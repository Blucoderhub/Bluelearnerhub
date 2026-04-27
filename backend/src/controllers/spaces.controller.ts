import { Router, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { body, param, query, validationResult } from 'express-validator';
import { db } from '../db';
import { authenticate } from '../middleware/auth';
import logger from '../utils/logger';

const router = Router();

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

router.get('/spaces', async (req: Request, res: Response) => {
  try {
    const spaces = await db.query.spaces.findMany({ isActive: true });
    res.json(spaces);
  } catch (error) {
    logger.error('Error fetching spaces:', error);
    res.status(500).json({ message: 'Failed to fetch spaces' });
  }
});

router.get('/challenges', async (req: Request, res: Response) => {
  try {
    const { spaceId, difficulty, page = '1', limit = '20' } = req.query;
    const filter: any = {};
    
    if (spaceId) filter.spaceId = spaceId;
    if (difficulty) filter.difficulty = difficulty;
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const challenges = await db.query.exercises.findMany({ ...filter, limit: parseInt(limit as string), skip });
    const all = await db.query.exercises.findMany({});
    const total = all.length;

    res.json({
      challenges,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ message: 'Failed to fetch challenges' });
  }
});

router.get('/challenges/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const challenge = await db.query.exercises.findById(id);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.json(challenge);
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({ message: 'Failed to fetch challenge' });
  }
});

router.post('/execute', authenticate, [
  body('challengeId').isString(),
  body('language').isString(),
  body('code').isString(),
], validate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { challengeId, language, code } = req.body;

    const challenge = await db.query.exercises.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Simplified response for now
    res.json({
      submission: { status: 'PENDING' },
      results: [],
      passed: false,
      xpEarned: 0,
    });
  } catch (error) {
    console.error('Error executing code:', error);
    res.status(500).json({ message: 'Failed to execute code' });
  }
});

router.get('/submissions', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const submissions = await db.query.exerciseSubmissions.findMany({ userId: new mongoose.Types.ObjectId(userId) });
    res.json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Failed to fetch submissions' });
  }
});

router.get('/daily', authenticate, async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const daily = await db.query.dailyChallenges.findFirst({ date: today });
    
    if (!daily) {
      return res.status(404).json({ message: 'No daily challenge available' });
    }

    res.json({ challenge: daily, completed: false });
  } catch (error) {
    console.error('Error fetching daily challenge:', error);
    res.status(500).json({ message: 'Failed to fetch daily challenge' });
  }
});

router.get('/stats', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const submissions = await db.query.exerciseSubmissions.findMany({ userId: new mongoose.Types.ObjectId(userId) });
    
    const passed = submissions.filter(s => s.status === 'ACCEPTED').length;
    const total = submissions.length;
    
    res.json({
      totalSolved: passed,
      totalSubmissions: total,
      passedSubmissions: passed,
      languageBreakdown: [],
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

export default router;