import express from 'express';

import upload from '../middlewares/upload';
import { onboarding } from '../utils';

const router = express.Router();

router.post('/schools', upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      message: 'File is required.',
    });
  }

  onboarding('schools');

  return res.json({
    message: 'success',
  });
});

export default router;
