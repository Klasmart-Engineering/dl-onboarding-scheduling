import express from 'express';

import ClassesRouter from './classes';
import ContentRouter from './contents';
import OrganizationsRouter from './organizations';
import PingRouter from './ping';
import ReportRouter from './report';
import SchedulesRouter from './schedules';
import SchoolsRouter from './schools';
import UsersRouter from './users';

const router = express.Router();

router.use('/', ClassesRouter);
router.use('/', OrganizationsRouter);
router.use('/', ReportRouter);
router.use('/', SchoolsRouter);
router.use('/', UsersRouter);
router.use('/', PingRouter);
router.use('/', ContentRouter);
router.use('/', SchedulesRouter);

export default router;
