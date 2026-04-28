import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  fullName: string;
  passwordHash: string;
  role: 'STUDENT' | 'MENTOR' | 'ADMIN' | 'CORPORATE';
  domain?: string;
  level?: number;
  isActive: boolean;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  lastActiveAt?: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true },
  fullName: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['STUDENT', 'MENTOR', 'ADMIN', 'CORPORATE'], default: 'STUDENT' },
  domain: { type: String },
  level: { type: Number },
  isActive: { type: Boolean, default: true },
  avatarUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date },
  lastActiveAt: { type: Date },
});

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);

// User Achievements
export interface IUserAchievement extends Document {
  userId: mongoose.Types.ObjectId;
  achievementId: string;
  title: string;
  description: string;
  earnedAt: Date;
}

const UserAchievementSchema = new Schema<IUserAchievement>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  achievementId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  earnedAt: { type: Date, default: Date.now },
});

UserAchievementSchema.index({ userId: 1 });

export const UserAchievement = mongoose.model<IUserAchievement>('UserAchievement', UserAchievementSchema);

// User Progress (for courses/lessons)
export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: Date;
}

const UserProgressSchema = new Schema<IUserProgress>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: String, required: true },
  lessonId: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
});

UserProgressSchema.index({ userId: 1, courseId: 1, lessonId: 1 }, { unique: true });

export const UserProgress = mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);

// User Credits (AI credits system)
export interface IUserCredits extends Document {
  userId: mongoose.Types.ObjectId;
  aiTokensBalance: number;
  bonusCredits: number;
  updatedAt: Date;
}

const UserCreditsSchema = new Schema<IUserCredits>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  aiTokensBalance: { type: Number, default: 50 },
  bonusCredits: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

export const UserCredits = mongoose.model<IUserCredits>('UserCredits', UserCreditsSchema);

// User Subscriptions
export interface IUserSubscription extends Document {
  userId: mongoose.Types.ObjectId;
  tier: 'EXPLORER' | 'INNOVATOR' | 'ENTERPRISE';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  expiresAt?: Date;
  createdAt: Date;
}

const UserSubscriptionSchema = new Schema<IUserSubscription>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  tier: { type: String, enum: ['EXPLORER', 'INNOVATOR', 'ENTERPRISE'], default: 'EXPLORER' },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export const UserSubscription = mongoose.model<IUserSubscription>('UserSubscription', UserSubscriptionSchema);

