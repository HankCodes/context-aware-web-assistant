import dotenv from 'dotenv';
dotenv.config();

const config = {
  aiProvider: process.env.AI_PROVIDER || 'ollama',

  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  claudeModel: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',

  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'mistral-small',

  port: process.env.PORT || 8080,

  // Prompt configuration
  systemPrompt: process.env.SYSTEM_PROMPT || 'default',
  assistantName: process.env.ASSISTANT_NAME || 'AI Assistant',
};

config.currentModel = config.aiProvider === 'claude' ? config.claudeModel : config.ollamaModel;

function validateConfig() {
  if (config.aiProvider === 'claude' && !config.anthropicApiKey) {
    throw new Error('ANTHROPIC_API_KEY is required when AI_PROVIDER is set to "claude"');
  }

  if (!['claude', 'ollama'].includes(config.aiProvider)) {
    throw new Error('AI_PROVIDER must be either "claude" or "ollama"');
  }
}

validateConfig();

export default config;
