import { resolve } from 'path';
import { config as dotenvConfig } from 'dotenv';

// Load environment variables from the parent directory of this file's directory (src/config -> backend/)
dotenvConfig({ path: resolve(__dirname, '../../.env') });

const nodeEnv = process.env.NODE_ENV || 'development';

const jwtSecret = process.env.JWT_SECRET || '';
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || '';

const looksPlaceholderSecret = (value: string) => {
  const lower = value.toLowerCase();
  return (
    lower.includes('change-in-production') ||
    lower.includes('your-super-secret') ||
    lower.includes('replace-me') ||
    lower.includes('default-secret')
  );
};

if (nodeEnv !== 'test') {
  if (!jwtSecret || jwtSecret.length < 32 || looksPlaceholderSecret(jwtSecret)) {
    throw new Error('Invalid JWT_SECRET: set a strong secret (>=32 chars) via environment variables.');
  }
  if (!jwtRefreshSecret || jwtRefreshSecret.length < 32 || looksPlaceholderSecret(jwtRefreshSecret)) {
    throw new Error('Invalid JWT_REFRESH_SECRET: set a strong secret (>=32 chars) via environment variables.');
  }
}

export const config = {
  // Server
  port: parseInt(process.env.PORT || '5000'),
  host: process.env.HOST || '0.0.0.0',
  nodeEnv,

  // Frontend
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  // CORS
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000,http://frontend:3000').split(','),

  // Session & Cookies
  // Session & Cookies
  sessionSecret: process.env.SESSION_SECRET || process.env.COOKIE_SECRET || '',

  // Database
  database: {
    host: process.env.DB_HOST || process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || process.env.POSTGRES_PORT || '5432'),
    name: process.env.DB_NAME || process.env.POSTGRES_DB || 'edtech_platform',
    user: process.env.DB_USER || process.env.POSTGRES_USER || 'postgres',
    password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || '',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000'),
  },

  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB || '0'),
  },

  // JWT
  jwt: {
    secret: jwtSecret,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: jwtRefreshSecret,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  // Session
  session: {
    secret: process.env.SESSION_SECRET || '',
    cookieSecret: process.env.COOKIE_SECRET || '',
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },

  // File Upload
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    allowedFileTypes: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.zip', '.dwg', '.dxf', '.step', '.stl'],
    allowedMimeTypes: (process.env.ALLOWED_MIME_TYPES || 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,application/zip').split(','),
    maxImageDimensions: {
      width: parseInt(process.env.MAX_IMAGE_WIDTH || '4000'),
      height: parseInt(process.env.MAX_IMAGE_HEIGHT || '4000'),
    },
    enableVirusScan: process.env.ENABLE_VIRUS_SCAN === 'true' || false,
  },

  // AWS
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.AWS_S3_BUCKET,
  },

  // Email (SendGrid or Resend — set either key to enable sending)
  email: {
    from: process.env.EMAIL_FROM || 'noreply@bluelearnerhub.com',
    sendgridApiKey: process.env.SENDGRID_API_KEY,
    resendApiKey: process.env.RESEND_API_KEY,
  },

  // OAuth
  oauth: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      callbackUrl: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/oauth/github/callback`,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackUrl: `${process.env.GOOGLE_CALLBACK_URL || `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/oauth/google/callback`}`,
    },
  },

  // AI Service
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',

  // Code Execution
  judge0: {
    apiKey: process.env.JUDGE0_API_KEY,
    apiUrl: process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com',
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  // Security
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5'),
    lockoutDuration: parseInt(process.env.LOCKOUT_DURATION || '900000'), // 15 minutes
  },
};
