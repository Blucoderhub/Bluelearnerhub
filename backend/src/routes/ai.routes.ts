import { Router } from 'express';
import * as aiController from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';
import { checkCredits } from '../middleware/credits';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

// ── Existing authenticated routes (unchanged) ─────────────────────────────────
router.post('/chat',           authenticate, checkCredits, aiController.chat);
router.get('/quiz',            authenticate, checkCredits, aiController.getDailyQuiz);
router.post('/quiz/submit',    authenticate,               aiController.submitQuiz);
router.post('/review',         authenticate, checkCredits, aiController.reviewProject);
router.get('/recommend',       authenticate, checkCredits, aiController.getRecommendations);
router.post('/hackathon-help', authenticate, checkCredits, aiController.getHackathonHelp);

// ── AI_core-backed routes ─────────────────────────────────────────────────────
// POST /api/ai/generate  — general-purpose text generation (public, rate-limited)
router.post('/generate',       apiLimiter,                 aiController.generate);

// POST /api/ai/quiz/generate — on-demand structured quiz creation (auth required)
router.post('/quiz/generate',  authenticate,               aiController.generateQuiz);

// POST /api/ai/agent/run — multi-agent orchestrator (auth required)
router.post('/agent/run',      authenticate,               aiController.agentRun);

export default router;
