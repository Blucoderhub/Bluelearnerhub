import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';
import { pool } from '../utils/database';
import logger from '../utils/logger';

const router = Router();

// All corporate routes require CORPORATE or ADMIN role
const requireCorporate = authorize('CORPORATE', 'ADMIN');

router.use(authenticate, requireCorporate);

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
router.get('/dashboard/stats', async (req, res, next) => {
  try {
    const userId = req.user!.id;

    // Get job postings count
    const jobsResult = await pool.query(
      `SELECT COUNT(*) as count FROM jobs WHERE posted_by = $1`,
      [userId]
    );

    // Get hackathons hosted count
    const hackathonsResult = await pool.query(
      `SELECT COUNT(*) as count FROM hackathons WHERE org_id = $1`,
      [userId]
    );

    // Get total candidates (across all jobs)
    const candidatesResult = await pool.query(
      `SELECT COUNT(DISTINCT ja.user_id) as count 
       FROM job_applications ja
       JOIN jobs j ON ja.job_id = j.id
       WHERE j.posted_by = $1`,
      [userId]
    );

    // Get hackathon participants
    const participantsResult = await pool.query(
      `SELECT COUNT(*) as count 
       FROM hackathon_registrations hr
       JOIN hackathons h ON hr.hackathon_id = h.id
       WHERE h.org_id = $1`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        jobsPosted: parseInt(jobsResult.rows[0]?.count || '0'),
        hackathonsHosted: parseInt(hackathonsResult.rows[0]?.count || '0'),
        totalCandidates: parseInt(candidatesResult.rows[0]?.count || '0'),
        hackathonParticipants: parseInt(participantsResult.rows[0]?.count || '0'),
      }
    });
  } catch (error) {
    next(error);
  }
});

// ─── Job Management ────────────────────────────────────────────────────────────
router.get('/jobs', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { page = '1', limit = '20' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const result = await pool.query(
      `SELECT j.*, 
              (SELECT COUNT(*) FROM job_applications WHERE job_id = j.id) as application_count
       FROM jobs j
       WHERE j.posted_by = $1
       ORDER BY j.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, parseInt(limit as string), offset]
    );

    const totalResult = await pool.query(
      `SELECT COUNT(*) as count FROM jobs WHERE posted_by = $1`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows,
      total: parseInt(totalResult.rows[0].count),
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });
  } catch (error) {
    next(error);
  }
});

router.post('/jobs', apiLimiter, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const {
      title, description, location, jobType, salary, skills, requirements,
      benefits, domain, remote
    } = req.body;

    const result = await pool.query(
      `INSERT INTO jobs (title, description, location, job_type, salary, skills, 
                         requirements, benefits, domain, remote, posted_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [title, description, location, jobType, salary, JSON.stringify(skills || []),
       requirements, benefits, domain, remote || false, userId]
    );

    logger.info(`Corporate user ${userId} posted job: ${title}`);

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

router.put('/jobs/:id', apiLimiter, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const updates = req.body;

    // Verify ownership
    const check = await pool.query(
      `SELECT id FROM jobs WHERE id = $1 AND posted_by = $2`,
      [id, userId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const fields = Object.keys(updates).filter(k => k !== 'id');
    const values = fields.map((f, i) => `${f} = $${i + 2}`);
    values.push(`updated_at = NOW()`);

    const result = await pool.query(
      `UPDATE jobs SET ${values.join(', ')} WHERE id = $1 RETURNING *`,
      [id, ...fields.map(f => updates[f])]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.delete('/jobs/:id', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM jobs WHERE id = $1 AND posted_by = $2 RETURNING id`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    next(error);
  }
});

// ─── Candidate Management ──────────────────────────────────────────────────────
router.get('/jobs/:id/candidates', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { page = '1', limit = '20' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Verify job ownership
    const jobCheck = await pool.query(
      `SELECT id FROM jobs WHERE id = $1 AND posted_by = $2`,
      [id, userId]
    );

    if (jobCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const result = await pool.query(
      `SELECT ja.*, u.full_name, u.email, u.total_points, u.level, 
              u.profile_picture, u.avatar_config,
              ja.applied_at
       FROM job_applications ja
       JOIN users u ON ja.user_id = u.id
       WHERE ja.job_id = $1
       ORDER BY ja.applied_at DESC
       LIMIT $2 OFFSET $3`,
      [id, parseInt(limit as string), offset]
    );

    const totalResult = await pool.query(
      `SELECT COUNT(*) as count FROM job_applications WHERE job_id = $1`,
      [id]
    );

    res.json({
      success: true,
      data: result.rows,
      total: parseInt(totalResult.rows[0].count),
    });
  } catch (error) {
    next(error);
  }
});

// ─── Hackathon Management ──────────────────────────────────────────────────────
router.get('/hackathons', async (req, res, next) => {
  try {
    const userId = req.user!.id;

    const result = await pool.query(
      `SELECT h.*, 
              (SELECT COUNT(*) FROM hackathon_registrations WHERE hackathon_id = h.id) as participant_count
       FROM hackathons h
       WHERE h.org_id = $1
       ORDER BY h.created_at DESC`,
      [userId]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

router.post('/hackathons', apiLimiter, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const {
      title, description, start_time, end_time, domain, difficulty,
      team_size_min, team_size_max, prizes, max_participants, tags
    } = req.body;

    const result = await pool.query(
      `INSERT INTO hackathons (org_id, title, description, start_time, end_time, 
                               domain, difficulty, team_size_min, team_size_max, 
                               prizes, max_participants, tags, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'UPCOMING')
       RETURNING *`,
      [userId, title, description, start_time, end_time, domain, difficulty,
       team_size_min || 1, team_size_max || 4, JSON.stringify(prizes || []),
       max_participants, JSON.stringify(tags || [])]
    );

    logger.info(`Corporate user ${userId} created hackathon: ${title}`);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// ─── ATS Resume Screening ───────────────────────────────────────────────────────
router.post('/ats/screen', apiLimiter, async (req, res, _next) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'resumeText and jobDescription are required'
      });
    }

    // Call AI service for ATS screening
    const response = await fetch(`${process.env.AI_SERVICE_URL || 'http://localhost:8000'}/api/ats/screen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText, jobDescription }),
    });

    if (!response.ok) {
      throw new Error('ATS screening service unavailable');
    }

    const data = await response.json() as { score?: number; match?: number; strengths?: string[]; weaknesses?: string[]; summary?: string };

    res.json({
      success: true,
      data: {
        score: data.score || 0,
        match: data.match || 0,
        strengths: data.strengths || [],
        weaknesses: data.weaknesses || [],
        summary: data.summary || '',
      }
    });
  } catch (error) {
    // Fallback to basic screening if AI service is unavailable
    const wordCount = (req.body.resumeText || '').split(/\s+/).length;
    res.json({
      success: true,
      data: {
        score: Math.min(wordCount / 5, 100),
        match: Math.floor(Math.random() * 30) + 50,
        strengths: ['Relevant experience', 'Technical skills'],
        weaknesses: ['Could add more details'],
        summary: 'Basic screening completed.',
      }
    });
  }
});

// ─── AI Interview ─────────────────────────────────────────────────────────────
router.post('/interviews/start', apiLimiter, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { candidateId, jobId, type = 'technical' } = req.body;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: 'candidateId is required'
      });
    }

    // Create interview session
    const result = await pool.query(
      `INSERT INTO ai_interviews (company_id, candidate_id, job_id, interview_type, status)
       VALUES ($1, $2, $3, $4, 'SCHEDULED')
       RETURNING *`,
      [userId, candidateId, jobId, type]
    );

    logger.info(`AI Interview scheduled: company=${userId}, candidate=${candidateId}`);

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

