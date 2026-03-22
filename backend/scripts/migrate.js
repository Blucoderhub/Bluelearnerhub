#!/usr/bin/env node
/**
 * Migration script — pushes the Drizzle schema to the database.
 * Used during Render build: npm run db:push && npm run build
 * Also callable manually: npm run migrate
 */
const { execSync } = require('child_process');

console.log('[migrate] Pushing schema to database...');
try {
  execSync('npx drizzle-kit push', { stdio: 'inherit' });
  console.log('[migrate] Schema push complete.');
} catch (err) {
  console.error('[migrate] Failed:', err.message);
  process.exit(1);
}
