/**
 * Daily Quiz Cron Service
 * =======================
 * Generates domain-specific AI quizzes every day at midnight.
 * Uses the Python AI orchestrator → QuizGeneratorAgent.
 *
 * Schedule: 0 0 * * *  (midnight UTC)
 */

import axios from 'axios';
import { db } from '../db';
import logger from '../utils/logger';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL ?? 'http://localhost:8001';

const DOMAINS = [
  'JavaScript', 'TypeScript', 'Python', 'React', 'Node.js',
  'PostgreSQL', 'Docker', 'Machine Learning', 'Data Structures',
  'System Design', 'Finance', 'Mechanical Engineering',
];

export interface DailyQuiz {
  domain:     string;
  date:       string;   // ISO date YYYY-MM-DD
  questions:  MCQ[];
}

export interface MCQ {
  question:     string;
  options:      string[];
  correctIndex: number;   // NEVER send to client
  explanation:  string;   // Sent only after submission
  difficulty:   'easy' | 'medium' | 'hard';
}

/**
 * Safe public shape — no correctIndex, no explanation.
 * This is the ONLY shape the frontend ever receives before submission.
 */
export interface MCQPublic {
  question:   string;
  options:    string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface DailyQuizPublic {
  domain:     string;
  date:       string;
  questions:  MCQPublic[];
}

/** XP per correct answer keyed by difficulty */
const XP_PER_DIFFICULTY: Record<MCQ['difficulty'], number> = {
  easy:   10,
  medium: 20,
  hard:   30,
};

/**
 * Strip correctIndex and explanation before sending to the client.
 * The server keeps the original DailyQuiz in its cache and uses it for scoring.
 */
export function getPublicQuiz(quiz: DailyQuiz): DailyQuizPublic {
  return {
    domain:    quiz.domain,
    date:      quiz.date,
    questions: quiz.questions.map(({ question, options, difficulty }) => ({
      question,
      options,
      difficulty,
    })),
  };
}

export interface ScoreResult {
  correctCount:   number;
  score:          number;   // 0–100 percentage
  xpEarned:       number;
  correctAnswers: number[]; // indices, revealed only after submission
  explanations:   string[]; // revealed only after submission
}

/**
 * Score a quiz server-side.
 * answers[] must have the same length as quiz.questions[].
 * Any out-of-range index is treated as wrong.
 */
export function scoreQuiz(quiz: DailyQuiz, answers: number[]): ScoreResult {
  let correctCount = 0;
  let xpEarned     = 0;

  quiz.questions.forEach((q, i) => {
    if (answers[i] === q.correctIndex) {
      correctCount++;
      xpEarned += XP_PER_DIFFICULTY[q.difficulty] ?? 10;
    }
  });

  return {
    correctCount,
    score:          Math.round((correctCount / quiz.questions.length) * 100),
    xpEarned,
    correctAnswers: quiz.questions.map((q) => q.correctIndex),
    explanations:   quiz.questions.map((q) => q.explanation),
  };
}

// In-memory cache — keyed by `${domain}:${date}`
const quizCache = new Map<string, DailyQuiz>();

// ─── Generator ────────────────────────────────────────────────────────────────

async function generateQuizForDomain(domain: string, date: string): Promise<DailyQuiz> {
  const cacheKey = `${domain}:${date}`;
  const cached = quizCache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.post(`${AI_SERVICE_URL}/api/v1/ai/quiz/generate`, {
      topic:       domain,
      count:       5,
      difficulty:  'medium',
      context:     `Daily practice quiz for ${domain}. Date: ${date}. Mix easy, medium, hard questions.`,
    }, { timeout: 30_000 });

    const quiz: DailyQuiz = {
      domain,
      date,
      questions: data.questions ?? [],
    };

    quizCache.set(cacheKey, quiz);
    logger.info(`Daily quiz generated: ${domain} (${date})`);
    return quiz;
  } catch (err) {
    logger.error(`Failed to generate quiz for ${domain}`, err);
    // Return fallback static quiz so the endpoint never crashes
    return {
      domain,
      date,
      questions: [
        {
          question:    `What is a key concept in ${domain}?`,
          options:     ['Option A', 'Option B', 'Option C', 'Option D'],
          correctIndex: 0,
          explanation: 'This is a placeholder question. AI service is unavailable.',
          difficulty:  'easy',
        },
      ],
    };
  }
}

// ─── Cron Job ─────────────────────────────────────────────────────────────────

export async function runDailyQuizGeneration(): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  logger.info(`[DailyQuiz] Generating quizzes for ${today}…`);

  // Pre-warm all domain quizzes in parallel (with concurrency cap)
  const BATCH = 3;
  for (let i = 0; i < DOMAINS.length; i += BATCH) {
    const batch = DOMAINS.slice(i, i + BATCH);
    await Promise.all(batch.map((d) => generateQuizForDomain(d, today)));
  }

  logger.info(`[DailyQuiz] All ${DOMAINS.length} quizzes ready for ${today}`);
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function getDailyQuiz(domain: string): Promise<DailyQuiz> {
  const today = new Date().toISOString().slice(0, 10);
  return generateQuizForDomain(domain, today);
}

export function getAvailableDomains(): string[] {
  return DOMAINS;
}

// ─── Scheduler Setup ─────────────────────────────────────────────────────────
// Call this once at server startup to register the cron

export function initDailyQuizCron(): void {
  try {
    // Dynamic require so the server doesn't crash if node-cron isn't installed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const cron = require('node-cron');

    // Run at midnight UTC every day
    cron.schedule('0 0 * * *', async () => {
      await runDailyQuizGeneration();
    }, { timezone: 'UTC' });

    logger.info('[DailyQuiz] Cron scheduled: 0 0 * * * UTC');

    // Also run immediately on startup to pre-warm today's quizzes
    runDailyQuizGeneration().catch((err) => logger.error('[DailyQuiz] Startup warmup failed', err));
  } catch (err) {
    logger.warn('[DailyQuiz] node-cron not available — daily quiz cron disabled. Install: npm i node-cron @types/node-cron');
  }
}
