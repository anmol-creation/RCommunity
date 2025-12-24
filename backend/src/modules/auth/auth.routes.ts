import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();
const authController = new AuthController();

// Bind methods to controller context
router.post('/login', (req, res) => authController.login(req, res));
router.post('/verify', (req, res) => authController.verifyOTP(req, res));

export default router;
