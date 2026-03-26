import * as schemaV1 from './schema';
import * as schemaV2 from './schema-v2';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('[db] DATABASE_URL is not set — all database queries will fail. Set DATABASE_URL in your environment.');
}
const schema = { ...schemaV1, ...schemaV2 };

function createDb() {
  if (!DATABASE_URL) {
    // Return a proxy so the server can boot; queries will throw at runtime
    return new Proxy({} as any, {
      get: () => { throw new Error('DATABASE_URL is not configured. Set it in your environment variables.'); }
    });
  }

  // Detect Neon cloud vs standard PostgreSQL by URL pattern.
  // Neon HTTP driver requires neon.tech endpoints; local/Docker PostgreSQL
  // uses the standard node-postgres (pg) driver via drizzle-orm/node-postgres.
  const isNeonDatabase =
    DATABASE_URL.includes('neon.tech') ||
    DATABASE_URL.includes('.aws.neon.tech') ||
    DATABASE_URL.includes('neon.database.azure.com');

  // Merge both schema files so Drizzle has full awareness of all 40+ tables
  if (isNeonDatabase) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { neon } = require('@neondatabase/serverless');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { drizzle } = require('drizzle-orm/neon-http');
    return drizzle(neon(DATABASE_URL), { schema });
  } else {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool } = require('pg');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { drizzle } = require('drizzle-orm/node-postgres');
    return drizzle(new Pool({ connectionString: DATABASE_URL }), { schema });
  }
}

export const db = createDb();

// Re-export all table definitions for use in controllers
export * from './schema';
export * from './schema-v2';
