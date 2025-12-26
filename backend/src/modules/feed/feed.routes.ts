import { Router } from 'express';
import { FeedController } from './feed.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
const feedController = new FeedController();

router.get('/', feedController.getFeed);
router.post('/', authenticate, feedController.createPost);

export const feedRoutes = router;
