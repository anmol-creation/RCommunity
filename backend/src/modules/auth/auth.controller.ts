import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { z } from 'zod';

const authService = new AuthService();

const loginSchema = z.object({
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

const verifySchema = z.object({
  phoneNumber: z.string().min(10),
  otp: z.string().length(6, "OTP must be 6 digits"),
  deviceId: z.string().optional()
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
  deviceId: z.string().optional()
});

export const requestOTP = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = loginSchema.parse(req.body);
    const result = await authService.requestOTP(phoneNumber);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: error.errors[0].message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, otp, deviceId } = verifySchema.parse(req.body);
    // Get IP for simple tracking
    const ip = req.ip || req.socket.remoteAddress;
    const result = await authService.verifyOTP(phoneNumber, otp, ip, deviceId);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: error.errors[0].message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken, deviceId } = refreshSchema.parse(req.body);
    const ip = req.ip || req.socket.remoteAddress;
    const tokens = await authService.refreshTokens(refreshToken, ip, deviceId);
    res.json({ success: true, ...tokens });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: error.errors[0].message });
    }
    res.status(401).json({ success: false, message: error.message || 'Unauthorized' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
      const { refreshToken } = req.body;
      if (refreshToken) {
          await authService.logout(refreshToken);
      }
      res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Logout failed' });
  }
};
