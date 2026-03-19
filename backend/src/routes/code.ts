/**
 * Code Execution Routes
 * =====================
 * POST /api/code/execute   — run arbitrary code via Judge0
 * GET  /api/code/languages — list supported languages
 */

import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { executeCode, LANGUAGE_IDS } from '../services/judge0.service';
import { GamificationService } from '../services/gamification.service';
import logger from '../utils/logger';

const router = Router();

// GET /api/code/languages
router.get('/languages', (_req, res) => {
  res.json({ success: true, data: Object.keys(LANGUAGE_IDS) });
});

// POST /api/code/execute — authenticated, rate limited at API layer
router.post('/execute', authenticate, async (req, res) => {
  try {
    const { code, language, stdin } = req.body as {
      code: string;
      language: string;
      stdin?: string;
    };

    if (!code?.trim()) {
      return res.status(400).json({ success: false, message: 'code is required' });
    }
    if (!language?.trim()) {
      return res.status(400).json({ success: false, message: 'language is required' });
    }
    // Enforce a 10 KB code size limit
    if (code.length > 10_000) {
      return res.status(400).json({ success: false, message: 'Code exceeds 10 KB limit' });
    }

    const result = await executeCode(code, language, stdin);

    // Award small XP for running code (encourages practice)
    if (result.success) {
      GamificationService.awardXP(req.user!.id, 5, 'code_execution').catch(() => {});
    }

    res.json({ success: true, data: result });
  } catch (err) {
    logger.error('code execute error', err);
    res.status(500).json({ success: false, message: 'Code execution failed' });
  }
});

export default router;
