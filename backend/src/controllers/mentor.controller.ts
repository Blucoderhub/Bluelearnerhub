import { Request, Response, NextFunction } from 'express';
import { pool } from '../utils/database';
import logger from '../utils/logger';

/**
 * MENTOR CONTROLLER
 * Handles professor/mentor functionality for managing classes
 */

export class MentorController {
  // ─── Dashboard ──────────────────────────────────────────────────────────────
  async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const [classesResult, studentsResult, sessionsResult, submissionsResult] = await Promise.all([
        pool.query(`SELECT COUNT(*) as count FROM mentor_batches WHERE mentor_id IN (SELECT id FROM mentor_profiles WHERE user_id = $1)`, [userId]),
        pool.query(`
          SELECT COUNT(DISTINCT be.student_id) as count
          FROM batch_enrollments be
          JOIN mentor_batches mb ON be.batch_id = mb.id
          JOIN mentor_profiles mp ON mb.mentor_id = mp.id
          WHERE mp.user_id = $1
        `, [userId]),
        pool.query(`
          SELECT COUNT(*) as count
          FROM mentor_sessions ms
          JOIN mentor_batches mb ON ms.batch_id = mb.id
          JOIN mentor_profiles mp ON mb.mentor_id = mp.id
          WHERE mp.user_id = $1 AND ms.status = 'SCHEDULED'
        `, [userId]),
        pool.query(`
          SELECT COUNT(*) as count
          FROM student_submissions ss
          JOIN mentor_batches mb ON ss.batch_id = mb.id
          JOIN mentor_profiles mp ON mb.mentor_id = mp.id
          WHERE mp.user_id = $1 AND ss.status = 'PENDING'
        `, [userId]),
      ]);

