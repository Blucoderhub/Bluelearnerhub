import { Router } from 'express';
import authRoutes from './auth';
import quizRoutes from './quiz';
import hackathonRoutes from './hackathon';
import jobRoutes from './job';
import learningRoutes from './learning';
import analyticsRoutes from './analytics';
import aiRoutes from './ai.routes';
import paymentRoutes from './payment.routes';
import errorRoutes from './errors';
// ── NEW CIVILIZATION MODULES ──────────────────────────────────────────────
import tutorialRoutes     from './tutorials';
import qnaRoutes          from './qna';
import repositoryRoutes   from './repositories';
import certificateRoutes  from './certificates';
import trackRoutes        from './tracks';
import organizationRoutes from './organizations';
import dailyQuizRoutes    from './dailyQuiz';
import notebookRoutes     from './notebooks';

const router = Router();

router.use('/auth', authRoutes);
router.use('/quiz', quizRoutes);
router.use('/hackathons', hackathonRoutes);
router.use('/jobs', jobRoutes);
router.use('/learning', learningRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/ai', aiRoutes);
router.use('/payments', paymentRoutes);
router.use('/errors', errorRoutes);
// ── NEW CIVILIZATION MODULES ──────────────────────────────────────────────
router.use('/tutorials',     tutorialRoutes);     // Interactive Tutorial Engine
router.use('/qna',           qnaRoutes);          // Q&A Knowledge Network
router.use('/repositories',  repositoryRoutes);   // Developer Portal
router.use('/certificates',  certificateRoutes);  // Verifiable Credentials
router.use('/tracks',        trackRoutes);        // Learning Tracks
router.use('/organizations', organizationRoutes); // Corporate & University
router.use('/daily-quiz',    dailyQuizRoutes);    // AI Daily Quiz
router.use('/notebooks',     notebookRoutes);     // Study Notebooks (NotebookLM)

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
