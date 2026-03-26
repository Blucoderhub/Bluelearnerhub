import { HackathonModel, SubmissionModel } from '../models/hackathon';
import { UserModel } from '../models/user';
import { AppError } from '../middleware/error';
import axios from 'axios';
import { config } from '../config';
import logger from '../utils/logger';
import { pool } from '../utils/database';

interface HackathonFilters {
  domain?: string;
  status?: string;
  search?: string;
}

export class HackathonService {
  private static readonly MAX_SOURCE_CODE_SIZE = 50 * 1024; // 50KB

  async getHackathons(filters: HackathonFilters, page: number, limit: number, userId?: number) {
    const result = await HackathonModel.findAll(filters, page, limit);

    if (userId && result.data.length > 0) {
      const hackathonIds = result.data.map((h: { id: number }) => h.id);
      const registrations = await pool.query(
        'SELECT hackathon_id FROM hackathon_registrations WHERE user_id = $1 AND hackathon_id = ANY($2)',
        [userId, hackathonIds]
      );
      const registeredIds = new Set(registrations.rows.map((r: { hackathon_id: number }) => r.hackathon_id));
      result.data.forEach((h: { isRegistered?: boolean; id: number }) => {
        h.isRegistered = registeredIds.has(h.id);
      });
    }

    return result;
  }

  async getHackathonById(hackathonId: number, userId?: number) {
    const hackathon = await HackathonModel.findById(hackathonId);

    if (!hackathon) {
      throw new AppError('Hackathon not found', 404);
    }

    if (userId) {
      hackathon.isRegistered = await HackathonModel.isUserRegistered(hackathonId, userId);

      // Get user's submission if exists
      hackathon.userSubmission = await SubmissionModel.findByUser(userId, hackathonId);
    }

    return hackathon;
  }

  async registerForHackathon(hackathonId: number, userId: number, teamId?: number) {
    const hackathon = await HackathonModel.findById(hackathonId);

    if (!hackathon) {
      throw new AppError('Hackathon not found', 404);
    }

    // Check if registration is open
    const now = new Date();
    if (now < hackathon.registration_start) {
      throw new AppError('Registration has not started yet', 400);
    }

    if (now > hackathon.registration_end) {
      throw new AppError('Registration has ended', 400);
    }

    // Check if already registered
    const isRegistered = await HackathonModel.isUserRegistered(hackathonId, userId);
    if (isRegistered) {
      throw new AppError('Already registered for this hackathon', 400);
    }

    // Register user
    await HackathonModel.register(hackathonId, userId, teamId);

    logger.info(`User ${userId} registered for hackathon ${hackathonId}`);

    return { message: 'Successfully registered for hackathon' };
  }

