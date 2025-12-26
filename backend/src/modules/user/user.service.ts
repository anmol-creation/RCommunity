import { User } from '@prisma/client';
import prisma from '../../utils/prisma';

export class UserService {

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            posts: true,
            comments: true,
            following: true,
            followedBy: true
          }
        }
      }
    });
    return user;
  }

  async getUserById(userId: string) {
    // Public profile view - strict selection
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        displayName: true,
        vehicleType: true,
        yearsExperience: true,
        platforms: true,
        verificationStatus: true,
        createdAt: true,
        _count: {
            select: { posts: true, following: true, followedBy: true }
        }
      }
    });
    return user;
  }

  async updateProfile(userId: string, data: Partial<User>) {
    // Whitelist allowed fields
    const allowedUpdates = {
      displayName: data.displayName,
      vehicleType: data.vehicleType,
      yearsExperience: data.yearsExperience,
      platforms: data.platforms,
    };

    // Remove undefined keys
    Object.keys(allowedUpdates).forEach(key =>
      (allowedUpdates as any)[key] === undefined && delete (allowedUpdates as any)[key]
    );

    const user = await prisma.user.update({
      where: { id: userId },
      data: allowedUpdates,
    });

    return user;
  }

  async followUser(followerId: string, followingId: string) {
      if (followerId === followingId) throw new Error('Cannot follow yourself');

      return await prisma.follow.create({
          data: {
              followerId,
              followingId
          }
      });
  }

  async unfollowUser(followerId: string, followingId: string) {
      return await prisma.follow.delete({
          where: {
              followerId_followingId: {
                  followerId,
                  followingId
              }
          }
      });
  }
}
