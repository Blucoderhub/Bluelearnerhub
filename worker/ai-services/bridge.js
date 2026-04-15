const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.LOCAL_LLM_MODEL || 'mistral';

// Security: API key for bridge authentication
// In production, set BRIDGE_API_KEY in environment
const BRIDGE_API_KEY = process.env.BRIDGE_API_KEY;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5000').split(',');

app.use(express.json());

// CORS configuration
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Bridge-Key');
    }
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    next();
});

// Bridge authentication middleware
const authenticateBridge = (req, res, next) => {
    // If no API key configured, reject all requests (fail-secure)
    if (!BRIDGE_API_KEY) {
        console.warn('⚠️  BRIDGE_API_KEY not configured - rejecting all requests');
        return res.status(503).json({ error: 'Bridge authentication not configured' });
    }
    
    const providedKey = req.headers['x-bridge-key'] || req.headers['authorization']?.replace('Bearer ', '');
    
    if (!providedKey) {
        return res.status(401).json({ error: 'Missing bridge authentication key' });
    }
    
    if (providedKey !== BRIDGE_API_KEY) {
        console.warn('⚠️  Invalid bridge key attempted:', req.ip);
        return res.status(403).json({ error: 'Invalid bridge authentication key' });
    }
    
    next();
};

// Apply authentication to all API routes (not /health)
app.post(['/v1/chat/completions', '/chat/completions', '/api/chat'], authenticateBridge, async (req, res) => {
    try {
        const { messages, model, stream, prompt } = req.body;
        
        // Support both chat/completions (messages) and legacy prompt formats
        const ollamaPayload = {
            model: model || DEFAULT_MODEL,
            stream: stream || false
        };

        if (messages) {
            ollamaPayload.messages = messages;
            const response = await axios.post(`${OLLAMA_URL}/api/chat`, ollamaPayload);
            
            // Map Ollama response to OpenAI-like format for backend compatibility
            return res.json({
                id: `chatcmpl-${Date.now()}`,
                object: 'chat.completion',
                created: Math.floor(Date.now() / 1000),
                model: ollamaPayload.model,
                choices: [{
                    index: 0,
                    message: response.data.message,
                    finish_reason: 'stop'
                }],
                usage: {
                    prompt_tokens: 0,
                    completion_tokens: 0,
                    total_tokens: 0
                }
            });
        } else if (prompt) {
            ollamaPayload.prompt = prompt;
            const response = await axios.post(`${OLLAMA_URL}/api/generate`, ollamaPayload);
            return res.json({
                response: response.data.response,
                model: response.data.model,
                done: response.data.done
            });
        }

        res.status(400).json({ error: 'Missing messages or prompt in request body' });
    } catch (error) {
        console.error('Ollama Bridge Error:', error.message);
        res.status(500).json({ error: 'Failed to communicate with Ollama service' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', bridge: 'Ollama-Node-Bridge', ollama_url: OLLAMA_URL });
});

app.listen(PORT, () => {
    console.log(`🚀 AI Bridge (Ollama) running on port ${PORT}`);
});
