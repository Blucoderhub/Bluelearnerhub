'use strict';
require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT || '8001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',

  cors: {
    origins: (
      process.env.CORS_ORIGINS ||
      `${process.env.FRONTEND_URL || 'http://localhost:3000'},${process.env.BACKEND_URL || 'http://localhost:5000'}`
    )
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
  },

  gemini: {
    apiKey:      process.env.GEMINI_API_KEY || '',
    model:       process.env.GEMINI_MODEL       || 'gemini-1.5-flash',
    temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.7'),
    maxTokens:   parseInt(process.env.GEMINI_MAX_TOKENS    || '2048', 10),
  },

  ollama: {
    url:   process.env.OLLAMA_URL      || 'http://localhost:11434',
    model: process.env.LOCAL_LLM_MODEL || 'llama3',
  },
};

// ── Startup validation ────────────────────────────────────────────────────────
if (config.isProd && !config.gemini.apiKey) {
  console.error('[config] FATAL: GEMINI_API_KEY is required in production.');
  process.exit(1);
}
if (!config.gemini.apiKey) {
  console.warn('[config] WARNING: GEMINI_API_KEY is not set — AI features will return stub responses.');
}

module.exports = config;
