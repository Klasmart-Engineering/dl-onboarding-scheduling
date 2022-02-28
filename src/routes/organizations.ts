import express from 'express';

import { AdminService } from '../services';
import { organizationsSchema } from '../validations/requests';

const router = express.Router();

router.post('/organizations', async (req, res) => {
  try {
    const apiSecret = req.get('X_API_SECRET');
    if (apiSecret != process.env.API_SECRET) {
      return res.status(401).json({
        message: `Invalid API secret, please check again!`,
      });
    }

    const { name } = req.body;
    const { error } = organizationsSchema.validate({
      name,
    });
    if (error) {
      return res.status(400).json({
        message: 'bad request',
        errors: error.details.map(
          (detail: { message: string }) => detail.message
        ),
      });
    }

    const admin = await AdminService.getInstance();
    const result = await admin.getOrganization(name);

    return res.json({
      message: 'success',
      data: { id: result },
    });
  } catch (error) {
    throw new Error(`Get organization from AS failed with error ${error}`);
  }
});

export default router;
