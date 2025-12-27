import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import prisma from '../utils/prisma';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
  }

  // --- DEV MOCKS (Legacy support if needed, but discouraged) ---
  if (process.env.NODE_ENV === 'development') {
      if (token === 'mock-jwt-token') {
        const user = await prisma.user.findFirst({ where: { verificationStatus: 'VERIFIED' } });
        if (user) {
            req.user = user;
            return next();
        }
      }
  }

  // --- REAL JWT VERIFICATION ---
  const payload = verifyAccessToken(token) as any;
  if (!payload) {
    return res.status(401).json({ success: false, message: 'Invalid or expired access token' });
  }

  try {
      // Optimisation: We can trust the token payload if strictly needed to save DB calls,
      // but usually fetching the user ensures they weren't deleted/banned.
      const user = await prisma.user.findUnique({ where: { id: payload.userId } });

      if (user) {
        req.user = user;
        return next();
      } else {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
  } catch (e) {
      return res.status(500).json({ success: false, message: 'Internal server error during auth' });
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next();

    const token = authHeader.split(' ')[1];
    if (!token) return next();

    try {
        const payload = verifyAccessToken(token) as any;
        if (payload) {
             const user = await prisma.user.findUnique({ where: { id: payload.userId } });
             if (user) req.user = user;
        } else if (process.env.NODE_ENV === 'development' && token === 'mock-jwt-token') {
             const user = await prisma.user.findFirst({ where: { verificationStatus: 'VERIFIED' } });
             if (user) req.user = user;
        }
    } catch (e) {}
    next();
};
