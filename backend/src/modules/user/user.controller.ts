import { Request, Response } from 'express';
import { UserService } from './user.service';

const userService = new UserService();

export class UserController {

  async getMyProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const user = await userService.getProfile(req.user.id);
      res.json({ success: true, data: user });
    } catch (error) {
      console.error('Get My Profile Error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch profile' });
    }
  }

  async updateMyProfile(req: Request, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const updatedUser = await userService.updateProfile(req.user.id, req.body);
        res.json({ success: true, data: updatedUser });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
  }

  async getUserProfile(req: Request, res: Response) {
      try {
          const { id } = req.params;
          const user = await userService.getUserById(id);
          if (!user) {
              return res.status(404).json({ success: false, message: 'User not found' });
          }
          res.json({ success: true, data: user });
      } catch (error) {
          console.error('Get User Profile Error:', error);
          res.status(500).json({ success: false, message: 'Failed to fetch user' });
      }
  }

  async followUser(req: Request, res: Response) {
      try {
          const { id } = req.params; // target user id
          const user = req.user;
          if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

          await userService.followUser(user.id, id);
          res.json({ success: true, message: 'Followed successfully' });
      } catch (error) {
          console.error('Follow Error:', error);
          res.status(500).json({ success: false, message: 'Failed to follow user' });
      }
  }

  async unfollowUser(req: Request, res: Response) {
      try {
          const { id } = req.params; // target user id
          const user = req.user;
          if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

          await userService.unfollowUser(user.id, id);
          res.json({ success: true, message: 'Unfollowed successfully' });
      } catch (error) {
          console.error('Unfollow Error:', error);
          res.status(500).json({ success: false, message: 'Failed to unfollow user' });
      }
  }
}
