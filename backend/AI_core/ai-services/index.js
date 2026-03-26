'use strict';

// Load env vars FIRST before any other module reads process.env
require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const morgan       = require('morgan');
const config       = require('./config');
const routes       = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const logger       = require('./utils/logger');

const app = express();

// ── Security & proxy ──────────────────────────────────────────────────────────
app.set('trust proxy', 1); // Required behind Render / Railway load balancers

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (Render health checks, server-to-server)
    if (!origin) return cb(null, true);
    if (config.cors.origins.includes(origin) || config.cors.origins.includes('*')) {
      return cb(null, true);
    }
    logger.warn('CORS blocked', { origin });
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ── HTTP request logging ──────────────────────────────────────────────────────
app.use(morgan(config.isProd ? 'combined' : 'dev'));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    service: 'BlueLearnerHub AI Services',
    version: '2.0.0',
    status:  'ok',
    uptime:  Math.floor(process.uptime()),
    env:     config.nodeEnv,
  });
});

app.get('/health', (_req, res) => {
  res.json({
    status:  'ok',
    uptime:  Math.floor(process.uptime()),
    memory:  process.memoryUsage(),
    gemini:  !!config.gemini.apiKey,
  });
});

// ── API routes ────────────────────────────────────────────────────────────────
// Mounted at /api — exposes:
//   /api/ai/*     → general AI (generate, chat, quiz, review, learning-path)
//   /api/agent/*  → multi-agent orchestrator (run, ask)
//   /api/model/*  → model info and predict
//   /api/v1/*     → backward-compatibility aliases (backend uses these)
app.use('/api', routes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = config.port;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`AI Services running`, { port: PORT, env: config.nodeEnv });
  logger.info('Routes mounted', {
    ai:    '/api/ai/{generate,chat,quiz/generate,review,learning-path}',
    agent: '/api/agent/{run,ask}',
    model: '/api/model/{predict,info}',
    compat: '/api/v1/ai/quiz/generate  /api/v1/chat  /api/v1/quiz/generate',
  });
});

module.exports = app; // for testing
