import dotenv from 'dotenv';
dotenv.config();

const config = {
  aiProvider: process.env.AI_PROVIDER || 'ollama',

  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  claudeModel: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',

  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'mistral-small',

  // LM Studio exposes an OpenAI-compatible server; baseUrl must include the
  // /v1 suffix (LM Studio's default local server URL).
  lmStudioBaseUrl: process.env.LM_STUDIO_BASE_URL || 'http://localhost:1234/v1',
  lmStudioModel: process.env.LM_STUDIO_MODEL || 'local-model',
  lmStudioApiKey: process.env.LM_STUDIO_API_KEY || 'lm-studio',

  port: process.env.PORT || 8080,

  // Prompt configuration
  systemPrompt: process.env.SYSTEM_PROMPT || 'default',
  assistantName: process.env.ASSISTANT_NAME || 'AI Assistant',
};

const modelByProvider = {
  claude: config.claudeModel,
  ollama: config.ollamaModel,
  lmstudio: config.lmStudioModel,
};
config.currentModel = modelByProvider[config.aiProvider];

function validateConfig() {
  if (config.aiProvider === 'claude' && !config.anthropicApiKey) {
    throw new Error('ANTHROPIC_API_KEY is required when AI_PROVIDER is set to "claude"');
  }

  if (!['claude', 'ollama', 'lmstudio'].includes(config.aiProvider)) {
    throw new Error('AI_PROVIDER must be one of "claude", "ollama", or "lmstudio"');
  }
}

validateConfig();

export default config;
