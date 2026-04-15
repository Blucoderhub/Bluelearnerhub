import { pgTable, serial, text, varchar, timestamp, integer, boolean, pgEnum, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', [
    'STUDENT',
    'CORPORATE',
    'MENTOR',
    'ADMIN'
]);

export const challengeTypeEnum = pgEnum('challenge_type', [
    'QUIZ',
    'CODING'
]);

export const challengeDifficultyEnum = pgEnum('challenge_difficulty', [
    'EASY',
    'MEDIUM',
    'HARD'
]);

export const submissionStatusEnum = pgEnum('submission_status', [
    'PENDING',
    'RUNNING',
    'PASSED',
    'FAILED',
    'ERROR'
]);

export const sessionStatusEnum = pgEnum('session_status', [
    'SCHEDULED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
]);

export const submissionReviewStatusEnum = pgEnum('submission_review_status', [
    'PENDING',
    'GRADED'
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
    password_hash: text('password_hash'),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    role: userRoleEnum('role').default('STUDENT').notNull(),
    xp: integer('xp').default(0).notNull(),
    level: integer('level').default(1).notNull(),
    current_streak: integer('current_streak').default(0).notNull(),
    longest_streak: integer('longest_streak').default(0).notNull(),
    total_points: integer('total_points').default(0).notNull(),
    avatar_config: jsonb('avatar_config'),
    last_active: timestamp('last_active').defaultNow().notNull(),
    last_login_at: timestamp('last_login_at').defaultNow().notNull(),
    failed_login_attempts: integer('failed_login_attempts').default(0),
    locked_until: timestamp('locked_until'),
    is_active: boolean('is_active').default(true).notNull(),
    is_banned: boolean('is_banned').default(false).notNull(),
    profile_picture: text('profile_picture'),
    bio: text('bio'),
    location: varchar('location', { length: 255 }),
    education_level: varchar('education_level', { length: 100 }),
    college_name: varchar('college_name', { length: 255 }),
    graduation_year: integer('graduation_year'),
    current_position: varchar('current_position', { length: 255 }),
    company: varchar('company', { length: 255 }),
    years_experience: integer('years_experience'),
    linkedin_url: text('linkedin_url'),
    github_url: text('github_url'),
    portfolio_url: text('portfolio_url'),
    resume_url: text('resume_url'),
    email_verified: boolean('email_verified').default(false).notNull(),
    preferences: jsonb('preferences').default('{}').notNull(),
    notification_settings: jsonb('notification_settings').default('{}').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
    lastActiveIdx: index('idx_users_last_active').on(t.last_active),
    isActiveIdx: index('idx_users_is_active').on(t.is_active),
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
    slug: varchar('slug', { length: 255 }).unique(),
    description: text('description'),
    frequency: varchar('frequency', { length: 50 }).default('special'),
    status: varchar('status', { length: 50 }).default('UPCOMING').notNull(),
    hosted_by_type: varchar('hosted_by_type', { length: 50 }),
    registration_start: timestamp('registration_start').defaultNow().notNull(),
    registration_end: timestamp('registration_end').defaultNow().notNull(),
    start_time: timestamp('start_time').notNull(),
    end_time: timestamp('end_time').notNull(),
    domain: varchar('domain', { length: 100 }).default('GENERAL'),
    difficulty: varchar('difficulty', { length: 50 }),
    problem_statement: text('problem_statement'),
    rules: text('rules'),
    team_size_min: integer('team_size_min').default(1),
    team_size_max: integer('team_size_max').default(4),
    allow_solo: boolean('allow_solo').default(true),
    prizes: jsonb('prizes').default('[]'),
    total_prize_pool: varchar('total_prize_pool', { length: 255 }),
    certificates: boolean('certificates').default(true),
    max_participants: integer('max_participants'),
    registration_fee: integer('registration_fee').default(0),
    tags: jsonb('tags').default('[]'),
    allowed_languages: jsonb('allowed_languages').default('["javascript", "python", "java"]'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
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

// Hackathon Registrations
export const hackathonRegistrations = pgTable('hackathon_registrations', {
    id: serial('id').primaryKey(),
    hackathonId: integer('hackathon_id').references(() => hackathons.id).notNull(),
    userId: integer('user_id').references(() => users.id).notNull(),
    teamId: integer('team_id'),
    registrationStatus: varchar('registration_status', { length: 50 }).default('registered').notNull(),
    registeredAt: timestamp('registered_at').defaultNow().notNull(),
    paymentStatus: varchar('payment_status', { length: 50 }).default('pending').notNull(),
    paymentId: varchar('payment_id', { length: 255 }),
});

// Teams
export const teams = pgTable('teams', {
    id: serial('id').primaryKey(),
    hackathonId: integer('hackathon_id').references(() => hackathons.id).notNull(),
    teamName: varchar('team_name', { length: 255 }).notNull(),
    teamLeaderId: integer('team_leader_id').references(() => users.id).notNull(),
    teamCode: varchar('team_code', { length: 50 }).unique().notNull(),
    maxMembers: integer('max_members').default(4).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Team Members
export const teamMembers = pgTable('team_members', {
    id: serial('id').primaryKey(),
    teamId: integer('team_id').references(() => teams.id).notNull(),
    userId: integer('user_id').references(() => users.id).notNull(),
    role: varchar('role', { length: 50 }).default('member').notNull(), // 'leader' or 'member'
    joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

// Hackathon Submissions
export const hackathonSubmissions = pgTable('hackathon_submissions', {
    id: serial('id').primaryKey(),
    hackathonId: integer('hackathon_id').references(() => hackathons.id).notNull(),
    userId: integer('user_id').references(() => users.id).notNull(),
    teamId: integer('team_id').references(() => teams.id),
    language: varchar('language', { length: 50 }),
    sourceCode: text('source_code'),
    fileUploads: jsonb('file_uploads').default('[]').notNull(),
    demoVideoUrl: text('demo_video_url'),
    presentationUrl: text('presentation_url'),
    finalScore: integer('final_score'),
    rank: integer('rank'),
    submissionStatus: varchar('submission_status', { length: 50 }).default('pending').notNull(),
    submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});

// Refresh Tokens
export const refreshTokens = pgTable('refresh_tokens', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    token: text('token').unique().notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    revoked: boolean('revoked').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User Skills
export const userSkills = pgTable('user_skills', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    skillName: varchar('skill_name', { length: 100 }).notNull(),
    proficiencyLevel: integer('proficiency_level').default(1).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
    uniqueSkill: index('idx_user_skills_unique').on(t.userId, t.skillName),
}));

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
    userAchievements: many(userAchievements),
    submissions: many(submissions),
    hackathonSubmissions: many(hackathonSubmissions),
    registrations: many(hackathonRegistrations),
    teams: many(teams),
    teamMemberships: many(teamMembers),
    subscription: one(userSubscriptions, {
        fields: [users.id],
        references: [userSubscriptions.userId],
    }),
    credits: one(userCredits, {
        fields: [users.id],
        references: [userCredits.userId],
    }),
    skills: many(userSkills),
}));

export const hackathonsRelations = relations(hackathons, ({ many }) => ({
    submissions: many(submissions),
    hackathonSubmissions: many(hackathonSubmissions),
    registrations: many(hackathonRegistrations),
    teams: many(teams),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
    hackathon: one(hackathons, {
        fields: [teams.hackathonId],
        references: [hackathons.id],
    }),
    leader: one(users, {
        fields: [teams.teamLeaderId],
        references: [users.id],
    }),
    members: many(teamMembers),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
    team: one(teams, {
        fields: [teamMembers.teamId],
        references: [teams.id],
    }),
    user: one(users, {
        fields: [teamMembers.userId],
        references: [users.id],
    }),
}));

// ═══════════════════════════════════════════════════════════════════════════════
// SPACES - Coding Challenges & Quizzes
// ═══════════════════════════════════════════════════════════════════════════════

export const spaces = pgTable('spaces', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    category: varchar('category', { length: 100 }).notNull(), // python, javascript, dsa, etc.
    difficulty: challengeDifficultyEnum('difficulty').default('MEDIUM').notNull(),
    xpReward: integer('xp_reward').default(50).notNull(),
    timeLimit: integer('time_limit'), // minutes, null = no limit
    isActive: boolean('is_active').default(true).notNull(),
    createdBy: integer('created_by').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
    categoryIdx: index('idx_spaces_category').on(t.category),
    difficultyIdx: index('idx_spaces_difficulty').on(t.difficulty),
}));

export const challenges = pgTable('challenges', {
    id: serial('id').primaryKey(),
    spaceId: integer('space_id').references(() => spaces.id).notNull(),
    type: challengeTypeEnum('type').default('CODING').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    starterCode: jsonb('starter_code').default('{}').notNull(), // {python: "...", javascript: "..."}
    testCases: jsonb('test_cases').default('[]').notNull(), // [{input, expected}]
    hints: jsonb('hints').default('[]').notNull(),
    constraints: jsonb('constraints').default('[]').notNull(),
    examples: jsonb('examples').default('[]').notNull(),
    solution: text('solution'),
    difficulty: challengeDifficultyEnum('difficulty').default('MEDIUM').notNull(),
    xpReward: integer('xp_reward').default(50).notNull(),
    acceptanceRate: integer('acceptance_rate').default(0), // percentage
    totalSolves: integer('total_solves').default(0),
    tags: jsonb('tags').default('[]').notNull(),
    isPublished: boolean('is_published').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
    spaceIdx: index('idx_challenges_space').on(t.spaceId),
    difficultyIdx: index('idx_challenges_difficulty').on(t.difficulty),
}));

