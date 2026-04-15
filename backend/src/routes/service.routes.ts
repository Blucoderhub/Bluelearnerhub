/**
 * SERVICE API ROUTES
 * ==================
 * Backend Services to Database operations
 * Protected by service authentication
 * 
 * Use cases:
 * - User Insert (from OAuth, Admin, etc.)
 * - Profile Update
 * - Report Queries
 * - Batch operations
 */

import { Router } from 'express';
import { internalApiKeyAuth } from '../middleware/internalAuth';
import { pool } from '../utils/database';
import { hashPassword } from '../utils/encryption';
import logger from '../utils/logger';

const router = Router();

// All service routes require API key
router.use(internalApiKeyAuth);

// ─── User Management ──────────────────────────────────────────────────────────
router.post('/users', async (req, res) => {
  try {
    const { email, password, fullName, role, collegeName, company, metadata } = req.body;

    if (!email || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'email and fullName are required',
      });
    }

    // Check if user exists
    const existing = await pool.query(
      'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User already exists',
        userId: existing.rows[0].id,
      });
    }

    const passwordHash = password ? await hashPassword(password) : null;

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, role, college_name, company, avatar_config, preferences)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, email, full_name, role, college_name, company, created_at`,
      [
        email,
        passwordHash,
        fullName,
        role || 'STUDENT',
        collegeName || null,
        company || null,
        JSON.stringify({ seed: email.split('@')[0], style: 'adventurer' }),
        JSON.stringify(metadata || {}),
      ]
    );

    logger.info(`Service: Created user ${email} with role ${role || 'STUDENT'}`);

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Service: User creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
    });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove protected fields
    delete updates.id;
    delete updates.password_hash;
    delete updates.role; // Role changes should go through separate endpoint

    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        fields.push(`${snakeKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update',
      });
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    logger.info(`Service: Updated user ${id}`);

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Service: User update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
    });
  }
});

router.put('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['STUDENT', 'CORPORATE', 'ADMIN'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Valid role is required (STUDENT, CORPORATE, ADMIN)',
      });
    }

    const result = await pool.query(
      `UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, role`,
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    logger.info(`Service: Changed user ${id} role to ${role}`);

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Service: Role update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update role',
    });
  }
});

// ─── Profile Update ────────────────────────────────────────────────────────────
router.put('/profiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      bio,
      location,
      educationLevel,
      collegeName,
      graduationYear,
      currentPosition,
      company,
      yearsExperience,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      skills,
      avatarConfig,
    } = req.body;

    // Build dynamic update query
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    const profileFields = {
      full_name: fullName,
      bio,
      location,
      education_level: educationLevel,
      college_name: collegeName,
      graduation_year: graduationYear,
      current_position: currentPosition,
      company,
      years_experience: yearsExperience,
      linkedin_url: linkedinUrl,
      github_url: githubUrl,
      portfolio_url: portfolioUrl,
      avatar_config: avatarConfig ? JSON.stringify(avatarConfig) : undefined,
    };

    for (const [key, value] of Object.entries(profileFields)) {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No profile fields to update',
      });
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update skills if provided
    if (skills && Array.isArray(skills)) {
      await pool.query('DELETE FROM user_skills WHERE user_id = $1', [id]);
      
      for (const skill of skills) {
        await pool.query(
          `INSERT INTO user_skills (user_id, skill_name, proficiency_level)
           VALUES ($1, $2, $3)
           ON CONFLICT (user_id, skill_name) DO UPDATE SET proficiency_level = $3`,
          [id, skill.name || skill.skillName, skill.level || skill.proficiencyLevel || 1]
        );
      }
    }

    logger.info(`Service: Profile updated for user ${id}`);

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Service: Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
});

// ─── Analytics & Reports ───────────────────────────────────────────────────────
router.get('/stats/overview', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '7 days') as new_users_week,
        (SELECT COUNT(*) FROM hackathons) as total_hackathons,
        (SELECT COUNT(*) FROM jobs) as total_jobs,
        (SELECT COUNT(*) FROM hackathon_registrations) as total_hackathon_participants,
        (SELECT COUNT(*) FROM job_applications) as total_applications
    `);

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Service: Stats overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
    });
  }
});

router.get('/stats/gamification', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        SUM(total_points) as total_xp_distributed,
        MAX(total_points) as highest_xp,
        AVG(total_points) as average_xp,
        AVG(current_streak) as average_streak,
        MAX(current_streak) as longest_streak,
        COUNT(*) FILTER (WHERE current_streak > 0) as users_with_streak
      FROM users
    `);

    const levelDistribution = await pool.query(`
      SELECT level, COUNT(*) as count
      FROM users
      GROUP BY level
      ORDER BY level
    `);

    res.json({
      success: true,
      data: {
        ...result.rows[0],
        levelDistribution: levelDistribution.rows,
      },
    });
  } catch (error) {
    logger.error('Service: Gamification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gamification stats',
    });
  }
});

router.get('/stats/engagement', async (req, res) => {
  try {
    const { period = '30 days' } = req.query;

    const dailyActive = await pool.query(`
      SELECT 
        DATE(last_active) as date,
        COUNT(*) as active_users
      FROM users
      WHERE last_active >= NOW() - INTERVAL '${period}'
      GROUP BY DATE(last_active)
      ORDER BY date DESC
    `);

    const quizActivity = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as submissions
      FROM quiz_attempts
      WHERE created_at >= NOW() - INTERVAL '${period}'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    const hackathonActivity = await pool.query(`
      SELECT 
        DATE(h.created_at) as date,
        COUNT(*) as new_hackathons
      FROM hackathons h
      WHERE h.created_at >= NOW() - INTERVAL '${period}'
      GROUP BY DATE(h.created_at)
      ORDER BY date DESC
    `);

    res.json({
      success: true,
      data: {
        dailyActiveUsers: dailyActive.rows,
        quizSubmissions: quizActivity.rows,
        newHackathons: hackathonActivity.rows,
      },
    });
  } catch (error) {
    logger.error('Service: Engagement stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch engagement stats',
    });
  }
});

// ─── Data Export ─────────────────────────────────────────────────────────────
router.get('/export/users', async (req, res) => {
  try {
    const { format = 'json', role, includeInactive } = req.query;

    let query = `
      SELECT u.*, 
             (SELECT COUNT(*) FROM hackathon_registrations WHERE user_id = u.id) as hackathons_joined,
             (SELECT COUNT(*) FROM hackathon_submissions WHERE user_id = u.id) as hackathons_submitted,
             (SELECT COUNT(*) FROM job_applications WHERE user_id = u.id) as jobs_applied
      FROM users u
      WHERE 1=1
    `;
    const params: any[] = [];

    if (role) {
      params.push(role);
      query += ` AND u.role = $${params.length}`;
    }

    if (!includeInactive) {
      query += ' AND u.is_active = true';
    }

    query += ' ORDER BY u.created_at DESC LIMIT 10000';

    const result = await pool.query(query, params);

    if (format === 'csv') {
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'No data to export' });
      }

      const headers = Object.keys(result.rows[0]).join(',');
      const rows = result.rows.map(row =>
        Object.values(row).map(v => 
          typeof v === 'string' && v.includes(',') ? `"${v}"` : v
        ).join(',')
      );

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=users-export.csv');
      return res.send([headers, ...rows].join('\n'));
    }

    res.json({
      success: true,
      data: result.rows,
      meta: {
        count: result.rows.length,
        exportedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('Service: User export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export users',
    });
  }
});

export default router;
