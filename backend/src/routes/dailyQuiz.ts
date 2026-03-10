import { Router } from 'express';
import { getDailyQuiz, getAvailableDomains } from '../services/dailyQuiz.service';

const router = Router();

// GET /api/daily-quiz/domains — list available domains
router.get('/domains', (_req, res) => {
  res.json({ success: true, data: getAvailableDomains() });
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
