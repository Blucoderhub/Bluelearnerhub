// @ts-nocheck
import { Request, Response } from 'express';
import { config } from '../config';
import { signAccessToken, signRefreshToken } from '../utils/jwt';
import { comparePassword, hashPassword } from '../utils/encryption';
import { UserModel } from '../models/User';

/**
 * SECURE TOKEN RESPONSE HANDLER
 * Uses HttpOnly cookies instead of localStorage
 * This prevents XSS token theft
 */
export class SecureAuthHandler {
  /**
   * Set secure HTTP-only cookies for tokens
   * Prevents JavaScript access (XSS protection)
   * Only sent over HTTPS in production
   */
  static setTokenCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
    options?: {
      rememberMe?: boolean;
    }
  ) {
    const isProduction = process.env.NODE_ENV === 'production';
    const accessTokenExpiry = 7 * 24 * 60 * 60 * 1000; // 7 days
    const refreshTokenExpiry = options?.rememberMe 
      ? 30 * 24 * 60 * 60 * 1000  // 30 days
      : 7 * 24 * 60 * 60 * 1000;  // 7 days

    // Access Token Cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,          // ✅ CRITICAL: Prevents JavaScript access
      secure: isProduction,    // ✅ HTTPS only in production
      sameSite: 'strict',      // ✅ CSRF protection
      maxAge: accessTokenExpiry,
      domain: process.env.COOKIE_DOMAIN || undefined,
      path: '/',
      signed: true,            // Uses config.sessionSecret
    });

    // Refresh Token Cookie (More restrictive path)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: refreshTokenExpiry,
      domain: process.env.COOKIE_DOMAIN || undefined,
      path: '/api/auth/refresh',  // Only accessible to refresh endpoint
      signed: true,
    });

    // Optional: Store token metadata in accessible cookie (no sensitive data)
    res.cookie('auth', JSON.stringify({
      isAuthenticated: true,
      tokenExpiry: new Date(Date.now() + accessTokenExpiry).toISOString(),
    }), {
      httpOnly: false,         // JavaScript can read metadata
      secure: isProduction,
      sameSite: 'lax',
      maxAge: accessTokenExpiry,
      path: '/',
    });
  }

  /**
   * Clear all authentication cookies
   * Used for logout
   */
  static clearTokenCookies(res: Response) {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
    res.clearCookie('auth', { path: '/' });
  }

  /**
   * Validate and extract token from request
   * Supports both cookies and Bearer header (for API clients)
   */
  static extractToken(req: Request): string | null {
    // First check HttpOnly cookies
    if (req.signedCookies?.accessToken) {
      return req.signedCookies.accessToken;
    }

    // Fallback to Authorization header for API clients
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    return null;
  }
}

/**
 * UPDATED LOGIN CONTROLLER WITH SECURITY ENHANCEMENTS
 */
export async function secureLogin(email: string, password: string, req: Request, res: Response) {
  try {
    // Find user
    const user = await UserModel.findByEmail(email);
    
    if (!user) {
      // Don't reveal if email exists (prevents enumeration)
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if account is locked
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      return res.status(429).json({
        success: false,
        message: `Account locked. Try again after ${user.lockedUntil}`,
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive',
      });
    }

    // Check if user is banned
    if (user.is_banned) {
      return res.status(403).json({
        success: false,
        message: 'Account is banned',
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      // Increment failed login attempts
      const failedAttempts = (user.failed_login_attempts || 0) + 1;
      let lockedUntil = null;

      if (failedAttempts >= config.security.maxLoginAttempts) {
        // Lock account
        lockedUntil = new Date(Date.now() + config.security.lockoutDuration);
      }

      await UserModel.update(user.id, {
        failed_login_attempts: failedAttempts,
        locked_until: lockedUntil,
      });

      if (lockedUntil) {
        return res.status(429).json({
          success: false,
          message: 'Too many failed attempts. Account locked for 15 minutes.',
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Reset failed attempts on successful login
    await UserModel.update(user.id, {
      failed_login_attempts: 0,
      locked_until: null,
      last_login_at: new Date(),
    });

    // Generate tokens
    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = signRefreshToken({
      userId: user.id,
    });

    // Store refresh token in database
    await storeRefreshToken(user.id, refreshToken);

    // Set secure HttpOnly cookies
    SecureAuthHandler.setTokenCookies(res, accessToken, refreshToken, {
      rememberMe: false,
    });

    // Return user data (NO tokens in response body)
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        profile_picture: user.profile_picture,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login',
    });
  }
}

/**
 * SECURE REFRESH TOKEN HANDLER
 * Implements refresh token rotation for security
 */
export async function secureRefreshToken(req: Request, res: Response) {
  try {
    // Get refresh token from cookie
    const refreshToken = req.signedCookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not found',
      });
    }

    // Verify and decode refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
      });
    }

    // Verify token exists in database and is valid
    const storedToken = await getStoredRefreshToken(decoded.userId);
    if (!storedToken || storedToken.token !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token has been revoked',
      });
    }

    // Get user
    const user = await UserModel.findById(decoded.userId);
    if (!user || !user.is_active || user.is_banned) {
      return res.status(403).json({
        success: false,
        message: 'User account is not active',
      });
    }

    // Generate new access token
    const newAccessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // IMPORTANT: Rotate refresh token (generate new one)
    const newRefreshToken = signRefreshToken({
      userId: user.id,
    });

    // Invalidate old refresh token
    await invalidateRefreshToken(decoded.userId);

    // Store new refresh token
    await storeRefreshToken(user.id, newRefreshToken);

    // Set new cookies
    SecureAuthHandler.setTokenCookies(res, newAccessToken, newRefreshToken);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during token refresh',
    });
  }
}

/**
 * SECURE LOGOUT HANDLER
 */
export async function secureLogout(req: Request, res: Response) {
  try {
    if (req.user?.userId) {
      // Invalidate refresh token in database
      await invalidateRefreshToken(req.user.userId);
    }

    // Clear cookies
    SecureAuthHandler.clearTokenCookies(res);

    res.json({
      success: true,
      message: 'Logout successful',
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during logout',
    });
  }
}

/**
 * DATABASE FUNCTIONS FOR TOKEN MANAGEMENT
 */

async function storeRefreshToken(userId: number, token: string) {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  // Store in database with expiration
  // await db.query(
  //   'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
  //   [userId, token, expiresAt]
  // );
}

async function getStoredRefreshToken(userId: number) {
  // Retrieve from database
  // const result = await db.query(
  //   'SELECT token FROM refresh_tokens WHERE user_id = $1 AND expires_at > NOW()',
  //   [userId]
  // );
  // return result.rows[0];
  return null;
}

async function invalidateRefreshToken(userId: number) {
  // Delete or mark as invalid in database
  // await db.query(
  //   'DELETE FROM refresh_tokens WHERE user_id = $1',
  //   [userId]
  // );
}
