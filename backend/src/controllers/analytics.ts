import { Request, Response, NextFunction } from 'express';
import { pool } from '../utils/database';

export class AnalyticsController {
  async getUserStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const [profileResult, learningResult, quizResult, hackathonResult] = await Promise.all([
        pool.query(
          'SELECT id, level, total_points, current_streak, longest_streak FROM users WHERE id = $1',
          [userId]
        ),
        pool.query(
          `SELECT
             COUNT(*)::int AS enrolled_paths,
             COALESCE(SUM(CASE WHEN completed_at IS NOT NULL THEN 1 ELSE 0 END), 0)::int AS completed_paths
           FROM learning_path_enrollments
           WHERE user_id = $1`,
          [userId]
        ),
        pool.query(
          `SELECT
             COUNT(*)::int AS total_attempts,
             COALESCE(AVG(percentage), 0)::float AS average_score,
             COALESCE(MAX(percentage), 0)::float AS best_score
           FROM quiz_attempts
           WHERE user_id = $1`,
          [userId]
        ),
        pool.query(
          `SELECT COUNT(*)::int AS hackathons_registered
           FROM hackathon_registrations
           WHERE user_id = $1`,
          [userId]
        ),
      ]);

      const profile = profileResult.rows[0] || {
        level: 1,
        total_points: 0,
        current_streak: 0,
        longest_streak: 0,
      };

      res.json({
        success: true,
        data: {
          level: profile.level,
          totalPoints: profile.total_points,
          currentStreak: profile.current_streak,
          longestStreak: profile.longest_streak,
          enrolledPaths: learningResult.rows[0].enrolled_paths,
          completedPaths: learningResult.rows[0].completed_paths,
          totalQuizAttempts: quizResult.rows[0].total_attempts,
          averageQuizScore: quizResult.rows[0].average_score,
          bestQuizScore: quizResult.rows[0].best_score,
          hackathonsRegistered: hackathonResult.rows[0].hackathons_registered,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const [pathProgressResult, recentLessonsResult, recentQuizAttemptsResult] = await Promise.all([
        pool.query(
          `SELECT
             lpe.learning_path_id,
             lp.title,
             lpe.progress_percentage,
             lpe.enrolled_at,
             lpe.last_accessed_at,
             lpe.completed_at
           FROM learning_path_enrollments lpe
           JOIN learning_paths lp ON lpe.learning_path_id = lp.id
           WHERE lpe.user_id = $1
           ORDER BY COALESCE(lpe.last_accessed_at, lpe.enrolled_at) DESC`,
          [userId]
        ),
        pool.query(
          `SELECT
             lp.lesson_id,
             l.title AS lesson_title,
             c.title AS course_title,
             lp.completed,
             lp.time_spent,
             lp.last_position,
             lp.updated_at
           FROM lesson_progress lp
           JOIN lessons l ON lp.lesson_id = l.id
           JOIN courses c ON l.course_id = c.id
           WHERE lp.user_id = $1
           ORDER BY lp.updated_at DESC
           LIMIT 10`,
          [userId]
        ),
        pool.query(
          `SELECT
             qa.id,
             qa.quiz_id,
             q.title,
             q.domain,
             qa.percentage,
             qa.correct_answers,
             qa.total_questions,
             qa.completed_at,
             qa.created_at
           FROM quiz_attempts qa
           JOIN quizzes q ON qa.quiz_id = q.id
           WHERE qa.user_id = $1
           ORDER BY COALESCE(qa.completed_at, qa.created_at) DESC
           LIMIT 10`,
          [userId]
        ),
      ]);

      res.json({
        success: true,
        data: {
          learningPaths: pathProgressResult.rows,
          recentLessons: recentLessonsResult.rows,
          recentQuizAttempts: recentQuizAttemptsResult.rows,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getStrengthsWeaknesses(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const [strengthsResult, weaknessesResult] = await Promise.all([
        pool.query(
          `SELECT skill_name, proficiency_level, verification_score
           FROM user_skills
           WHERE user_id = $1
           AND proficiency_level >= 4
           ORDER BY proficiency_level DESC, COALESCE(verification_score, 0) DESC, skill_name ASC
           LIMIT 10`,
          [userId]
        ),
        pool.query(
          `SELECT skill_name, proficiency_level, verification_score
           FROM user_skills
           WHERE user_id = $1
           AND proficiency_level <= 2
           ORDER BY proficiency_level ASC, COALESCE(verification_score, 0) ASC, skill_name ASC
           LIMIT 10`,
          [userId]
        ),
      ]);

      res.json({
        success: true,
        data: {
          strengths: strengthsResult.rows,
          weaknesses: weaknessesResult.rows,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getPlatformAnalytics(_req: Request, res: Response, next: NextFunction) {
    try {
      const [usersResult, roleDistributionResult, quizResult, learningResult, hackathonResult, xpResult] = await Promise.all([
        pool.query(
          `SELECT
             COUNT(*)::int AS total_users,
             COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::int AS new_users_last_30_days
           FROM users`
        ),
        pool.query(
          `SELECT role, COUNT(*)::int AS count
           FROM users
           GROUP BY role
           ORDER BY count DESC`
        ),
        pool.query(
          `SELECT
             COUNT(*)::int AS total_quizzes,
             COUNT(*) FILTER (WHERE is_active = true)::int AS active_quizzes,
             COUNT(*) FILTER (WHERE quiz_type = 'daily')::int AS daily_quizzes
           FROM quizzes`
        ),
        pool.query(
          `SELECT
             COUNT(*)::int AS total_learning_paths,
             COUNT(*) FILTER (WHERE is_published = true)::int AS published_learning_paths,
             COUNT(*)::int AS total_enrollments
           FROM learning_paths lp
           LEFT JOIN learning_path_enrollments lpe ON lpe.learning_path_id = lp.id`
        ),
        pool.query(
          `SELECT
             COUNT(*)::int AS total_hackathons,
             COUNT(*) FILTER (WHERE status = 'upcoming')::int AS upcoming_hackathons,
             COUNT(*) FILTER (WHERE status = 'ongoing')::int AS ongoing_hackathons,
             COUNT(*) FILTER (WHERE status = 'completed')::int AS completed_hackathons
           FROM hackathons`
        ),
        pool.query('SELECT COALESCE(SUM(total_points), 0)::bigint AS total_xp FROM users'),
      ]);

      res.json({
        success: true,
        data: {
          users: usersResult.rows[0],
          roleDistribution: roleDistributionResult.rows,
          quizzes: quizResult.rows[0],
          learning: learningResult.rows[0],
          hackathons: hackathonResult.rows[0],
          totalXpAwarded: Number(xpResult.rows[0].total_xp),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
