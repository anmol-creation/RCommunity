import prisma from '../../utils/prisma';

export class VerificationService {

  async createRequest(userId: string, filename: string) {
    // Check if pending request exists
    const existing = await prisma.verificationRequest.findUnique({
      where: { userId }
    });

    // Construct local URL
    const imageUrl = `/uploads/${filename}`;

    if (existing) {
        // Update existing request
        return await prisma.verificationRequest.update({
            where: { userId },
            data: {
                imageUrl,
                status: 'PENDING',
                adminNote: null,
                updatedAt: new Date()
            }
        });
    }

    // Create new
    return await prisma.verificationRequest.create({
        data: {
            userId,
            imageUrl,
            status: 'PENDING'
        }
    });
  }

  async getStatus(userId: string) {
      const req = await prisma.verificationRequest.findUnique({
          where: { userId }
      });
      return req; // Can be null
  }

  // Admin function to approve/reject
  async reviewRequest(requestId: string, status: 'VERIFIED' | 'REJECTED', note?: string) {
      const request = await prisma.verificationRequest.update({
          where: { id: requestId },
          data: {
              status,
              adminNote: note
          },
          include: { user: true }
      });

      // Sync user status
      if (status === 'VERIFIED') {
          await prisma.user.update({
              where: { id: request.userId },
              data: { verificationStatus: 'VERIFIED' }
          });
      } else if (status === 'REJECTED') {
         await prisma.user.update({
              where: { id: request.userId },
              data: { verificationStatus: 'UNVERIFIED' } // Reset to unverified
          });
      }

      return request;
  }
}
