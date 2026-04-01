/**
 * Daily Quiz Routes — Secure Server-Side Scoring
 * ================================================
 * SECURITY MODEL:
 *   - correctIndex is NEVER sent to the client
 *   - Frontend submits raw answers[]; backend scores from its own cache
 *   - UNIQUE(user_id, quiz_date, domain) enforced at DB level
 *   - Duplicate submissions return 409 (not silently double-award XP)
 *   - Domain validated against server-side allowlist
 */

import { Router } from 'express';
import {
  getDailyQuiz,
  getAvailableDomains,
  getPublicQuiz,
  scoreQuiz,
} from '../services/dailyQuiz.service';
import { authenticate } from '../middleware/auth';
import { apiLimiter, strictLimiter } from '../middleware/rateLimiter';
import { GamificationService } from '../services/gamification.service';
import { pool } from '../utils/database';
import logger from '../utils/logger';

const router = Router();

// ─── DB bootstrap ────────────────────────────────────────────────────────────
// Creates the attempt-tracking table the first time this module loads.
// UNIQUE(user_id, quiz_date, domain) is the DB-level duplicate guard.

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS daily_quiz_attempts (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER NOT NULL,
        quiz_date  DATE    NOT NULL DEFAULT CURRENT_DATE,
        domain     TEXT    NOT NULL,
        score      INTEGER NOT NULL,
        xp_earned  INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_daily_quiz_attempt UNIQUE (user_id, quiz_date, domain)
      )
    `);
  } catch (err) {
    logger.error('[DailyQuiz] Failed to initialise attempt table', err);
  }
})();

// ─── GET /domains — public ───────────────────────────────────────────────────

router.get('/domains', apiLimiter, (_req, res) => {
  res.json({ success: true, data: getAvailableDomains(), error: null });
});

// ─── GET /:domain — return quiz WITHOUT correctIndex (requires auth) ─────────

router.get('/:domain', apiLimiter, authenticate, async (req, res) => {
  try {
    const domain = decodeURIComponent(req.params.domain as string);
    const allowedDomains = getAvailableDomains();

    if (!allowedDomains.includes(domain)) {
      return res.status(400).json({ success: false, message: 'Invalid domain', error: 'INVALID_DOMAIN' });
    }

    const userId = req.user!.id;
    const today  = new Date().toISOString().slice(0, 10);

    // Tell the client if they've already submitted today so the UI can show
    // a "come back tomorrow" state rather than letting them start again.
    const existing = await pool.query(
      `SELECT score, xp_earned
         FROM daily_quiz_attempts
        WHERE user_id = $1 AND quiz_date = $2 AND domain = $3`,
      [userId, today, domain]
    );

    const quiz       = await getDailyQuiz(domain);
    const publicQuiz = getPublicQuiz(quiz); // correctIndex stripped here

    res.json({
      success: true,
      data: {
        ...publicQuiz,
        alreadySubmitted: existing.rows.length > 0,
        previousResult:   existing.rows[0] ?? null,
      },
      error: null,
    });
  } catch (err) {
    logger.error('daily-quiz GET error', err);
    return res.status(500).json({ success: false, message: 'Failed to load daily quiz', error: null });
  }
});

// ─── POST /submit — server-side scoring ──────────────────────────────────────
//
// Body: { domain: string, answers: number[] }
//   answers[i] is the index (0-based) of the option the user selected for
//   question i.  correctIndex is fetched from the server cache — it is NEVER
//   read from the request body.

router.post('/submit', strictLimiter, authenticate, async (req, res) => {
  try {
    const userId  = req.user!.id;
    const { domain, answers } = req.body as { domain: unknown; answers: unknown };
    const today   = new Date().toISOString().slice(0, 10);

    // ── 1. Input validation ──────────────────────────────────────────────────

    if (!domain || typeof domain !== 'string') {
      return res.status(400).json({ success: false, message: 'domain is required', error: 'MISSING_DOMAIN' });
    }

    const allowedDomains = getAvailableDomains();
    if (!allowedDomains.includes(domain)) {
      return res.status(400).json({ success: false, message: 'Invalid domain', error: 'INVALID_DOMAIN' });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'answers must be an array', error: 'INVALID_ANSWERS' });
    }

    // ── 2. Load authoritative quiz from server cache ─────────────────────────

    const quiz = await getDailyQuiz(domain);

    if (answers.length !== quiz.questions.length) {
      return res.status(400).json({
        success: false,
        message: `Expected ${quiz.questions.length} answers, received ${answers.length}`,
        error: 'WRONG_ANSWER_COUNT',
      });
    }

    // Validate each answer is an integer within the option range
    for (let i = 0; i < answers.length; i++) {
      const a = answers[i];
      if (!Number.isInteger(a) || (a as number) < 0 || (a as number) >= quiz.questions[i].options.length) {
        return res.status(400).json({
          success: false,
          message: `Answer at index ${i} is out of range`,
          error: 'INVALID_ANSWER_VALUE',
        });
      }
    }

    // ── 3. Score entirely on the server ─────────────────────────────────────

    const { correctCount, score, xpEarned, correctAnswers, explanations } =
      scoreQuiz(quiz, answers as number[]);

    // ── 4. Persist attempt — UNIQUE constraint prevents double-submission ────

    try {
      await pool.query(
        `INSERT INTO daily_quiz_attempts (user_id, quiz_date, domain, score, xp_earned)
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, today, domain, score, xpEarned]
      );
    } catch (dbErr: any) {
      if (dbErr.code === '23505') {
        // Unique violation → already submitted today for this domain
        return res.status(409).json({
          success: false,
          message: 'You have already submitted this quiz today. Come back tomorrow!',
          error: 'ALREADY_SUBMITTED',
        });
      }
      throw dbErr; // unexpected DB error — re-throw for the outer catch
    }

    // ── 5. Award XP only after successful deduplication insert ───────────────

    if (xpEarned > 0) {
      await GamificationService.awardXP(userId, xpEarned, 'daily_quiz');
      await GamificationService.updateStreak(userId);
    }

    // ── 6. Respond with full results (correct answers revealed post-submit) ──

    res.json({
      success: true,
      data: {
        score,
        correctCount,
        totalQuestions: quiz.questions.length,
        xpEarned,
        correctAnswers, // safe to reveal now — submission is locked
        explanations,
      },
      error: null,
    });
  } catch (err) {
    logger.error('daily-quiz submit error', err);
    return res.status(500).json({ success: false, message: 'Failed to record quiz result', error: null });
  }
});

export default router;
