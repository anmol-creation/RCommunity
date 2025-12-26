import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

  // For Phase 1 (Stub), we might verify a simple mock token OR
  // if we want to be secure, we should use JWT.
  // Given the "Phase 1" constraints, let's at least expect the token
  // to be the USER ID directly (for development simplicity) OR a valid JWT.

  // REAL IMPLEMENTATION (TODO): Verify JWT
  // const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // req.user = decoded;

  // DEV IMPLEMENTATION:
  // We will assume the token passed is "mock-jwt-token" which maps to our seeded rider,
  // OR the client sends the actual UserID as the token for testing purposes.

  // Let's make it slightly better:
  // If token is 'mock-jwt-token', we use the seeded verified rider.
  if (token === 'mock-jwt-token') {
    const user = await prisma.user.findFirst({ where: { verificationStatus: 'VERIFIED' } });
    if (user) {
        req.user = user;
        return next();
    }
  }

  // Allow passing UserID as token for testing other users (e.g. Visitor)
  const user = await prisma.user.findUnique({ where: { id: token } });
  if (user) {
    req.user = user;
    return next();
  }

  return res.status(401).json({ success: false, message: 'Invalid token' });
};
