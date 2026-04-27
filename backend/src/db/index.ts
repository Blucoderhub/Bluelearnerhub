import mongoose from 'mongoose';
import { config } from '../config';
import logger from '../utils/logger';

// Connection state
let isConnected = false;

// MongoDB connection
export async function connectDatabase(): Promise<typeof mongoose> {
  if (isConnected) return mongoose;

  const mongoUri = config.database.url;
  if (!mongoUri) {
    throw new Error('MONGODB_URL is not configured.');
  }

  try {
    await mongoose.connect(mongoUri, {
      maxPoolSize: 50,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    logger.info('✅ MongoDB connected');
    return mongoose;
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    throw error;
  }
}

export async function closeDatabase(): Promise<void> {
  await mongoose.connection.close();
  isConnected = false;
}

export function getConnectionStatus() {
  return { isConnected, readyState: mongoose.connection.readyState };
}

// Import all models
import { 
  User, IUser,
  UserAchievement, IUserAchievement,
  UserProgress, IUserProgress,
  UserCredits, IUserCredits,
  UserSubscription, IUserSubscription,
  Hackathon, IHackathon,
  HackathonTeam, IHackathonTeam,
  HackathonSubmission, IHackathonSubmission,
  Quiz, IQuiz,
  QuizAttempt, IQuizAttempt,
  Tutorial, ITutorial,
  Exercise, IExercise,
  ExerciseSubmission, IExerciseSubmission,
  DailyChallenge, IDailyChallenge,
  Space, ISpace,
  Notebook, INotebook,
  Job, IJob,
  JobApplication, IJobApplication,
  MentorProfile, IMentorProfile,
  MentorBatch, IMentorBatch,
  Certificate, ICertificate,
  QnA, IQnA,
  Organization, IOrganization,
  Lead, ILead
} from './models';

// Re-export models for external use
export { User, Hackathon, Quiz, Tutorial, Exercise, Job, Notebook, Space } from './models';

type QueryRow = any;
type QueryRows = any[];

class QueryBuilder<T = QueryRows> implements PromiseLike<T> {
  protected result: T;

  constructor(result: T) {
    this.result = result;
  }

  protected resolve(): Promise<T> {
    return Promise.resolve(this.result);
  }

  from(_table: any) { return this; }
  leftJoin(_table: any, _on?: any) { return this; }
  innerJoin(_table: any, _on?: any) { return this; }
  where(_condition?: any) { return this; }
  orderBy(..._order: any[]) { return this; }
  limit(_limit: number) { return this; }
  offset(_offset: number) { return this; }
  $dynamic() { return this; }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.resolve().then(onfulfilled ?? undefined, onrejected ?? undefined);
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
  ): Promise<T | TResult> {
    return this.resolve().catch(onrejected ?? undefined);
  }
}

class MutationBuilder extends QueryBuilder<QueryRows> {
  constructor() {
    super([]);
  }

  values(values: any) {
    this.result = Array.isArray(values) ? values : [values];
    return this;
  }

  set(values: any) {
    this.result = [values];
    return this;
  }

  where(_condition?: any) { return this; }
  onConflictDoUpdate(_config?: any) { return this; }
  onConflictDoNothing() { return this; }
  returning(_selection?: any) { return this.resolve(); }
}

// Query builder mimicking Drizzle ORM
export const db = {
  query: {
    users: {
      findMany: async (filter: any = {}) => User.find(filter).lean(),
      findFirst: async (filter: any) => User.findOne(filter).lean(),
      findById: async (id: any) => User.findById(id).lean(),
      create: async (data: any) => User.create(data),
      update: async (filter: any, data: any) => User.findOneAndUpdate(filter, data, { new: true }).lean(),
      updateById: async (id: any, data: any) => User.findByIdAndUpdate(id, data, { new: true }).lean(),
      delete: async (filter: any) => User.findOneAndDelete(filter),
      count: async (filter: any = {}) => User.countDocuments(filter),
    },
    userAchievements: {
      findMany: async (filter: any = {}) => UserAchievement.find(filter).lean(),
      findFirst: async (filter: any) => UserAchievement.findOne(filter).lean(),
      create: async (data: any) => UserAchievement.create(data),
    },
    userProgress: {
      findMany: async (filter: any = {}) => UserProgress.find(filter).lean(),
      findFirst: async (filter: any) => UserProgress.findOne(filter).lean(),
      create: async (data: any) => UserProgress.create(data),
      update: async (filter: any, data: any) => UserProgress.findOneAndUpdate(filter, data, { new: true }).lean(),
    },
    userCredits: {
      findFirst: async (filter: any) => UserCredits.findOne(filter).lean(),
      create: async (data: any) => UserCredits.create(data),
      update: async (filter: any, data: any) => UserCredits.findOneAndUpdate(filter, data, { new: true }).lean(),
    },
    userSubscriptions: {
      findFirst: async (filter: any) => UserSubscription.findOne(filter).lean(),
      create: async (data: any) => UserSubscription.create(data),
      update: async (filter: any, data: any) => UserSubscription.findOneAndUpdate(filter, data, { new: true }).lean(),
    },
    hackathons: {
      findMany: async (filter: any = {}) => Hackathon.find(filter).lean(),
      findFirst: async (filter: any) => Hackathon.findOne(filter).lean(),
      findById: async (id: any) => Hackathon.findById(id).lean(),
      create: async (data: any) => Hackathon.create(data),
      update: async (filter: any, data: any) => Hackathon.findOneAndUpdate(filter, data, { new: true }).lean(),
      updateById: async (id: any, data: any) => Hackathon.findByIdAndUpdate(id, data, { new: true }).lean(),
      delete: async (filter: any) => Hackathon.findOneAndDelete(filter),
      count: async (filter: any = {}) => Hackathon.countDocuments(filter),
    },
    hackathonTeams: {
      findMany: async (filter: any = {}) => HackathonTeam.find(filter).lean(),
      findFirst: async (filter: any) => HackathonTeam.findOne(filter).lean(),
      create: async (data: any) => HackathonTeam.create(data),
      update: async (filter: any, data: any) => HackathonTeam.findOneAndUpdate(filter, data, { new: true }).lean(),
    },
    hackathonSubmissions: {
      findMany: async (filter: any = {}) => HackathonSubmission.find(filter).lean(),
      findFirst: async (filter: any) => HackathonSubmission.findOne(filter).lean(),
      create: async (data: any) => HackathonSubmission.create(data),
      update: async (filter: any, data: any) => HackathonSubmission.findOneAndUpdate(filter, data, { new: true }).lean(),
    },
    quizzes: {
      findMany: async (filter: any = {}) => Quiz.find(filter).lean(),
      findFirst: async (filter: any) => Quiz.findOne(filter).lean(),
      findById: async (id: any) => Quiz.findById(id).lean(),
      create: async (data: any) => Quiz.create(data),
      update: async (filter: any, data: any) => Quiz.findOneAndUpdate(filter, data, { new: true }).lean(),
      delete: async (filter: any) => Hackathon.findOneAndDelete(filter),
    },
    quizAttempts: {
      findMany: async (filter: any = {}) => QuizAttempt.find(filter).lean(),
      findFirst: async (filter: any) => QuizAttempt.findOne(filter).lean(),
      create: async (data: any) => QuizAttempt.create(data),
      update: async (filter: any, data: any) => QuizAttempt.findOneAndUpdate(filter, data, { new: true }).lean(),
    },
    tutorials: {
      findMany: async (filter: any = {}) => Tutorial.find(filter).lean(),
      findFirst: async (filter: any) => Tutorial.findOne(filter).lean(),
      findById: async (id: any) => Tutorial.findById(id).lean(),
      create: async (data: any) => Tutorial.create(data),
      update: async (filter: any, data: any) => Tutorial.findOneAndUpdate(filter, data, { new: true }).lean(),
    },
    exercises: {
      findMany: async (filter: any = {}) => Exercise.find(filter).lean(),
      findFirst: async (filter: any) => Exercise.findOne(filter).lean(),
      findById: async (id: any) => Exercise.findById(id).lean(),
      create: async (data: any) => Exercise.create(data),
      update: async (filter: any, data: any) => Exercise.findOneAndUpdate(filter, data, { new: true }).lean(),
    },
    exerciseSubmissions: {
      findMany: async (filter: any = {}) => ExerciseSubmission.find(filter).lean(),
      findFirst: async (filter: any) => ExerciseSubmission.findOne(filter).lean(),
      create: async (data: any) => ExerciseSubmission.create(data),
    },
    dailyChallenges: {
      findMany: async (filter: any = {}) => DailyChallenge.find(filter).lean(),
      findFirst: async (filter: any) => DailyChallenge.findOne(filter).lean(),
      create: async (data: any) => DailyChallenge.create(data),
    },
    spaces: {
      findMany: async (filter: any = {}) => Space.find(filter).lean(),
      findFirst: async (filter: any) => Space.findOne(filter).lean(),
      create: async (data: any) => Space.create(data),
    },
    notebooks: {
      findMany: async (filter: any = {}) => Notebook.find(filter).lean(),
      findFirst: async (filter: any) => Notebook.findOne(filter).lean(),
      findById: async (id: any) => Notebook.findById(id).lean(),
      create: async (data: any) => Notebook.create(data),
      update: async (filter: any, data: any) => Notebook.findOneAndUpdate(filter, data, { new: true }).lean(),
    },
    jobs: {
      findMany: async (filter: any = {}) => Job.find(filter).lean(),
      findFirst: async (filter: any) => Job.findOne(filter).lean(),
      findById: async (id: any) => Job.findById(id).lean(),
      create: async (data: any) => Job.create(data),
      update: async (filter: any, data: any) => Job.findOneAndUpdate(filter, data, { new: true }).lean(),
    },
    jobApplications: {
      findMany: async (filter: any = {}) => JobApplication.find(filter).lean(),
      findFirst: async (filter: any) => JobApplication.findOne(filter).lean(),
      create: async (data: any) => JobApplication.create(data),
      update: async (filter: any, data: any) => JobApplication.findOneAndUpdate(filter, data, { new: true }).lean(),
    },
    mentorProfiles: {
      findMany: async (filter: any = {}) => MentorProfile.find(filter).lean(),
      findFirst: async (filter: any) => MentorProfile.findOne(filter).lean(),
      create: async (data: any) => MentorProfile.create(data),
    },
    mentorBatches: {
      findMany: async (filter: any = {}) => MentorBatch.find(filter).lean(),
      findFirst: async (filter: any) => MentorBatch.findOne(filter).lean(),
      create: async (data: any) => MentorBatch.create(data),
      update: async (filter: any, data: any) => MentorBatch.findOneAndUpdate(filter, data, { new: true }).lean(),
    },
    certificates: {
      findMany: async (filter: any = {}) => Certificate.find(filter).lean(),
      findFirst: async (filter: any) => Certificate.findOne(filter).lean(),
      create: async (data: any) => Certificate.create(data),
    },
    qna: {
      findMany: async (filter: any = {}) => QnA.find(filter).lean(),
      findFirst: async (filter: any) => QnA.findOne(filter).lean(),
      create: async (data: any) => QnA.create(data),
      update: async (filter: any, data: any) => QnA.findOneAndUpdate(filter, data, { new: true }).lean(),
    },
    organizations: {
      findMany: async (filter: any = {}) => Organization.find(filter).lean(),
      findFirst: async (filter: any) => Organization.findOne(filter).lean(),
      create: async (data: any) => Organization.create(data),
      update: async (filter: any, data: any) => Organization.findOneAndUpdate(filter, data, { new: true }).lean(),
    },
    leads: {
      findMany: async (filter: any = {}) => Lead.find(filter).lean(),
      findFirst: async (filter: any) => Lead.findOne(filter).lean(),
      create: async (data: any) => Lead.create(data),
    },
  },

  // SQL helpers for compatibility
  select: (_selection?: any) => new QueryBuilder<QueryRows>([]),
  insert: (_table: any) => new MutationBuilder(),
  update: (_table: any) => new MutationBuilder(),
  delete: (_table: any) => new MutationBuilder(),
  execute: async (_query: any): Promise<QueryRows> => [],
  transaction: async <T>(callback: (tx: any) => Promise<T> | T): Promise<T> => Promise.resolve(callback(db as any)),
};

// Helper operators for Drizzle compatibility
export const eq = (a: any, b: any) => a === b;
export const ne = (a: any, b: any) => a !== b;
export const gte = (a: any, b: any) => a >= b;
export const lte = (a: any, b: any) => a <= b;
export const gt = (a: any, b: any) => a > b;
export const lt = (a: any, b: any) => a < b;
export const and = (...conds: any[]) => conds.every(Boolean);
export const or = (...conds: any[]) => conds.some(Boolean);
export const like = (a: string, b: string) => new RegExp(b.replace(/%/g, '.*'), 'i').test(String(a));
export const inArray = (a: any, b: any[]) => b.includes(a);
export const desc = (field: string) => { const o: any = {}; o[field] = -1; return o; };
export const asc = (field: string) => { const o: any = {}; o[field] = 1; return o; };
export const sql = (strings: any, ...args: any[]) => strings;

// Schema exports (for compatibility)
export const users = User;
export const hackathons = Hackathon;
export const spaces = Space;
export const quizzes = Quiz;
export const tutorials = Tutorial;
export const exercises = Exercise;
export const notebooks = Notebook;
export const jobs = Job;

export default db;
