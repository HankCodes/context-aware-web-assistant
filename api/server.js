import express, { json } from 'express';
import cors from 'cors';
import ChatController from './controllers/chatController.js';
import chatRoutes from './routes/chat.js';
import exampleRoutes from './routes/examples.js';

export default ({ config, aiAgentService }) => {
  const app = express();

  app.use(cors());
  app.use(json());

  app.get('/health', (_, res) => {
    res.json({
      status: 'OK',
      provider: config.aiProvider,
      timestamp: new Date().toISOString()
    });
  });


  app.use(chatRoutes(new ChatController(aiAgentService)));

  // Example routes (REMOVE THIS LINE to delete all examples)
  app.use(exampleRoutes);

  const PORT = config.port;

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Using AI provider: ${config.aiProvider}`);
  });
}

