import express from 'express';

import ClassesRouter from './classes';
import OrganizationsRouter from './organizations';
import ReportRouter from './report';
import SchoolsRouter from './schools';
import UsersRouter from './users';

const router = express.Router();

router.use('/', ClassesRouter);
router.use('/', OrganizationsRouter);
router.use('/', ReportRouter);
router.use('/', SchoolsRouter);
router.use('/', UsersRouter);

export default router;