  async createTeam(hackathonId: number, userId: number, teamName: string) {
    const hackathon = await HackathonModel.findById(hackathonId);

    if (!hackathon) {
      throw new AppError('Hackathon not found', 404);
    }

    // Generate unique team code
    const teamCode = `${hackathonId}-${Date.now().toString(36).toUpperCase()}`;

    // Create team
    const result = await pool.query(
      `INSERT INTO teams (hackathon_id, team_name, team_leader_id, team_code, max_members)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [hackathonId, teamName, userId, teamCode, hackathon.team_size_max]
    );

    const team = result.rows[0];

    // Add team leader as first member
    await pool.query(
      `INSERT INTO team_members (team_id, user_id, role)
       VALUES ($1, $2, 'leader')`,
      [team.id, userId]
    );

    logger.info(`Team created: ${team.id} for hackathon ${hackathonId}`);

    return team;
  }

  async joinTeam(hackathonId: number, userId: number, teamCode: string) {
    // Find team
    const teamResult = await pool.query(
      'SELECT * FROM teams WHERE hackathon_id = $1 AND team_code = $2 AND is_active = true',
      [hackathonId, teamCode]
    );

    if (teamResult.rows.length === 0) {
      throw new AppError('Team not found', 404);
    }

    const team = teamResult.rows[0];

    // Check if team is full
    const membersResult = await pool.query(
      'SELECT COUNT(*) FROM team_members WHERE team_id = $1',
      [team.id]
    );

    const memberCount = parseInt(membersResult.rows[0].count);

    if (memberCount >= team.max_members) {
      throw new AppError('Team is full', 400);
    }

    // Check if user is already in a team for this hackathon
    const existingTeamResult = await pool.query(
      `SELECT tm.* FROM team_members tm
       JOIN teams t ON tm.team_id = t.id
       WHERE t.hackathon_id = $1 AND tm.user_id = $2`,
      [hackathonId, userId]
    );

    if (existingTeamResult.rows.length > 0) {
      throw new AppError('Already in a team for this hackathon', 400);
    }

    // Add user to team
    await pool.query(
      `INSERT INTO team_members (team_id, user_id, role)
       VALUES ($1, $2, 'member')`,
      [team.id, userId]
    );

    logger.info(`User ${userId} joined team ${team.id}`);

    return { message: 'Successfully joined team', team };
  }

  async submitCode(
    hackathonId: number,
    userId: number,
    language: string,
    sourceCode: string,
    additionalFiles?: any
  ) {
    const hackathon = await HackathonModel.findById(hackathonId);

    if (!hackathon) {
      throw new AppError('Hackathon not found', 404);
    }

    // Check if hackathon is ongoing
    const now = new Date();
    if (now < hackathon.start_time) {
      throw new AppError('Hackathon has not started yet', 400);
    }

    if (now > hackathon.end_time) {
      throw new AppError('Hackathon has ended', 400);
    }

    // Check source code size limit
    if (sourceCode.length > HackathonService.MAX_SOURCE_CODE_SIZE) {
      throw new AppError(`Source code exceeds maximum size of ${Math.floor(HackathonService.MAX_SOURCE_CODE_SIZE / 1024)}KB`, 400);
    }

    // Check if user is registered
    const isRegistered = await HackathonModel.isUserRegistered(hackathonId, userId);
    if (!isRegistered) {
      throw new AppError('Not registered for this hackathon', 403);
    }

    // Get user's team (if any)
    const teamResult = await pool.query(
      `SELECT t.id FROM teams t
       JOIN team_members tm ON t.id = tm.team_id
       WHERE t.hackathon_id = $1 AND tm.user_id = $2`,
      [hackathonId, userId]
    );

    const teamId = teamResult.rows.length > 0 ? teamResult.rows[0].id : null;

    // Create submission
    const submission = await SubmissionModel.create({
      hackathon_id: hackathonId,
      user_id: userId,
      team_id: teamId,
      language,
      source_code: sourceCode,
      file_uploads: additionalFiles?.fileUploads || [],
      demo_video_url: additionalFiles?.demoVideoUrl,
      presentation_url: additionalFiles?.presentationUrl,
    });

    // Trigger AI evaluation asynchronously
    this.evaluateSubmission(submission.id).catch(err => {
      logger.error(`Failed to evaluate submission ${submission.id}:`, err);
    });

    logger.info(`Code submitted: Submission ${submission.id} for hackathon ${hackathonId}`);

    return submission;
  }

  async runCode(hackathonId: number, code: string, language: string, input?: string) {
    try {
      // Call Judge0 API to run code
      const response = await axios.post(
        `${config.judge0.apiUrl}/submissions`,
        {
          source_code: Buffer.from(code).toString('base64'),
          language_id: this.getLanguageId(language),
          stdin: input ? Buffer.from(input).toString('base64') : undefined,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': config.judge0.apiKey,
          },
        }
      );

      const token = response.data.token;

      // Poll for result
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

        const resultResponse = await axios.get(
          `${config.judge0.apiUrl}/submissions/${token}`,
          {
            headers: {
              'X-RapidAPI-Key': config.judge0.apiKey,
            },
          }
        );

        const result = resultResponse.data;

        if (result.status.id > 2) { // Processing complete
          return {
            status: result.status.description,
            output: result.stdout ? Buffer.from(result.stdout, 'base64').toString() : null,
            error: result.stderr ? Buffer.from(result.stderr, 'base64').toString() : null,
            executionTime: result.time,
            memory: result.memory,
          };
        }

        attempts++;
      }

      throw new Error('Code execution timed out');
    } catch (error) {
      logger.error('Code execution failed:', error);
      throw new AppError('Failed to execute code', 500);
    }
  }

  private getLanguageId(language: string): number {
    const languageMap: Record<string, number> = {
      python: 71,
      java: 62,
      cpp: 54,
      c: 50,
      javascript: 63,
      go: 60,
      rust: 73,
    };

    return languageMap[language.toLowerCase()] || 71; // Default to Python
  }

  async evaluateSubmission(submissionId: number) {
    try {
      const submission = await SubmissionModel.findById(submissionId);

      if (!submission) {
        throw new Error('Submission not found');
      }

      // Call AI service for evaluation
      const response = await axios.post(
        `${config.aiServiceUrl}/api/v1/hackathon/evaluate`,
        {
          submission_id: submissionId,
          code: submission.source_code,
          language: submission.language,
        }
      );

      const evaluation = response.data;

      // Update submission with evaluation results
      await SubmissionModel.updateEvaluation(submissionId, evaluation);

      logger.info(`Submission ${submissionId} evaluated successfully`);
    } catch (error) {
      logger.error(`Evaluation failed for submission ${submissionId}:`, error);
      throw error;
    }
  }

  async getPotentialMatches(hackathonId: number, userId: number) {
    // Get user's skills and domain
    const userResult = await pool.query(
      'SELECT domain, skills FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    const { domain, skills } = userResult.rows[0];

    // Find other registered users for this hackathon who are NOT in a team
    // and have complementary domains/skills
    const matchesResult = await pool.query(
      `SELECT u.id, u.full_name, u.domain, u.skills, u.bio
       FROM users u
       JOIN hackathon_registrations hr ON u.id = hr.user_id
       WHERE hr.hackathon_id = $1 
       AND u.id != $2
       AND hr.team_id IS NULL
       LIMIT 10`,
      [hackathonId, userId]
    );

    // Simple scoring logic based on domain complementarity
    return matchesResult.rows.map((match: any) => {
      let score = 50; // Base score

      // Complementary domain check
      if (domain === 'Computer Science' && (match.domain === 'Mechanical' || match.domain === 'Finance')) {
        score += 30;
      } else if (domain === 'Mechanical' && (match.domain === 'Electrical' || match.domain === 'Computer Science')) {
        score += 30;
      }

      // Skill overlap/complement check (placeholder logic)
      score += Math.min(20, (match.skills?.length || 0) * 5);

      return {
        ...match,
        matchScore: Math.min(98, score)
      };
    });
  }

  async getLeaderboard(hackathonId: number) {
    return await SubmissionModel.getLeaderboard(hackathonId);
  }

  async getUserSubmissions(hackathonId: number, userId: number) {
    return await SubmissionModel.findByUser(userId, hackathonId);
  }

  async transferTeamLeadership(hackathonId: number, currentLeaderId: number, newLeaderId: number) {
    // Find the team where current user is leader
    const teamResult = await pool.query(
      `SELECT t.* FROM teams t
       JOIN team_members tm ON t.id = tm.team_id
       WHERE t.hackathon_id = $1 AND tm.user_id = $2 AND tm.role = 'leader'`,
      [hackathonId, currentLeaderId]
    );

    if (teamResult.rows.length === 0) {
      throw new AppError('You are not a team leader in this hackathon', 403);
    }

    const team = teamResult.rows[0];

    // Check if new leader is a member of the team
    const memberResult = await pool.query(
      'SELECT * FROM team_members WHERE team_id = $1 AND user_id = $2',
      [team.id, newLeaderId]
    );

    if (memberResult.rows.length === 0) {
      throw new AppError('Target user is not a member of your team', 400);
    }

    // Update roles: demote current leader to member, promote new leader to leader
    await pool.query(
      'UPDATE team_members SET role = $1 WHERE team_id = $2 AND user_id = $3',
      ['member', team.id, currentLeaderId]
    );

    await pool.query(
      'UPDATE team_members SET role = $1 WHERE team_id = $2 AND user_id = $3',
      ['leader', team.id, newLeaderId]
    );

    logger.info(`Team leadership transferred: ${currentLeaderId} → ${newLeaderId} in team ${team.id}`);

    return { message: 'Team leadership transferred successfully' };
  }
}
