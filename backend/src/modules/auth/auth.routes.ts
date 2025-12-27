import { Router } from 'express';
import * as authController from './auth.controller';
import { rateLimiter } from '../../middleware/rateLimit.middleware';

const router = Router();

// Apply rate limiting to auth routes
router.use(rateLimiter);

router.post('/login', authController.requestOTP);
router.post('/verify', authController.verifyOTP);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

export default router;
