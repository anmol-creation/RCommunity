import prisma from '../../utils/prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import crypto from 'crypto';

export class AuthService {

  async requestOTP(phoneNumber: string) {
    // TODO: Integrate with SMS provider (e.g., Twilio, MSG91)
    console.log(`[STUB] OTP requested for: ${phoneNumber}`);
    // In dev, we can just return a success and maybe log the "OTP"
    return { message: 'OTP sent successfully', devOtp: '123456' };
  }

  async verifyOTP(phoneNumber: string, otp: string, ipAddress?: string, deviceId?: string) {
    // TODO: Verify against stored OTP in Redis/DB
    console.log(`[STUB] Verifying OTP ${otp} for ${phoneNumber} from IP: ${ipAddress}`);

    if (otp === '123456') {

      // Ensure user exists in DB
      let user = await prisma.user.findUnique({
        where: { phoneNumber }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            phoneNumber,
            verificationStatus: 'UNVERIFIED',
            role: 'USER'
          }
        });
      }

      // Generate Tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Save Refresh Token in DB
      await this.saveRefreshToken(user.id, refreshToken, ipAddress, deviceId);

      return {
        success: true,
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          phoneNumber: user.phoneNumber,
          status: user.verificationStatus
        }
      };
    }

    return { success: false, message: 'Invalid OTP' };
  }

  async saveRefreshToken(userId: string, token: string, ipAddress?: string, deviceId?: string) {
    // Calculate expiry date (7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Hash device ID if provided
    let deviceHash: string | undefined;
    if (deviceId) {
        deviceHash = crypto.createHash('sha256').update(deviceId).digest('hex');
    }

    await prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
        ipAddress,
        deviceHash
      }
    });
  }

  async refreshTokens(token: string, ipAddress?: string, deviceId?: string) {
    const payload = verifyRefreshToken(token) as any;
    if (!payload) {
      throw new Error('Invalid refresh token');
    }

    const savedToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!savedToken || savedToken.revoked) {
      throw new Error('Invalid refresh token');
    }

    // Check if user matches
    if (savedToken.userId !== payload.userId) {
       throw new Error('Invalid refresh token');
    }

    // Security Check: Suspicious Login Detection
    // Check if IP or Device Hash changed
    let deviceHash: string | undefined;
    if (deviceId) {
        deviceHash = crypto.createHash('sha256').update(deviceId).digest('hex');
    }

    if (savedToken.deviceHash && deviceHash && savedToken.deviceHash !== deviceHash) {
        console.warn(`[SECURITY] Suspicious refresh attempt for user ${savedToken.userId}. Original DeviceHash: ${savedToken.deviceHash}, Current: ${deviceHash}`);
        // We log it but do not block for now, as per requirements ("no blocking, only logging")
    }

    if (savedToken.ipAddress && ipAddress && savedToken.ipAddress !== ipAddress) {
        console.warn(`[SECURITY] Refresh attempt from new IP for user ${savedToken.userId}. Original IP: ${savedToken.ipAddress}, Current: ${ipAddress}`);
    }

    // Check expiry
    if (new Date() > savedToken.expiresAt) {
      await prisma.refreshToken.update({
        where: { id: savedToken.id },
        data: { revoked: true }
      });
      throw new Error('Refresh token expired');
    }

    // Token Rotation: Revoke old token, issue new one
    const newAccessToken = generateAccessToken(savedToken.user);
    const newRefreshToken = generateRefreshToken(savedToken.user);

    // Transaction to update old token and create new one
    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: savedToken.id },
        data: { revoked: true, replacedByToken: newRefreshToken }
      }),
      prisma.refreshToken.create({
        data: {
          userId: savedToken.userId,
          token: newRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          ipAddress,
          deviceHash
        }
      })
    ]);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  async logout(token: string) {
      try {
          await prisma.refreshToken.update({
              where: { token },
              data: { revoked: true }
          });
      } catch (e) {
          // Token might not exist or already revoked
      }
  }
}