export const challengeSubmissions = pgTable('challenge_submissions', {
    id: serial('id').primaryKey(),
    challengeId: integer('challenge_id').references(() => challenges.id).notNull(),
    userId: integer('user_id').references(() => users.id).notNull(),
    language: varchar('language', { length: 50 }).notNull(),
    sourceCode: text('source_code').notNull(),
    status: submissionStatusEnum('status').default('PENDING').notNull(),
    passedTests: integer('passed_tests').default(0),
    totalTests: integer('total_tests').default(0),
    executionTime: integer('execution_time'), // ms
    errorMessage: text('error_message'),
    output: text('output'),
    xpEarned: integer('xp_earned').default(0),
    submittedAt: timestamp('submitted_at').defaultNow().notNull(),
}, (t) => ({
    challengeIdx: index('idx_submissions_challenge').on(t.challengeId),
    userIdx: index('idx_submissions_user').on(t.userId),
}));

export const dailyChallenges = pgTable('daily_challenges', {
    id: serial('id').primaryKey(),
    challengeId: integer('challenge_id').references(() => challenges.id).notNull(),
    date: varchar('date', { length: 10 }).notNull(), // YYYY-MM-DD
    domain: varchar('domain', { length: 100 }).notNull(),
    isCompleted: boolean('is_completed').default(false).notNull(),
    completedByUserId: integer('completed_by_user_id').references(() => users.id),
    completedAt: timestamp('completed_at'),
}, (t) => ({
    dateIdx: index('idx_daily_date').on(t.date),
    uniqueDate: index('idx_daily_unique').on(t.date, t.domain),
}));

