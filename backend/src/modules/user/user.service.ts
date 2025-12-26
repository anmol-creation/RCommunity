import { PrismaClient, User } from '@prisma/client';

export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            posts: true,
            comments: true,
          }
        }
      }
    });
    return user;
  }

  async getUserById(userId: string) {
    // Public profile view - strict selection
    const user = await this.prisma.user.findUnique({
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
            select: { posts: true }
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

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: allowedUpdates,
    });

    return user;
  }
}
