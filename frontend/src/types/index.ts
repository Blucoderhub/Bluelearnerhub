// Core type definitions

export interface UserStats {
  total_points?: number
  current_streak?: number
  longest_streak?: number
  level?: number
  enrolled_paths?: number
  quizzes_taken?: number
  avg_quiz_score?: number
  hackathons_participated?: number
  jobs_applied?: number
}

export interface UserSkill {
  skill_name: string
  proficiency_level: number
}

export interface User {
  id: string
  email: string
  name: string
  fullName?: string
  role: 'student' | 'candidate' | 'corporate' | 'hr' | 'admin'
  avatar?: string
  profilePicture?: string
  level?: number
  totalPoints?: number
  currentStreak?: number
  longestStreak?: number
  avatarConfig?: any
  bio?: string
  location?: string
  stats?: UserStats
  skills?: UserSkill[]
  createdAt: Date
}

export interface Tutorial {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  language: string
  duration: number
  progress?: number
}

export interface Hackathon {
  id: string
  title: string
  description: string
  organizer: string
  startDate: Date
  endDate: Date
  status: 'upcoming' | 'active' | 'completed'
  participants: number
  prizes: string[]
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  salary?: string
  postedAt: Date
}

export interface Quiz {
  id: string
  title: string
  questions: Question[]
  timeLimit?: number
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  explanation?: string
}
