'use strict';
// Ported from ai_model/ (airllm_model.py + model_loader.py)
// Local LLM loading is optional. When no local model is available, the
// module falls back to Gemini for predictions.
const path   = require('path');
const fs     = require('fs');
const gemini = require('../services/gemini.service');
const logger = require('../utils/logger');

let _modelMeta = null;

/**
 * Attempt to load model metadata from the local models directory.
 * Actual inference is handled via Gemini or Ollama — no heavy ML runtime here.
 */
function loadModel(modelPath) {
  const resolvedPath = modelPath || process.env.AIRLLM_MODEL_PATH;
  if (resolvedPath && fs.existsSync(resolvedPath)) {
    logger.info('model.load: found local model', { path: resolvedPath });
    _modelMeta = { path: resolvedPath, loaded: true, type: 'local' };
    return _modelMeta;
  }
  logger.info('model.load: no local model found, using cloud provider');
  _modelMeta = { path: null, loaded: false, type: 'cloud' };
  return _modelMeta;
}

/**
 * Generate a prediction / completion for the given prompt.
 * @param {string} prompt
 * @param {object} [opts]
 * @returns {Promise<{prediction: string, model: string, source: string}>}
 */
async function predict(prompt, opts = {}) {
  if (!_modelMeta) loadModel();

  logger.info('model.predict', { source: _modelMeta.type, prompt: prompt.slice(0, 60) });

  // If we have a local Ollama instance configured, try it first
  const ollamaUrl = process.env.OLLAMA_URL;
  if (ollamaUrl && _modelMeta.type === 'local') {
    try {
      const axios = require('axios');
      const model = process.env.LOCAL_LLM_MODEL || 'llama3';
      const res = await axios.post(`${ollamaUrl}/api/generate`, {
        model,
        prompt,
        stream: false,
      }, { timeout: 30_000 });
      return { prediction: res.data.response, model, source: 'ollama' };
    } catch (err) {
      logger.warn('Ollama unavailable, falling back to Gemini', { error: err.message });
    }
  }

  // Cloud fallback — Gemini
  const prediction = await gemini.generate(prompt, opts);
  return { prediction, model: process.env.GEMINI_MODEL || 'gemini-1.5-flash', source: 'gemini' };
}

function getModelInfo() {
  if (!_modelMeta) loadModel();
  return {
    type:        _modelMeta.type,
    loaded:      _modelMeta.loaded,
    path:        _modelMeta.path,
    cloudModel:  process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    ollamaModel: process.env.LOCAL_LLM_MODEL || null,
  };
}

// Initialise on module load
loadModel();

module.exports = { loadModel, predict, getModelInfo };
