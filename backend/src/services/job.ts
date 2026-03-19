import { pool } from '../utils/database';
import { AppError } from '../middleware/error';
import axios from 'axios';
import { config } from '../config';
import logger from '../utils/logger';

export class JobService {
  async getJobs(filters: any, page: number, limit: number) {
    let whereClause = 'WHERE is_active = true';
    const values: any[] = [];
    let paramCount = 1;

    if (filters.jobType) {
      whereClause += ` AND job_type = $${paramCount}`;
      values.push(filters.jobType);
      paramCount++;
    }

    if (filters.location) {
      whereClause += ` AND location ILIKE $${paramCount}`;
      values.push(`%${filters.location}%`);
      paramCount++;
    }

    if (filters.companyId) {
      whereClause += ` AND company_id = $${paramCount}`;
      values.push(filters.companyId);
      paramCount++;
    }

    const offset = (page - 1) * limit;

    const countQuery = `SELECT COUNT(*) FROM job_postings ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    const query = `
      SELECT jp.*, u.full_name as company_name, u.profile_picture as company_logo
      FROM job_postings jp
      JOIN users u ON jp.company_id = u.id
      ${whereClause}
      ORDER BY posted_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    values.push(limit, offset);
    const result = await pool.query(query, values);

    return {
      data: result.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getJobById(jobId: number, userId?: number) {
    const result = await pool.query(
      `SELECT jp.*, u.full_name as company_name, u.profile_picture as company_logo
       FROM job_postings jp
       JOIN users u ON jp.company_id = u.id
       WHERE jp.id = $1`,
      [jobId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Job not found', 404);
    }

    const job = result.rows[0];

    // Check if user has already applied
    if (userId) {
      const applicationResult = await pool.query(
        'SELECT * FROM job_applications WHERE job_id = $1 AND user_id = $2',
        [jobId, userId]
      );

      job.hasApplied = applicationResult.rows.length > 0;
      job.application = applicationResult.rows[0] || null;
    }

    return job;
  }

  async createJob(companyId: number, data: any) {
    const query = `
      INSERT INTO job_postings (
        company_id, title, department, location, job_type, work_mode,
        experience_required, description, responsibilities, requirements,
        required_skills, preferred_skills, salary_min, salary_max,
        currency, benefits, hiring_via_hackathon, auto_screening
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *
    `;

    const values = [
      companyId,
      data.title,
      data.department,
      data.location,
      data.jobType,
      data.workMode || 'onsite',
      data.experienceRequired,
      data.description,
      JSON.stringify(data.responsibilities || []),
      JSON.stringify(data.requirements || []),
      JSON.stringify(data.requiredSkills || []),
      JSON.stringify(data.preferredSkills || []),
      data.salaryMin,
      data.salaryMax,
      data.currency || 'INR',
      JSON.stringify(data.benefits || []),
      data.hiringViaHackathon || false,
      data.autoScreening !== false,
    ];

    const result = await pool.query(query, values);

    logger.info(`Job posted: ${result.rows[0].id} by company ${companyId}`);

    return result.rows[0];
  }

  async applyForJob(jobId: number, userId: number, resumeUrl: string, coverLetter?: string) {
    // Check if job exists and is active
    const jobResult = await pool.query(
      'SELECT * FROM job_postings WHERE id = $1 AND is_active = true',
      [jobId]
    );

    if (jobResult.rows.length === 0) {
      throw new AppError('Job not found or inactive', 404);
    }

    const job = jobResult.rows[0];

    // Check if already applied
    const existingApplication = await pool.query(
      'SELECT * FROM job_applications WHERE job_id = $1 AND user_id = $2',
      [jobId, userId]
    );

    if (existingApplication.rows.length > 0) {
      throw new AppError('Already applied for this job', 400);
    }

    // Get user profile data
    const userResult = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );

    const user = userResult.rows[0];

    // Create application
    const query = `
      INSERT INTO job_applications (
        job_id, user_id, resume_url, cover_letter,
        experience_years, education_level
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      jobId,
      userId,
      resumeUrl,
      coverLetter,
      user.years_experience || 0,
      user.education_level,
    ];

    const result = await pool.query(query, values);
    const application = result.rows[0];

    // Update job applications count
    await pool.query(
      'UPDATE job_postings SET applications_received = applications_received + 1 WHERE id = $1',
      [jobId]
    );

    // Trigger AI screening if enabled
    if (job.auto_screening) {
      this.screenApplication(application.id).catch(err => {
        logger.error(`Failed to screen application ${application.id}:`, err);
      });
    }

    logger.info(`Job application submitted: ${application.id} for job ${jobId}`);

    return application;
  }

  async screenApplication(applicationId: number) {
    try {
      const result = await pool.query(
        `SELECT ja.*, jp.description, jp.required_skills, jp.preferred_skills, jp.requirements
         FROM job_applications ja
         JOIN job_postings jp ON ja.job_id = jp.id
         WHERE ja.id = $1`,
        [applicationId]
      );

      if (result.rows.length === 0) {
        throw new Error('Application not found');
      }

      const application = result.rows[0];

      // Call AI service for resume screening
      const response = await axios.post(
        `${config.aiServiceUrl}/api/v1/interview/screen-resume`,
        {
          application_id: applicationId,
          resume_url: application.resume_url,
          job_description: application.description,
          required_skills: application.required_skills,
        }
      );

      const screening = response.data;

      // Update application with screening results
      await pool.query(
        `UPDATE job_applications
         SET 
           resume_match_score = $1,
           skill_match_percentage = $2,
           extracted_skills = $3,
           status = CASE 
             WHEN $1 >= 70 THEN 'screening'::application_status
             ELSE 'rejected'::application_status
           END
         WHERE id = $4`,
        [
          screening.match_score,
          screening.skill_match_percentage,
          JSON.stringify(screening.extracted_skills),
          applicationId,
        ]
      );

      logger.info(`Application ${applicationId} screened: Score ${screening.match_score}`);
    } catch (error) {
      logger.error(`Screening failed for application ${applicationId}:`, error);
      throw error;
    }
  }

  async getUserApplications(userId: number, page: number, limit: number) {
    const offset = (page - 1) * limit;

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM job_applications WHERE user_id = $1',
      [userId]
    );
    const total = parseInt(countResult.rows[0].count);

    const query = `
      SELECT ja.*, jp.title as job_title, jp.location, jp.job_type,
             u.full_name as company_name
      FROM job_applications ja
      JOIN job_postings jp ON ja.job_id = jp.id
      JOIN users u ON jp.company_id = u.id
      WHERE ja.user_id = $1
      ORDER BY ja.applied_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [userId, limit, offset]);

    return {
      data: result.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCandidates(jobId: number, companyId: number, filters: any) {
    // Verify company owns this job
    const jobResult = await pool.query(
      'SELECT * FROM job_postings WHERE id = $1 AND company_id = $2',
      [jobId, companyId]
    );

    if (jobResult.rows.length === 0) {
      throw new AppError('Job not found or unauthorized', 404);
    }

    let whereClause = 'WHERE ja.job_id = $1';
    const values: any[] = [jobId];
    let paramCount = 2;

    if (filters.status) {
      whereClause += ` AND ja.status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.minScore) {
      whereClause += ` AND ja.resume_match_score >= $${paramCount}`;
      values.push(filters.minScore);
      paramCount++;
    }

    const query = `
      SELECT ja.*, u.full_name, u.email, u.profile_picture, u.years_experience
      FROM job_applications ja
      JOIN users u ON ja.user_id = u.id
      ${whereClause}
      ORDER BY ja.resume_match_score DESC NULLS LAST, ja.applied_at DESC
    `;

    const result = await pool.query(query, values);

    return result.rows;
  }

  async rankCandidates(jobId: number, companyId: number) {
    try {
      // Verify company owns this job
      const jobResult = await pool.query(
        'SELECT * FROM job_postings WHERE id = $1 AND company_id = $2',
        [jobId, companyId]
      );

      if (jobResult.rows.length === 0) {
        throw new AppError('Job not found or unauthorized', 404);
      }

      // Call AI service for candidate ranking
      const response = await axios.post(
        `${config.aiServiceUrl}/api/v1/interview/rank-candidates`,
        {
          job_id: jobId,
        }
      );

      const rankings = response.data.rankings;

      // Update candidate_rankings table
      for (const ranking of rankings) {
        await pool.query(
          `INSERT INTO candidate_rankings (
            job_id, candidate_id, resume_score, hackathon_performance_score,
            quiz_performance_score, interview_score, comprehensive_score,
            hire_probability, rank, recommendation, strengths, weaknesses
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (job_id, candidate_id)
          DO UPDATE SET
            comprehensive_score = $7,
            hire_probability = $8,
            rank = $9,
            recommendation = $10,
            calculated_at = NOW()`
          ,
          [
            jobId,
            ranking.candidate_id,
            ranking.resume_score,
            ranking.hackathon_performance_score,
            ranking.quiz_performance_score,
            ranking.interview_score,
            ranking.comprehensive_score,
            ranking.hire_probability,
            ranking.rank,
            ranking.recommendation,
            JSON.stringify(ranking.strengths),
            JSON.stringify(ranking.weaknesses),
          ]
        );
      }

      logger.info(`Candidates ranked for job ${jobId}`);

      return rankings;
    } catch (error) {
      logger.error(`Candidate ranking failed for job ${jobId}:`, error);
      throw new AppError('Failed to rank candidates', 500);
    }
  }
}
