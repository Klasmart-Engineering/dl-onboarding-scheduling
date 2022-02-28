import express from 'express';

import OrganizationsRouter from './organizations';
import SchoolsRouter from './schools';

const router = express.Router();

router.use('/', OrganizationsRouter);
router.use('/', SchoolsRouter);

export default router;
