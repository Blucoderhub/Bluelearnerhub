import { pgTable, serial, text, varchar, timestamp, integer, boolean, pgEnum, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleEnum = pgEnum('role', [
    'ADMIN',
    'CORPORATE',
    'HR',
    'STUDENT',
    'CANDIDATE',
    'FACULTY',
    'INSTITUTION'
]);

export const domainEnum = pgEnum('domain', [
    'ENGINEERING',
    'MANAGEMENT'
]);

export const labTypeEnum = pgEnum('lab_type', [
    'SOFTWARE',
    'MECHANICAL',
    'ELECTRICAL',
    'CIVIL',
    'BUSINESS'
]);

export const subscriptionTierEnum = pgEnum('subscription_tier', [
    'FREE',
    'EXPLORER',
    'INNOVATOR',
    'ENTERPRISE'
]);

// Tables
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    password: text('password'),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    role: roleEnum('role').default('STUDENT').notNull(),
    xp: integer('xp').default(0).notNull(),
    level: integer('level').default(1).notNull(),
    streak: integer('streak').default(0).notNull(),
    avatarConfig: jsonb('avatar_config'),
    lastActive: timestamp('last_active').defaultNow().notNull(),
    failedLoginAttempts: integer('failed_login_attempts').default(0),
    lockedUntil: timestamp('locked_until'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
    lastActiveIdx: index('idx_users_last_active').on(t.lastActive),
}));

export const domains = pgTable('domains', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    type: domainEnum('type').notNull(),
    description: text('description'),
});

export const specializations = pgTable('specializations', {
    id: serial('id').primaryKey(),
    domainId: integer('domain_id').references(() => domains.id).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
});

export const courses = pgTable('courses', {
    id: serial('id').primaryKey(),
    specializationId: integer('specialization_id').references(() => specializations.id).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    instructorId: integer('instructor_id').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const modules = pgTable('modules', {
    id: serial('id').primaryKey(),
    courseId: integer('course_id').references(() => courses.id).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content'),
    order: integer('order').notNull(),
});

export const labs = pgTable('labs', {
    id: serial('id').primaryKey(),
    moduleId: integer('module_id').references(() => modules.id).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    type: labTypeEnum('type').notNull(),
    config: text('config'), // JSON configuration for the lab
});

export const quizzes = pgTable('quizzes', {
    id: serial('id').primaryKey(),
    moduleId: integer('module_id').references(() => modules.id).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    difficulty: integer('difficulty').default(1).notNull(),
});

export const questions = pgTable('questions', {
    id: serial('id').primaryKey(),
    quizId: integer('quiz_id').references(() => quizzes.id).notNull(),
    type: varchar('type', { length: 50 }).notNull(), // MCQ, Numerical, Case, Code
    content: text('content').notNull(),
    options: text('options'), // JSON string for options
    correctAnswer: text('correct_answer').notNull(),
});

export const hackathons = pgTable('hackathons', {
    id: serial('id').primaryKey(),
    orgId: integer('org_id').references(() => users.id).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),
    status: varchar('status', { length: 50 }).default('UPCOMING').notNull(),
});

export const submissions = pgTable('submissions', {
    id: serial('id').primaryKey(),
    hackathonId: integer('hackathon_id').references(() => hackathons.id).notNull(),
    userId: integer('user_id').references(() => users.id).notNull(),
    contentUrl: text('content_url').notNull(),
    type: varchar('type', { length: 50 }).notNull(), // Code, PDF, Video
    score: integer('score'),
    feedback: text('feedback'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const achievements = pgTable('achievements', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    xpReward: integer('xp_reward').default(0).notNull(),
    badgeUrl: text('badge_url'),
});

export const userAchievements = pgTable('user_achievements', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    achievementId: integer('achievement_id').references(() => achievements.id).notNull(),
    earnedAt: timestamp('earned_at').defaultNow().notNull(),
});

export const userSubscriptions = pgTable('user_subscriptions', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }).unique(),
    stripeCustomerId: varchar('stripe_customer_id', { length: 255 }).unique(),
    tier: subscriptionTierEnum('tier').default('FREE').notNull(),
    status: varchar('status', { length: 50 }).notNull(), // active, trialing, past_due, canceled
    currentPeriodEnd: timestamp('current_period_end'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userCredits = pgTable('user_credits', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    aiTokensBalance: integer('ai_tokens_balance').default(100).notNull(), // Monthly allocation based on tier
    bonusCredits: integer('bonus_credits').default(0).notNull(), // Earned via gamification
    lastReset: timestamp('last_reset').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
    userAchievements: many(userAchievements),
    submissions: many(submissions),
    subscription: one(userSubscriptions, {
        fields: [users.id],
        references: [userSubscriptions.userId],
    }),
    credits: one(userCredits, {
        fields: [users.id],
        references: [userCredits.userId],
    }),
}));

export const hackathonsRelations = relations(hackathons, ({ many }) => ({
    submissions: many(submissions),
}));
