import { Pool } from 'pg';
import Redis from 'ioredis';
import { config } from '../config';
import logger from './logger';

// PostgreSQL Connection Pool
// Prefer DATABASE_URL (single source of truth) over individual host/user/password vars
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      max: config.database.maxConnections,
      idleTimeoutMillis: config.database.idleTimeoutMillis,
      connectionTimeoutMillis: config.database.connectionTimeoutMillis,
      ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
    }
  : {
      host: config.database.host,
      port: config.database.port,
      database: config.database.name,
      user: config.database.user,
      password: config.database.password,
      max: config.database.maxConnections,
      idleTimeoutMillis: config.database.idleTimeoutMillis,
      connectionTimeoutMillis: config.database.connectionTimeoutMillis,
      ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
    };

export const pool = new Pool(poolConfig);

// Enhanced error handling for pool
pool.on('error', (err: unknown) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

pool.on('connect', () => {
  logger.info('✓ New PostgreSQL client connected');
});

pool.on('remove', () => {
  logger.info('PostgreSQL client removed');
});

// Test PostgreSQL connection with retry logic
export const testPostgresConnection = async (): Promise<void> => {
  const maxRetries = 5;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const client = await pool.connect();
      await client.query('SELECT NOW()');
      logger.info('✓ PostgreSQL connected successfully');
      client.release();
      return;
    } catch (error) {
      retries++;
      logger.error(`PostgreSQL connection attempt ${retries} failed:`, error);
      
      if (retries === maxRetries) {
        throw new Error(`PostgreSQL connection failed after ${maxRetries} attempts`);
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
    }
  }
};

// Redis Client — prefer REDIS_URL (provided by Render, Railway, etc.)
// over individual host/port/password config vars.
const redisBaseOptions = {
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    logger.info(`Redis retry attempt ${times}, waiting ${delay}ms`);
    return delay;
  },
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
};

export const redisClient = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, redisBaseOptions)
  : new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password || undefined,
      db: config.redis.db,
      ...redisBaseOptions,
    });

// Redis event handlers
redisClient.on('connect', () => {
  logger.info('✓ Redis connected successfully');
});

redisClient.on('ready', () => {
  logger.info('✓ Redis ready to receive commands');
});

redisClient.on('error', (error: any) => {
  logger.error('✗ Redis connection error:', error);
});

redisClient.on('close', () => {
  logger.warn('Redis connection closed');
});

redisClient.on('reconnecting', () => {
  logger.info('Redis reconnecting...');
});

// Test Redis connection
export const testRedisConnection = async (): Promise<void> => {
  try {
    await redisClient.ping();
    logger.info('✓ Redis connected successfully');
  } catch (error) {
    logger.error('✗ Redis connection failed:', error);
    throw error;
  }
};

// Enhanced Redis helper functions
export const redisHelpers = {
  // Set with expiration and error handling
  async set(key: string, value: any, expirationSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (expirationSeconds) {
        await redisClient.setex(key, expirationSeconds, serialized);
      } else {
        await redisClient.set(key, serialized);
      }
    } catch (error) {
      logger.error(`Redis SET error for key ${key}:`, error);
      throw error;
    }
  },

  // Get and parse with error handling
  async get(key: string): Promise<any> {
    try {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error(`Redis GET error for key ${key}:`, error);
      return null;
    }
  },

  // Delete with error handling
  async del(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      logger.error(`Redis DEL error for key ${key}:`, error);
      throw error;
    }
  },

  // Clear all keys matching pattern
  async clearPattern(pattern: string): Promise<void> {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(...keys);
        logger.info(`Cleared ${keys.length} keys matching pattern: ${pattern}`);
      }
    } catch (error) {
      logger.error(`Redis CLEAR PATTERN error for pattern ${pattern}:`, error);
      throw error;
    }
  },

  // Increment counter with error handling
  async incr(key: string): Promise<number> {
    try {
      return await redisClient.incr(key);
    } catch (error) {
      logger.error(`Redis INCR error for key ${key}:`, error);
      throw error;
    }
  },

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Redis EXISTS error for key ${key}:`, error);
      return false;
    }
  },

  // Set with TTL (time to live)
  async setWithTTL(key: string, value: any, ttlSeconds: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await redisClient.setex(key, ttlSeconds, serialized);
    } catch (error) {
      logger.error(`Redis SET with TTL error for key ${key}:`, error);
      throw error;
    }
  },

  // Get TTL for a key
  async getTTL(key: string): Promise<number> {
    try {
      return await redisClient.ttl(key);
    } catch (error) {
      logger.error(`Redis TTL error for key ${key}:`, error);
      return -1;
    }
  },

  // Hash operations
  async hset(key: string, field: string, value: any): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await redisClient.hset(key, field, serialized);
    } catch (error) {
      logger.error(`Redis HSET error for key ${key}, field ${field}:`, error);
      throw error;
    }
  },

  async hget(key: string, field: string): Promise<any> {
    try {
      const value = await redisClient.hget(key, field);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error(`Redis HGET error for key ${key}, field ${field}:`, error);
      return null;
    }
  },

  // List operations
  async lpush(key: string, value: any): Promise<number> {
    try {
      const serialized = JSON.stringify(value);
      return await redisClient.lpush(key, serialized);
    } catch (error) {
      logger.error(`Redis LPUSH error for key ${key}:`, error);
      throw error;
    }
  },

  async rpop(key: string): Promise<any> {
    try {
      const value = await redisClient.rpop(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error(`Redis RPOP error for key ${key}:`, error);
      return null;
    }
  }
};

// Graceful shutdown
export const closeConnections = async (): Promise<void> => {
  await pool.end();
  redisClient.quit();
  console.log('All database connections closed');
};
