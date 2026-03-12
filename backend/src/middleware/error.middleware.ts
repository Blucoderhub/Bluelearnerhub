import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { config } from '../config';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}

// Validation Error
export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, 400);
  }
}

// Authentication Error
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401);
  }
}

// Authorization Error
export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403);
  }
}

// Not Found Error
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

// Conflict Error
export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409);
  }
}

// Rate Limit Error
export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429);
  }
}

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new NotFoundError(message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ConflictError(message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
    error = new ValidationError(message);
  }

  // PostgreSQL errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        error = new ConflictError('Resource already exists');
        break;
      case '23502': // Not null violation
        error = new ValidationError('Required field is missing');
        break;
      case '23503': // Foreign key violation
        error = new ValidationError('Referenced resource does not exist');
        break;
      case '42P01': // Undefined table
        error = new AppError('Database table not found', 500);
        break;
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AuthenticationError('Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    error = new AuthenticationError('Token expired');
  }

  // Rate limiting errors
  if (err.type === 'entity.too.large') {
    error = new ValidationError('File too large');
  }

  // Log error for debugging
  const logData = {
    error: {
      name: err.name,
      message: err.message,
      stack: config.nodeEnv === 'development' ? err.stack : undefined,
    },
    request: {
      requestId: (req as any).requestId,
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      user: req.user?.id || 'anonymous',
    },
    timestamp: new Date().toISOString(),
  };

  if (error.statusCode >= 500) {
    logger.error('Server Error:', logData);
  } else if (error.statusCode >= 400) {
    logger.warn('Client Error:', logData);
  }

  // Send error response
  const responseError = {
    success: false,
    message: error.message,
    requestId: (req as any).requestId,
    ...(config.nodeEnv === 'development' && {
      stack: err.stack,
      error: err,
    }),
  };

  res.status(error.statusCode || 500).json(responseError);
}

export function notFound(req: Request, res: Response) {
  const message = `Route ${req.originalUrl} not found`;
  
  logger.warn('Route not found:', {
    requestId: (req as any).requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.status(404).json({
    success: false,
    message,
    requestId: (req as any).requestId,
  });
}

// Async error handler wrapper
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);
