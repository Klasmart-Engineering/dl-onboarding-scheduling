import fs from 'fs';
import path from 'path';

import express from 'express';

import { UPLOAD_DIR } from '../config';
import { checkAPISecret } from '../middlewares/checkAPISecret';
import { fileIsRequired } from '../middlewares/fileIsRequired';
import { orgIDRequired } from '../middlewares/orgIDRequired';
import upload from '../middlewares/upload';
import { CMSService } from '../services/cms';

const router = express.Router();

router.post(
  '/schedules',
  checkAPISecret,
  upload.single('file'),
  fileIsRequired,
  async (_, res) => {
    try {
      const cmsService = await CMSService.getInstance();
      await cmsService.addSchedules();
      res.json({
        message: 'Upload successful.',
      });
    } catch (error) {
      fs.unlinkSync(path.resolve(UPLOAD_DIR, `schedules.csv`));
      res.json({
        message: 'Add schedules failed!',
        errors: [`Add schedules failed with error ${error}`],
      });
    }
  }
);

router.post(
  '/schedules_time_view',
  checkAPISecret,
  orgIDRequired,
  async (req, res) => {
    try {
      const cmsService = await CMSService.getInstance();
      const result = await cmsService.getSchedulesTimeViewList({
        org_id: String(req.query.org_id),
        ...req.body,
      });
      res.send(result);
    } catch (error) {
      res.json({
        message: 'Get schedules time view failed!',
        errors: [`Get schedules time view from CMS failed with error ${error}`],
      });
    }
  }
);

export default router;
