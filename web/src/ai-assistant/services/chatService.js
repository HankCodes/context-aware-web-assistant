/**
 * Chat API service
 * Handles communication with the backend chat API
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * Sends a chat message to the API and returns the response
 * @param {string} message - The user's message
 * @param {Array} chatHistory - Array of previous messages
 * @param {Object} context - Optional context object (any structure)
 * @param {{id: string, toolName: string, parameters: Object, result: unknown}} [toolResult] -
 *   Pass this when this call is a continuation handing back the result of an "answer"-type tool
 *   the backend just asked for (see `renderLocation: 'answer'` in toolsConfig.js). `message`
 *   should still be the original user message that triggered it, so the backend can reconstruct
 *   that turn.
 * @returns {Promise<Object>} The API response
 */
export async function sendChatMessage(message, chatHistory = [], context = {}, toolResult) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        chatHistory,
        context,
        toolResult,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('Chat service error:', error);
    throw error;
  }
}

/**
 * Checks the health status of the API
 * @returns {Promise<Object>} Health status information
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
}
