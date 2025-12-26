import { Router } from 'express';
import { VerificationController } from './verification.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { upload } from '../../utils/file-upload';

const router = Router();
const verificationController = new VerificationController();

router.post('/request', authenticate, upload.single('screenshot'), verificationController.submitRequest);
router.get('/status', authenticate, verificationController.getStatus);

// Admin route (Open for prototype simulation, usually strictly protected)
router.post('/:id/review', verificationController.adminReview);

export default router;
