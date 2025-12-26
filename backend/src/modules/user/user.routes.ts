import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
const userController = new UserController();

router.get('/me', authenticate, userController.getMyProfile);
router.patch('/me', authenticate, userController.updateMyProfile);
router.get('/:id', userController.getUserProfile); // Public profile view

export const userRoutes = router;
