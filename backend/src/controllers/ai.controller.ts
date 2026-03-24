import { Request, Response } from 'express';
import { aiService } from '../services/ai.service';
import { QuizService } from '../services/quiz.service';
import { consumeCredit } from '../middleware/credits';
import { runAgentCommand, generateQuizQuestions, isInProcess } from '../services/aiCoreBridge.service';

export const chat = async (req: Request, res: Response) => {
    try {
        const { message, context, persona = 'tutor' } = req.body;
        const user = req.user as any;

        // Enrich context with user data
        const enrichedContext = {
            ...context,
            userName: user.fullName,
            domain: user.domain,
            level: user.level
        };

        // Set headers for SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const stream = await aiService.chatAssistantStream(message, enrichedContext, persona);

        for await (const chunk of stream) {
            const chunkText = chunk.text();
            res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
        }

        res.write('data: [DONE]\n\n');
        res.end();

        // Consume credit after successful stream
        await consumeCredit(user.id).catch(err => console.error('Credit consumption failed:', err));
    } catch (error) {
        console.error('Streaming AI error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'AI Chat failed' });
        } else {
            res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
            res.end();
        }
    }
};

export const getDailyQuiz = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const quiz = await QuizService.getDailyQuiz(userId);
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate quiz' });
    }
};

export const submitQuiz = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const { quizId, answers } = req.body;
        const result = await QuizService.submitQuiz(userId, quizId, answers);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Quiz submission failed' });
    }
};

export const reviewProject = async (req: Request, res: Response) => {
    try {
        const { projectContent, domain, persona = 'technical' } = req.body;
        const user = req.user as any;

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const prompt = `Review this project in the ${domain} domain. Focus on technical depth, design choices, and industry-readiness. Content: ${projectContent}`;

        const stream = await aiService.chatAssistantStream(prompt, {
            userName: user.fullName,
            domain,
            level: user.level,
            path: '/project/review'
        }, persona as any);

        for await (const chunk of stream) {
            res.write(`data: ${JSON.stringify({ text: chunk.text() })}\n\n`);
        }

        res.write('data: [DONE]\n\n');
        res.end();

        // Consume credit
        await consumeCredit(user.id).catch(err => console.error('Credit consumption failed:', err));
    } catch (error) {
        console.error('Project review streaming error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Project review failed' });
        } else {
            res.end();
        }
    }
};

export const getRecommendations = async (req: Request, res: Response) => {
    try {
        const user = req.user as any;

        // In a real app, this would query the DB for user's skills and performance
        // For now, we'll use the AI to generate tailored recommendations
        const recommendationPrompt = `Based on my current domain: ${user.domain} and level: ${user.level}, what are 3 specific projects or courses I should tackle next to maximize my industry-readiness? Respond with a JSON array of strings.`;

        const responseText = await aiService.chatAssistant(recommendationPrompt, {
            userName: user.fullName,
            domain: user.domain,
            level: user.level
        });

        // Extract JSON from response
        const jsonMatch = responseText.match(/\[.*\]/s);
        const recommendations = jsonMatch ? JSON.parse(jsonMatch[0]) : ['Advanced Robotics', 'Operations Management', 'Cloud Architecture'];

        res.json({ recommendations });

        // Consume credit
        await consumeCredit(user.id).catch(err => console.error('Credit consumption failed:', err));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
};

export const getHackathonHelp = async (req: Request, res: Response) => {
    try {
        const { hackathonTheme, query } = req.body;
        const help = await aiService.chatAssistant(
            `I am participating in a hackathon with theme: ${hackathonTheme}. My question is: ${query}`,
            { hackathonTheme }
        );
        res.json({ help });

        // Consume credit
        const user = req.user as any;
        await consumeCredit(user.id).catch(err => console.error('Credit consumption failed:', err));
    } catch (error) {
        res.status(500).json({ error: 'Hackathon AI help failed' });
    }
};

// ── AI_core-backed endpoints (routes through AI_core/ai-services in-process) ─

/**
 * POST /api/ai/generate
 * General-purpose text generation powered by AI_core/ai-services.
 * Does NOT require auth (public endpoint) so it can be used by the frontend
 * directly. Authenticated variants with credit tracking use POST /api/ai/chat.
 *
 * Body: { prompt: string, topic?: string, max_tokens?: number }
 */
export const generate = async (req: Request, res: Response) => {
    try {
        const { prompt, topic, max_tokens } = req.body as {
            prompt?: string;
            topic?: string;
            max_tokens?: number;
        };

        const input = prompt || topic;
        if (!input || typeof input !== 'string' || !input.trim()) {
            return res.status(400).json({ success: false, error: 'prompt (or topic) is required' });
        }

        const response = await aiService.generate(input.trim());

        return res.json({
            success: true,
            response,
            provider: aiService.providerName,
            inProcess: isInProcess,
        });
    } catch (error) {
        console.error('[ai.controller] generate error:', error);
        return res.status(500).json({ success: false, error: 'AI generation failed' });
    }
};

/**
 * POST /api/ai/agent/run
 * Route a free-text command through the multi-agent orchestrator
 * (CTO / Dev / Product / Sales agents in AI_core/ai-services/system/).
 *
 * Body: { command: string, agent_type?: 'cto'|'dev'|'product'|'sales' }
 */
export const agentRun = async (req: Request, res: Response) => {
    try {
        const { command, agent_type } = req.body as { command?: string; agent_type?: string };
        if (!command || typeof command !== 'string' || !command.trim()) {
            return res.status(400).json({ success: false, error: 'command is required' });
        }

        const result = await runAgentCommand(command.trim(), agent_type);
        return res.json({ success: true, ...result });
    } catch (error) {
        console.error('[ai.controller] agentRun error:', error);
        return res.status(500).json({ success: false, error: 'Agent command failed' });
    }
};

/**
 * POST /api/ai/quiz/generate
 * Generate structured quiz questions using the AI_core quiz service.
 * Also used internally by the daily quiz cron (dailyQuiz.service.ts calls
 * the AI service directly, but this endpoint exposes the same capability
 * for on-demand quiz creation).
 *
 * Body: { topic: string, count?: number, difficulty?: string, context?: string }
 */
export const generateQuiz = async (req: Request, res: Response) => {
    try {
        const { topic, count, difficulty, context } = req.body as {
            topic?: string;
            count?: number;
            difficulty?: string;
            context?: string;
        };

        if (!topic || typeof topic !== 'string' || !topic.trim()) {
            return res.status(400).json({ success: false, error: 'topic is required' });
        }

        const result = await generateQuizQuestions({
            topic:      topic.trim(),
            count:      count      ?? 5,
            difficulty: difficulty ?? 'medium',
            context:    context    ?? '',
        });

        return res.json({ success: true, ...result });
    } catch (error) {
        console.error('[ai.controller] generateQuiz error:', error);
        return res.status(500).json({ success: false, error: 'Quiz generation failed' });
    }
};
