'use strict';
const catchAsync  = require('../middleware/asyncWrapper');
const modelModule = require('../model/index');

// ── POST /api/model/predict ───────────────────────────────────────────────────
const predict = catchAsync(async (req, res) => {
  const { prompt, input } = req.body;
  const text = prompt || input;
  if (!text) return res.status(400).json({ success: false, error: 'prompt or input is required' });

  const result = await modelModule.predict(text);
  res.json({ success: true, ...result });
});

// ── GET /api/model/info ───────────────────────────────────────────────────────
const info = catchAsync(async (req, res) => {
  res.json({ success: true, model: modelModule.getModelInfo() });
});

module.exports = { predict, info };
