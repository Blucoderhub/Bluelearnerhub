// Core type definitions

export interface User {
  id: string
  email: string
  name: string
  fullName?: string  // Optional: full display name
  role: 'student' | 'candidate' | 'corporate' | 'hr' | 'admin'
  avatar?: string
  profilePicture?: string  // Optional: profile picture URL
  level?: number  // User level/tier
  totalPoints?: number  // Total XP/points earned
  currentStreak?: number  // Current learning streak in days
  avatarConfig?: any
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
