
class ChatController {
  constructor(aiAgentService) {
    this.aiAgentService = aiAgentService;
  }

  async chat(req, res) {
    try {
      const { message, chatHistory = [], context = {} } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({
          error: 'Message is required and must be a string'
        });
      }

      const result = await this.aiAgentService.processChat(message, chatHistory, context);

      res.json(result);

    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({
        error: 'Failed to process chat request',
      });
    }
  }
}

export default ChatController;