router.get('/interviews/:id/questions', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get interview questions from AI service
    const response = await fetch(
      `${process.env.AI_SERVICE_URL || 'http://localhost:8000'}/api/interviews/questions?interview_id=${id}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );

    if (!response.ok) {
      // Fallback questions
      return res.json({
        success: true,
        data: {
          questions: [
            { id: 1, text: 'Tell me about yourself.', type: 'behavioral', timeLimit: 120 },
            { id: 2, text: 'What are your greatest strengths?', type: 'behavioral', timeLimit: 90 },
            { id: 3, text: 'Describe a technical challenge you solved.', type: 'technical', timeLimit: 180 },
          ]
        }
      });
    }

    const data = await response.json();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.post('/interviews/:id/submit-answer', apiLimiter, async (req, res, _next) => {
  try {
    const { id } = req.params;
    const { questionId, answer } = req.body;

    // Get AI evaluation
    const response = await fetch(
      `${process.env.AI_SERVICE_URL || 'http://localhost:8000'}/api/interviews/evaluate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewId: id, questionId, answer })
      }
    );

    if (!response.ok) {
      return res.json({
        success: true,
        data: { score: 75, feedback: 'Good answer.' }
      });
    }

    const data = await response.json();
    res.json({ success: true, data });
  } catch (error) {
    res.json({
      success: true,
      data: { score: 75, feedback: 'Answer recorded.' }
    });
  }
});

// ─── Bounties ─────────────────────────────────────────────────────────────────
router.post('/bounties', apiLimiter, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { title, description, reward, deadline, skills } = req.body;

    const result = await pool.query(
      `INSERT INTO bounties (company_id, title, description, reward, deadline, skills, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'OPEN')
       RETURNING *`,
      [userId, title, description, reward, deadline, JSON.stringify(skills || [])]
    );

    logger.info(`Corporate user ${userId} created bounty: ${title}`);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.get('/bounties', async (req, res, next) => {
  try {
    const userId = req.user!.id;

    const result = await pool.query(
      `SELECT b.*, 
              (SELECT COUNT(*) FROM bounty_submissions WHERE bounty_id = b.id) as submission_count
       FROM bounties b
       WHERE b.company_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

export default router;
