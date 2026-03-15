import { Router } from 'express';
import { getMyAchievements, getLeaderboard } from '@/controllers/gamification.controller';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.get('/achievements', authenticate, getMyAchievements);
router.get('/leaderboard',  getLeaderboard);

export default router;
