import { Request, Response, NextFunction } from 'express';
import { QuizService } from '@/services/quiz';
import { db } from '@/db';
import { learningBehaviorEvents } from '@/db/schema-v2';
import { and, desc, eq } from 'drizzle-orm';
import logger from '@/utils/logger';
import { fetchAdaptiveGuidanceFromAI, fallbackQuizGuidance } from '@/services/adaptiveGuidance';

const quizService = new QuizService();

export class QuizController {
  async getQuizzes(req: Request, res: Response, next: NextFunction) {
    try {
      const { quizType, domain, difficulty, page = 1, limit = 10 } = req.query;

      const filters = {
        quizType,
        domain,
        difficulty,
      };

      const result = await quizService.getQuizzes(
        filters,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getQuizById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const quiz = await quizService.getQuizById(parseInt(id), userId);

      res.json({
        success: true,
        data: quiz,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDailyQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const { domain } = req.query;

      const quiz = await quizService.getDailyQuiz(domain as string);

      res.json({
        success: true,
        data: quiz,
      });
    } catch (error) {
      next(error);
    }
  }

  async submitQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { answers } = req.body;

      const result = await quizService.submitQuizAttempt(
        userId,
        parseInt(id),
        answers
      );

      res.json({
        success: true,
        message: 'Quiz submitted successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserAttempts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { page = 1, limit = 10 } = req.query;

      const result = await quizService.getUserAttempts(
        userId,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const type = (req.params.type as string) || (req.query.type as string) || 'all_time';
      const { limit = 10 } = req.query;

      const leaderboard = await quizService.getLeaderboard(
        type,
        parseInt(limit as string)
      );

      res.json({
        success: true,
        data: leaderboard,
      });
    } catch (error) {
      next(error);
    }
  }

  async generateAIQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { topic, difficulty, numQuestions = 10 } = req.body;

      const quiz = await quizService.generateAIQuiz(
        topic,
        difficulty,
        parseInt(numQuestions),
        userId
      );

      res.json({
        success: true,
        message: 'AI Quiz generated successfully',
        data: quiz,
      });
    } catch (error) {
      next(error);
    }
  }

  async createBehaviorEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = parseInt(req.params.id, 10);
      const userId = req.user!.id;
      const { eventType, eventPayload } = req.body || {};

      if (!Number.isInteger(quizId) || quizId <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid quiz id' });
      }
      if (!eventType || typeof eventType !== 'string') {
        return res.status(400).json({ success: false, message: 'eventType is required' });
      }

      await db.insert(learningBehaviorEvents).values({
        userId,
        moduleType: 'quiz',
        targetId: quizId,
        eventType: eventType.trim().slice(0, 100),
        eventPayload: eventPayload && typeof eventPayload === 'object' ? eventPayload : {},
      });

      res.status(201).json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async getAdaptiveGuidance(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = parseInt(req.params.id, 10);
      const userId = req.user!.id;
      if (!Number.isInteger(quizId) || quizId <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid quiz id' });
      }

      const [quiz, attemptsResult, recentEvents] = await Promise.all([
        quizService.getQuizById(quizId, userId),
        quizService.getUserAttempts(userId, 1, 20),
        db.select({ eventType: learningBehaviorEvents.eventType, eventPayload: learningBehaviorEvents.eventPayload, createdAt: learningBehaviorEvents.createdAt })
          .from(learningBehaviorEvents)
          .where(and(
            eq(learningBehaviorEvents.userId, userId),
            eq(learningBehaviorEvents.moduleType, 'quiz'),
            eq(learningBehaviorEvents.targetId, quizId),
          ))
          .orderBy(desc(learningBehaviorEvents.createdAt))
          .limit(80),
      ]);

      const attempts = Array.isArray(attemptsResult?.data) ? attemptsResult.data : (Array.isArray(attemptsResult) ? attemptsResult : []);
      const relevantAttempts = attempts.filter((attempt: any) => Number(attempt.quiz_id || attempt.quizId) === quizId);
      const attemptCount = relevantAttempts.length;
      const averageScore = attemptCount
        ? relevantAttempts.reduce((acc: number, item: any) => acc + Number(item.percentage || 0), 0) / attemptCount
        : 0;
      const latestScore = attemptCount ? Number(relevantAttempts[0]?.percentage || 0) : 0;
      const errorEvents = recentEvents.filter((event) => event.eventType.toLowerCase().includes('error')).length;

      const snapshot = {
        attemptCount,
        averageScore: Math.round(averageScore * 10) / 10,
        latestScore,
        errorEvents,
      };

      const fallbackGuidance = fallbackQuizGuidance(snapshot);

      try {
        const data = await fetchAdaptiveGuidanceFromAI('quiz', String(req.requestId || 'unknown'), {
          target_id: quizId,
          target_title: quiz?.title || `Quiz ${quizId}`,
          metrics: snapshot,
          events: recentEvents.map((event) => ({
            event_type: event.eventType,
            event_payload: event.eventPayload,
            created_at: event.createdAt,
          })),
        });

        return res.json({
          success: true,
          guidance: Array.isArray(data?.guidance) && data.guidance.length > 0 ? data.guidance : fallbackGuidance,
          behaviorSummary: data?.behavior_summary || snapshot,
          generatedAt: data?.generated_at || new Date().toISOString(),
        });
      } catch (upstreamErr) {
        logger.warn('quiz adaptive guidance upstream fallback', upstreamErr);
        return res.json({
          success: true,
          guidance: fallbackGuidance,
          behaviorSummary: snapshot,
          generatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      next(error);
    }
  }
}
