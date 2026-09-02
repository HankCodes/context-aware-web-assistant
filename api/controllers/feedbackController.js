import { writeFile, mkdir, readdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FEEDBACK_DIR = join(__dirname, '..', 'feedback');

/**
 * Saves/forwards conversation ratings (thumbs up/down + an optional comment on an assistant
 * reply). Two interchangeable modes, picked by config (see config.js) - the frontend's
 * feedbackService.js always just POSTs to this same /feedback endpoint and never needs to know
 * which mode is active, the same way the frontend's chatService.js doesn't know which LLM
 * provider is behind /chat:
 *
 * - 'local': writes each rating as a standalone JSON file under api/feedback/ (gitignored) - a
 *   developer workflow: rate a bad reply with a note on what went wrong, then read the file
 *   later to diagnose and fix it.
 * - 'api': forwards each rating to an external FEEDBACK_API_URL instead - for capturing real
 *   user feedback from a deployed app, where you want it in your own product-feedback pipeline
 *   rather than a local file.
 */
class FeedbackController {
  constructor(config) {
    this.config = config;
  }

  async submit(req, res) {
    if (!this.config.feedbackEnabled) {
      return res.status(404).json({ error: 'Feedback is disabled' });
    }

    const { rating, comment, ratedMessage, conversation, context } = req.body;

    if (rating !== 'up' && rating !== 'down') {
      return res.status(400).json({ error: "rating must be 'up' or 'down'" });
    }

    const entry = {
      timestamp: new Date().toISOString(),
      rating,
      comment: comment || null,
      ratedMessage: ratedMessage || null,
      context: context || {},
      conversation: conversation || [],
    };

    try {
      if (this.config.feedbackMode === 'api') {
        await this._forwardToApi(entry);
      } else {
        await this._saveLocally(entry);
      }
      res.status(201).json({ saved: true });
    } catch (error) {
      console.error('Feedback save error:', error);
      res.status(500).json({ error: 'Failed to save feedback' });
    }
  }

  /** Lists locally-saved feedback entries, newest first. Only meaningful in 'local' mode. */
  async list(req, res) {
    if (!this.config.feedbackEnabled) {
      return res.status(404).json({ error: 'Feedback is disabled' });
    }
    if (this.config.feedbackMode !== 'local') {
      return res.status(400).json({ error: "Listing is only available when FEEDBACK_MODE is 'local'" });
    }

    try {
      await mkdir(FEEDBACK_DIR, { recursive: true });
      const files = (await readdir(FEEDBACK_DIR)).filter((f) => f.endsWith('.json')).sort().reverse();

      const entries = await Promise.all(
        files.map(async (file) => {
          const raw = await readFile(join(FEEDBACK_DIR, file), 'utf-8');
          const data = JSON.parse(raw);
          return { filename: file, timestamp: data.timestamp, rating: data.rating, comment: data.comment };
        }),
      );

      res.json(entries);
    } catch (error) {
      console.error('Feedback list error:', error);
      res.status(500).json({ error: 'Failed to list feedback' });
    }
  }

  async _saveLocally(entry) {
    await mkdir(FEEDBACK_DIR, { recursive: true });
    const filename = `${entry.timestamp.replace(/[:.]/g, '-')}_${entry.rating}.json`;
    await writeFile(join(FEEDBACK_DIR, filename), JSON.stringify(entry, null, 2), 'utf-8');
  }

  async _forwardToApi(entry) {
    const headers = { 'Content-Type': 'application/json' };
    if (this.config.feedbackApiKey) {
      headers['Authorization'] = `Bearer ${this.config.feedbackApiKey}`;
    }

    const response = await fetch(this.config.feedbackApiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      throw new Error(`Feedback API responded with ${response.status}`);
    }
  }
}

export default FeedbackController;
