import { Router } from 'express';

const router = Router();

export default (feedbackController) => {
  router.post('/feedback', (req, res) => feedbackController.submit(req, res));
  router.get('/feedback', (req, res) => feedbackController.list(req, res));

  return router;
};
