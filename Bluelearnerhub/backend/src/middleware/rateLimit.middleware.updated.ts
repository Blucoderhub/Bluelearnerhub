// @ts-nocheck
import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { config } from '../config';

/**
 * General rate limiter for API endpoints
 * 100 requests per 15 minutes per IP
 */
export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  },
  keyGenerator: (req) => {
    // Use X-Forwarded-For for accurate IP behind proxy
    return req.get('X-Forwarded-For') || req.ip;
  },
});

/**
 * Stricter rate limiter for authentication endpoints
 * 5 attempts per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: {
    success: false,
    message: 'Too many authentication attempts. Account temporarily locked. Try again in 15 minutes.',
  },
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    return (req.get('X-Forwarded-For') || req.ip) + ':' + (req.body?.email || '');
  },
});

/**
 * Password reset endpoint limiter
 * 3 attempts per 15 minutes per IP
 * Prevents password reset abuse and enumeration attacks
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 attempts per 15 minutes
  message: {
    success: false,
    message: 'Too many password reset attempts. Please try again later.',
  },
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    return (req.get('X-Forwarded-For') || req.ip) + ':' + (req.body?.email || '');
  },
});

/**
 * API rate limiter for general API endpoints
 * 60 requests per minute per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: {
    success: false,
    message: 'API rate limit exceeded',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.get('X-Forwarded-For') || req.ip;
  },
});

/**
 * File upload rate limiter
 * 10 uploads per 15 minutes per IP
 */
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 uploads per 15 minutes
  message: {
    success: false,
    message: 'Upload rate limit exceeded, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.get('X-Forwarded-For') || req.ip;
  },
});

/**
 * Strict rate limiter for sensitive operations
 * (account deletion, data export, etc.)
 * 10 requests per minute per IP
 */
export const strictLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: {
    success: false,
    message: 'Strict rate limit exceeded',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.get('X-Forwarded-For') || req.ip;
  },
});

/**
 * Extreme rate limiter for brute force protection
 * Used for critical endpoints like 2FA verification
 */
export const bruteForceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 attempts
  message: {
    success: false,
    message: 'Too many attempts. Please try again later.',
  },
  skipSuccessfulRequests: true,
});

/**
 * Store rate limit metrics for monitoring
 * This can be extended for more detailed analytics
 */
export const rateLimitMonitor = (req: Request, res: Response, next: Function) => {
  const ip = req.get('X-Forwarded-For') || req.ip;
  const rateLimitKey = `rate_limit:${ip}`;

  // Track request count for monitoring
  // This should be logged to a monitoring system
  next();
};
