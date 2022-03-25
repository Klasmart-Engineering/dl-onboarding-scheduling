import express from 'express';

import { fileIsRequired } from '../middlewares/fileIsRequired';
import upload from '../middlewares/upload';

const router = express.Router();

router.post('/users', upload.single('file'), fileIsRequired, async (_, res) => {
  return res.json({
    message: 'Upload successful.',
  });
});

export default router;
