import path from 'path';

import { config } from 'dotenv';

config();

export const MAX_SIZE_UPLOAD = process.env.MAX_SIZE_UPLOAD
  ? parseInt(process.env.MAX_SIZE_UPLOAD, 10)
  : 50 * 1000 * 1000; // default: 50MB
export const UPLOAD_DIR = path.resolve(__dirname, '../../uploads/');
export const OUTPUT_DIR = path.resolve(__dirname, '../../output/');
