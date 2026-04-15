import axios from 'axios';
import { pool } from '../utils/database';
import { hashPassword } from '../utils/encryption';
import { signAccessToken, signRefreshToken } from '../utils/jwt';
import { config } from '../config';
import logger from '../utils/logger';

export interface OAuthProfile {
  providerId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider: 'github' | 'google';
}

// ─── GitHub OAuth helpers ──────────────────────────────────────────────────

export async function exchangeGithubCode(code: string): Promise<string> {
  const res = await axios.post(
    'https://github.com/login/oauth/access_token',
    {
      client_id: config.oauth.github.clientId,
      client_secret: config.oauth.github.clientSecret,
      code,
      redirect_uri: config.oauth.github.callbackUrl,
    },
    { headers: { Accept: 'application/json' } },
  );
  const accessToken = res.data?.access_token;
  if (!accessToken) throw new Error('GitHub did not return an access token');
  return accessToken;
}

export async function fetchGithubProfile(accessToken: string): Promise<OAuthProfile> {
  const [userRes, emailRes] = await Promise.all([
    axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'BlueLearnerHub' },
    }),
    axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'BlueLearnerHub' },
    }),
  ]);

  const primaryEmail =
    emailRes.data?.find((e: any) => e.primary && e.verified)?.email ||
    emailRes.data?.[0]?.email ||
    userRes.data?.email;

  if (!primaryEmail) throw new Error('GitHub account has no verified email address');

  return {
    providerId: String(userRes.data.id),
    email: primaryEmail,
    name: userRes.data.name || userRes.data.login || 'GitHub User',
    avatarUrl: userRes.data.avatar_url,
    provider: 'github',
  };
}

// ─── Google OAuth helpers ──────────────────────────────────────────────────

export async function exchangeGoogleCode(code: string): Promise<string> {
  const res = await axios.post('https://oauth2.googleapis.com/token', {
    client_id: config.oauth.google.clientId,
    client_secret: config.oauth.google.clientSecret,
    code,
    redirect_uri: config.oauth.google.callbackUrl,
    grant_type: 'authorization_code',
  });
  const accessToken = res.data?.access_token;
  if (!accessToken) throw new Error('Google did not return an access token');
  return accessToken;
}

export async function fetchGoogleProfile(accessToken: string): Promise<OAuthProfile> {
  const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const { sub, email, name, picture } = res.data;
  if (!email) throw new Error('Google account has no email address');

  return {
    providerId: String(sub),
    email,
    name: name || 'Google User',
    avatarUrl: picture,
    provider: 'google',
  };
}

// ─── Shared: find-or-create user + generate tokens ────────────────────────

export async function findOrCreateOAuthUser(profile: OAuthProfile) {
  // Try to find existing user by email (case-insensitive)
  const existing = await pool.query(
    'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
    [profile.email],
  );

  let user = existing.rows[0];

  if (user) {
    if (!user.is_active || user.is_banned) {
      throw new Error('Account is inactive or banned');
    }
    // Update profile picture if not set
    if (!user.profile_picture && profile.avatarUrl) {
      await pool.query(
        'UPDATE users SET profile_picture = $1, updated_at = NOW() WHERE id = $2',
        [profile.avatarUrl, user.id],
      );
    }
    logger.info(`OAuth login: existing user ${user.email} via ${profile.provider}`);
  } else {
    // Create new user — OAuth users don't have a password
    const placeholderHash = await hashPassword(
      `oauth_${profile.provider}_${profile.providerId}_${Date.now()}`,
    );
    const result = await pool.query(
      `INSERT INTO users
         (email, password_hash, full_name, role, profile_picture, email_verified, is_active)
       VALUES ($1, $2, $3, 'student', $4, true, true)
       RETURNING *`,
      [
        profile.email.toLowerCase().trim(),
        placeholderHash,
        profile.name,
        profile.avatarUrl || null,
      ],
    );
    user = result.rows[0];
    logger.info(`OAuth signup: new user ${user.email} via ${profile.provider}`);
  }

  return user;
}

export async function issueTokensForUser(user: any) {
  const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role || 'STUDENT' });
  const refreshToken = signRefreshToken({ userId: user.id, email: user.email, role: user.role || 'STUDENT' });

  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '30 days')
     ON CONFLICT (token) DO NOTHING`,
    [user.id, refreshToken],
  );

  await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

  // Reset lockout counter — defensive in case migration 004 hasn't run yet
  try {
    await pool.query(
      'UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = $1',
      [user.id],
    );
  } catch (err: any) {
    // Column doesn't exist yet — safe to ignore, will work once migrations run
  }

  return { accessToken, refreshToken };
}
