import { Router } from 'express';
import { FeedController } from './feed.controller';
import { authenticate, optionalAuth } from '../../middleware/auth.middleware';

const router = Router();
const feedController = new FeedController();

router.get('/', optionalAuth, feedController.getFeed);
router.post('/', authenticate, feedController.createPost);

router.post('/:postId/like', authenticate, feedController.toggleLike);
router.post('/:postId/comments', authenticate, feedController.addComment);
router.get('/:postId/comments', optionalAuth, feedController.getComments);

export const feedRoutes = router;
