import { Request, Response } from 'express';
import { aiService } from '../services/ai.service';
import { QuizService } from '../services/quiz.service';
import { consumeCredit } from '../middleware/credits';

export const chat = async (req: Request, res: Response) => {
    try {
        const { message, context, persona = 'tutor' } = req.body;
        const user = req.user;

        // Enrich context with user data
        const enrichedContext = {
            ...context,
            userName: user.full_name,
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
        const user = req.user;

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const prompt = `Review this project in the ${domain} domain. Focus on technical depth, design choices, and industry-readiness. Content: ${projectContent}`;

        const stream = await aiService.chatAssistantStream(prompt, {
            userName: user.full_name,
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
        const user = req.user;

        // In a real app, this would query the DB for user's skills and performance
        // For now, we'll use the AI to generate tailored recommendations
        const recommendationPrompt = `Based on my current domain: ${user.domain} and level: ${user.level}, what are 3 specific projects or courses I should tackle next to maximize my industry-readiness? Respond with a JSON array of strings.`;

        const responseText = await aiService.chatAssistant(recommendationPrompt, {
            userName: user.full_name,
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
        const user = req.user;
        await consumeCredit(user.id).catch(err => console.error('Credit consumption failed:', err));
    } catch (error) {
        res.status(500).json({ error: 'Hackathon AI help failed' });
    }
};
