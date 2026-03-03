import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/auth';
import { UserModel } from '@/models/user';
import { pool } from '@/utils/database';
import logger from '@/utils/logger';
import { config } from '@/config';

const authService = new AuthService();

// Helper function to set secure HttpOnly cookies
const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProduction = config.nodeEnv === 'production';
  
  // Access Token Cookie
  res.cookie('accessToken', accessToken, {
    httpOnly: true,           // Prevents JavaScript access (XSS protection)
    secure: isProduction,     // HTTPS only in production
    sameSite: 'strict',       // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    signed: true,             // Uses session secret
  });

  // Refresh Token Cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/api/auth/refresh',
    signed: true,
  });
};

// Helper function to clear auth cookies
const clearAuthCookies = (res: Response) => {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
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

      const { comparePassword } = await import('@/utils/encryption');
      const isValid = await comparePassword(currentPassword, user.password_hash);

      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect',
        });
      }

      const { hashPassword } = await import('@/utils/encryption');
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
