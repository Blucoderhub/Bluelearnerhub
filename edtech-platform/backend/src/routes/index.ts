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

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
