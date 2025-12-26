import { Router } from 'express';
import { ReportController } from './report.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
const reportController = new ReportController();

router.post('/', authenticate, reportController.createReport);

export const reportRoutes = router;
