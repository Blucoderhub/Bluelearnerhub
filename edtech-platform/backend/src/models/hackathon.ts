import { pool } from '@/utils/database';

export interface Hackathon {
  id: number;
  title: string;
  slug: string;
  description?: string;
  frequency: 'weekly' | 'monthly' | 'special';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  hosted_by_type?: string;
  hosted_by_id?: number;
  registration_start: Date;
  registration_end: Date;
  start_time: Date;
  end_time: Date;
  domain?: string;
  difficulty?: string;
  tags: string[];
  max_participants?: number;
  team_size_min: number;
  team_size_max: number;
  allow_solo: boolean;
  problem_statement: string;
  problem_files: string[];
  input_format?: string;
  output_format?: string;
  constraints?: string;
  sample_input?: string;
  sample_output?: string;
  evaluation_criteria: any;
  test_cases?: any;
  prizes: any[];
  total_prize_pool?: number;
  certificates: boolean;
  logo_url?: string;
  banner_url?: string;
  theme_color?: string;
  allowed_languages: string[];
  enable_cad_submission: boolean;
  enable_video_demo: boolean;
  enable_presentation: boolean;
  total_registrations: number;
  total_participants: number;
  total_submissions: number;
  total_teams: number;
  is_public: boolean;
  is_featured: boolean;
  created_at: Date;
  updated_at: Date;
  // dynamic properties used by service/controllers
  isRegistered?: boolean;
  userSubmission?: any;
}

export interface HackathonSubmission {
  id: number;
  hackathon_id: number;
  user_id: number;
  team_id?: number;
  language: string;
  source_code: string;
  file_uploads: string[];
  demo_video_url?: string;
  presentation_url?: string;
  documentation_url?: string;
  repository_url?: string;
  test_results?: any;
  execution_time?: number;
  memory_used?: number;
  passed_test_cases: number;
  total_test_cases: number;
  correctness_score?: number;
  efficiency_score?: number;
  code_quality_score?: number;
  best_practices_score?: number;
  innovation_score?: number;
  plagiarism_detected: boolean;
  plagiarism_confidence?: number;
  similar_submissions?: any;
  plagiarism_report?: string;
  final_score?: number;
  rank?: number;
  prize_won?: string;
  ai_feedback?: any;
  judge_feedback?: string;
  submission_status: string;
  submitted_at: Date;
  evaluation_started_at?: Date;
  evaluation_completed_at?: Date;
  evaluation_details?: any;
}

