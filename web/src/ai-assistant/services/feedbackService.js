/**
 * Feedback API service
 * Sends thumbs up/down ratings (+ an optional comment) on assistant replies to the backend.
 *
 * This service is identical no matter which mode the backend is configured for (FEEDBACK_MODE
 * in api/.env: 'local' writes a JSON file per rating for a developer to review; 'api' forwards
 * each rating to an external endpoint instead) - the same way chatService.js doesn't know or
 * care which AI_PROVIDER is answering /chat. The frontend always just POSTs here.
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * Saves a conversation rating.
 * @param {Object} payload
 * @param {'up'|'down'} payload.rating
 * @param {string} payload.comment - optional, may be empty
 * @param {Object} payload.ratedMessage - the specific message being rated ({ role, content })
 * @param {Array} payload.conversation - the full message list up to and including ratedMessage
 * @param {Object} payload.context - the active AI Assistant context at the time of rating
 */
export async function submitFeedback(payload) {
  const response = await fetch(`${API_BASE_URL}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to save feedback');
  }
}
