import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { config } from './config';
import routes from './routes';
import { errorHandler, notFound } from './middleware/error.middleware';
import { generalLimiter } from './middleware/rateLimiter';
import { requestContext } from './middleware/requestContext';
import logger from './utils/logger';

export function createApp(): Application {
  const app = express();

  // Trust proxy for deployment behind load balancers
  app.set('trust proxy', process.env.TRUST_PROXY === 'true' ? 1 : false);

  // HTTPS redirect in production
  if (config.nodeEnv === 'production') {
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https' && !req.path.startsWith('/health')) {
        return res.redirect(301, `https://${req.header('host')}${req.url}`);
      }
      next();
    });
  }

  // Comprehensive security headers
  app.use(
    helmet({
      // Strict Transport Security (force HTTPS)
      hsts: {
        maxAge: 31536000,        // 1 year
        includeSubDomains: true,
        preload: true,
      },
      // Content Security Policy
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
          fontSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", config.frontendUrl].filter(Boolean),
          mediaSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
        },
        ...(config.nodeEnv === 'production' ? { upgradeInsecureRequests: true } : {}),
      },
      // Referrer Policy
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },
      // Prevent MIME type sniffing
      noSniff: true,
      // Prevent clickjacking
      frameguard: {
        action: 'deny',
      },
      // Remove X-Powered-By header
      hidePoweredBy: true,
      // DNS Prefetch Control
      dnsPrefetchControl: {
        allow: false,
      },
    })
  );

  // CORS
  const corsOptions: cors.CorsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (config.corsOrigins.indexOf(origin) !== -1 || config.nodeEnv === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['set-cookie'],
  };
  app.use(cors(corsOptions));

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Cookie parser with session secret
  if (!config.sessionSecret) {
    logger.warn('⚠️  SESSION_SECRET not set — using insecure fallback. Set SESSION_SECRET in your environment.');
  }
  const sessionSecret = config.sessionSecret || 'dev-secret-change-me-not-for-production';
  app.use(cookieParser(sessionSecret));

  // Compression
  app.use(compression());

  // Request correlation id for logs and upstream calls
  app.use(requestContext);

  // Logging
  if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined', {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    }));
  }

  // Rate limiting
  app.use('/api', generalLimiter);

  // Routes
  app.use('/api', routes);

  // Health check
  app.get('/health', (_req, res) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Error handling
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
