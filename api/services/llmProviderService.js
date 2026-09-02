import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOllama } from '@langchain/ollama';
import { ChatOpenAI } from '@langchain/openai';
import { convertToLangChainTools, convertToOpenAITools } from './toolsService.js';

export default (config) => {
  let llm;
  // Anthropic's tool format also works for Ollama; OpenAI-compatible
  // providers (LM Studio) need the OpenAI `{type: "function", ...}` shape.
  let tools = convertToLangChainTools();

  switch (config.aiProvider) {
    // Anthropic's native Messages API (api.anthropic.com).
    case 'claude':
      console.log(`Initializing Claude with model: ${config.claudeModel}`);
      llm = new ChatAnthropic({
        anthropicApiKey: config.anthropicApiKey,
        modelName: config.claudeModel,
        temperature: 0.7,
      });
      break;

    // Ollama's native API (not OpenAI-compatible).
    case 'ollama':
      console.log(`Initializing Ollama with model: ${config.ollamaModel}`);
      llm = new ChatOllama({
        baseUrl: config.ollamaBaseUrl,
        model: config.ollamaModel,
        temperature: 0.7,
      });
      break;

    // LM Studio's local server speaks the OpenAI Chat Completions wire
    // format, so it's driven by LangChain's OpenAI client pointed at LM
    // Studio's base URL instead of api.openai.com. This same branch would
    // work for any other OpenAI-compatible server (vLLM, llama.cpp, etc.)
    // by swapping the base URL/model.
    case 'lmstudio':
      console.log(`Initializing LM Studio with model: ${config.lmStudioModel}`);
      llm = new ChatOpenAI({
        apiKey: config.lmStudioApiKey, // LM Studio ignores this; the OpenAI client just requires a non-empty string
        modelName: config.lmStudioModel,
        temperature: 0.7,
        configuration: {
          baseURL: config.lmStudioBaseUrl,
        },
      });
      tools = convertToOpenAITools();
      break;

    default:
      throw new Error(`Unsupported AI provider: ${config.aiProvider}`);
  }

  console.log(`Binding ${tools.length} tools to LLM`);

  return llm.bindTools(tools);
}
