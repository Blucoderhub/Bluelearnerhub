import { Request, Response, NextFunction } from 'express';
import { randomBytes, createHash } from 'crypto';
import { AuthService } from '../services/auth';
import { UserModel } from '../models/user';
import { pool } from '../utils/database';
import logger from '../utils/logger';
import { config } from '../config';
import { sendEmail, buildPasswordResetEmail } from '../utils/email';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

async function ensureResetTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id         SERIAL PRIMARY KEY,
      email      TEXT NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      used       BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

const authService = new AuthService();

// Helper function to set secure HttpOnly cookies
const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProduction = config.nodeEnv === 'production';
  
  // Access Token Cookie
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    // 'none' required for cross-domain XHR (Vercel frontend + Render backend)
    // 'lax' is fine for same-domain local dev
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    signed: true,
  });

  // Refresh Token Cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/api/auth/refresh',
    signed: true,
  });
};

// Helper function to clear auth cookies
// Must include the same SameSite/Secure/signed flags as setAuthCookies or
// browsers (especially Chrome with SameSite=None) will ignore the clear.
const clearAuthCookies = (res: Response) => {
  const isProduction = config.nodeEnv === 'production';
  const baseOpts = {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
    signed: true,
  };
  res.clearCookie('accessToken', { ...baseOpts, path: '/' });
  res.clearCookie('refreshToken', { ...baseOpts, path: '/api/auth/refresh' });
};

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, fullName, role, collegeName, company } = req.body;

      const result = await authService.register({
        email,
        password,
        fullName,
        role,
        collegeName,
        company,
      });

      // Set HttpOnly cookies instead of returning tokens in body
      setAuthCookies(res, result.accessToken, result.refreshToken);

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          user: result.user,
          // Tokens are in cookies, not in response body
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      // Set HttpOnly cookies instead of returning tokens in body
      setAuthCookies(res, result.accessToken, result.refreshToken);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          // Tokens are in cookies, not in response body
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.signedCookies?.refreshToken;
      
      if (req.user) {
        await authService.logout(req.user.id, refreshToken);
      }

      // Clear cookies
      clearAuthCookies(res);

      res.json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.signedCookies?.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token not found',
        });
      }

      const result = await authService.refreshAccessToken(refreshToken);

      // Set new cookies with rotated tokens
      setAuthCookies(res, result.accessToken, result.refreshToken);

      res.json({
        success: true,
        message: 'Token refreshed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const user = await authService.getCurrentUser(userId);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const updates = req.body;

      const user = await UserModel.update(userId, updates);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ success: false, message: 'Email is required.' });
      }

      await ensureResetTable();

      // Always return success to prevent email enumeration
      const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
      if (userResult.rows.length === 0) {
        return res.json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
      }

      // Invalidate any existing tokens for this email
      await pool.query('UPDATE password_reset_tokens SET used = TRUE WHERE email = $1 AND used = FALSE', [email]);

      const rawToken = randomBytes(32).toString('hex');
      const tokenHash = createHash('sha256').update(rawToken).digest('hex');
      const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

      await pool.query(
        'INSERT INTO password_reset_tokens (email, token_hash, expires_at) VALUES ($1, $2, $3)',
        [email.toLowerCase().trim(), tokenHash, expiresAt]
      );

      // Send password reset email
      const resetUrl = `${config.frontendUrl}/reset-password?token=${rawToken}`;
      await sendEmail(buildPasswordResetEmail(email.toLowerCase().trim(), resetUrl));

      const responseData: Record<string, unknown> = { message: 'If that email is registered, a reset link has been sent.' };
      // Expose token in non-production for easier testing without email setup
      if (config.nodeEnv !== 'production') {
        responseData.devToken = rawToken;
        responseData.devResetUrl = resetUrl;
      }

      logger.info(`Password reset requested for ${email}`);
      res.json({ success: true, ...responseData });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        return res.status(400).json({ success: false, message: 'Token and new password are required.' });
      }
      if (typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
      }

      await ensureResetTable();

      const tokenHash = createHash('sha256').update(token).digest('hex');
      const result = await pool.query(
        'SELECT email, expires_at, used FROM password_reset_tokens WHERE token_hash = $1',
        [tokenHash]
      );

      if (result.rows.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
      }

      const { email, expires_at, used } = result.rows[0];
      if (used || new Date(expires_at) < new Date()) {
        return res.status(400).json({ success: false, message: 'Reset token has expired. Please request a new one.' });
      }

      const { hashPassword } = await import('../utils/encryption');
      const hashedPassword = await hashPassword(password);

      await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hashedPassword, email]);
      await pool.query('UPDATE password_reset_tokens SET used = TRUE WHERE token_hash = $1', [tokenHash]);

      logger.info(`Password reset completed for ${email}`);
      res.json({ success: true, message: 'Password has been reset successfully. You can now log in.' });
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { currentPassword, newPassword } = req.body;

      const user = await UserModel.findById(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      const { comparePassword } = await import('../utils/encryption');
      const isValid = await comparePassword(currentPassword, user.password_hash);

      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect',
        });
      }

      const { hashPassword } = await import('../utils/encryption');
      const hashedPassword = await hashPassword(newPassword);

      await pool.query(
        'UPDATE users SET password_hash = $1 WHERE id = $2',
        [hashedPassword, userId]
      );

      res.json({
        success: true,
        message: 'Password updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
