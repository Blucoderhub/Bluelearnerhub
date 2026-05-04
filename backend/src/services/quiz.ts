import { QuizModel, QuizAttemptModel } from '../models/quiz';
import { AppError } from '../middleware/error';
import axios from 'axios';
import { config } from '../config';
import logger from '../utils/logger';

export class QuizService {
  async getQuizzes(filters: any, page: number, limit: number) {
    return await QuizModel.findAll(filters, page, limit);
  }

  async getQuizById(id: number, userId?: number) {
    const quiz = await QuizModel.findById(id, true);
    if (!quiz) {
      throw new AppError('Quiz not found', 404);
    }

    if (userId) {
      // could add user-specific info (attempted etc.)
    }

    return quiz;
  }

  async getDailyQuiz(domainOrUserId?: string) {
    return await QuizModel.getDailyQuiz(domainOrUserId);
  }

  async submitQuizAttempt(userId: number, quizId: number, answers: any) {
    // logic: calculate score, insert attempt via model
    // simplistic implementation, scoring per question
    const quiz = await QuizModel.findById(quizId, true);
    if (!quiz) {
      throw new AppError('Quiz not found', 404);
    }

    // Here we would iterate questions, compute result
    const questions = quiz.questions || [];
    let correct = 0;
    let points = 0;
    questions.forEach((q: any) => {
      const ans = answers[q.id];
      if (ans !== undefined) {
        if (ans === q.correct_answer) {
          correct++;
          points += q.points;
        }
      }
    });

    const total = questions.length;
    const percentage = total > 0 ? (correct / total) * 100 : 0;

    const attempt = await QuizAttemptModel.create({
      user_id: userId,
      quiz_id: quizId,
      score: points,
      percentage,
      total_questions: total,
      correct_answers: correct,
      incorrect_answers: total - correct,
      user_answers: answers,
      points_earned: points,
    });

    return attempt;
  }

  async getUserAttempts(userId: number, page: number, limit: number) {
    return await QuizAttemptModel.findByUser(userId, page, limit);
  }

  async getLeaderboard(type: string, limit: number) {
    return await QuizAttemptModel.getLeaderboard(type as any, limit);
  }

  async generateAIQuiz(topic: string, difficulty: string, numQuestions: number, userId: number) {
    try {
      const response = await axios.post(
        `${config.aiServiceUrl}/api/v1/quiz/generate`,
        { topic, difficulty, numQuestions, userId }
      );
      return response.data;
    } catch (err) {
      logger.error('AI quiz generation failed', err);
      throw new AppError('Failed to generate AI quiz', 500);
    }
  }
}

export const quizService = new QuizService();
