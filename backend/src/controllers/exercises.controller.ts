/**
 * Exercises Controller
 * ====================
 * Serves practice challenges for the /exercises page.
 * Queries the quizzes → modules → courses → specializations → domains hierarchy.
 *
 * Routes:
 *   GET  /api/exercises         — paginated exercise list (filter by domain, difficulty, search)
 *   GET  /api/exercises/:id     — single exercise with questions
 */

import { Request, Response } from 'express';
import { db } from '../db';
import { eq, ilike, or, sql, desc, asc } from 'drizzle-orm';
import { quizzes, questions, modules, courses, specializations, domains } from '../db/schema';
import logger from '../utils/logger';

// Map integer difficulty (1-3) to readable label
function difficultyLabel(d: number): string {
  if (d >= 3) return 'Hard';
  if (d === 2) return 'Medium';
  return 'Easy';
}

// Approximate points from difficulty
function difficultyPoints(d: number): number {
  if (d >= 3) return 120;
  if (d === 2) return 60;
  return 30;
}

// ─── GET /exercises ──────────────────────────────────────────────────────────

export const listExercises = async (req: Request, res: Response) => {
  try {
    const { domain: domainFilter, search, sort = 'newest', page = '1', limit = '20' } = req.query as Record<string, string>;

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const offset   = (pageNum - 1) * limitNum;

    const rows = await db
      .select({
        id:               quizzes.id,
        title:            quizzes.title,
        difficulty:       quizzes.difficulty,
        moduleTitle:      modules.title,
        courseTitle:      courses.title,
        domainName:       domains.name,
        domainType:       domains.type,
        specializationName: specializations.name,
      })
      .from(quizzes)
      .innerJoin(modules,        eq(quizzes.moduleId,             modules.id))
      .innerJoin(courses,        eq(modules.courseId,             courses.id))
      .innerJoin(specializations, eq(courses.specializationId,    specializations.id))
      .innerJoin(domains,        eq(specializations.domainId,     domains.id))
      .where(
        domainFilter && domainFilter !== 'All Domains'
          ? ilike(domains.name, `%${domainFilter}%`)
          : undefined
      )
      .orderBy(sort === 'points' ? desc(quizzes.difficulty) : desc(quizzes.id))
      .limit(limitNum)
      .offset(offset);

    // Apply search filter in memory (small result sets expected)
    const filtered = search
      ? rows.filter((r) =>
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.specializationName.toLowerCase().includes(search.toLowerCase()) ||
          r.domainName.toLowerCase().includes(search.toLowerCase())
        )
      : rows;

    const exercises = filtered.map((r) => ({
      id:          String(r.id),
      title:       r.title,
      domain:      r.domainName,
      subDomain:   r.specializationName,
      difficulty:  difficultyLabel(r.difficulty),
      points:      difficultyPoints(r.difficulty),
      successRate: null, // Not tracked yet — UI shows '—'
      solved:      false, // Per-user solved state requires auth; computed separately
    }));

    res.json({ success: true, data: exercises, meta: { page: pageNum, limit: limitNum, total: exercises.length } });
  } catch (err) {
    logger.error('listExercises error', err);
    res.status(500).json({ success: false, message: 'Failed to load exercises' });
  }
};

// ─── GET /exercises/:id ───────────────────────────────────────────────────────

export const getExercise = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid exercise id' });

    const [quiz] = await db
      .select({
        id:         quizzes.id,
        title:      quizzes.title,
        difficulty: quizzes.difficulty,
      })
      .from(quizzes)
      .where(eq(quizzes.id, id));

    if (!quiz) return res.status(404).json({ success: false, message: 'Exercise not found' });

    const qs = await db
      .select()
      .from(questions)
      .where(eq(questions.quizId, id));

    res.json({
      success: true,
      data: {
        ...quiz,
        difficulty: difficultyLabel(quiz.difficulty),
        points:     difficultyPoints(quiz.difficulty),
        questions:  qs,
      },
    });
  } catch (err) {
    logger.error('getExercise error', err);
    res.status(500).json({ success: false, message: 'Failed to load exercise' });
  }
};