// ═══════════════════════════════════════════════════════════════════════════════
// MENTOR - Batch Tracking & Sessions
// ═══════════════════════════════════════════════════════════════════════════════

export const mentorProfiles = pgTable('mentor_profiles', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull().unique(),
    specialization: varchar('specialization', { length: 255 }),
    bio: text('bio'),
    rating: integer('rating').default(0), // 0-5 scale
    totalSessions: integer('total_sessions').default(0),
    totalStudents: integer('total_students').default(0),
    availability: jsonb('availability').default('[]').notNull(), // [{day, startTime, endTime}]
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const mentorBatches = pgTable('mentor_batches', {
    id: serial('id').primaryKey(),
    mentorId: integer('mentor_id').references(() => mentorProfiles.id).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    domain: varchar('domain', { length: 100 }).notNull(),
    maxStudents: integer('max_students').default(50),
    startDate: timestamp('start_date'),
    endDate: timestamp('end_date'),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
    mentorIdx: index('idx_batches_mentor').on(t.mentorId),
}));

export const batchEnrollments = pgTable('batch_enrollments', {
    id: serial('id').primaryKey(),
    batchId: integer('batch_id').references(() => mentorBatches.id).notNull(),
    studentId: integer('student_id').references(() => users.id).notNull(),
    progress: integer('progress').default(0), // 0-100
    status: varchar('status', { length: 50 }).default('active').notNull(), // active, completed, dropped
    enrolledAt: timestamp('enrolled_at').defaultNow().notNull(),
}, (t) => ({
    uniqueEnrollment: index('idx_enrollment_unique').on(t.batchId, t.studentId),
}));