// Hackathons
export interface IHackathon extends Document {
  name: string;
  description: string;
  theme: string;
  startDate: Date;
  endDate: Date;
  status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED';
  maxParticipants: number;
  prizePool?: string;
  imageUrl?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const HackathonSchema = new Schema<IHackathon>({
  name: { type: String, required: true },
  description: { type: String },
  theme: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'ACTIVE', 'COMPLETED'], default: 'DRAFT' },
  maxParticipants: { type: Number, default: 100 },
  prizePool: { type: String },
  imageUrl: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

HackathonSchema.index({ status: 1 });
HackathonSchema.index({ startDate: 1, endDate: 1 });

export const Hackathon = mongoose.model<IHackathon>('Hackathon', HackathonSchema);

// Hackathon Teams
export interface IHackathonTeam extends Document {
  hackathonId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  leaderId: mongoose.Types.ObjectId;
  memberIds: mongoose.Types.ObjectId[];
  repoUrl?: string;
  demoUrl?: string;
  submissionLink?: string;
  createdAt: Date;
}

const HackathonTeamSchema = new Schema<IHackathonTeam>({
  hackathonId: { type: Schema.Types.ObjectId, ref: 'Hackathon', required: true },
  name: { type: String, required: true },
  description: { type: String },
  leaderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  memberIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  repoUrl: { type: String },
  demoUrl: { type: String },
  submissionLink: { type: String },
  createdAt: { type: Date, default: Date.now },
});

HackathonTeamSchema.index({ hackathonId: 1 });

export const HackathonTeam = mongoose.model<IHackathonTeam>('HackathonTeam', HackathonTeamSchema);

// Hackathon Submissions
export interface IHackathonSubmission extends Document {
  hackathonId: mongoose.Types.ObjectId;
  teamId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  repoUrl: string;
  demoUrl?: string;
  score?: number;
  submittedBy: mongoose.Types.ObjectId;
  submittedAt: Date;
}

const HackathonSubmissionSchema = new Schema<IHackathonSubmission>({
  hackathonId: { type: Schema.Types.ObjectId, ref: 'Hackathon', required: true },
  teamId: { type: Schema.Types.ObjectId, ref: 'HackathonTeam', required: true },
  title: { type: String, required: true },
  description: { type: String },
  repoUrl: { type: String, required: true },
  demoUrl: { type: String },
  score: { type: Number },
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  submittedAt: { type: Date, default: Date.now },
});

HackathonSubmissionSchema.index({ hackathonId: 1, teamId: 1 }, { unique: true });

export const HackathonSubmission = mongoose.model<IHackathonSubmission>('HackathonSubmission', HackathonSubmissionSchema);

// Quizzes
export interface IQuiz extends Document {
  title: string;
  description: string;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
  }>;
  timeLimit?: number;
  category?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const QuizSchema = new Schema<IQuiz>({
  title: { type: String, required: true },
  description: { type: String },
  questions: [{
    id: { type: String, required: true },
    question: { type: String, required: true },
    options: [{ type: String }],
    correctIndex: { type: Number, required: true },
  }],
  timeLimit: { type: Number },
  category: { type: String },
  difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'] },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

export const Quiz = mongoose.model<IQuiz>('Quiz', QuizSchema);

// Quiz Attempts
export interface IQuizAttempt extends Document {
  quizId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  score: number;
  totalQuestions: number;
  answers: Array<{ questionId: string; selectedIndex: number; correct: boolean }>;
  startedAt: Date;
  completedAt?: Date;
}

const QuizAttemptSchema = new Schema<IQuizAttempt>({
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, default: 0 },
  totalQuestions: { type: Number, required: true },
  answers: [{
    questionId: { type: String },
    selectedIndex: { type: Number },
    correct: { type: Boolean },
  }],
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

QuizAttemptSchema.index({ quizId: 1, userId: 1 });

export const QuizAttempt = mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);

// Tutorials/Courses
export interface ITutorial extends Document {
  title: string;
  description: string;
  category: string;
  path: string;
  lessons: Array<{
    id: string;
    title: string;
    content: string;
    order: number;
  }>;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  isPublished: boolean;
  imageUrl?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TutorialSchema = new Schema<ITutorial>({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  path: { type: String, required: true },
  lessons: [{
    id: { type: String },
    title: { type: String },
    content: { type: String },
    order: { type: Number },
  }],
  difficulty: { type: String, enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], default: 'BEGINNER' },
  isPublished: { type: Boolean, default: false },
  imageUrl: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

TutorialSchema.index({ path: 1 }, { unique: true });
TutorialSchema.index({ category: 1, isPublished: 1 });

export const Tutorial = mongoose.model<ITutorial>('Tutorial', TutorialSchema);

// Exercises/Challenges
export interface IExercise extends Document {
  title: string;
  description: string;
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  starterCode?: string;
  solution?: string;
  testCases?: Array<{ input: string; expected: string }>;
  tags: string[];
  spaceId?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ExerciseSchema = new Schema<IExercise>({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'], default: 'EASY' },
  starterCode: { type: String },
  solution: { type: String },
  testCases: [{
    input: { type: String },
    expected: { type: String },
  }],
  tags: [{ type: String }],
  spaceId: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

ExerciseSchema.index({ category: 1, difficulty: 1 });

export const Exercise = mongoose.model<IExercise>('Exercise', ExerciseSchema);

// Exercise Submissions
export interface IExerciseSubmission extends Document {
  exerciseId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  code: string;
  language: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  output?: string;
  submittedAt: Date;
}

const ExerciseSubmissionSchema = new Schema<IExerciseSubmission>({
  exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  code: { type: String, required: true },
  language: { type: String, default: 'javascript' },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], default: 'PENDING' },
  output: { type: String },
  submittedAt: { type: Date, default: Date.now },
});

ExerciseSubmissionSchema.index({ exerciseId: 1, userId: 1 });

export const ExerciseSubmission = mongoose.model<IExerciseSubmission>('ExerciseSubmission', ExerciseSubmissionSchema);

// Daily Challenges
export interface IDailyChallenge extends Document {
  date: Date;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  starterCode?: string;
  solution?: string;
  participants: number;
  createdAt: Date;
}

const DailyChallengeSchema = new Schema<IDailyChallenge>({
  date: { type: Date, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'] },
  starterCode: { type: String },
  solution: { type: String },
  participants: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const DailyChallenge = mongoose.model<IDailyChallenge>('DailyChallenge', DailyChallengeSchema);

// Spaces (challenge categories)
export interface ISpace extends Document {
  name: string;
  category: string;
  description?: string;
  icon?: string;
  isActive: boolean;
}

const SpaceSchema = new Schema<ISpace>({
  name: { type: String, required: true },
  category: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String },
  isActive: { type: Boolean, default: true },
});

SpaceSchema.index({ isActive: 1 });

export const Space = mongoose.model<ISpace>('Space', SpaceSchema);

// Notebooks
export interface INotebook extends Document {
  title: string;
  content: string;
  language: string;
  isPublic: boolean;
  userId: mongoose.Types.ObjectId;
  forkCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const NotebookSchema = new Schema<INotebook>({
  title: { type: String, required: true },
  content: { type: String, default: '' },
  language: { type: String, default: 'python' },
  isPublic: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  forkCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

NotebookSchema.index({ userId: 1 });
NotebookSchema.index({ isPublic: 1 });

export const Notebook = mongoose.model<INotebook>('Notebook', NotebookSchema);

// Jobs/Careers
export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT';
  description: string;
  requirements: string[];
  applyUrl?: string;
  salary?: string;
  isActive: boolean;
  postedBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const JobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  type: { type: String, enum: ['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT'] },
  description: { type: String },
  requirements: [{ type: String }],
  applyUrl: { type: String },
  salary: { type: String },
  isActive: { type: Boolean, default: true },
  postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

JobSchema.index({ isActive: 1, type: 1 });

export const Job = mongoose.model<IJob>('Job', JobSchema);

// Job Applications
export interface IJobApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  resumeUrl?: string;
  coverLetter?: string;
  status: 'PENDING' | 'REVIEWING' | 'INTERVIEWED' | 'REJECTED' | 'OFFERED';
  appliedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  resumeUrl: { type: String },
  coverLetter: { type: String },
  status: { type: String, enum: ['PENDING', 'REVIEWING', 'INTERVIEWED', 'REJECTED', 'OFFERED'], default: 'PENDING' },
  appliedAt: { type: Date, default: Date.now },
});

JobApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

export const JobApplication = mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);

// Mentors & Batches
export interface IMentorProfile extends Document {
  userId: mongoose.Types.ObjectId;
  expertise: string[];
  experience: number;
  bio?: string;
  hourlyRate?: number;
  isAvailable: boolean;
}

const MentorProfileSchema = new Schema<IMentorProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  expertise: [{ type: String }],
  experience: { type: Number, default: 0 },
  bio: { type: String },
  hourlyRate: { type: Number },
  isAvailable: { type: Boolean, default: true },
});

export const MentorProfile = mongoose.model<IMentorProfile>('MentorProfile', MentorProfileSchema);

export interface IMentorBatch extends Document {
  name: string;
  description?: string;
  mentorId: mongoose.Types.ObjectId;
  studentIds: mongoose.Types.ObjectId[];
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
}

const MentorBatchSchema = new Schema<IMentorBatch>({
  name: { type: String, required: true },
  description: { type: String },
  mentorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  studentIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

MentorBatchSchema.index({ mentorId: 1, isActive: 1 });

export const MentorBatch = mongoose.model<IMentorBatch>('MentorBatch', MentorBatchSchema);

// Certificates
export interface ICertificate extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  type: 'COURSE' | 'HACKATHON' | 'MENTORSHIP' | 'ACHIEVEMENT';
  issuedAt: Date;
  expiresAt?: Date;
  verificationCode: string;
}

const CertificateSchema = new Schema<ICertificate>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['COURSE', 'HACKATHON', 'MENTORSHIP', 'ACHIEVEMENT'], required: true },
  issuedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  verificationCode: { type: String, required: true, unique: true },
});

CertificateSchema.index({ userId: 1 });

export const Certificate = mongoose.model<ICertificate>('Certificate', CertificateSchema);

// Q&A
export interface IQnA extends Document {
  question: string;
  answer?: string;
  category: string;
  tags: string[];
  authorId: mongoose.Types.ObjectId;
  answeredBy?: mongoose.Types.ObjectId;
  upvotes: number;
  views: number;
  createdAt: Date;
}

const QnASchema = new Schema<IQnA>({
  question: { type: String, required: true },
  answer: { type: String },
  category: { type: String, required: true },
  tags: [{ type: String }],
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  answeredBy: { type: Schema.Types.ObjectId, ref: 'User' },
  upvotes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

QnASchema.index({ category: 1 });
QnASchema.index({ tags: 1 });

export const QnA = mongoose.model<IQnA>('QnA', QnASchema);

// Organizations
export interface IOrganization extends Document {
  name: string;
  type: 'UNIVERSITY' | 'COMPANY';
  description?: string;
  website?: string;
  logoUrl?: string;
  adminIds: mongoose.Types.ObjectId[];
  talentPool: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>({
  name: { type: String, required: true },
  type: { type: String, enum: ['UNIVERSITY', 'COMPANY'], required: true },
  description: { type: String },
  website: { type: String },
  logoUrl: { type: String },
  adminIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  talentPool: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

OrganizationSchema.index({ type: 1 });

export const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);

// Leads (newsletter)
export interface ILead extends Document {
  email: string;
  source: string;
  createdAt: Date;
}

const LeadSchema = new Schema<ILead>({
  email: { type: String, required: true, lowercase: true },
  source: { type: String, default: 'homepage_newsletter' },
  createdAt: { type: Date, default: Date.now },
});

LeadSchema.index({ email: 1 }, { unique: true });

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);

// Products (e-commerce/catalog)
export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  images: string[];
  features: string[];
  isActive: boolean;
  isFeatured: boolean;
  stock?: number;
  sku?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number },
  category: { type: String, required: true },
  images: [{ type: String }],
  features: [{ type: String }],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  stock: { type: Number, default: 0 },
  sku: { type: String },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ProductSchema.index({ name: 1, category: 1 });
ProductSchema.index({ isActive: 1, isFeatured: 1 });
ProductSchema.index({ tags: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);