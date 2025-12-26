import { Request, Response } from 'express';
import { FeedService } from './feed.service';
import { PrismaClient } from '@prisma/client';

const feedService = new FeedService();
const prisma = new PrismaClient();

export class FeedController {

  async getFeed(req: Request, res: Response) {
    try {
      // Basic pagination query params
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const posts = await feedService.getFeed(page, limit);
      res.json({ success: true, data: posts });
    } catch (error) {
      console.error('Get Feed Error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch feed' });
    }
  }

  async createPost(req: Request, res: Response) {
    try {
      const { content, imageUrl } = req.body;
      const user = req.user; // Set by authenticate middleware

      if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      // Check user verification status
      // Note: user object is already fetched in middleware, so we can trust it.
      // But let's double check status if the middleware didn't enforce verification (it might not).

      if (user.verificationStatus !== 'VERIFIED') {
        return res.status(403).json({
          success: false,
          message: 'Only verified riders can post.',
          code: 'NOT_VERIFIED'
        });
      }

      const post = await feedService.createPost(user.id, content, imageUrl);
      res.status(201).json({ success: true, data: post });
    } catch (error: any) {
      console.error('Create Post Error:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to create post' });
    }
  }
}
