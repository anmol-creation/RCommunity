import { Request, Response } from 'express';
import { FeedService } from './feed.service';

const feedService = new FeedService();

export class FeedController {

  async getFeed(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      // req.user might be present if we attach auth middleware to GET (optional)
      // or we can extract it if present.
      // For now, let's assume we might want to know if *I* liked the post even if I'm a visitor?
      // Actually Visitors are Read-Only but they are users in DB.

      // Note: If using `authenticate` middleware, req.user is set.
      // If endpoint is public, req.user is undefined.
      // Let's check headers manually if middleware isn't forced, or rely on middleware.
      // We will make GET /feed optionally authenticated in routes?
      // Or just check if req.user exists (if we use a "soft" auth middleware).

      // Simplest: Check req.user.id
      const userId = req.user?.id;

      const posts = await feedService.getFeed(userId, page, limit);
      res.json({ success: true, data: posts });
    } catch (error) {
      console.error('Get Feed Error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch feed' });
    }
  }

  async createPost(req: Request, res: Response) {
    try {
      const { content, imageUrl } = req.body;
      const user = req.user;

      if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      if (user.verificationStatus !== 'VERIFIED') {
        return res.status(403).json({ success: false, message: 'Only verified riders can post.' });
      }

      const post = await feedService.createPost(user.id, content, imageUrl);
      res.status(201).json({ success: true, data: post });
    } catch (error: any) {
      console.error('Create Post Error:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to create post' });
    }
  }

  async toggleLike(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const user = req.user;
      if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      // Verified only? Or Visitors can like?
      // Requirement: "Visitor... Cannot post, comment, like, vote"
      if (user.verificationStatus !== 'VERIFIED') {
          return res.status(403).json({ success: false, message: 'Only verified riders can like.' });
      }

      const result = await feedService.toggleLike(postId, user.id);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Like Error:', error);
      res.status(500).json({ success: false, message: 'Failed to toggle like' });
    }
  }

  async addComment(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const { content } = req.body;
      const user = req.user;
      if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      if (user.verificationStatus !== 'VERIFIED') {
          return res.status(403).json({ success: false, message: 'Only verified riders can comment.' });
      }

      const comment = await feedService.addComment(postId, user.id, content);
      res.json({ success: true, data: comment });
    } catch (error) {
      console.error('Comment Error:', error);
      res.status(500).json({ success: false, message: 'Failed to add comment' });
    }
  }

  async getComments(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const comments = await feedService.getComments(postId);
      res.json({ success: true, data: comments });
    } catch (error) {
      console.error('Get Comments Error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch comments' });
    }
  }
}
