import { Request, Response, NextFunction } from 'express';
import { pool } from '../utils/database';
import { AppError } from '../middleware/error';

export class LearningController {
  async getLearningPaths(req: Request, res: Response, next: NextFunction) {
    try {
      const { domain, difficulty, page = 1, limit = 10 } = req.query;

      let whereClause = 'WHERE is_published = true';
      const values: any[] = [];
      let paramCount = 1;

      if (domain) {
        whereClause += ` AND domain = $${paramCount}`;
        values.push(domain);
        paramCount++;
      }

      if (difficulty) {
        whereClause += ` AND difficulty = $${paramCount}`;
        values.push(difficulty);
        paramCount++;
      }

      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

      const countQuery = `SELECT COUNT(*) FROM learning_paths ${whereClause}`;
      const countResult = await pool.query(countQuery, values);
      const total = parseInt(countResult.rows[0].count);

      const query = `
        SELECT * FROM learning_paths ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `;

      values.push(parseInt(limit as string), offset);
      const result = await pool.query(query, values);

      res.json({
        success: true,
        data: {
          data: result.rows,
          total,
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getLearningPathById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const pathResult = await pool.query('SELECT * FROM learning_paths WHERE id = $1', [id]);

      if (pathResult.rows.length === 0) {
        throw new AppError('Learning path not found', 404);
      }

      const path = pathResult.rows[0];

      const coursesResult = await pool.query(
        'SELECT * FROM courses WHERE learning_path_id = $1 ORDER BY order_index',
        [id]
      );

      path.courses = coursesResult.rows;

      if (userId) {
        const enrollmentResult = await pool.query(
          'SELECT * FROM learning_path_enrollments WHERE user_id = $1 AND learning_path_id = $2',
          [userId, id]
        );

        path.enrollment = enrollmentResult.rows[0] || null;
      }

      res.json({
        success: true,
        data: path,
      });
    } catch (error) {
      next(error);
    }
  }

  async enrollInPath(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      await pool.query(
        `INSERT INTO learning_path_enrollments (user_id, learning_path_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, learning_path_id) DO NOTHING`,
        [userId, id]
      );

      res.json({
        success: true,
        message: 'Enrolled successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const courseResult = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);

      if (courseResult.rows.length === 0) {
        throw new AppError('Course not found', 404);
      }

      const course = courseResult.rows[0];

      const lessonsResult = await pool.query(
        'SELECT * FROM lessons WHERE course_id = $1 ORDER BY order_index',
        [id]
      );

      course.lessons = lessonsResult.rows;

      res.json({
        success: true,
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }

  async getLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const lessonResult = await pool.query('SELECT * FROM lessons WHERE id = $1', [id]);

      if (lessonResult.rows.length === 0) {
        throw new AppError('Lesson not found', 404);
      }

      const lesson = lessonResult.rows[0];

      if (userId) {
        const progressResult = await pool.query(
          'SELECT * FROM lesson_progress WHERE user_id = $1 AND lesson_id = $2',
          [userId, id]
        );

        lesson.progress = progressResult.rows[0] || null;
      }

      res.json({
        success: true,
        data: lesson,
      });
    } catch (error) {
      next(error);
    }
  }

  async markLessonComplete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      await pool.query(
        `INSERT INTO lesson_progress (user_id, lesson_id, completed, completed_at)
         VALUES ($1, $2, true, NOW())
         ON CONFLICT (user_id, lesson_id)
         DO UPDATE SET completed = true, completed_at = NOW()`,
        [userId, id]
      );

      res.json({
        success: true,
        message: 'Lesson marked as complete',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { timeSpent, lastPosition } = req.body;

      await pool.query(
        `INSERT INTO lesson_progress (user_id, lesson_id, time_spent, last_position)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, lesson_id)
         DO UPDATE SET
           time_spent = lesson_progress.time_spent + $3,
           last_position = $4,
           updated_at = NOW()`,
        [userId, id, timeSpent || 0, lastPosition || 0]
      );

      res.json({
        success: true,
        message: 'Progress updated',
      });
    } catch (error) {
      next(error);
    }
  }

  async bookmarkLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { notes } = req.body;

      await pool.query(
        `INSERT INTO bookmarks (user_id, lesson_id, notes)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, lesson_id)
         DO UPDATE SET notes = $3, updated_at = NOW()`,
        [userId, id, notes]
      );

      res.json({
        success: true,
        message: 'Lesson bookmarked',
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookmarks(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const result = await pool.query(
        `SELECT b.*, l.title, l.slug, c.title as course_title
         FROM bookmarks b
         JOIN lessons l ON b.lesson_id = l.id
         JOIN courses c ON l.course_id = c.id
         WHERE b.user_id = $1
         ORDER BY b.created_at DESC`,
        [userId]
      );

      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      next(error);
    }
  }
}
