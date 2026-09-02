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

  // Feedback (thumbs up/down on assistant replies) configuration.
  // - Set FEEDBACK_ENABLED=false (or omit it) to leave the /feedback route unmounted entirely -
  //   this is a dev/product-feedback add-on, not core to the assistant.
  // - 'local' writes each rating as a JSON file under api/feedback/ (gitignored) - handy for a
  //   developer to review locally and act on ("here's what went wrong, fix it").
  // - 'api' forwards each rating to FEEDBACK_API_URL instead, for collecting real user feedback
  //   in a deployed app. The frontend's feedbackService.js is identical either way - only this
  //   config decides where a rating actually goes, the same way AI_PROVIDER decides which LLM
  //   backs /chat without the frontend needing to know or care.
  feedbackEnabled: (process.env.FEEDBACK_ENABLED || 'false').toLowerCase() === 'true',
  feedbackMode: process.env.FEEDBACK_MODE || 'local',
  feedbackApiUrl: process.env.FEEDBACK_API_URL,
  feedbackApiKey: process.env.FEEDBACK_API_KEY,
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

  if (config.feedbackEnabled) {
    if (!['local', 'api'].includes(config.feedbackMode)) {
      throw new Error('FEEDBACK_MODE must be either "local" or "api"');
    }
    if (config.feedbackMode === 'api' && !config.feedbackApiUrl) {
      throw new Error('FEEDBACK_API_URL is required when FEEDBACK_MODE is set to "api"');
    }
  }
}

validateConfig();

export default config;
