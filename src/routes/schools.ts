import express from 'express';

const router = express.Router();

router.get('/schools', (_, res) => {
  res.json({
    message: 'Onboarding schools!',
  });
});

export default router;
