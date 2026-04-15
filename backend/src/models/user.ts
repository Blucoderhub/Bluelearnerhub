import { pool } from '../utils/database';
import { hashPassword } from '../utils/encryption';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  role?: 'STUDENT' | 'CORPORATE' | 'MENTOR' | 'ADMIN';
  profile_picture?: string;
  bio?: string;
  location?: string;
  education_level?: string;
  college_name?: string;
  graduation_year?: number;
  current_position?: string;
  company?: string;
  years_experience?: number;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  resume_url?: string;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  level: number;
  email_verified: boolean;
  is_active: boolean;
  is_banned: boolean;
  failed_login_attempts?: number;
  locked_until?: Date;
  last_login_at?: Date;
  avatar_config?: any;
  preferences: any;
  notification_settings: any;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  fullName: string;
  collegeName?: string;
  company?: string;
  avatarConfig?: any;
  role?: 'STUDENT' | 'CORPORATE' | 'MENTOR' | 'ADMIN';
}

export interface UpdateUserDTO {
  fullName?: string;
  bio?: string;
  location?: string;
  profilePicture?: string;
  educationLevel?: string;
  collegeName?: string;
  graduationYear?: number;
  currentPosition?: string;
  company?: string;
  yearsExperience?: number;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  avatarConfig?: any;
}

export class UserModel {
  static async create(data: CreateUserDTO): Promise<User> {
    const hashedPassword = await hashPassword(data.password);

    const query = `
      INSERT INTO users (
        email, password_hash, full_name, 
        college_name, company, avatar_config, role
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      data.email,
      hashedPassword,
      data.fullName,
      data.collegeName || null,
      data.company || null,
      JSON.stringify(data.avatarConfig || {}),
      data.role || 'STUDENT',
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id: number): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    return result.rows[0] || null;
  }

  static async update(id: number, data: UpdateUserDTO): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        // Convert camelCase to snake_case
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        fields.push(`${snakeKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE users 
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount! > 0;
  }

  static async updatePoints(id: number, points: number): Promise<void> {
    await pool.query(
      'UPDATE users SET total_points = total_points + $1 WHERE id = $2',
      [points, id]
    );
  }

  static async updateStreak(id: number, streak: number): Promise<void> {
    await pool.query(
      `UPDATE users 
       SET current_streak = $1,
           longest_streak = GREATEST(longest_streak, $1)
       WHERE id = $2`,
      [streak, id]
    );
  }

  static async getStats(id: number): Promise<any> {
    const query = `
      SELECT 
        u.total_points,
        u.current_streak,
        u.longest_streak,
        u.level,
        COUNT(DISTINCT lpe.learning_path_id) as enrolled_paths,
        COUNT(DISTINCT qa.id) as quizzes_taken,
        COALESCE(AVG(qa.percentage), 0) as avg_quiz_score,
        COUNT(DISTINCT hs.id) as hackathons_participated,
        COUNT(DISTINCT ja.id) as jobs_applied
      FROM users u
      LEFT JOIN learning_path_enrollments lpe ON u.id = lpe.user_id
      LEFT JOIN quiz_attempts qa ON u.id = qa.user_id
      LEFT JOIN hackathon_submissions hs ON u.id = hs.user_id
      LEFT JOIN job_applications ja ON u.id = ja.user_id
      WHERE u.id = $1
      GROUP BY u.id, u.total_points, u.current_streak, u.longest_streak, u.level
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async addSkill(userId: number, skillName: string, proficiencyLevel: number): Promise<void> {
    await pool.query(
      `INSERT INTO user_skills (user_id, skill_name, proficiency_level)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, skill_name) 
       DO UPDATE SET proficiency_level = $3`,
      [userId, skillName, proficiencyLevel]
    );
  }

  static async getSkills(userId: number): Promise<any[]> {
    const result = await pool.query(
      'SELECT * FROM user_skills WHERE user_id = $1 ORDER BY proficiency_level DESC',
      [userId]
    );
    return result.rows;
  }
}
