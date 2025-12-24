// Placeholder for Authentication Module
// Handles: OTP Login, Session Management, Device Binding

export class AuthService {
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
      // Mock User and Token
      return {
        success: true,
        token: 'mock-jwt-token',
        user: {
          id: 'user-123',
          phoneNumber,
          status: 'UNVERIFIED' // Aligned with Prisma Enum
        }
      };
    }

    return { success: false };
  }
}
