import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { body, query, param } from 'express-validator';
import logger from '../utils/logger';
import { redisClient } from '../utils/database';

// Security headers middleware (enhanced helmet configuration)
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://generativelanguage.googleapis.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for API usage
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
});

// XSS Protection middleware
export const xssProtection = (req: Request, res: Response, next: NextFunction): void => {
  const xssRegex = /<script[^>]*>.*?<\/script>|javascript:|on\w+\s*=|<iframe|<object|<embed/gi;
  
  const checkXSS = (obj: any, path: string = ''): boolean => {
    if (typeof obj === 'string') {
      if (xssRegex.test(obj)) {
        logger.warn('XSS attempt detected:', {
          path,
          value: obj,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          url: req.originalUrl,
        });
        return true;
      }
    } else if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        if (checkXSS(obj[i], `${path}[${i}]`)) {
          return true;
        }
      }
    } else if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (checkXSS(obj[key], path ? `${path}.${key}` : key)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Check body, query, and params for XSS
  if (checkXSS(req.body, 'body') || checkXSS(req.query, 'query') || checkXSS(req.params, 'params')) {
    res.status(400).json({
      success: false,
      message: 'Potentially malicious content detected',
    });
    return;
  }

  next();
};

// SQL Injection protection
export const sqlInjectionProtection = (req: Request, res: Response, next: NextFunction): void => {
  const sqlRegex = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)|(\||;|--|\/\*|\*\/|xp_|sp_)/gi;
  
  const checkSQL = (obj: any, path: string = ''): boolean => {
    if (typeof obj === 'string') {
      if (sqlRegex.test(obj)) {
        logger.warn('SQL injection attempt detected:', {
          path,
          value: obj,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          url: req.originalUrl,
        });
        return true;
      }
    } else if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        if (checkSQL(obj[i], `${path}[${i}]`)) {
          return true;
        }
      }
    } else if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (checkSQL(obj[key], path ? `${path}.${key}` : key)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  if (checkSQL(req.body, 'body') || checkSQL(req.query, 'query') || checkSQL(req.params, 'params')) {
    res.status(400).json({
      success: false,
      message: 'Potentially malicious query detected',
    });
    return;
  }

  next();
};

// Request monitoring and anomaly detection
export const requestMonitoring = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const clientId = req.ip;
    const timestamp = Date.now();
    const windowSize = 60 * 1000; // 1 minute window
    const maxRequests = 100; // Max requests per minute per IP
    
    // Track request patterns
    const key = `req_monitor:${clientId}`;
    const requests = await redisClient.get(key);
    
    if (requests) {
      const requestData = JSON.parse(requests);
      const recentRequests = requestData.filter((ts: number) => timestamp - ts < windowSize);
      
      if (recentRequests.length >= maxRequests) {
        logger.warn('Suspicious request pattern detected:', {
          ip: clientId,
          requests: recentRequests.length,
          timeWindow: windowSize,
          url: req.originalUrl,
        });
        
        res.status(429).json({
          success: false,
          message: 'Request pattern anomaly detected',
        });
        return;
      }
      
      recentRequests.push(timestamp);
      await redisClient.setex(key, 300, JSON.stringify(recentRequests)); // 5 minutes expiry
    } else {
      await redisClient.setex(key, 300, JSON.stringify([timestamp]));
    }
    
    next();
  } catch (error) {
    // Don't fail the request if monitoring fails
    logger.error('Request monitoring error:', error);
    next();
  }
};

// Suspicious activity detection
export const suspiciousActivityDetection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const suspiciousPatterns = [
      /\.\.\//g, // Directory traversal
      /%2e%2e%2f/gi, // URL encoded directory traversal
      /etc\/passwd/gi, // System file access
      /cmd\.exe/gi, // Command execution
      /powershell/gi, // PowerShell execution
      /base64/gi, // Base64 encoded content (potential)
      /<\?php/gi, // PHP injection
    ];

    const requestString = JSON.stringify({
      url: req.originalUrl,
      query: req.query,
      body: req.body,
      headers: req.headers,
    });

    const matchedPatterns = suspiciousPatterns.filter(pattern => pattern.test(requestString));
    
    if (matchedPatterns.length > 0) {
      logger.error('Suspicious activity detected:', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        url: req.originalUrl,
        method: req.method,
        patterns: matchedPatterns.map(p => p.source),
        user: req.user?.id || 'anonymous',
      });
      
      // Track suspicious IPs
      const suspiciousKey = `suspicious:${req.ip}`;
      await redisClient.incr(suspiciousKey);
      await redisClient.expire(suspiciousKey, 3600); // 1 hour expiry
      
      res.status(400).json({
        success: false,
        message: 'Request blocked for security reasons',
      });
      return;
    }
    
    next();
  } catch (error) {
    logger.error('Suspicious activity detection error:', error);
    next();
  }
};

// Common validation rules
export const commonValidation = {
  // ID validation
  id: param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
  
  // Email validation
  email: body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  
  // Password validation
  password: body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  // Name validation
  name: body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters')
    .matches(/^[a-zA-Z\s.'-]+$/)
    .withMessage('Name contains invalid characters'),
  
  // Pagination validation
  page: query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  limit: query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  // Search query validation
  search: query('q').optional().isLength({ max: 100 }).withMessage('Search query too long'),
  
  // File upload validation
  fileSize: (maxSize: number) => 
    body('file').custom((_value, { req }) => {
      if (req.file && req.file.size > maxSize) {
        throw new Error(`File size exceeds ${maxSize} bytes`);
      }
      return true;
    }),
};

// IP whitelist/blacklist middleware
export const ipFilter = (whitelist?: string[], blacklist?: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIP = req.ip || '';
    
    // Check blacklist first
    if (blacklist && blacklist.includes(clientIP)) {
      logger.warn('Blocked request from blacklisted IP:', { ip: clientIP });
      res.status(403).json({
        success: false,
        message: 'Access denied',
      });
      return;
    }
    
    // Check whitelist if provided
    if (whitelist && whitelist.length > 0 && !whitelist.includes(clientIP)) {
      logger.warn('Blocked request from non-whitelisted IP:', { ip: clientIP });
      res.status(403).json({
        success: false,
        message: 'Access denied',
      });
      return;
    }
    
    next();
  };
};