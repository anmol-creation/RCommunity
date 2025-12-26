import { Request, Response, NextFunction } from 'express';
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

  if (token === 'mock-jwt-token') {
    const user = await prisma.user.findFirst({ where: { verificationStatus: 'VERIFIED' } });
    if (user) {
        req.user = user;
        return next();
    }
  }

  // Allow passing UserID as token for testing other users (e.g. Visitor)
  try {
      const user = await prisma.user.findUnique({ where: { id: token } });
      if (user) {
        req.user = user;
        return next();
      }
  } catch (e) {
      // ignore
  }

  return res.status(401).json({ success: false, message: 'Invalid token' });
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next();

    const token = authHeader.split(' ')[1];
    if (!token) return next();

    try {
        if (token === 'mock-jwt-token') {
             const user = await prisma.user.findFirst({ where: { verificationStatus: 'VERIFIED' } });
             if (user) req.user = user;
        } else {
             const user = await prisma.user.findUnique({ where: { id: token } });
             if (user) req.user = user;
        }
    } catch (e) {}
    next();
};
