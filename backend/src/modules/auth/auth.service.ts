import { PrismaClient } from '@prisma/client';

export class AuthService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async requestOTP(phoneNumber: string) {
    // TODO: Integrate with SMS provider (e.g., Twilio, MSG91)
    console.log(`[STUB] OTP requested for: ${phoneNumber}`);
    // In dev, we can just return a success and maybe log the "OTP"
    return { message: 'OTP sent successfully', devOtp: '123456' };
  }

  async verifyOTP(phoneNumber: string, otp: string) {
    // TODO: Verify against stored OTP in Redis/DB
    console.log(`[STUB] Verifying OTP ${otp} for ${phoneNumber}`);

    if (otp === '123456') {

      // Ensure user exists in DB
      let user = await this.prisma.user.findUnique({
        where: { phoneNumber }
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            phoneNumber,
            verificationStatus: 'UNVERIFIED',
            role: 'USER'
          }
        });
      }

      return {
        success: true,
        token: 'mock-jwt-token',
        user: {
          id: user.id,
          phoneNumber: user.phoneNumber,
          status: user.verificationStatus
        }
      };
    }

    return { success: false };
  }
}
