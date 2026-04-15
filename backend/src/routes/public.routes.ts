/**
 * PUBLIC API ROUTES
 * =================
 * Frontend-to-Backend communication
 * Protected by JWT authentication (authenticate middleware)
 * 
 * Use cases:
 * - Login / Register
 * - Profile fetch
 * - Live search (hackathons, jobs, candidates)
 */

import { Router } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth';
import { pool } from '../utils/database';
import logger from '../utils/logger';

const router = Router();

// ─── Live Search ───────────────────────────────────────────────────────────────
// Search across hackathons, jobs, candidates, and content
router.get('/search', optionalAuth, async (req, res) => {
  try {
    const { q, type, limit = '20', page = '1' } = req.query;

    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters',
      });
    }

    const searchTerm = `%${q.trim().toLowerCase()}%`;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const results: Record<string, any[]> = {};

    // Search hackathons
    if (!type || type === 'hackathons') {
      const hackathons = await pool.query(
        `SELECT id, title, description, status, domain, prizes, start_time, end_time
         FROM hackathons
         WHERE LOWER(title) LIKE $1 OR LOWER(description) LIKE $1
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        [searchTerm, parseInt(limit as string), offset]
      );
      results.hackathons = hackathons.rows;
    }

    // Search jobs
    if (!type || type === 'jobs') {
      const jobs = await pool.query(
        `SELECT id, title, description, location, job_type, salary, skills, domain
         FROM jobs
         WHERE LOWER(title) LIKE $1 OR LOWER(description) LIKE $1 OR LOWER(skills::text) LIKE $1
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        [searchTerm, parseInt(limit as string), offset]
      );
      results.jobs = jobs.rows;
    }

    // Search candidates (for corporate users)
    if (!type || type === 'candidates') {
      const candidates = await pool.query(
        `SELECT id, full_name, email, total_points, level, skills, current_position, company
         FROM users u
         LEFT JOIN LATERAL (
           SELECT json_agg(json_build_object('skill', skill_name, 'level', proficiency_level))
           FROM user_skills WHERE user_id = u.id
         ) skills ON true
         WHERE u.role = 'STUDENT'
           AND u.is_active = true
           AND (LOWER(full_name) LIKE $1 OR LOWER(current_position) LIKE $1 OR LOWER(company) LIKE $1)
         ORDER BY u.total_points DESC
         LIMIT $2 OFFSET $3`,
        [searchTerm, parseInt(limit as string), offset]
      );
      results.candidates = candidates.rows;
    }

    // Search learning tracks
    if (!type || type === 'tracks') {
      const tracks = await pool.query(
        `SELECT id, title, slug, description, difficulty, rating, enrollment_count
         FROM learning_tracks
         WHERE LOWER(title) LIKE $1 OR LOWER(description) LIKE $1
         ORDER BY rating DESC
         LIMIT $2 OFFSET $3`,
        [searchTerm, parseInt(limit as string), offset]
      );
      results.tracks = tracks.rows;
    }

    res.json({
      success: true,
      data: results,
      meta: {
        query: q,
        type: type || 'all',
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      },
    });
  } catch (error) {
    logger.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
    });
  }
});

// ─── User Profile (Frontend accessible) ──────────────────────────────────────
router.get('/profile/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const requesterId = (req as any).user?.id;

    const result = await pool.query(
      `SELECT 
         u.id, u.email, u.full_name, u.profile_picture, u.bio, u.location,
         u.education_level, u.college_name, u.graduation_year,
         u.current_position, u.company, u.years_experience,
         u.linkedin_url, u.github_url, u.portfolio_url,
         u.total_points, u.level, u.current_streak, u.longest_streak,
         u.avatar_config, u.role, u.created_at,
         (SELECT COUNT(*) FROM hackathon_registrations WHERE user_id = u.id) as hackathons_participated,
         (SELECT COUNT(*) FROM hackathon_submissions WHERE user_id = u.id) as hackathons_submitted,
         (SELECT COUNT(*) FROM job_applications WHERE user_id = u.id) as jobs_applied
       FROM users u
       WHERE u.id = $1 AND u.is_active = true`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const user = result.rows[0];

    // Fetch skills
    const skills = await pool.query(
      `SELECT skill_name, proficiency_level FROM user_skills WHERE user_id = $1 ORDER BY proficiency_level DESC`,
      [id]
    );

    // Fetch achievements
    const achievements = await pool.query(
      `SELECT a.title, a.description, a.xp_reward, ua.earned_at
       FROM achievements a
       JOIN user_achievements ua ON a.id = ua.achievement_id
       WHERE ua.user_id = $1
       ORDER BY ua.earned_at DESC
       LIMIT 10`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...user,
        skills: skills.rows,
        achievements: achievements.rows,
        isOwnProfile: requesterId === parseInt(id),
      },
    });
  } catch (error) {
    logger.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
    });
  }
});