      res.json({
        success: true,
        data: {
          totalClasses: parseInt(classesResult.rows[0]?.count || '0'),
          totalStudents: parseInt(studentsResult.rows[0]?.count || '0'),
          upcomingSessions: parseInt(sessionsResult.rows[0]?.count || '0'),
          pendingSubmissions: parseInt(submissionsResult.rows[0]?.count || '0'),
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // ─── Classes / Batches ─────────────────────────────────────────────────────
  async getClasses(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = (page - 1) * limit;

      const result = await pool.query(`
        SELECT mb.*, 
               mp.specialization,
               (SELECT COUNT(*) FROM batch_enrollments WHERE batch_id = mb.id) as student_count,
               (SELECT COUNT(*) FROM mentor_sessions WHERE batch_id = mb.id) as session_count
        FROM mentor_batches mb
        JOIN mentor_profiles mp ON mb.mentor_id = mp.id
        WHERE mp.user_id = $1
        ORDER BY mb.created_at DESC
        LIMIT $2 OFFSET $3
      `, [userId, limit, offset]);

      res.json({ success: true, data: result.rows });
    } catch (error) {
      next(error);
    }
  }

  async createClass(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { name, description, domain, maxStudents, startDate, endDate } = req.body;

      if (!name) {
        return res.status(400).json({ success: false, message: 'Class name is required' });
      }

      // Get or create mentor profile
      const mentorProfile = await pool.query(
        `SELECT id FROM mentor_profiles WHERE user_id = $1`,
        [userId]
      );

      let profileId: number;
      if (mentorProfile.rows.length === 0) {
        const newProfile = await pool.query(
          `INSERT INTO mentor_profiles (user_id) VALUES ($1) RETURNING id`,
          [userId]
        );
        profileId = newProfile.rows[0].id;
      } else {
        profileId = mentorProfile.rows[0].id;
      }

      const result = await pool.query(
        `INSERT INTO mentor_batches (mentor_id, name, description, domain, max_students, start_date, end_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [profileId, name, description, domain, maxStudents || 50, startDate, endDate]
      );

      logger.info(`Mentor ${userId} created class: ${name}`);

      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }

  async getClassById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const batch = await pool.query(`
        SELECT mb.*, mp.specialization, mp.bio as mentor_bio
        FROM mentor_batches mb
        JOIN mentor_profiles mp ON mb.mentor_id = mp.id
        WHERE mb.id = $1 AND mp.user_id = $2
      `, [id, userId]);

      if (batch.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Class not found' });
      }

      const [students, sessions, pendingSubmissions] = await Promise.all([
        pool.query(`
          SELECT u.id, u.full_name, u.email, u.profile_picture, u.avatar_config,
                 be.progress, be.status, be.enrolled_at
          FROM batch_enrollments be
          JOIN users u ON be.student_id = u.id
          WHERE be.batch_id = $1
          ORDER BY be.enrolled_at DESC
        `, [id]),
        pool.query(`
          SELECT * FROM mentor_sessions
          WHERE batch_id = $1
          ORDER BY scheduled_at ASC
        `, [id]),
        pool.query(`
          SELECT ss.*, u.full_name as student_name
          FROM student_submissions ss
          JOIN users u ON ss.student_id = u.id
          WHERE ss.batch_id = $1 AND ss.status = 'PENDING'
          ORDER BY ss.submitted_at ASC
        `, [id]),
      ]);

      res.json({
        success: true,
        data: {
          ...batch.rows[0],
          students: students.rows,
          sessions: sessions.rows,
          pendingSubmissions: pendingSubmissions.rows,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateClass(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const updates = req.body;

      // Verify ownership
      const check = await pool.query(`
        SELECT mb.id FROM mentor_batches mb
        JOIN mentor_profiles mp ON mb.mentor_id = mp.id
        WHERE mb.id = $1 AND mp.user_id = $2
      `, [id, userId]);

      if (check.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Class not found' });
      }

      const fields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      const fieldMap: Record<string, string> = {
        name: 'name',
        description: 'description',
        domain: 'domain',
        maxStudents: 'max_students',
        startDate: 'start_date',
        endDate: 'end_date',
        isActive: 'is_active',
      };

      for (const [key, dbField] of Object.entries(fieldMap)) {
        if (updates[key] !== undefined) {
          fields.push(`${dbField} = $${paramCount++}`);
          values.push(updates[key]);
        }
      }

      if (fields.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields to update' });
      }

      fields.push(`updated_at = NOW()`);
      values.push(id);

      const result = await pool.query(
        `UPDATE mentor_batches SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }

  async deleteClass(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const result = await pool.query(`
        DELETE FROM mentor_batches mb
        USING mentor_profiles mp
        WHERE mb.mentor_id = mp.id
          AND mb.id = $1
          AND mp.user_id = $2
        RETURNING mb.id
      `, [id, userId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Class not found' });
      }

      res.json({ success: true, message: 'Class deleted' });
    } catch (error) {
      next(error);
    }
  }

  // ─── Sessions ───────────────────────────────────────────────────────────────
  async createSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { title, description, scheduledAt, duration, meetingLink } = req.body;

      if (!title || !scheduledAt) {
        return res.status(400).json({ success: false, message: 'Title and scheduled time are required' });
      }

      // Verify ownership
      const check = await pool.query(`
        SELECT mb.id FROM mentor_batches mb
        JOIN mentor_profiles mp ON mb.mentor_id = mp.id
        WHERE mb.id = $1 AND mp.user_id = $2
      `, [id, userId]);

      if (check.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Class not found' });
      }

      const result = await pool.query(
        `INSERT INTO mentor_sessions (batch_id, title, description, scheduled_at, duration, meeting_link)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [id, title, description, scheduledAt, duration || 60, meetingLink]
      );

      logger.info(`Session created for class ${id}: ${title}`);

      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }

  async updateSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const updates = req.body;

      // Verify ownership
      const check = await pool.query(`
        SELECT ms.id FROM mentor_sessions ms
        JOIN mentor_batches mb ON ms.batch_id = mb.id
        JOIN mentor_profiles mp ON mb.mentor_id = mp.id
        WHERE ms.id = $1 AND mp.user_id = $2
      `, [id, userId]);

      if (check.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Session not found' });
      }

      const fields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      const fieldMap: Record<string, string> = {
        title: 'title',
        description: 'description',
        scheduledAt: 'scheduled_at',
        duration: 'duration',
        meetingLink: 'meeting_link',
        status: 'status',
      };

      for (const [key, dbField] of Object.entries(fieldMap)) {
        if (updates[key] !== undefined) {
          fields.push(`${dbField} = $${paramCount++}`);
          values.push(updates[key]);
        }
      }

      if (fields.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields to update' });
      }

      fields.push(`updated_at = NOW()`);
      values.push(id);

      const result = await pool.query(
        `UPDATE mentor_sessions SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }

  // ─── Assignments ───────────────────────────────────────────────────────────
  async createAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { taskTitle, taskType, maxScore } = req.body;

      if (!taskTitle || !taskType) {
        return res.status(400).json({ success: false, message: 'Title and type are required' });
      }

      // Verify ownership
      const check = await pool.query(`
        SELECT mb.id FROM mentor_batches mb
        JOIN mentor_profiles mp ON mb.mentor_id = mp.id
        WHERE mb.id = $1 AND mp.user_id = $2
      `, [id, userId]);

      if (check.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Class not found' });
      }

      const result = await pool.query(
        `INSERT INTO student_submissions (batch_id, task_title, task_type, max_score)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [id, taskTitle, taskType, maxScore || 100]
      );

      logger.info(`Assignment created for class ${id}: ${taskTitle}`);

      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }

  // ─── Grading ───────────────────────────────────────────────────────────────
  async getSubmissions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { status, batchId, page = '1', limit = '20' } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

      let query = `
        SELECT ss.*, u.full_name as student_name, u.email as student_email, mb.name as batch_name
        FROM student_submissions ss
        JOIN users u ON ss.student_id = u.id
        JOIN mentor_batches mb ON ss.batch_id = mb.id
        JOIN mentor_profiles mp ON mb.mentor_id = mp.id
        WHERE mp.user_id = $1
      `;
      const params: any[] = [userId];
      let paramCount = 2;

      if (status && status !== 'ALL') {
        query += ` AND ss.status = $${paramCount++}`;
        params.push(status);
      }

      if (batchId) {
        query += ` AND ss.batch_id = $${paramCount++}`;
        params.push(batchId);
      }

      query += ` ORDER BY ss.submitted_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
      params.push(parseInt(limit as string), offset);

      const result = await pool.query(query, params);

      res.json({ success: true, data: result.rows });
    } catch (error) {
      next(error);
    }
  }

  async gradeSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { score, feedback } = req.body;

      if (score === undefined) {
        return res.status(400).json({ success: false, message: 'Score is required' });
      }

      // Verify ownership
      const check = await pool.query(`
        SELECT ss.id FROM student_submissions ss
        JOIN mentor_batches mb ON ss.batch_id = mb.id
        JOIN mentor_profiles mp ON mb.mentor_id = mp.id
        WHERE ss.id = $1 AND mp.user_id = $2
      `, [id, userId]);

      if (check.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
      }

      const result = await pool.query(
        `UPDATE student_submissions 
         SET score = $1, feedback = $2, status = 'GRADED', graded_by = $3, graded_at = NOW()
         WHERE id = $4
         RETURNING *`,
        [score, feedback, userId, id]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }

  // ─── Attendance ───────────────────────────────────────────────────────────
  async markAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { studentId, attended } = req.body;

      // Verify ownership
      const check = await pool.query(`
        SELECT ms.id FROM mentor_sessions ms
        JOIN mentor_batches mb ON ms.batch_id = mb.id
        JOIN mentor_profiles mp ON mb.mentor_id = mp.id
        WHERE ms.id = $1 AND mp.user_id = $2
      `, [id, userId]);

      if (check.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Session not found' });
      }

      const result = await pool.query(
        `INSERT INTO session_attendance (session_id, student_id, attended, joined_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (session_id, student_id) 
         DO UPDATE SET attended = $3
         RETURNING *`,
        [id, studentId, attended]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }

  async getAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      // Verify ownership
      const check = await pool.query(`
        SELECT ms.id FROM mentor_sessions ms
        JOIN mentor_batches mb ON ms.batch_id = mb.id
        JOIN mentor_profiles mp ON mb.mentor_id = mp.id
        WHERE ms.id = $1 AND mp.user_id = $2
      `, [id, userId]);

      if (check.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Session not found' });
      }

      const result = await pool.query(`
        SELECT sa.*, u.full_name as student_name, u.email as student_email
        FROM session_attendance sa
        JOIN users u ON sa.student_id = u.id
        WHERE sa.session_id = $1
        ORDER BY u.full_name
      `, [id]);

      res.json({ success: true, data: result.rows });
    } catch (error) {
      next(error);
    }
  }

