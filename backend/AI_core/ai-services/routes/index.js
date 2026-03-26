'use strict';
const { Router }  = require('express');
const aiRoutes    = require('./ai.routes');
const agentRoutes = require('./agent.routes');
const modelRoutes = require('./model.routes');
const aiCtrl      = require('../controllers/ai.controller');

const router = Router();

// ── Unified routes ────────────────────────────────────────────────────────────
router.use('/ai',    aiRoutes);
router.use('/agent', agentRoutes);
router.use('/model', modelRoutes);

// ── Backward-compatibility aliases (called by backend services) ───────────────
//
// backend/src/services/dailyQuiz.service.ts calls:
//   POST ${AI_SERVICE_URL}/api/v1/ai/quiz/generate
//
// backend/src/services/ai.service.ts (LocalLLMProvider) calls:
//   POST ${AI_SERVICE_URL}/api/v1/ai/quiz/generate
//   POST ${AI_SERVICE_URL}/api/v1/chat
//   POST ${AI_SERVICE_URL}/api/v1/quiz/generate

router.post('/v1/ai/quiz/generate', aiCtrl.generateQuiz);
router.post('/v1/quiz/generate',    aiCtrl.generateQuiz);
router.post('/v1/chat',             aiCtrl.chat);
router.post('/v1/ai/generate',      aiCtrl.generate);

module.exports = router;
