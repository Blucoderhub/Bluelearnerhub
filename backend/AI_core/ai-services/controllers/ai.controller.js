'use strict';
const catchAsync   = require('../middleware/asyncWrapper');
const gemini       = require('../services/gemini.service');
const quizService  = require('../services/quiz.service');
const logger       = require('../utils/logger');

// ── POST /api/ai/generate ─────────────────────────────────────────────────────
// General text generation.
const generate = catchAsync(async (req, res) => {
  const { prompt, topic, max_tokens } = req.body;
  const input = prompt || topic;
  if (!input) return res.status(400).json({ success: false, error: 'prompt or topic is required' });

  const response = await gemini.generate(input, { maxTokens: max_tokens });
  res.json({ success: true, response });
});

// ── POST /api/ai/chat  (also /api/v1/chat) ────────────────────────────────────
const chat = catchAsync(async (req, res) => {
  const { prompt, message, max_new_tokens } = req.body;
  const input = prompt || message;
  if (!input) return res.status(400).json({ success: false, error: 'prompt or message is required' });

  const response = await gemini.generate(input, { maxTokens: max_new_tokens });
  res.json({ success: true, response });
});

// ── POST /api/ai/quiz/generate  (also /api/v1/ai/quiz/generate + /api/v1/quiz/generate)
// This is the endpoint called by backend/src/services/dailyQuiz.service.ts
const generateQuiz = catchAsync(async (req, res) => {
  const { topic, count, num_questions, difficulty, context } = req.body;
  if (!topic) return res.status(400).json({ success: false, error: 'topic is required' });

  const result = await quizService.generateQuiz({
    topic,
    count:      count || num_questions || 5,
    difficulty: difficulty || 'medium',
    context:    context || '',
  });

  logger.info('quiz.generated', { topic, count: result.questions.length });
  res.json({ success: true, ...result });
});

// ── POST /api/ai/review ───────────────────────────────────────────────────────
const reviewCode = catchAsync(async (req, res) => {
  const { code, language } = req.body;
  if (!code) return res.status(400).json({ success: false, error: 'code is required' });

  const prompt = `You are an expert code reviewer.

Review the following ${language || 'code'} and provide:
1. A brief summary of what the code does
2. Issues found (bugs, security risks, performance)
3. Specific improvement suggestions with examples

Code:
\`\`\`${language || ''}
${code}
\`\`\`

Respond in plain text, not JSON.`;

  const review = await gemini.generate(prompt, { temperature: 0.3 });
  res.json({ success: true, review });
});

// ── POST /api/ai/learning-path ────────────────────────────────────────────────
const generateLearningPath = catchAsync(async (req, res) => {
  const { goal, current_skills } = req.body;
  if (!goal) return res.status(400).json({ success: false, error: 'goal is required' });

  const skills = Array.isArray(current_skills) ? current_skills.join(', ') : (current_skills || 'beginner');
  const prompt = `You are an expert learning path designer.

Create a structured learning path for someone who wants to: "${goal}"
Current skills: ${skills}

Respond with a JSON object:
{
  "title": "...",
  "estimatedWeeks": 12,
  "phases": [
    {
      "phase": 1,
      "title": "...",
      "weeks": 2,
      "topics": ["topic1", "topic2"],
      "resources": ["resource1"],
      "milestone": "..."
    }
  ]
}`;

  const path = await gemini.generateJSON(prompt, { temperature: 0.5 });
  res.json({ success: true, path });
});

module.exports = { generate, chat, generateQuiz, reviewCode, generateLearningPath };
