'use strict';
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config  = require('../config');
const logger  = require('../utils/logger');

let _client = null;

function getClient() {
  if (!config.gemini.apiKey) return null;
  if (!_client) {
    _client = new GoogleGenerativeAI(config.gemini.apiKey);
  }
  return _client;
}

/**
 * Send a plain text prompt to Gemini and return the text response.
 * @param {string} prompt
 * @param {object} [opts]
 * @param {number} [opts.maxTokens]
 * @param {number} [opts.temperature]
 * @returns {Promise<string>}
 */
async function generate(prompt, opts = {}) {
  const client = getClient();
  if (!client) {
    logger.warn('gemini.generate called but GEMINI_API_KEY is not set — returning stub');
    return `[AI stub] Response for: ${prompt.slice(0, 80)}`;
  }

  const model = client.getGenerativeModel({
    model: config.gemini.model,
    generationConfig: {
      temperature:     opts.temperature  ?? config.gemini.temperature,
      maxOutputTokens: opts.maxTokens    ?? config.gemini.maxTokens,
    },
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Send a prompt and parse the Gemini response as JSON.
 * Handles markdown code-block wrapping (```json ... ```) that Gemini often emits.
 * @param {string} prompt
 * @param {object} [opts]
 * @returns {Promise<object>}
 */
async function generateJSON(prompt, opts = {}) {
  const raw = await generate(prompt, opts);

  // Strip markdown code fences if present
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Try to extract the first {...} or [...] block
    const match = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (match) {
      try { return JSON.parse(match[1]); } catch { /* fall through */ }
    }
    logger.warn('gemini.generateJSON failed to parse response', { raw: raw.slice(0, 200) });
    throw new Error(`Gemini returned non-JSON response: ${raw.slice(0, 120)}`);
  }
}

module.exports = { generate, generateJSON };
