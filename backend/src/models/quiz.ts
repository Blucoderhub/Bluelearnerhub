import { pool } from '../utils/database';

export interface Quiz {
  id: number;
  title: string;
  description?: string;
  quiz_type: 'daily' | 'practice' | 'assessment' | 'ai_generated';
  domain: string;
  topic?: string;
  difficulty?: string;
  time_limit?: number;
  total_questions: number;
  passing_score?: number;
  points_per_question: number;
  shuffle_questions: boolean;
  shuffle_options: boolean;
  show_correct_answers: boolean;
  allow_review: boolean;
  is_active: boolean;
  scheduled_date?: Date;
  starts_at?: Date;
  ends_at?: Date;
  total_attempts: number;
  avg_score?: number;
  created_by?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Question {
  id: number;
  quiz_id: number;
  question_text: string;
  question_type: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
  explanation_links?: string[];
  difficulty: string;
  topic?: string;
  tags: string[];
  points: number;
  code_template?: string;
  test_cases?: any;
  expected_output?: string;
  ai_generated: boolean;
  generation_model?: string;
  times_used: number;
  times_correct: number;
  times_incorrect: number;
  created_at: Date;
}

export interface QuizAttempt {
  id: number;
  user_id: number;
  quiz_id: number;
  started_at: Date;
  completed_at?: Date;
  score: number;
  percentage: number;
  total_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  skipped_answers: number;
  time_taken?: number;
  user_answers: Record<number, string>;
  detailed_results?: any;
  accuracy_by_topic?: any;
  difficulty_breakdown?: any;
  time_per_question?: any;
  points_earned: number;
  created_at: Date;
}

export class QuizModel {
  static async create(data: Partial<Quiz>): Promise<Quiz> {
    const query = `
      INSERT INTO quizzes (
        title, description, quiz_type, domain, topic, difficulty,
        time_limit, total_questions, passing_score, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      data.title,
      data.description,
      data.quiz_type,
      data.domain,
      data.topic,
      data.difficulty,
      data.time_limit,
      data.total_questions,
      data.passing_score,
      data.created_by,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id: number, includeQuestions: boolean = false): Promise<any> {
    const quizResult = await pool.query('SELECT * FROM quizzes WHERE id = $1', [id]);
    
    if (quizResult.rows.length === 0) return null;

    const quiz = quizResult.rows[0];

    if (includeQuestions) {
      const questionsResult = await pool.query(
        'SELECT * FROM questions WHERE quiz_id = $1 ORDER BY id',
        [id]
      );
      quiz.questions = questionsResult.rows;
    }

    return quiz;
  }

  static async findAll(filters: any = {}, page: number = 1, limit: number = 10): Promise<any> {
    let whereClause = 'WHERE is_active = true';
    const values: any[] = [];
    let paramCount = 1;

    if (filters.quizType) {
      whereClause += ` AND quiz_type = $${paramCount}`;
      values.push(filters.quizType);
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

    const offset = (page - 1) * limit;

    const countQuery = `SELECT COUNT(*) FROM quizzes ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    const query = `
      SELECT * FROM quizzes ${whereClause}
      ORDER BY created_at DESC
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

  static async addQuestion(quizId: number, question: Partial<Question>): Promise<Question> {
    const query = `
      INSERT INTO questions (
        quiz_id, question_text, question_type, options, correct_answer,
        explanation, difficulty, topic, points, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      quizId,
      question.question_text,
      question.question_type || 'multiple_choice',
      JSON.stringify(question.options),
      question.correct_answer,
      question.explanation,
      question.difficulty,
      question.topic,
      question.points || 1,
      JSON.stringify(question.tags || []),
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getDailyQuiz(domain?: string): Promise<Quiz | null> {
    const today = new Date().toISOString().split('T')[0];
    
    let query = `
      SELECT * FROM quizzes 
      WHERE quiz_type = 'daily' 
        AND scheduled_date = $1 
        AND is_active = true
    `;
    
    const values: any[] = [today];

    if (domain) {
      query += ' AND domain = $2';
      values.push(domain);
    }

    query += ' LIMIT 1';

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }
}

export class QuizAttemptModel {
  static async create(data: Partial<QuizAttempt>): Promise<QuizAttempt> {
    const query = `
      INSERT INTO quiz_attempts (
        user_id, quiz_id, score, percentage, total_questions,
        correct_answers, incorrect_answers, skipped_answers,
        time_taken, user_answers, detailed_results, points_earned
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const values = [
      data.user_id,
      data.quiz_id,
      data.score,
      data.percentage,
      data.total_questions,
      data.correct_answers,
      data.incorrect_answers,
      data.skipped_answers || 0,
      data.time_taken,
      JSON.stringify(data.user_answers),
      JSON.stringify(data.detailed_results || {}),
      data.points_earned || 0,
    ];

    const result = await pool.query(query, values);
    
    // Update quiz statistics
    await pool.query(
      `UPDATE quizzes 
       SET total_attempts = total_attempts + 1,
           avg_score = (COALESCE(avg_score * total_attempts, 0) + $1) / (total_attempts + 1)
       WHERE id = $2`,
      [data.score, data.quiz_id]
    );

    return result.rows[0];
  }

  static async findByUser(userId: number, page: number = 1, limit: number = 10): Promise<any> {
    const offset = (page - 1) * limit;

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM quiz_attempts WHERE user_id = $1',
      [userId]
    );
    const total = parseInt(countResult.rows[0].count);

    const query = `
      SELECT qa.*, q.title as quiz_title, q.domain, q.difficulty
      FROM quiz_attempts qa
      JOIN quizzes q ON qa.quiz_id = q.id
      WHERE qa.user_id = $1
      ORDER BY qa.completed_at DESC
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

  static async getLeaderboard(
    type: 'daily' | 'weekly' | 'monthly' | 'all_time',
    limit: number = 10
  ): Promise<any[]> {
    const query = `
      SELECT 
        l.rank,
        u.id,
        u.full_name,
        u.profile_picture,
        l.total_score,
        l.total_points,
        l.quizzes_completed,
        l.avg_accuracy
      FROM leaderboards l
      JOIN users u ON l.user_id = u.id
      WHERE l.leaderboard_type = $1
      ORDER BY l.rank ASC
      LIMIT $2
    `;

    const result = await pool.query(query, [type, limit]);
    return result.rows;
  }
}