  // ─── Student Progress ───────────────────────────────────────────────────────
  async getStudentProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      // Verify mentor has access to this student
      const access = await pool.query(`
        SELECT 1 FROM batch_enrollments be
        JOIN mentor_batches mb ON be.batch_id = mb.id
        JOIN mentor_profiles mp ON mb.mentor_id = mp.id
        WHERE mp.user_id = $1 AND be.student_id = $2
      `, [userId, id]);

      if (access.rows.length === 0) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      const [student, submissions, attendance] = await Promise.all([
        pool.query(
          `SELECT id, full_name, email, profile_picture, avatar_config FROM users WHERE id = $1`,
          [id]
        ),
        pool.query(`
          SELECT ss.*, mb.name as batch_name
          FROM student_submissions ss
          JOIN mentor_batches mb ON ss.batch_id = mb.id
          WHERE ss.student_id = $1
          ORDER BY ss.submitted_at DESC
          LIMIT 50
        `, [id]),
        pool.query(`
          SELECT sa.*, ms.title as session_title
          FROM session_attendance sa
          JOIN mentor_sessions ms ON sa.session_id = ms.id
          WHERE sa.student_id = $1
          ORDER BY sa.joined_at DESC
        `, [id]),
      ]);

      res.json({
        success: true,
        data: {
          student: student.rows[0],
          submissions: submissions.rows,
          attendance: attendance.rows,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // ─── Profile ───────────────────────────────────────────────────────────────
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const profile = await pool.query(`
        SELECT mp.*, u.full_name, u.email, u.profile_picture
        FROM mentor_profiles mp
        JOIN users u ON mp.user_id = u.id
        WHERE mp.user_id = $1
      `, [userId]);

      if (profile.rows.length === 0) {
        return res.json({ success: true, data: null });
      }

      const stats = await pool.query(`
        SELECT 
          COUNT(DISTINCT mb.id) as total_classes,
          COUNT(DISTINCT be.student_id) as total_students,
          COUNT(DISTINCT CASE WHEN ms.status = 'COMPLETED' THEN ms.id END) as completed_sessions
        FROM mentor_profiles mp
        LEFT JOIN mentor_batches mb ON mp.id = mb.mentor_id
        LEFT JOIN batch_enrollments be ON mb.id = be.batch_id
        LEFT JOIN mentor_sessions ms ON mb.id = ms.batch_id
        WHERE mp.user_id = $1
        GROUP BY mp.id
      `, [userId]);

      res.json({
        success: true,
        data: {
          ...profile.rows[0],
          stats: stats.rows[0],
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { specialization, bio, availability } = req.body;

      const profile = await pool.query(
        `SELECT id FROM mentor_profiles WHERE user_id = $1`,
        [userId]
      );

      let profileId: number;
      if (profile.rows.length === 0) {
        const newProfile = await pool.query(
          `INSERT INTO mentor_profiles (user_id) VALUES ($1) RETURNING id`,
          [userId]
        );
        profileId = newProfile.rows[0].id;
      } else {
        profileId = profile.rows[0].id;
      }

      const fields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (specialization !== undefined) { fields.push(`specialization = $${paramCount++}`); values.push(specialization); }
      if (bio !== undefined) { fields.push(`bio = $${paramCount++}`); values.push(bio); }
      if (availability !== undefined) { fields.push(`availability = $${paramCount++}`); values.push(JSON.stringify(availability)); }
      fields.push(`updated_at = NOW()`);
      values.push(profileId);

      const result = await pool.query(
        `UPDATE mentor_profiles SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }
}

export default new MentorController();
