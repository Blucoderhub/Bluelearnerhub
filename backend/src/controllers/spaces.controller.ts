import { Router, Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { db } from '../db';
import { challenges, challengeSubmissions, spaces, dailyChallenges } from '../db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { authenticate } from '../middleware/auth';
import { GamificationService } from '../services/gamification.service';
import { judge0Service } from '../services/judge0.service';

const router = Router();

// Validation helper
const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

// ═══════════════════════════════════════════════════════════════════════════════
// SPACES - List all spaces (categories)
// ═══════════════════════════════════════════════════════════════════════════════

router.get('/spaces', async (req: Request, res: Response) => {
  try {

    const query = db.select().from(spaces).where(eq(spaces.isActive, true));

    const result = await query.orderBy(desc(spaces.createdAt));

    // Group by category and get challenge counts
    const categoryStats = await db
      .select({
        category: spaces.category,
        count: sql<number>`count(*)`.as('count'),
      })
      .from(challenges)
      .innerJoin(spaces, eq(challenges.spaceId, spaces.id))
      .where(eq(challenges.isPublished, true))
      .groupBy(spaces.category);

    const enrichedSpaces = result.map((space) => {
      const stats = categoryStats.find((s) => s.category === space.category);
      return {
        ...space,
        challengeCount: stats?.count || 0,
      };
    });

    res.json(enrichedSpaces);
  } catch (error) {
    console.error('Error fetching spaces:', error);
    res.status(500).json({ message: 'Failed to fetch spaces' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// CHALLENGES - List challenges with filters
// ═══════════════════════════════════════════════════════════════════════════════

router.get(
  '/challenges',
  [
    query('spaceId').optional().isInt(),
    query('difficulty').optional().isIn(['EASY', 'MEDIUM', 'HARD']),
    query('type').optional().isIn(['QUIZ', 'CODING']),
    query('page').optional().isInt(),
    query('limit').optional().isInt(),
  ],
  validate,
  async (req: Request, res: Response) => {
    try {
      const { spaceId, difficulty, type, page = '1', limit = '20' } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

      const conditions = [eq(challenges.isPublished, true)];

      if (spaceId) {
        conditions.push(eq(challenges.spaceId, parseInt(spaceId as string)));
      }
      if (difficulty) {
        conditions.push(eq(challenges.difficulty, difficulty as any));
      }
      if (type) {
        conditions.push(eq(challenges.type, type as any));
      }

      const [challengesList, countResult] = await Promise.all([
        db
          .select()
          .from(challenges)
          .where(and(...conditions))
          .orderBy(desc(challenges.createdAt))
          .limit(parseInt(limit as string))
          .offset(offset),
        db
          .select({ count: sql<number>`count(*)` })
          .from(challenges)
          .where(and(...conditions)),
      ]);

      res.json({
        challenges: challengesList,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: countResult[0]?.count || 0,
          totalPages: Math.ceil((countResult[0]?.count || 0) / parseInt(limit as string)),
        },
      });
    } catch (error) {
      console.error('Error fetching challenges:', error);
      res.status(500).json({ message: 'Failed to fetch challenges' });
    }
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// CHALLENGES - Get single challenge (without solution)
// ═══════════════════════════════════════════════════════════════════════════════

router.get(
  '/challenges/:id',
  [param('id').isInt()],
  validate,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const challenge = await db
        .select()
        .from(challenges)
        .where(eq(challenges.id, parseInt(id)))
        .limit(1);

      if (!challenge[0]) {
        return res.status(404).json({ message: 'Challenge not found' });
      }

      // Don't send solution to client
      const { solution: _solution, ...safeChallenge } = challenge[0];

      // Increment view count or solve count
      await db
        .update(challenges)
        .set({ totalSolves: sql`${challenges.totalSolves} + 1` })
        .where(eq(challenges.id, parseInt(id)));

      res.json(safeChallenge);
    } catch (error) {
      console.error('Error fetching challenge:', error);
      res.status(500).json({ message: 'Failed to fetch challenge' });
    }
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// CODE EXECUTION - Run code via Judge0
// ═══════════════════════════════════════════════════════════════════════════════

router.post(
  '/execute',
  authenticate,
  [
    body('challengeId').isInt(),
    body('language').isString(),
    body('code').isString(),
  ],
  validate,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const { challengeId, language, code } = req.body;

      // Get challenge test cases
      const challenge = await db
        .select()
        .from(challenges)
        .where(eq(challenges.id, challengeId))
        .limit(1);

      if (!challenge[0]) {
        return res.status(404).json({ message: 'Challenge not found' });
      }

      const testCases = challenge[0].testCases as Array<{ input: string; expected: string }>;

      // Execute code against test cases
      const results = await judge0Service.executeMultiple(code, language, testCases);

      // Save submission
      const passedCount = results.filter((r) => r.passed).length;
      const allPassed = passedCount === results.length;

      const [submission] = await db
        .insert(challengeSubmissions)
        .values({
          challengeId,
          userId,
          language,
          sourceCode: code,
          status: allPassed ? 'PASSED' : 'FAILED',
          passedTests: passedCount,
          totalTests: results.length,
          xpEarned: allPassed ? challenge[0].xpReward : 0,
        })
        .returning();

      // Award XP if all tests passed
      if (allPassed && challenge[0].xpReward > 0) {
        await GamificationService.awardXP(
          userId,
          challenge[0].xpReward,
          `Completed challenge: ${challenge[0].title}`
        );
      }

      res.json({
        submission,
        results,
        passed: allPassed,
        xpEarned: allPassed ? challenge[0].xpReward : 0,
      });
    } catch (error) {
      console.error('Error executing code:', error);
      res.status(500).json({ message: 'Failed to execute code' });
    }
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// SUBMISSIONS - User's submission history
// ═══════════════════════════════════════════════════════════════════════════════

router.get('/submissions', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { challengeId, page = '1', limit = '20' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const conditions = [eq(challengeSubmissions.userId, userId)];
    if (challengeId) {
      conditions.push(eq(challengeSubmissions.challengeId, parseInt(challengeId as string)));
    }

    const [submissions, _countResult] = await Promise.all([
      db
        .select({
          id: challengeSubmissions.id,
          challengeId: challengeSubmissions.challengeId,
          language: challengeSubmissions.language,
          status: challengeSubmissions.status,
          passedTests: challengeSubmissions.passedTests,
          totalTests: challengeSubmissions.totalTests,
          xpEarned: challengeSubmissions.xpEarned,
          submittedAt: challengeSubmissions.submittedAt,
          title: challenges.title,
        })
        .from(challengeSubmissions)
        .leftJoin(challenges, eq(challengeSubmissions.challengeId, challenges.id))
        .where(and(...conditions))
        .orderBy(desc(challengeSubmissions.submittedAt))
        .limit(parseInt(limit as string))
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(challengeSubmissions)
        .where(and(...conditions)),
    ]);

    res.json({
      submissions,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: _countResult[0]?.count || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Failed to fetch submissions' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// DAILY CHALLENGE - Get today's challenge
// ═══════════════════════════════════════════════════════════════════════════════

router.get('/daily', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const today = new Date().toISOString().split('T')[0];

    // Check if user already completed today's challenge
    const completed = await db
      .select()
      .from(dailyChallenges)
      .where(
        and(
          eq(dailyChallenges.date, today),
          eq(dailyChallenges.completedByUserId, userId)
        )
      )
      .limit(1);

    if (completed[0]) {
      // Return completed challenge info
      const challenge = await db
        .select()
        .from(challenges)
        .where(eq(challenges.id, completed[0].challengeId))
        .limit(1);

      return res.json({
        challenge: challenge[0],
        completed: true,
        xpEarned: completed[0].completedAt ? 50 : 0,
      });
    }

    // Get daily challenge for today
    let daily = await db
      .select()
      .from(dailyChallenges)
      .innerJoin(challenges, eq(dailyChallenges.challengeId, challenges.id))
      .where(eq(dailyChallenges.date, today))
      .limit(1);

    if (!daily[0]) {
      // Generate new daily challenge if none exists
      const randomChallenge = await db
        .select()
        .from(challenges)
        .where(eq(challenges.isPublished, true))
        .orderBy(sql`random()`)
        .limit(1);

      if (randomChallenge[0]) {
        await db.insert(dailyChallenges).values({
          challengeId: randomChallenge[0].id,
          date: today,
          domain: randomChallenge[0].category,
        });

        daily = await db
          .select()
          .from(dailyChallenges)
          .innerJoin(challenges, eq(dailyChallenges.challengeId, challenges.id))
          .where(eq(dailyChallenges.date, today))
          .limit(1);
      }
    }

    if (!daily[0]) {
      return res.status(404).json({ message: 'No daily challenge available' });
    }

    // Don't send solution
    const { solution: _solution, ...safeChallenge } = daily[0].challenges;

    res.json({
      challenge: safeChallenge,
      completed: false,
    });
  } catch (error) {
    console.error('Error fetching daily challenge:', error);
    res.status(500).json({ message: 'Failed to fetch daily challenge' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// STATS - User's challenge stats
// ═══════════════════════════════════════════════════════════════════════════════

router.get('/stats', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const [stats] = await db
      .select({
        totalSolved: sql<number>`count(distinct ${challengeSubmissions.challengeId})`.as('total_solved'),
        totalSubmissions: sql<number>`count(*)`.as('total_submissions'),
        passedSubmissions: sql<number>`sum(case when ${challengeSubmissions.status} = 'PASSED' then 1 else 0 end)`.as('passed_submissions'),
        totalXP: sql<number>`sum(${challengeSubmissions.xpEarned})`.as('total_xp'),
      })
      .from(challengeSubmissions)
      .where(eq(challengeSubmissions.userId, userId));

    const languageBreakdown = await db
      .select({
        language: challengeSubmissions.language,
        count: sql<number>`count(*)`.as('count'),
      })
      .from(challengeSubmissions)
      .where(eq(challengeSubmissions.userId, userId))
      .groupBy(challengeSubmissions.language);

    res.json({
      ...stats,
      languageBreakdown,
      acceptanceRate: stats.totalSubmissions > 0
        ? Math.round((stats.passedSubmissions / stats.totalSubmissions) * 100)
        : 0,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

export default router;