export class HackathonModel {
  static async create(data: Partial<Hackathon>): Promise<Hackathon> {
    const query = `
      INSERT INTO hackathons (
        title, slug, description, frequency, hosted_by_type, hosted_by_id,
        registration_start, registration_end, start_time, end_time,
        domain, difficulty, problem_statement, evaluation_criteria,
        team_size_min, team_size_max, prizes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `;

    const values = [
      data.title,
      data.slug,
      data.description,
      data.frequency,
      data.hosted_by_type,
      data.hosted_by_id,
      data.registration_start,
      data.registration_end,
      data.start_time,
      data.end_time,
      data.domain,
      data.difficulty,
      data.problem_statement,
      JSON.stringify(data.evaluation_criteria),
      data.team_size_min || 1,
      data.team_size_max || 4,
      JSON.stringify(data.prizes || []),
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id: number): Promise<Hackathon | null> {
    const result = await pool.query('SELECT * FROM hackathons WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findAll(filters: any = {}, page: number = 1, limit: number = 10): Promise<any> {
    let whereClause = 'WHERE is_public = true';
    const values: any[] = [];
    let paramCount = 1;

    if (filters.status) {
      whereClause += ` AND status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.domain) {
      whereClause += ` AND domain = $${paramCount}`;
      values.push(filters.domain);
      paramCount++;
    }

    if (filters.difficulty) {
      whereClause += ` AND difficulty = $${paramCount}`;
      values.push(filters.difficulty);
      paramCount++;
    }

    if (filters.featured) {
      whereClause += ` AND is_featured = true`;
    }

    const offset = (page - 1) * limit;

    const countQuery = `SELECT COUNT(*) FROM hackathons ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    const query = `
      SELECT * FROM hackathons ${whereClause}
      ORDER BY 
        CASE 
          WHEN status = 'ongoing' THEN 1
          WHEN status = 'upcoming' THEN 2
          ELSE 3
        END,
        start_time DESC
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

  static async register(hackathonId: number, userId: number, teamId?: number): Promise<void> {
    await pool.query(
      `INSERT INTO hackathon_registrations (hackathon_id, user_id, team_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (hackathon_id, user_id) DO NOTHING`,
      [hackathonId, userId, teamId || null]
    );

    await pool.query(
      'UPDATE hackathons SET total_registrations = total_registrations + 1 WHERE id = $1',
      [hackathonId]
    );
  }

  static async isUserRegistered(hackathonId: number, userId: number): Promise<boolean> {
    const result = await pool.query(
      `SELECT 1 FROM hackathon_registrations 
       WHERE hackathon_id = $1 AND user_id = $2 AND registration_status = 'registered'`,
      [hackathonId, userId]
    );
    return result.rows.length > 0;
  }

  static async updateStatus(id: number, status: string): Promise<void> {
    await pool.query('UPDATE hackathons SET status = $1 WHERE id = $2', [status, id]);
  }
}

export class SubmissionModel {
  static async create(data: Partial<HackathonSubmission>): Promise<HackathonSubmission> {
    const query = `
      INSERT INTO hackathon_submissions (
        hackathon_id, user_id, team_id, language, source_code,
        file_uploads, demo_video_url, presentation_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      data.hackathon_id,
      data.user_id,
      data.team_id,
      data.language,
      data.source_code,
      JSON.stringify(data.file_uploads || []),
      data.demo_video_url,
      data.presentation_url,
    ];

    const result = await pool.query(query, values);

    // Update hackathon stats
    await pool.query(
      'UPDATE hackathons SET total_submissions = total_submissions + 1 WHERE id = $1',
      [data.hackathon_id]
    );

    return result.rows[0];
  }

  static async findById(id: number): Promise<HackathonSubmission | null> {
    const result = await pool.query('SELECT * FROM hackathon_submissions WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByHackathon(hackathonId: number): Promise<HackathonSubmission[]> {
    const result = await pool.query(
      'SELECT * FROM hackathon_submissions WHERE hackathon_id = $1 ORDER BY submitted_at DESC',
      [hackathonId]
    );
    return result.rows;
  }

  static async findByUser(userId: number, hackathonId: number): Promise<HackathonSubmission | null> {
    const result = await pool.query(
      'SELECT * FROM hackathon_submissions WHERE user_id = $1 AND hackathon_id = $2',
      [userId, hackathonId]
    );
    return result.rows[0] || null;
  }

  static async updateEvaluation(id: number, evaluation: any): Promise<void> {
    const query = `
      UPDATE hackathon_submissions
      SET 
        correctness_score = $1,
        efficiency_score = $2,
        code_quality_score = $3,
        best_practices_score = $4,
        innovation_score = $5,
        final_score = $6,
        evaluation_details = $7,
        submission_status = 'evaluated',
        evaluation_completed_at = NOW()
      WHERE id = $8
    `;

    const values = [
      evaluation.correctness_score,
      evaluation.efficiency_score,
      evaluation.code_quality_score,
      evaluation.best_practices_score,
      evaluation.innovation_score,
      evaluation.final_score,
      JSON.stringify(evaluation.details),
      id,
    ];

    await pool.query(query, values);
  }

  static async getLeaderboard(hackathonId: number): Promise<any[]> {
    const query = `
      SELECT 
        hs.*,
        u.full_name,
        u.profile_picture,
        t.team_name
      FROM hackathon_submissions hs
      JOIN users u ON hs.user_id = u.id
      LEFT JOIN teams t ON hs.team_id = t.id
      WHERE hs.hackathon_id = $1 
        AND hs.submission_status = 'evaluated'
        AND hs.final_score IS NOT NULL
      ORDER BY hs.final_score DESC, hs.submitted_at ASC
    `;

    const result = await pool.query(query, [hackathonId]);

    // Assign ranks
    return result.rows.map((row: any, index: number) => ({
      ...row,
      rank: index + 1,
    }));
  }
}
