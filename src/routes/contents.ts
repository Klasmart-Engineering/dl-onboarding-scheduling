import express from 'express';

import { checkAPISecret } from '../middlewares/checkAPISecret';
import { orgIDRequired } from '../middlewares/orgIDRequired';
import { CMSService } from '../services/cms';

const router = express.Router();

router.get(
  '/contents_folders',
  checkAPISecret,
  orgIDRequired,
  async (req, res) => {
    try {
      const cmsService = await CMSService.getInstance();
      const result = await cmsService.getLessonPlans({
        org_id: String(req.query.org_id),
        ...req.query,
      });
      res.send(result);
    } catch (error) {
      res.json({
        message:
          'Get contents folders failed! If the error is general_error_no_permission, try to set publish_status param is published ',
        errors: [`Get contents folders from CMS failed with error ${error}`],
      });
    }
  }
);

export default router;
