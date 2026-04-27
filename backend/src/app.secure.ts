import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { config } from './config';
import { generalLimiter, apiLimiter } from './middleware/rateLimit.middleware';

/**
 * SECURE EXPRESS APPLICATION CONFIGURATION
 * Implements comprehensive security best practices
 */
export function createSecureApp(): Application {
  const app = express();

  // ============================================
  // 1. TRUST PROXY (for load balancers)
  // ============================================
  app.set('trust proxy', process.env.TRUST_PROXY === 'true' ? 1 : false);

  // ============================================
  // 2. HTTPS REDIRECT (Production Only)
  // ============================================
  if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      // Redirect HTTP to HTTPS
      if (req.header('x-forwarded-proto') !== 'https' && !req.path.startsWith('/health')) {
        return res.redirect(301, `https://${req.header('host')}${req.url}`);
      }
      next();
    });
  }

  // ============================================
  // 3. SECURITY HEADERS WITH HELMET
  // ============================================
  app.use(
    helmet({
      // Strict Transport Security
      hsts: {
        maxAge: 31536000,        // 1 year in seconds
        includeSubDomains: true,
        preload: true,           // Allow inclusion in HSTS preload list
      },

      // Content Security Policy
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", 'https:'],
          scriptSrc: ["'self'", 'https:'],
          imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
          fontSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:3000'].filter(Boolean),
          mediaSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : undefined,
        },
        reportOnly: false,
      },

      // Referrer Policy
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },

      // Prevent MIME type sniffing
      noSniff: true,

      // X-Frame-Options: DENY
      frameguard: {
        action: 'deny',
      },

      // X-XSS-Protection header (legacy but helpful)
      xssFilter: true,

      // Disable other risky headers
      iframeSandbox: false,
    })
  );

  // ============================================
  // 4. CORS CONFIGURATION
  // ============================================
  const corsOptions = {
    origin: (origin: string | undefined, callback: Function) => {
      const allowedOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:3000')
        .split(',')
        .map(o => o.trim());

      // In development, allow localhost
      if (process.env.NODE_ENV === 'development') {
        allowedOrigins.push('http://localhost:3000', 'http://localhost:3001');
      }

      // Allow undefined origin for same-origin requests
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },

    credentials: true,                      // Allow credentials (cookies)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'X-Total-Count'],
    maxAge: 3600,                          // Cache preflight for 1 hour
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));

  // Reject CORS preflight requests with missing origin in production
  if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      if (req.method === 'OPTIONS' && !req.get('origin')) {
        return res.status(403).json({ error: 'CORS request invalid' });
      }
      next();
    });
  }

  // ============================================
  // 5. REQUEST SIZE LIMITS
  // ============================================
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // ============================================
  // 6. COOKIE PARSER (Must come after body parser)
  // ============================================
  const sessionSecret = process.env.SESSION_SECRET || config.sessionSecret;
  if (!sessionSecret || sessionSecret === config.sessionSecret) {
    console.warn('⚠️  Using default SESSION_SECRET. Set SESSION_SECRET environment variable.');
  }

  app.use(cookieParser(sessionSecret));

  // ============================================
  // 7. COMPRESSION
  // ============================================
  app.use(compression({ level: 6 }));

  // ============================================
  // 8. REQUEST LOGGING
  // ============================================
  if (process.env.NODE_ENV === 'production') {
    // Use Morgan for access logging in production
    app.use(
      morgan(
        ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms',
        {
          skip: (req) => req.path === '/health',  // Skip health checks
        }
      )
    );
  }

  // ============================================
  // 9. RATE LIMITING
  // ============================================
  app.use('/api/', apiLimiter);  // Apply rate limiting to all API routes

  // ============================================
  // 10. REQUEST VALIDATION MIDDLEWARE
  // ============================================
  // Validate request content-type
  app.use((req, res, next) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const contentType = req.get('Content-Type');
      if (!contentType?.includes('application/json') && !contentType?.includes('multipart/form-data')) {
        return res.status(415).json({
          success: false,
          message: 'Content-Type must be application/json or multipart/form-data',
        });
      }
    }
    next();
  });

  // ============================================
  // 11. SECURITY MIDDLEWARE FOR RESPONSES
  // ============================================
  app.use((req, res, next) => {
    // Remove server header
    res.removeHeader('X-Powered-By');

    // Add security response headers
    res.set({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    });

    next();
  });

  // ============================================
  // 12. REQUEST ID TRACKING
  // ============================================
  app.use((req, res, next) => {
    req.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    res.set('X-Request-ID', req.id);
    next();
  });

  // ============================================
  // 13. HEALTH CHECK ENDPOINT
  // ============================================
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ============================================
  // 14. ERROR HANDLING MIDDLEWARE
  // ============================================
  app.use((err: any, req: any, res: any, next: any) => {
    const isDevelopment = process.env.NODE_ENV === 'development';

    console.error('[Error]', err.message);

    const statusCode = err.status || err.statusCode || 500;
    const response = {
      success: false,
      message: isDevelopment ? err.message : 'An error occurred',
      requestId: req.id,
    };

    // Include stack trace in development only
    if (isDevelopment && err.stack) {
      response.stack = err.stack.split('\n');
    }

    res.status(statusCode).json(response);
  });

  return app;
}

/**
 * ENVIRONMENT VALIDATION
 * Ensures critical configuration is present
 */
export function validateSecurityConfig() {
  const requiredEnvVars = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'SESSION_SECRET',
    'MONGODB_URL',
    'REDIS_URL',
    'FRONTEND_URL',
    'NODE_ENV',
  ];

  const missing = requiredEnvVars.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please set these in your .env file'
    );
  }

  // Warn about localhost URLs in production
  if (process.env.NODE_ENV === 'production') {
    if (process.env.FRONTEND_URL?.includes('localhost')) {
      console.warn('⚠️  FRONTEND_URL contains localhost. This should be your actual domain.');
    }
  }
}
