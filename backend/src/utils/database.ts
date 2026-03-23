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

// Log idle pool errors but do NOT exit — let the app handle DB errors at request time
pool.on('error', (err: unknown) => {
  logger.error('Unexpected error on idle PostgreSQL client:', err);
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

// ─── Redis / In-Memory Cache ──────────────────────────────────────────────────
//
// If REDIS_URL is set, use a real Redis connection.
// Otherwise fall back to a lightweight in-memory store so the server runs
// without any Redis infrastructure (suitable for free-tier single-instance).

interface CacheEntry { value: string; expiresAt?: number }

class InMemoryCache {
  private store = new Map<string, CacheEntry>();
  readonly status = 'ready';

  private live(e: CacheEntry | undefined): e is CacheEntry {
    if (!e) return false;
    if (e.expiresAt !== undefined && Date.now() > e.expiresAt) { this.store.delete(''); return false; }
    return true;
  }

  async get(key: string): Promise<string | null> {
    const e = this.store.get(key);
    if (!e || (e.expiresAt !== undefined && Date.now() > e.expiresAt)) { this.store.delete(key); return null; }
    return e.value;
  }
  async set(key: string, value: string): Promise<'OK'> { this.store.set(key, { value }); return 'OK'; }
  async setex(key: string, seconds: number, value: string): Promise<'OK'> {
    this.store.set(key, { value, expiresAt: Date.now() + seconds * 1000 }); return 'OK';
  }
  async del(...keys: string[]): Promise<number> {
    return keys.filter(k => this.store.delete(k)).length;
  }
  async incr(key: string): Promise<number> {
    const e = this.store.get(key);
    const n = (e ? parseInt(e.value, 10) || 0 : 0) + 1;
    this.store.set(key, { value: String(n), expiresAt: e?.expiresAt }); return n;
  }
  async expire(key: string, seconds: number): Promise<number> {
    const e = this.store.get(key); if (!e) return 0;
    this.store.set(key, { ...e, expiresAt: Date.now() + seconds * 1000 }); return 1;
  }
  async exists(...keys: string[]): Promise<number> {
    return keys.filter(k => { const e = this.store.get(k); return e && !(e.expiresAt !== undefined && Date.now() > e.expiresAt); }).length;
  }
  async keys(pattern: string): Promise<string[]> {
    const re = new RegExp('^' + pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
    return [...this.store.keys()].filter(k => { const e = this.store.get(k); return e && !(e.expiresAt !== undefined && Date.now() > e.expiresAt) && re.test(k); });
  }
  async ttl(key: string): Promise<number> {
    const e = this.store.get(key); if (!e) return -2; if (e.expiresAt === undefined) return -1;
    return Math.ceil((e.expiresAt - Date.now()) / 1000);
  }
  async hset(key: string, field: string, value: string): Promise<number> {
    const e = this.store.get(key); const h = e ? JSON.parse(e.value) : {}; h[field] = value;
    this.store.set(key, { value: JSON.stringify(h) }); return 1;
  }
  async hget(key: string, field: string): Promise<string | null> {
    const e = this.store.get(key); if (!e) return null;
    try { return JSON.parse(e.value)[field] ?? null; } catch { return null; }
  }
  async lpush(key: string, value: string): Promise<number> {
    const e = this.store.get(key); const l = e ? JSON.parse(e.value) : []; l.unshift(value);
    this.store.set(key, { value: JSON.stringify(l) }); return l.length;
  }
  async rpop(key: string): Promise<string | null> {
    const e = this.store.get(key); if (!e) return null; const l = JSON.parse(e.value); const v = l.pop() ?? null;
    this.store.set(key, { value: JSON.stringify(l) }); return v;
  }
  async ping(): Promise<'PONG'> { return 'PONG'; }
  on(_: string, __: any): this { return this; }
  quit(): void {}
  disconnect(): void {}
}

const redisConfigured = Boolean(process.env.REDIS_URL);

export const redisClient: any = redisConfigured
  ? (() => {
      const client = new Redis(process.env.REDIS_URL!, {
        retryStrategy: (times: number) => {
          if (times > 5) { logger.warn('Redis max retries exceeded — caching disabled.'); return null; }
          const delay = Math.min(times * 500, 3000);
          logger.info(`Redis retry ${times}/5, waiting ${delay}ms`);
          return delay;
        },
        maxRetriesPerRequest: null as any,
        lazyConnect: true,
      });
      client.on('connect', () => logger.info('✓ Redis connected'));
      client.on('error', (e: any) => logger.error('✗ Redis error:', e.message));
      return client;
    })()
  : (() => {
      logger.warn('REDIS_URL not set — using in-memory cache (caching is local to this instance).');
      return new InMemoryCache();
    })();

// Test Redis connection
export const testRedisConnection = async (): Promise<void> => {
  if (!redisConfigured) {
    logger.info('ℹ️  Redis not configured — in-memory cache active.');
    return;
  }
  try {
    await redisClient.ping();
    logger.info('✅ Redis connected successfully');
  } catch (error) {
    logger.warn('⚠️  Redis ping failed — caching may be degraded:', error);
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
  if (redisConfigured) redisClient.quit();
  console.log('All database connections closed');
};
