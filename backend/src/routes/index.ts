import { Router } from 'express';
import authRoutes from './auth.routes';
import avatarRoutes from './avatar';
import quizRoutes from './quiz.routes';
import hackathonRoutes from './hackathon.routes';
import jobRoutes from './job.routes';
import learningRoutes from './learning.routes';
import analyticsRoutes from './analytics.routes';
import aiRoutes from './ai.routes';
import paymentRoutes from './payment.routes';
import errorRoutes from './errors.routes';
// ── NEW CIVILIZATION MODULES ──────────────────────────────────────────────
import tutorialRoutes     from './tutorials';
import qnaRoutes          from './qna';
import repositoryRoutes   from './repositories';
import certificateRoutes  from './certificates';
import trackRoutes        from './tracks';
import organizationRoutes from './organizations';
import dailyQuizRoutes    from './dailyQuiz.routes';
import notebookRoutes     from './notebooks';
import gamificationRoutes from './gamification';
import exerciseRoutes     from './exercises';
import codeRoutes         from './code';
import leadsRoutes        from './leads';
import oauthRoutes        from './oauth';
import spacesRoutes       from './spaces.routes';
import mentorRoutes       from './mentor.routes';
import corporateRoutes    from './corporate.routes';
// ── API LAYERS ─────────────────────────────────────────────────────────────
import internalRoutes     from './internal.routes';
import serviceRoutes      from './service.routes';
import publicRoutes       from './public.routes';

const router = Router();

/*
 * ═══════════════════════════════════════════════════════════════════════════
 * API LAYER ARCHITECTURE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  LAYER 1: PUBLIC API (/api/*)                                       │
 * │  Frontend → Backend (JWT Auth)                                      │
 * │  - Login, Register, Profile fetch                                    │
 * │  - Live search (hackathons, jobs, candidates)                       │
 * │  - Student dashboard data                                            │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  LAYER 2: SERVICE API (/service/*)                                  │
 * │  Backend Services → Database (API Key Auth)                          │
 * │  - User insert, profile update                                       │
 * │  - Report queries, analytics                                         │
 * │  - Batch operations                                                  │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  LAYER 3: INTERNAL API (/internal/*)                               │
 * │  Backend ↔ Backend (API Key Auth)                                   │
 * │  - Payment webhooks (Stripe)                                         │
 * │  - Token verification between services                               │
 * │  - Cross-service queries, reports                                    │
 * └─────────────────────────────────────────────────────────────────────┘
 */

// ── PUBLIC API (Frontend-Facing) ─────────────────────────────────────────────
router.use('/auth', authRoutes);
router.use('/auth/oauth', oauthRoutes);
router.use('/avatar', avatarRoutes);
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
router.use('/notebooks',     notebookRoutes);      // Study Notebooks (NotebookLM)
router.use('/gamification',  gamificationRoutes); // Achievements + Leaderboard
router.use('/exercises',     exerciseRoutes);     // Practice Challenge Hub
router.use('/code',          codeRoutes);         // Sandboxed Code Execution (Judge0)
router.use('/leads',         leadsRoutes);        // Newsletter / Lead Capture
router.use('/spaces',        spacesRoutes);        // Coding Challenges / Quiz Arena
router.use('/mentor',        mentorRoutes);        // Mentor Dashboard
router.use('/corporate',     corporateRoutes);    // Corporate Hiring Dashboard

// ── PUBLIC API (Search & Profile) ────────────────────────────────────────────
router.use('/public', publicRoutes);               // Live search, profile, candidate search

// ── SERVICE API (Backend Services → Database) ────────────────────────────────
router.use('/service', serviceRoutes);            // User CRUD, profiles, reports

// ── INTERNAL API (Backend ↔ Backend) ────────────────────────────────────────
router.use('/internal', internalRoutes);          // Webhooks, token verification, cross-service

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    layers: {
      public: '/api/*',
      service: '/service/*',
      internal: '/internal/*',
    },
  });
});

export default router;
