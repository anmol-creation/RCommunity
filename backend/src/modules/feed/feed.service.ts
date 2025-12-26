import { PrismaClient } from '@prisma/client';

export class FeedService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getFeed(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    // Fetch posts with author details and counts
    // Note: Counting relations (likes, comments) typically uses `_count` in Prisma
    const posts = await this.prisma.post.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            verificationStatus: true,
            role: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          }
        }
      },
    });

    return posts;
  }

  async createPost(userId: string, content: string, imageUrl?: string) {
    // Basic validation
    if (!content && !imageUrl) {
      throw new Error('Post must contain text or image');
    }

    const post = await this.prisma.post.create({
      data: {
        content,
        imageUrl,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            verificationStatus: true,
          }
        }
      }
    });

    return post;
  }
}
