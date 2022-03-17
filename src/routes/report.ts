import fs from 'fs';
import path from 'path';

import express from 'express';

import { OUTPUT_DIR } from '../config';
import { parseCsv } from '../utils/csv';

const router = express.Router();

router.get('/report', async (req, res, next) => {
  const type = req.query.type?.toString() || '';
  const outputFilePath = getOutputFilePath(type);

  if (!fs.existsSync(outputFilePath)) {
    return res.status(400).json({
      message: `output file ${req.query.type}.csv does not exist`,
    });
  }

  try {
    const rows = parseCsv(outputFilePath, '', {
      cast: (value, context) => {
        if (context.column === 'start_at') {
          return new Date(parseInt(value)).toUTCString();
        } else if (context.column === 'end_at') {
          return new Date(parseInt(value)).toUTCString();
        } else if (context.column === 'duration_in_second') {
          return parseInt(value) / 1000; // convert from milliseconds -> seconds
        } else if (context.column === 'errors') {
          return JSON.parse(value);
        } else {
          return value;
        }
      },
    });

    return res.json(rows);
  } catch (error) {
    return next(error);
  }
});

router.delete('/report', async (req, res, next) => {
  const type = req.query.type?.toString() || '';

  try {
    fs.unlinkSync(getOutputFilePath(type));
    return res.json({ message: 'success' });
  } catch (error) {
    return next(error);
  }
});

const getOutputFilePath = (type: string): string => {
  let outputFilePath: string;
  switch (type) {
    case 'schools':
      outputFilePath = path.resolve(OUTPUT_DIR, 'schools.csv');
      break;
    case 'classes':
      outputFilePath = path.resolve(OUTPUT_DIR, 'classes.csv');
      break;
    default:
      outputFilePath = path.resolve(OUTPUT_DIR, 'users.csv');
      break;
  }

  return outputFilePath;
};

export default router;
