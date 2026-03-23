/**
 * CSRF Protection — Double Submit Cookie Pattern
 * ===============================================
 * Because the API is cross-origin (Vercel frontend + Render backend) we must
 * use sameSite:'none' on auth cookies, which means the browser WILL send them
 * on cross-site requests.  The Double Submit Cookie Pattern mitigates this:
 *
 *   1. On login/register the server sets a readable `_csrf` cookie (not httpOnly).
 *   2. The frontend JS reads that cookie and attaches it as the `X-CSRF-Token` header.
 *   3. This middleware verifies the header value matches the cookie value.
 *   4. An attacker-controlled page can forge the header value but cannot read our
 *      cookie (SOP), so the values will never match.
 *
 * Exemptions (configured below):
 *   - GET / HEAD / OPTIONS — safe methods, no state change
 *   - /api/auth/login, /api/auth/register — no session exists yet; CSRF token is
 *     issued *as part of* these responses
 *   - /api/payments/webhook — uses Stripe signature verification instead
 *   - /health — public health check
 */

import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';
import logger from '../utils/logger';
import { config } from '../config';

const CSRF_COOKIE = '_csrf';
const CSRF_HEADER = 'x-csrf-token';

/** Paths that are exempt from CSRF validation. */
const EXEMPT_PATHS = new Set([
  '/api/auth/login',
  '/api/auth/register',
  '/api/payments/webhook',
  '/health',
]);

/** Safe HTTP methods that never change server state. */
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Generate a cryptographically random CSRF token and attach it as a
 * readable (non-httpOnly) cookie on the response.
 * Call this after successful login / register so the frontend can bootstrap.
 */
export function setCsrfCookie(res: Response): string {
  const token = randomBytes(32).toString('hex');
  const isProduction = config.nodeEnv === 'production';

  res.cookie(CSRF_COOKIE, token, {
    httpOnly: false,          // Must be readable by frontend JS
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // Match access-token lifetime
    path: '/',
  });

  return token;
}

/**
 * Clear the CSRF cookie on logout.
 */
export function clearCsrfCookie(res: Response): void {
  const isProduction = config.nodeEnv === 'production';
  res.clearCookie(CSRF_COOKIE, {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });
}

/**
 * CSRF validation middleware.
 * Attach to app.use() AFTER body-parser but BEFORE routes.
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  // Pass safe methods through without checks
  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  // Pass exempt paths through (login, register, Stripe webhook, health)
  const path = req.path;
  if (EXEMPT_PATHS.has(path)) {
    return next();
  }

  // In development, skip CSRF to simplify local API testing
  if (config.nodeEnv === 'development') {
    return next();
  }

  const cookieToken = req.cookies?.[CSRF_COOKIE];
  const headerToken = req.headers[CSRF_HEADER] as string | undefined;

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    logger.warn('CSRF validation failed', {
      path,
      method: req.method,
      hasCookie: !!cookieToken,
      hasHeader: !!headerToken,
      ip: req.ip,
    });
    res.status(403).json({ success: false, message: 'CSRF token mismatch' });
    return;
  }

  next();
}
