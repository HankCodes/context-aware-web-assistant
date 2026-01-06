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
 * @returns {Promise<Object>} The API response
 */
export async function sendChatMessage(message, chatHistory = [], context = {}) {
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
