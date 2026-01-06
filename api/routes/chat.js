import { Router } from 'express';

const router = Router();

export default (chatController) => {
  router.post('/chat', (req, res) => chatController.chat(req, res));

  return router;
}; 
