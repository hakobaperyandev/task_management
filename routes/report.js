import express from 'express';
import {reportByPeriod, summary} from '../controllers/report.js';
const router = express.Router();


router.post('/report/period', reportByPeriod);

router.post('/report/summary', summary);

export default router
