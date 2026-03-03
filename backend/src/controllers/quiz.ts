import { Request, Response, NextFunction } from 'express';
import { QuizService } from '@/services/quiz';

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
}
