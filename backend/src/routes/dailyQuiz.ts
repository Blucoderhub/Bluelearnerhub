import { Router } from 'express';
import { getDailyQuiz, getAvailableDomains } from '../services/dailyQuiz.service';
import { authenticate } from '../middleware/auth';
import { GamificationService } from '../services/gamification.service';
import logger from '../utils/logger';

const router = Router();

// GET /api/daily-quiz/domains — list available domains
router.get('/domains', (_req, res) => {
  res.json({ success: true, data: getAvailableDomains() });
});

// POST /api/daily-quiz/submit — persist XP earned from quiz completion
router.post('/submit', authenticate, async (req, res) => {
  try {
    const { xpEarned } = req.body as { domain: string; score: number; xpEarned: number };
    const userId = req.user!.id;
    const xp = Math.max(0, Math.min(Number(xpEarned) || 0, 500)); // cap at 500
    if (xp > 0) {
      await GamificationService.awardXP(userId, xp, 'daily_quiz');
      await GamificationService.updateStreak(userId);
    }
    res.json({ success: true, data: { xpAwarded: xp } });
  } catch (err) {
    logger.error('daily-quiz submit error', err);
    res.status(500).json({ success: false, message: 'Failed to record quiz result' });
  }
});

// GET /api/daily-quiz/:domain — today's quiz for a domain
router.get('/:domain', async (req, res) => {
  try {
    const domain = decodeURIComponent(req.params.domain);
    const quiz   = await getDailyQuiz(domain);
    res.json({ success: true, data: quiz });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load daily quiz' });
  }
});

export default router;
