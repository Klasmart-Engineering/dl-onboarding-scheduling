import path from 'path';

import express from 'express';

import { OUTPUT_DIR, UPLOAD_DIR } from '../config';
import upload from '../middlewares/upload';
import { processCsv } from '../utils/csv';

const router = express.Router();

router.post('/users', upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      message: 'File is required.',
    });
  }

  await processCsv(
    path.resolve(UPLOAD_DIR, 'users.csv'),
    path.resolve(OUTPUT_DIR, 'users.csv')
  );

  return res.json({
    message: 'success',
  });
});

export default router;
