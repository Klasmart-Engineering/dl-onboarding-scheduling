import fs from 'fs';

import createError from 'http-errors';
import multer from 'multer';

import { MAX_SIZE_UPLOAD, UPLOAD_DIR } from '../config';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const csvFilter = (req: any, file: any, cb: any) => {
  const name = req.path.replace('/', '');
  if (file.mimetype.includes('csv')) {
    if (fs.existsSync(UPLOAD_DIR + `/${name}.csv`)) {
      return cb(
        createError(400, `Please try again later, ${name} are being onboard.`),
        false
      );
    }
    cb(null, true);
  } else {
    return cb(createError(400, 'Please upload only CSV file.'), false);
  }
};

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, _file, cb) => {
    const name = req.path.replace('/', '') + '.csv';
    cb(null, name);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: csvFilter,
  limits: { fileSize: MAX_SIZE_UPLOAD },
});

export default upload;
