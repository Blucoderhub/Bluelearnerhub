import type { Request, Response, NextFunction } from 'express';
import { eq } from 'drizzle-orm';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { db, users } from '../db';
import logger from '../utils/logger';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from cookies (preferred) or Authorization header (fallback for API clients)
    let token: string | undefined;

    // First try to get from signed cookies (HttpOnly)
    if (req.signedCookies?.accessToken) {
      token = req.signedCookies.accessToken;
    }
    // Fallback to Authorization header for API clients
    else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No token provided',
      });
      return;
    }

    // Verify token
    const decoded: TokenPayload = verifyAccessToken(token);

    // Get user from database using Drizzle ORM
    const result = await db.query.users.findFirst({
      where: eq(users.id, decoded.userId),
      columns: {
        id: true,
        email: true,
        role: true,
        fullName: true,
        isActive: true,
      },
    });

    if (!result) {
      res.status(401).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Check if user is active
    if (!result.isActive) {
      res.status(401).json({
        success: false,
        message: 'Account is deactivated',
      });
      return;
    }

    // Attach user to request
    req.user = {
      id: result.id,
      email: result.email,
      role: result.role,
      fullName: result.fullName,
    };

    // Update last active (fire-and-forget — never block auth on this)
    db.update(users)
      .set({ lastActive: new Date() })
      .where(eq(users.id, result.id))
      .catch(() => { /* non-fatal */ });

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};

export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Mirror authenticate: prefer signed cookies, fall back to Authorization header
    let token: string | undefined;

    if (req.signedCookies?.accessToken) {
      token = req.signedCookies.accessToken;
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
    }

    if (!token) {
      return next();
    }

    const decoded: TokenPayload = verifyAccessToken(token);

    const result = await db.query.users.findFirst({
      where: eq(users.id, decoded.userId),
      columns: {
        id: true,
        email: true,
        role: true,
        fullName: true,
        isActive: true,
      },
    });

    if (result && result.isActive) {
      req.user = {
        id: result.id,
        email: result.email,
        role: result.role,
        fullName: result.fullName,
      };
    }

    next();
  } catch (error) {
    // Invalid token — continue without user rather than blocking
    next();
  }
};
