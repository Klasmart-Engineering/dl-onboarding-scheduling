import express from 'express';

import OrganizationsRouter from './organizations';
import ReportRouter from './report';
import SchoolsRouter from './schools';

const router = express.Router();

router.use('/', OrganizationsRouter);
router.use('/', ReportRouter);
router.use('/', SchoolsRouter);

export default router;
