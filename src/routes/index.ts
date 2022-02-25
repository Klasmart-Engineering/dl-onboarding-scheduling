import express from 'express';

import SchoolsRouter from './schools';

const router = express.Router();

router.use('/', SchoolsRouter);

export default router;
