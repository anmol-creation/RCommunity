import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
const userController = new UserController();

router.get('/me', authenticate, userController.getMyProfile);
router.patch('/me', authenticate, userController.updateMyProfile);

router.post('/:id/follow', authenticate, userController.followUser);
router.delete('/:id/follow', authenticate, userController.unfollowUser);

router.get('/:id', userController.getUserProfile); // Public profile view

export const userRoutes = router;
