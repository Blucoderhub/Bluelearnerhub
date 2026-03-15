import * as schemaV1 from './schema';
import * as schemaV2 from './schema-v2';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const DATABASE_URL = process.env.DATABASE_URL;
const schema = { ...schemaV1, ...schemaV2 };

// Detect Neon cloud vs standard PostgreSQL by URL pattern.
// Neon HTTP driver requires neon.tech endpoints; local/Docker PostgreSQL
// uses the standard node-postgres (pg) driver via drizzle-orm/node-postgres.
const isNeonDatabase =
  DATABASE_URL.includes('neon.tech') ||
  DATABASE_URL.includes('.aws.neon.tech') ||
  DATABASE_URL.includes('neon.database.azure.com');

// Merge both schema files so Drizzle has full awareness of all 40+ tables
export const db = isNeonDatabase
  ? (() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { neon } = require('@neondatabase/serverless');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { drizzle } = require('drizzle-orm/neon-http');
      return drizzle(neon(DATABASE_URL), { schema });
    })()
  : (() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { Pool } = require('pg');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { drizzle } = require('drizzle-orm/node-postgres');
      return drizzle(new Pool({ connectionString: DATABASE_URL }), { schema });
    })();

// Re-export all table definitions for use in controllers
export * from './schema';
export * from './schema-v2';
