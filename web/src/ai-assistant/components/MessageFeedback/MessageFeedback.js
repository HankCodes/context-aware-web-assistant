import React, { useState } from 'react';
import { submitFeedback } from '../../services/feedbackService';
import './MessageFeedback.css';

const FEEDBACK_ENABLED = process.env.REACT_APP_FEEDBACK_ENABLED === 'true';

/**
 * Thumbs up/down on one assistant reply, with an optional comment.
 *
 * Rendered under every assistant message in ChatDrawer.js. Entirely opt-in: renders nothing
 * unless REACT_APP_FEEDBACK_ENABLED=true (and, separately, the backend only accepts the POST
 * if FEEDBACK_ENABLED=true there too - see api/config.js). This is a dev/product-feedback
 * workflow, not something every host app needs, hence the flag.
 *
 * @param {Object} props
 * @param {Object} props.message - the assistant message being rated ({ role, content })
 * @param {Array} props.conversation - the message list up to and including `message`
 * @param {Object} props.context - the AI Assistant context active when this message was rated
 */
export function MessageFeedback({ message, conversation, context }) {
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('idle'); // idle | commenting | submitting | submitted | error

  if (!FEEDBACK_ENABLED) {
    return null;
  }

  const chooseRating = (value) => {
    setRating(value);
    setStatus('commenting');
  };

  const handleSubmit = async () => {
    setStatus('submitting');
    try {
      await submitFeedback({
        rating,
        comment: comment.trim(),
        ratedMessage: message,
        conversation,
        context,
      });
      setStatus('submitted');
    } catch (err) {
      console.error('Failed to save feedback:', err);
      setStatus('error');
    }
  };

  if (status === 'submitted') {
    return <div className="message-feedback-saved">✓ Feedback saved</div>;
  }

  return (
    <div className="message-feedback">
      <div className="message-feedback-buttons">
        <button
          type="button"
          className={`message-feedback-thumb ${rating === 'up' ? 'active' : ''}`}
          aria-label="Good response"
          onClick={() => chooseRating('up')}
        >
          👍
        </button>
        <button
          type="button"
          className={`message-feedback-thumb ${rating === 'down' ? 'active down' : ''}`}
          aria-label="Bad response"
          onClick={() => chooseRating('down')}
        >
          👎
        </button>
      </div>

      {(status === 'commenting' || status === 'submitting' || status === 'error') && (
        <div className="message-feedback-comment">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What went wrong (or right)? Optional, but helpful."
            disabled={status === 'submitting'}
          />
          {status === 'error' && (
            <p className="message-feedback-error">Couldn't save that - try again.</p>
          )}
          <button
            type="button"
            className="message-feedback-submit"
            onClick={handleSubmit}
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Saving...' : 'Save feedback'}
          </button>
        </div>
      )}
    </div>
  );
}
