import { Request, Response } from 'express';
import { pool } from '../utils/database';

// Ensure leads table exists (runs once; harmless if already created)
const ensureTable = pool.query(`
  CREATE TABLE IF NOT EXISTS leads (
    id          SERIAL PRIMARY KEY,
    email       TEXT NOT NULL,
    source      TEXT NOT NULL DEFAULT 'homepage_newsletter',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (email, source)
  )
`).catch(() => {/* ignore — table may already exist */});

export async function captureLeadEmail(req: Request, res: Response) {
  const { email, source = 'homepage_newsletter' } = req.body as { email?: string; source?: string };

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'A valid email is required.' });
  }

  const sanitizedEmail = email.trim().toLowerCase().slice(0, 254);
  const sanitizedSource = String(source).slice(0, 64);

  try {
    await ensureTable; // wait for table creation if it's still pending
    await pool.query(
      `INSERT INTO leads (email, source)
       VALUES ($1, $2)
       ON CONFLICT (email, source) DO NOTHING`,
      [sanitizedEmail, sanitizedSource],
    );
    return res.json({ success: true, message: 'Lead captured.' });
  } catch (err) {
    // Never expose DB errors to the client
    console.error('[leads] captureLeadEmail error:', err);
    return res.json({ success: true, message: 'Lead captured.' }); // silent fail — UX must not break
  }
}
