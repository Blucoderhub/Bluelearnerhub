import { UserModel, CreateUserDTO } from '../models/user';
import { comparePassword } from '../utils/encryption';
import { signAccessToken, signRefreshToken } from '../utils/jwt';
import { AppError } from '../middleware/error';
import { pool } from '../utils/database';
import logger from '../utils/logger';

export class AuthService {
  async register(data: CreateUserDTO) {
    // Check if user exists
    const existingUser = await UserModel.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    // Create user with default avatar config
    const user = await UserModel.create({
      ...data,
      avatarConfig: {
        seed: data.email.split('@')[0],
        style: 'adventurer',
      }
    });

    // Generate tokens
    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = signRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '30 days')
       ON CONFLICT (token) DO UPDATE SET expires_at = NOW() + INTERVAL '30 days'`,
      [user.id, refreshToken]
    );

    logger.info(`New user registered: ${user.email}`);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string) {
    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      throw new AppError(
        `Account locked due to multiple failed login attempts. Try again after ${user.locked_until}`,
        429
      );
    }

    // Check if user is active
    if (!user.is_active) {
      throw new AppError('Account is inactive', 403);
    }

    if (user.is_banned) {
      throw new AppError('Account is banned', 403);
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      // Increment failed login attempts
      const failedAttempts = (user.failed_login_attempts || 0) + 1;
      const maxAttempts = 5; // config.security.maxLoginAttempts
      let lockedUntil = null;

      if (failedAttempts >= maxAttempts) {
        // Lock account for 15 minutes
        lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      }

      await pool.query(
        'UPDATE users SET failed_login_attempts = $1, locked_until = $2 WHERE id = $3',
        [failedAttempts, lockedUntil, user.id]
      );

      if (lockedUntil) {
        throw new AppError('Too many failed attempts. Account locked for 15 minutes.', 429);
      }

      throw new AppError('Invalid credentials', 401);
    }

    // Reset failed attempts on successful login
    await pool.query(
      'UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = $1',
      [user.id]
    );

    // Generate tokens
    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = signRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token — upsert to avoid duplicate token collisions
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '30 days')
       ON CONFLICT (token) DO UPDATE SET expires_at = NOW() + INTERVAL '30 days'`,
      [user.id, refreshToken]
    );

    // Update last login
    await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

    logger.info(`User logged in: ${user.email}`);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        profilePicture: user.profile_picture,
        totalPoints: user.total_points,
        level: user.level,
      },
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: number, refreshToken: string) {
    // Revoke refresh token
    await pool.query(
      'UPDATE refresh_tokens SET revoked = true WHERE user_id = $1 AND token = $2',
      [userId, refreshToken]
    );

    logger.info(`User logged out: ${userId}`);
  }

  async refreshAccessToken(refreshToken: string) {
    // Verify refresh token exists and is not revoked
    const result = await pool.query(
      `SELECT * FROM refresh_tokens 
       WHERE token = $1 AND revoked = false AND expires_at > NOW()`,
      [refreshToken]
    );

    if (result.rows.length === 0) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const tokenData = result.rows[0];
    const user = await UserModel.findById(tokenData.user_id);

    if (!user || !user.is_active || user.is_banned) {
      throw new AppError('User account is not active', 403);
    }

    // Generate new tokens (IMPORTANT: Rotate refresh token for security)
    const newAccessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = signRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Invalidate old refresh token
    await pool.query(
      'UPDATE refresh_tokens SET revoked = true WHERE token = $1',
      [refreshToken]
    );

    // Store new refresh token
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '30 days')`,
      [user.id, newRefreshToken]
    );

    logger.info(`Token refreshed for user: ${user.id}`);

    return { 
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async getCurrentUser(userId: number) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const stats = await UserModel.getStats(userId);
    const skills = await UserModel.getSkills(userId);

    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      profilePicture: user.profile_picture,
      bio: user.bio,
      location: user.location,
      educationLevel: user.education_level,
      collegeName: user.college_name,
      currentPosition: user.current_position,
      company: user.company,
      yearsExperience: user.years_experience,
      linkedinUrl: user.linkedin_url,
      githubUrl: user.github_url,
      portfolioUrl: user.portfolio_url,
      totalPoints: user.total_points,
      currentStreak: user.current_streak,
      longestStreak: user.longest_streak,
      level: user.level,
      emailVerified: user.email_verified,
      stats,
      skills,
    };
  }
}