export const mentorSessions = pgTable('mentor_sessions', {
    id: serial('id').primaryKey(),
    batchId: integer('batch_id').references(() => mentorBatches.id).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    scheduledAt: timestamp('scheduled_at').notNull(),
    duration: integer('duration').default(60), // minutes
    status: sessionStatusEnum('status').default('SCHEDULED').notNull(),
    meetingLink: text('meeting_link'),
    recordingUrl: text('recording_url'),
    materials: jsonb('materials').default('[]').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
    batchIdx: index('idx_sessions_batch').on(t.batchId),
    scheduledIdx: index('idx_sessions_scheduled').on(t.scheduledAt),
}));

export const sessionAttendance = pgTable('session_attendance', {
    id: serial('id').primaryKey(),
    sessionId: integer('session_id').references(() => mentorSessions.id).notNull(),
    studentId: integer('student_id').references(() => users.id).notNull(),
    attended: boolean('attended').default(false).notNull(),
    joinedAt: timestamp('joined_at'),
    leftAt: timestamp('left_at'),
}, (t) => ({
    uniqueAttendance: index('idx_attendance_unique').on(t.sessionId, t.studentId),
}));

export const studentSubmissions = pgTable('student_submissions', {
    id: serial('id').primaryKey(),
    studentId: integer('student_id').references(() => users.id).notNull(),
    batchId: integer('batch_id').references(() => mentorBatches.id),
    taskTitle: varchar('task_title', { length: 255 }).notNull(),
    taskType: varchar('task_type', { length: 100 }).notNull(), // quiz, exercise, assignment
    submissionUrl: text('submission_url'),
    submissionText: text('submission_text'),
    score: integer('score'),
    maxScore: integer('max_score').default(100),
    status: submissionReviewStatusEnum('status').default('PENDING').notNull(),
    feedback: text('feedback'),
    gradedBy: integer('graded_by').references(() => users.id),
    submittedAt: timestamp('submitted_at').defaultNow().notNull(),
    gradedAt: timestamp('graded_at'),
}, (t) => ({
    studentIdx: index('idx_student_submissions_student').on(t.studentId),
    batchIdx: index('idx_student_submissions_batch').on(t.batchId),
}));

// ═══════════════════════════════════════════════════════════════════════════════
// LIBRARY - User Collections
// ═══════════════════════════════════════════════════════════════════════════════

export const userLibraries = pgTable('user_libraries', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    isPublic: boolean('is_public').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
    userIdx: index('idx_libraries_user').on(t.userId),
}));

export const libraryItems = pgTable('library_items', {
    id: serial('id').primaryKey(),
    libraryId: integer('library_id').references(() => userLibraries.id).notNull(),
    itemType: varchar('item_type', { length: 50 }).notNull(), // tutorial, course, notebook, certificate
    itemId: integer('item_id').notNull(), // references to actual content
    addedAt: timestamp('added_at').defaultNow().notNull(),
}, (t) => ({
    libraryIdx: index('idx_library_items_library').on(t.libraryId),
}));