// ─── Candidate Search (For Corporate Users) ────────────────────────────────────
router.get('/candidates', authenticate, async (req, res) => {
  try {
    const { 
      search, 
      skills, 
      minXp, 
      maxXp,
      domain,
      sortBy = 'total_points',
      sortOrder = 'desc',
      page = '1',
      limit = '20'
    } = req.query;

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const params: any[] = [];
    let paramCount = 1;

    // Only STUDENT role users
    let whereClause = 'WHERE u.role = $' + paramCount + ' AND u.is_active = true AND u.is_banned = false';
    params.push('STUDENT');
    paramCount++;

    if (search) {
      whereClause += ` AND (LOWER(u.full_name) LIKE $${paramCount} OR LOWER(u.email) LIKE $${paramCount} OR LOWER(u.current_position) LIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (minXp) {
      whereClause += ` AND u.total_points >= $${paramCount}`;
      params.push(parseInt(minXp as string));
      paramCount++;
    }

    if (maxXp) {
      whereClause += ` AND u.total_points <= $${paramCount}`;
      params.push(parseInt(maxXp as string));
      paramCount++;
    }

    const allowedSortFields = ['total_points', 'level', 'current_streak', 'created_at'];
    const sortField = allowedSortFields.includes(sortBy as string) ? sortBy : 'total_points';
    const sortDir = sortOrder === 'asc' ? 'ASC' : 'DESC';

    const query = `
      SELECT 
        u.id, u.full_name, u.email, u.profile_picture, u.avatar_config,
        u.total_points, u.level, u.current_streak, u.current_position, u.company,
        u.location, u.years_experience, u.bio,
        u.linkedin_url, u.github_url, u.portfolio_url,
        (SELECT COUNT(*) FROM hackathon_registrations WHERE user_id = u.id) as hackathons_participated,
        (SELECT COUNT(*) FROM job_applications WHERE user_id = u.id) as jobs_applied
      FROM users u
      ${whereClause}
      ORDER BY u.${sortField} ${sortDir}
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    params.push(parseInt(limit as string), offset);

    const result = await pool.query(query, params);

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM users u ${whereClause}`,
      params.slice(0, -2)
    );

    // Get skills for all candidates (batch query)
    if (result.rows.length > 0) {
      const userIds = result.rows.map(r => r.id);
      const skillsResult = await pool.query(
        `SELECT user_id, skill_name, proficiency_level 
         FROM user_skills 
         WHERE user_id = ANY($1)`,
        [userIds]
      );

      const skillsMap: Record<number, any[]> = {};
      for (const skill of skillsResult.rows) {
        if (!skillsMap[skill.user_id]) {
          skillsMap[skill.user_id] = [];
        }
        skillsMap[skill.user_id].push(skill);
      }

      for (const user of result.rows) {
        user.skills = skillsMap[user.id] || [];
      }
    }

    res.json({
      success: true,
      data: result.rows,
      meta: {
        total: parseInt(countResult.rows[0].total),
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        pages: Math.ceil(parseInt(countResult.rows[0].total) / parseInt(limit as string)),
      },
    });
  } catch (error) {
    logger.error('Candidate search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search candidates',
    });
  }
});

// ─── Job Search (Public) ──────────────────────────────────────────────────────
router.get('/jobs/search', optionalAuth, async (req, res) => {
  try {
    const { 
      q, 
      location, 
      jobType, 
      domain,
      minSalary,
      remote,
      sortBy = 'created_at',
      sortOrder = 'desc',
      page = '1',
      limit = '20'
    } = req.query;

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const params: any[] = [];
    let paramCount = 1;

    let whereClause = 'WHERE 1=1';

    if (q) {
      whereClause += ` AND (LOWER(title) LIKE $${paramCount} OR LOWER(description) LIKE $${paramCount})`;
      params.push(`%${q}%`);
      paramCount++;
    }

    if (location) {
      whereClause += ` AND LOWER(location) LIKE $${paramCount}`;
      params.push(`%${location}%`);
      paramCount++;
    }

    if (jobType) {
      whereClause += ` AND job_type = $${paramCount}`;
      params.push(jobType);
      paramCount++;
    }

    if (domain) {
      whereClause += ` AND domain = $${paramCount}`;
      params.push(domain);
      paramCount++;
    }

    if (remote === 'true') {
      whereClause += ` AND remote = true`;
    }

    const allowedSortFields = ['created_at', 'salary', 'title'];
    const sortField = allowedSortFields.includes(sortBy as string) ? sortBy : 'created_at';
    const sortDir = sortOrder === 'asc' ? 'ASC' : 'DESC';

    const query = `
      SELECT j.*, 
             u.full_name as posted_by_name,
             (SELECT COUNT(*) FROM job_applications WHERE job_id = j.id) as application_count
      FROM jobs j
      LEFT JOIN users u ON j.posted_by = u.id
      ${whereClause}
      ORDER BY j.${sortField} ${sortDir}
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    params.push(parseInt(limit as string), offset);

    const result = await pool.query(query, params);

    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM jobs ${whereClause}`,
      params.slice(0, -2)
    );

    res.json({
      success: true,
      data: result.rows,
      meta: {
        total: parseInt(countResult.rows[0].total),
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      },
    });
  } catch (error) {
    logger.error('Job search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search jobs',
    });
  }
});

// ─── Hackathon Search (Public) ───────────────────────────────────────────────
router.get('/hackathons/search', optionalAuth, async (req, res) => {
  try {
    const { 
      q, 
      status, 
      domain,
      difficulty,
      sortBy = 'created_at',
      sortOrder = 'desc',
      page = '1',
      limit = '20'
    } = req.query;

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const params: any[] = [];
    let paramCount = 1;

    let whereClause = 'WHERE 1=1';

    if (q) {
      whereClause += ` AND (LOWER(title) LIKE $${paramCount} OR LOWER(description) LIKE $${paramCount})`;
      params.push(`%${q}%`);
      paramCount++;
    }

    if (status) {
      whereClause += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (domain) {
      whereClause += ` AND domain = $${paramCount}`;
      params.push(domain);
      paramCount++;
    }

    if (difficulty) {
      whereClause += ` AND difficulty = $${paramCount}`;
      params.push(difficulty);
      paramCount++;
    }

    const allowedSortFields = ['created_at', 'start_time', 'prizes', 'title'];
    const sortField = allowedSortFields.includes(sortBy as string) ? sortBy : 'created_at';
    const sortDir = sortOrder === 'asc' ? 'ASC' : 'DESC';

    const query = `
      SELECT h.*,
             u.full_name as org_name,
             (SELECT COUNT(*) FROM hackathon_registrations WHERE hackathon_id = h.id) as participant_count
      FROM hackathons h
      LEFT JOIN users u ON h.org_id = u.id
      ${whereClause}
      ORDER BY h.${sortField} ${sortDir}
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    params.push(parseInt(limit as string), offset);

    const result = await pool.query(query, params);

    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM hackathons ${whereClause}`,
      params.slice(0, -2)
    );

    res.json({
      success: true,
      data: result.rows,
      meta: {
        total: parseInt(countResult.rows[0].total),
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      },
    });
  } catch (error) {
    logger.error('Hackathon search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search hackathons',
    });
  }
});

export default router;
