import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schemaV1 from './schema';
import * as schemaV2 from './schema-v2';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const sql = neon(process.env.DATABASE_URL);

// Merge both schema files so Drizzle has full awareness of all 40+ tables
export const db = drizzle(sql, { schema: { ...schemaV1, ...schemaV2 } });

// Re-export all table definitions for use in controllers
export * from './schema';
export * from './schema-v2';
