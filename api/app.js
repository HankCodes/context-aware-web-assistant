import createLLM from './services/llmProviderService.js';
import config from './config.js';
import AIAgentService from './services/aiAgentService.js';
import startServer from './server.js';

const llmProvider = createLLM(config);
const aiAgentService = new AIAgentService(llmProvider, config);

startServer({ config, aiAgentService });
