// User Types
export interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'student' | 'corporate' | 'college' | 'admin';
  profilePicture?: string;
  bio?: string;
  location?: string;
  educationLevel?: 'high_school' | 'bachelors' | 'masters' | 'phd';
  collegeName?: string;
  graduationYear?: number;
  currentPosition?: string;
  company?: string;
  yearsExperience?: number;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  skills?: UserSkill[];
  achievements?: Achievement[];
  createdAt: string;
  updatedAt: string;
}

export interface UserSkill {
  id: number;
  skillName: string;
  proficiencyLevel: number; // 1-5
  verified: boolean;
  verifiedThrough?: string;
}

export interface Achievement {
  id: number;
  achievementType: string;
  title: string;
  description: string;
  iconUrl?: string;
  earnedAt: string;
}

// Learning Types
export interface LearningPath {
  id: number;
  title: string;
  slug: string;
  domain: string;
  difficulty: string;
  description: string;
  thumbnailUrl?: string;
  estimatedDuration: number; // hours
  prerequisites: string[];
  learningOutcomes: string[];
  isPublished: boolean;
  courses: Course[];
  progress?: number; // percentage
}

export interface Course {
  id: number;
  learningPathId: number;
  title: string;
  slug: string;
  orderIndex: number;
  description: string;
  estimatedDuration: number; // minutes
  isPublished: boolean;
  lessons: Lesson[];
  progress?: number;
}

export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  slug: string;
  orderIndex: number;
  contentType: 'text' | 'video' | 'interactive' | 'code';
  contentMarkdown?: string;
  videoUrl?: string;
  codeExamples?: CodeExample[];
  hasQuiz: boolean;
  hasPractice: boolean;
  estimatedDuration: number;
  isFree: boolean;
  completed?: boolean;
  timeSpent?: number;
}

export interface CodeExample {
  language: string;
  code: string;
  title?: string;
}

// Quiz Types
export interface Quiz {
  id: number;
  title: string;
  description: string;
  quizType: 'daily' | 'practice' | 'assessment' | 'ai_generated';
  domain: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  timeLimit?: number; // seconds
  totalQuestions: number;
  passingScore?: number;
  isActive: boolean;
  scheduledDate?: string;
  questions?: Question[];
}

export interface Question {
  id: number;
  quizId: number;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false' | 'code';
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  topic: string;
  points: number;
  codeTemplate?: string;
  testCases?: any[];
  aiGenerated: boolean;
  tags: string[];
}

export interface QuizAttempt {
  id: number;
  userId: number;
  quizId: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken?: number;
  userAnswers: Record<number, string>;
  detailedResults: any;
  completedAt: string;
}

export interface Leaderboard {
  id: number;
  userId: number;
  user?: User;
  leaderboardType: 'daily' | 'weekly' | 'monthly' | 'all_time';
  periodStart: string;
  periodEnd: string;
  totalScore: number;
  rank: number;
  quizzesCompleted: number;
  avgAccuracy: number;
}

// Hackathon Types
export interface Hackathon {
  id: number;
  title: string;
  slug: string;
  description: string;
  frequency: 'weekly' | 'monthly' | 'special';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  hostedByType?: string;
  hostedById?: number;
  registrationStart: string;
  registrationEnd: string;
  startTime: string;
  endTime: string;
  domain: string;
  difficulty: string;
  maxParticipants?: number;
  teamSizeMin: number;
  teamSizeMax: number;
  problemStatement: string;
  problemFiles: string[];
  evaluationCriteria: Record<string, number>;
  testCases: any[];
  prizes: Prize[];
  certificates: boolean;
  logoUrl?: string;
  bannerUrl?: string;
  themeColor?: string;
  totalParticipants: number;
  totalSubmissions: number;
  isRegistered?: boolean;
  myTeam?: Team;
}

export interface Prize {
  rank: number;
  prize: string;
  description: string;
}

export interface HackathonSubmission {
  id: number;
  hackathonId: number;
  userId: number;
  teamId?: number;
  language: string;
  sourceCode: string;
  fileUploads: string[];
  demoVideoUrl?: string;
  presentationUrl?: string;
  testResults: any;
  executionTime?: number;
  memoryUsed?: number;
  correctnessScore?: number;
  efficiencyScore?: number;
  codeQualityScore?: number;
  bestPracticesScore?: number;
  innovationScore?: number;
  plagiarismDetected: boolean;
  plagiarismConfidence?: number;
  similarSubmissions?: any[];
  finalScore?: number;
  rank?: number;
  submittedAt: string;
  evaluationCompletedAt?: string;
  evaluationDetails?: any;
}

export interface Team {
  id: number;
  hackathonId: number;
  teamName: string;
  teamLeaderId: number;
  teamCode: string;
  maxMembers: number;
  members: TeamMember[];
  createdAt: string;
}

export interface TeamMember {
  id: number;
  teamId: number;
  userId: number;
  user?: User;
  role: 'leader' | 'member';
  joinedAt: string;
}

// Job & Interview Types
export interface Job {
  id: number;
  companyId: number;
  company?: User;
  title: string;
  department?: string;
  location: string;
  jobType: 'full_time' | 'part_time' | 'contract' | 'internship';
  experienceRequired: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  hiringViaHackathon: boolean;
  minHackathonRank?: number;
  autoScreening: boolean;
  isActive: boolean;
  positionsAvailable: number;
  applicationsReceived: number;
  postedAt: string;
  expiresAt?: string;
}

export interface JobApplication {
  id: number;
  jobId: number;
  job?: Job;
  userId: number;
  user?: User;
  resumeUrl: string;
  coverLetter?: string;
  resumeText?: string;
  extractedSkills: string[];
  experienceYears?: number;
  educationLevel?: string;
  resumeMatchScore?: number;
  skillMatchPercentage?: number;
  experienceMatchScore?: number;
  bestHackathonRank?: number;
  avgHackathonScore?: number;
  totalHackathons?: number;
  status: string;
  interviewScheduledAt?: string;
  interviewCompletedAt?: string;
  appliedAt: string;
  updatedAt: string;
}

export interface InterviewSession {
  id: number;
  applicationId: number;
  application?: JobApplication;
  jobId: number;
  candidateId: number;
  candidate?: User;
  interviewerId?: number;
  interviewer?: User;
  sessionType: 'technical' | 'hr' | 'managerial';
  scheduledAt: string;
  durationMinutes: number;
  meetingLink?: string;
  questions: InterviewQuestion[];
  responses?: InterviewResponse[];
  technicalScore?: number;
  communicationScore?: number;
  problemSolvingScore?: number;
  overallScore?: number;
  interviewerNotes?: string;
  interviewerRating?: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

export interface InterviewQuestion {
  questionId: number;
  question: string;
  category: string;
  difficulty: string;
  expectedAnswer?: string;
}

export interface InterviewResponse {
  questionId: number;
  answer: string;
  timeTaken: number;
  evaluation?: any;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
