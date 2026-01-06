import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOllama } from '@langchain/ollama';
import { convertToLangChainTools } from './toolsService.js';

export default (config) => {
  let llm;

  switch (config.aiProvider) {
    case 'claude':
      console.log(`Initializing Claude with model: ${config.claudeModel}`);
      llm = new ChatAnthropic({
        anthropicApiKey: config.anthropicApiKey,
        modelName: config.claudeModel,
        temperature: 0.7,
      });
      break;
    case 'ollama':
      console.log(`Initializing Ollama with model: ${config.ollamaModel}`);
      llm = new ChatOllama({
        baseUrl: config.ollamaBaseUrl,
        model: config.ollamaModel,
        temperature: 0.7,
      });
      break;
    default:
      throw new Error(`Unsupported AI provider: ${config.aiProvider}`);
  }

  const tools = convertToLangChainTools();
  console.log(`Binding ${tools.length} tools to LLM`);

  return llm.bindTools(tools);
}
