import prisma from '../../utils/prisma';

export class FeedService {

  async getFeed(userId?: string, page: number = 1, limit: number = 20, sortBy: 'latest' | 'trending' = 'latest') {
    const skip = (page - 1) * limit;

    // Sort logic
    let orderBy: any = { createdAt: 'desc' };

    if (sortBy === 'trending') {
        orderBy = {
            likes: {
                _count: 'desc'
            }
        };
    }

    // Fetch posts
    const posts = await prisma.post.findMany({
      skip,
      take: limit,
      orderBy: orderBy,
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            verificationStatus: true,
            role: true,
            // Check if I follow this author
            followedBy: userId ? {
                where: { followerId: userId },
                select: { followerId: true }
            } : false
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          }
        },
        // If userId is provided, check if liked
        likes: userId ? {
          where: { userId: userId },
          select: { userId: true }
        } : false
      },
    });

    // Transform
    return posts.map(post => ({
      ...post,
      likedByMe: post.likes && post.likes.length > 0,
      isFollowing: post.author.followedBy && post.author.followedBy.length > 0,
      likes: undefined,
      author: {
          ...post.author,
          followedBy: undefined
      }
    }));
  }

  async createPost(userId: string, content: string, imageUrl?: string) {
    if (!content && !imageUrl) {
      throw new Error('Post must contain text or image');
    }

    const post = await prisma.post.create({
      data: { content, imageUrl, authorId: userId },
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

  async toggleLike(postId: string, userId: string) {
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: { postId, userId }
      }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          postId_userId: { postId, userId }
        }
      });
      return { liked: false };
    } else {
      await prisma.like.create({
        data: { postId, userId }
      });
      return { liked: true };
    }
  }

  async addComment(postId: string, userId: string, content: string) {
    if (!content.trim()) throw new Error('Comment cannot be empty');

    const comment = await prisma.comment.create({
      data: { postId, authorId: userId, content },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            verificationStatus: true
          }
        }
      }
    });
    return comment;
  }

  async getComments(postId: string) {
    return await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            verificationStatus: true,
            vehicleType: true
          }
        }
      }
    });
  }
}
