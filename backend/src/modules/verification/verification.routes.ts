import { Router } from 'express';
import { VerificationController } from './verification.controller';

const router = Router();
const verificationController = new VerificationController();

router.post('/upload', (req, res) => verificationController.uploadProof(req, res));
router.get('/status/:userId', (req, res) => verificationController.checkStatus(req, res));

export default router;
