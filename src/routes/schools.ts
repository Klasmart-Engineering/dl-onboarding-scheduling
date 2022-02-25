import express from 'express';

const router = express.Router();

router.get('/schools', (_, res) => {
  res.send('Onboarding schools!');
});

export default router;
