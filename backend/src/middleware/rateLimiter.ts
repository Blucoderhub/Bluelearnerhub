import rateLimit from 'express-rate-limit';
import { config } from '../config';

export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
  },
  skipSuccessfulRequests: true,
});

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: {
    success: false,
    message: 'API rate limit exceeded',
  },
});

export const notebookIngestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 8, // ingestion is expensive
  message: {
    success: false,
    message: 'Notebook source ingestion rate limit exceeded',
  },
});

export const notebookAiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // chat/generate are AI-heavy
  message: {
    success: false,
    message: 'Notebook AI request rate limit exceeded',
  },
});

export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: 'Upload rate limit exceeded, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const strictLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  message: { success: false, message: 'Strict rate limit exceeded' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Password reset — 3 requests per hour per IP (prevents email spam)
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: { success: false, message: 'Too many password reset requests. Please try again in an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// High-capacity limiter for Stripe webhooks — Stripe retries on 429, so don't block real events
export const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 300, // 300 req/min — plenty for Stripe burst retries
  message: { success: false, message: 'Webhook rate limit exceeded' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Only apply to requests bearing a valid stripe-signature header; block raw floods
    return !!req.headers['stripe-signature']
  },
});
