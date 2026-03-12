/**
 * BlueLearnerHub — Extended Database Schema v2
 * =============================================
 * Adds the seven new civilization modules on top of the existing schema:
 *
 *  1. Tutorial Engine         — interactive lessons + code playgrounds
 *  2. Q&A Knowledge Network   — StackOverflow-style community
 *  3. Developer Portal        — GitHub-style repos, commits, PRs
 *  4. Certificates            — verifiable, PDF-issued credentials
 *  5. Learning Tracks         — structured career paths
 *  6. Organizations           — corporate + university accounts
 *  7. Content Embeddings      — pgvector for semantic search
 *
 * Import alongside schema.ts — both export to the same Drizzle instance.
 */

import {
  pgTable, serial, text, varchar, timestamp, integer, boolean,
  smallint, pgEnum, jsonb, uniqueIndex, index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users, courses, modules } from './schema';

// ────────────────────────────────────────────────────────────────────────────
// NEW ENUMS
// ────────────────────────────────────────────────────────────────────────────

export const difficultyEnum  = pgEnum('difficulty_level', ['beginner', 'intermediate', 'advanced', 'expert']);
export const voteTypeEnum    = pgEnum('vote_type',        ['up', 'down']);
export const repoVisibility  = pgEnum('repo_visibility',  ['public', 'private']);
export const issueStatusEnum = pgEnum('issue_status',     ['open', 'in_progress', 'closed']);
export const prStatusEnum    = pgEnum('pr_status',        ['open', 'merged', 'closed']);
export const orgTypeEnum     = pgEnum('org_type',         ['corporate', 'university', 'community']);
export const certTypeEnum    = pgEnum('cert_type',        ['course', 'track', 'hackathon', 'skill']);

// ────────────────────────────────────────────────────────────────────────────
// MODULE 1: TUTORIAL ENGINE
// ────────────────────────────────────────────────────────────────────────────

/**
 * tutorials — top-level tutorial documents (W3Schools-style)
 *
 * A tutorial contains multiple ordered sections; each section can have an
 * embedded code playground and/or a practice exercise.
 */
export const tutorials = pgTable('tutorials', {
  id:               serial('id').primaryKey(),
  slug:             varchar('slug', { length: 255 }).unique().notNull(),
  title:            varchar('title', { length: 255 }).notNull(),
  description:      text('description'),
  authorId:         integer('author_id').references(() => users.id),
  domain:           varchar('domain', { length: 100 }).notNull(),        // 'javascript', 'thermodynamics'
  subDomain:        varchar('sub_domain', { length: 100 }),              // 'async', 'heat-transfer'
  difficulty:       difficultyEnum('difficulty').default('beginner'),
  estimatedMinutes: integer('estimated_minutes').default(15),
  xpReward:         integer('xp_reward').default(50).notNull(),
  prerequisites:    text('prerequisites').array(),                       // Array of tutorial slugs
  tags:             text('tags').array(),
  isPublished:      boolean('is_published').default(false).notNull(),
  viewCount:        integer('view_count').default(0).notNull(),
  completionCount:  integer('completion_count').default(0).notNull(),
  // embedding vector(1536) — added via raw SQL migration (pgvector)
  createdAt:        timestamp('created_at').defaultNow().notNull(),
  updatedAt:        timestamp('updated_at').defaultNow().notNull(),
});

/**
 * tutorial_sections — individual steps inside a tutorial
 *
 * Sections are rendered one at a time in the left→right reading flow.
 * Each section may include a live code editor and/or a practice exercise.
 */
export const tutorialSections = pgTable('tutorial_sections', {
  id:                   serial('id').primaryKey(),
  tutorialId:           integer('tutorial_id').references(() => tutorials.id, { onDelete: 'cascade' }).notNull(),
  title:                varchar('title', { length: 255 }).notNull(),
  content:              text('content').notNull(),                       // Markdown with ```code blocks```
  sectionOrder:         integer('section_order').notNull(),
  language:             varchar('language', { length: 50 }),             // Default code language
  starterCode:          text('starter_code'),                            // Pre-filled in editor
  solutionCode:         text('solution_code'),                           // Hidden solution
  hasExercise:          boolean('has_exercise').default(false).notNull(),
  exercisePrompt:       text('exercise_prompt'),
  exerciseTestCases:    jsonb('exercise_test_cases'),                    // [{input, expectedOutput, isHidden}]
  exerciseXpReward:     integer('exercise_xp_reward').default(20),
});

/**
 * tutorial_progress — per-user completion tracking
 */
export const tutorialProgress = pgTable('tutorial_progress', {
  id:          serial('id').primaryKey(),
  userId:      integer('user_id').references(() => users.id).notNull(),
  tutorialId:  integer('tutorial_id').references(() => tutorials.id).notNull(),
  sectionId:   integer('section_id').references(() => tutorialSections.id).notNull(),
  completedAt: timestamp('completed_at').defaultNow().notNull(),
}, (t) => ({
  uniq: uniqueIndex('uq_tutorial_progress').on(t.userId, t.sectionId),
}));

/**
 * tutorial_completions — when a user finishes the entire tutorial
 */
export const tutorialCompletions = pgTable('tutorial_completions', {
  id:          serial('id').primaryKey(),
  userId:      integer('user_id').references(() => users.id).notNull(),
  tutorialId:  integer('tutorial_id').references(() => tutorials.id).notNull(),
  xpAwarded:   integer('xp_awarded').notNull(),
  completedAt: timestamp('completed_at').defaultNow().notNull(),
}, (t) => ({
  uniq: uniqueIndex('uq_tutorial_completion').on(t.userId, t.tutorialId),
}));

// ────────────────────────────────────────────────────────────────────────────
// MODULE 2: Q&A KNOWLEDGE NETWORK
// ────────────────────────────────────────────────────────────────────────────

/**
 * qna_questions — technical questions asked by users
 *
 * Each question has a vector embedding (added via migration) so we can
 * detect semantic duplicates before publishing.
 */
export const qnaQuestions = pgTable('qna_questions', {
  id:               serial('id').primaryKey(),
  authorId:         integer('author_id').references(() => users.id).notNull(),
  title:            varchar('title', { length: 500 }).notNull(),
  body:             text('body').notNull(),                               // Markdown
  domain:           varchar('domain', { length: 100 }),
  viewCount:        integer('view_count').default(0).notNull(),
  answerCount:      integer('answer_count').default(0).notNull(),
  voteScore:        integer('vote_score').default(0).notNull(),          // net votes
  isAnswered:       boolean('is_answered').default(false).notNull(),
  acceptedAnswerId: integer('accepted_answer_id'),                       // FK set after answer created
  bountyAmount:     integer('bounty_amount').default(0).notNull(),
  bountyDeadline:   timestamp('bounty_deadline'),
  // embedding vector(1536) — added via raw SQL migration
  createdAt:        timestamp('created_at').defaultNow().notNull(),
  updatedAt:        timestamp('updated_at').defaultNow().notNull(),
});

/**
 * qna_answers — answers posted in response to a question
 */
export const qnaAnswers = pgTable('qna_answers', {
  id:           serial('id').primaryKey(),
  questionId:   integer('question_id').references(() => qnaQuestions.id, { onDelete: 'cascade' }).notNull(),
  authorId:     integer('author_id').references(() => users.id).notNull(),
  body:         text('body').notNull(),                                  // Markdown
  voteScore:    integer('vote_score').default(0).notNull(),
  isAccepted:   boolean('is_accepted').default(false).notNull(),
  aiGenerated:  boolean('ai_generated').default(false).notNull(),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
  updatedAt:    timestamp('updated_at').defaultNow().notNull(),
});

/**
 * qna_votes — tracks who voted on what (prevents double-voting)
 */
export const qnaVotes = pgTable('qna_votes', {
  id:         serial('id').primaryKey(),
  userId:     integer('user_id').references(() => users.id).notNull(),
  targetType: varchar('target_type', { length: 20 }).notNull(),         // 'question' | 'answer'
  targetId:   integer('target_id').notNull(),
  vote:       voteTypeEnum('vote').notNull(),
  createdAt:  timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  uniq: uniqueIndex('uq_qna_vote').on(t.userId, t.targetType, t.targetId),
}));

/**
 * tags — technology / domain tags (javascript, thermodynamics, CAPM, etc.)
 */
export const tags = pgTable('tags', {
  id:          serial('id').primaryKey(),
  name:        varchar('name', { length: 100 }).unique().notNull(),
  slug:        varchar('slug', { length: 100 }).unique().notNull(),
  description: text('description'),
  usageCount:  integer('usage_count').default(0).notNull(),
  domain:      varchar('domain', { length: 100 }),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
});

export const qnaQuestionTags = pgTable('qna_question_tags', {
  questionId: integer('question_id').references(() => qnaQuestions.id, { onDelete: 'cascade' }).notNull(),
  tagId:      integer('tag_id').references(() => tags.id).notNull(),
}, (t) => ({
  pk: uniqueIndex('uq_question_tag').on(t.questionId, t.tagId),
}));

/**
 * user_reputation — community reputation points (separate from XP)
 */
export const userReputation = pgTable('user_reputation', {
  id:         serial('id').primaryKey(),
  userId:     integer('user_id').references(() => users.id).notNull().unique(),
  points:     integer('points').default(1).notNull(),
  rank:       varchar('rank', { length: 100 }).default('Curious Learner').notNull(),
  updatedAt:  timestamp('updated_at').defaultNow().notNull(),
});

// ────────────────────────────────────────────────────────────────────────────
// MODULE 3: DEVELOPER PORTAL (GitHub-style)
// ────────────────────────────────────────────────────────────────────────────

/**
 * repositories — user code repositories
 */
export const repositories = pgTable('repositories', {
  id:            serial('id').primaryKey(),
  ownerId:       integer('owner_id').references(() => users.id).notNull(),
  name:          varchar('name', { length: 255 }).notNull(),
  slug:          varchar('slug', { length: 255 }).notNull(),
  description:   text('description'),
  language:      varchar('language', { length: 100 }),
  visibility:    repoVisibility('visibility').default('public').notNull(),
  isTemplate:    boolean('is_template').default(false).notNull(),
  defaultBranch: varchar('default_branch', { length: 100 }).default('main').notNull(),
  starCount:     integer('star_count').default(0).notNull(),
  forkCount:     integer('fork_count').default(0).notNull(),
  forkedFromId:  integer('forked_from_id'),                             // FK to self (set post-create)
  topics:        text('topics').array(),
  license:       varchar('license', { length: 100 }),
  readmeContent: text('readme_content'),
  totalCommits:  integer('total_commits').default(0).notNull(),
  createdAt:     timestamp('created_at').defaultNow().notNull(),
  updatedAt:     timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
  uniq: uniqueIndex('uq_repo_owner_slug').on(t.ownerId, t.slug),
}));

/**
 * repository_files — current state of every file in a repo
 */
export const repositoryFiles = pgTable('repository_files', {
  id:           serial('id').primaryKey(),
  repoId:       integer('repo_id').references(() => repositories.id, { onDelete: 'cascade' }).notNull(),
  path:         varchar('path', { length: 1024 }).notNull(),            // 'src/main.py'
  content:      text('content'),
  language:     varchar('language', { length: 100 }),
  sizeBytes:    integer('size_bytes').default(0).notNull(),
  lastCommitId: integer('last_commit_id'),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
  updatedAt:    timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
  uniq: uniqueIndex('uq_repo_file_path').on(t.repoId, t.path),
}));

/**
 * commits — immutable commit log
 */
export const commits = pgTable('commits', {
  id:             serial('id').primaryKey(),
  repoId:         integer('repo_id').references(() => repositories.id, { onDelete: 'cascade' }).notNull(),
  sha:            varchar('sha', { length: 64 }).unique().notNull(),
  authorId:       integer('author_id').references(() => users.id).notNull(),
  message:        text('message').notNull(),
  changesSummary: jsonb('changes_summary'),                             // {filesChanged, additions, deletions}
  parentSha:      varchar('parent_sha', { length: 64 }),
  branch:         varchar('branch', { length: 255 }).default('main').notNull(),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  repoIdx: index('idx_commits_repo').on(t.repoId),
}));

/**
 * issues — bug reports and feature requests
 */
export const issues = pgTable('issues', {
  id:         serial('id').primaryKey(),
  repoId:     integer('repo_id').references(() => repositories.id, { onDelete: 'cascade' }).notNull(),
  authorId:   integer('author_id').references(() => users.id).notNull(),
  number:     integer('number').notNull(),                              // Per-repo #1, #2…
  title:      varchar('title', { length: 500 }).notNull(),
  body:       text('body'),
  status:     issueStatusEnum('status').default('open').notNull(),
  labels:     text('labels').array(),
  assigneeId: integer('assignee_id').references(() => users.id),
  createdAt:  timestamp('created_at').defaultNow().notNull(),
  closedAt:   timestamp('closed_at'),
}, (t) => ({
  uniq: uniqueIndex('uq_issue_repo_num').on(t.repoId, t.number),
}));

/**
 * pull_requests — code review requests
 */
export const pullRequests = pgTable('pull_requests', {
  id:             serial('id').primaryKey(),
  repoId:         integer('repo_id').references(() => repositories.id, { onDelete: 'cascade' }).notNull(),
  authorId:       integer('author_id').references(() => users.id).notNull(),
  number:         integer('number').notNull(),
  title:          varchar('title', { length: 500 }).notNull(),
  description:    text('description'),
  sourceBranch:   varchar('source_branch', { length: 255 }).notNull(),
  targetBranch:   varchar('target_branch', { length: 255 }).default('main').notNull(),
  status:         prStatusEnum('status').default('open').notNull(),
  diffContent:    text('diff_content'),                                 // Unified diff
  aiReview:       text('ai_review'),                                    // AI-generated review
  aiReviewScore:  smallint('ai_review_score'),                         // 0-100
  changesAdded:   integer('changes_added').default(0),
  changesRemoved: integer('changes_removed').default(0),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
  mergedAt:       timestamp('merged_at'),
  closedAt:       timestamp('closed_at'),
}, (t) => ({
  uniq: uniqueIndex('uq_pr_repo_num').on(t.repoId, t.number),
}));

/**
 * repository_stars — star/unstar tracking
 */
export const repositoryStars = pgTable('repository_stars', {
  userId:    integer('user_id').references(() => users.id).notNull(),
  repoId:    integer('repo_id').references(() => repositories.id).notNull(),
  starredAt: timestamp('starred_at').defaultNow().notNull(),
}, (t) => ({
  pk: uniqueIndex('uq_repo_star').on(t.userId, t.repoId),
}));

// ────────────────────────────────────────────────────────────────────────────
// MODULE 4: CERTIFICATES
// ────────────────────────────────────────────────────────────────────────────

/**
 * certificate_templates — reusable certificate design configs
 */
export const certificateTemplates = pgTable('certificate_templates', {
  id:           serial('id').primaryKey(),
  name:         varchar('name', { length: 255 }).notNull(),
  type:         certTypeEnum('type').notNull(),
  designConfig: jsonb('design_config').notNull(),                       // Layout, colors, fonts, logo
  isActive:     boolean('is_active').default(true).notNull(),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
});

/**
 * certificates — issued, verifiable credentials
 */
export const certificates = pgTable('certificates', {
  id:              serial('id').primaryKey(),
  userId:          integer('user_id').references(() => users.id).notNull(),
  templateId:      integer('template_id').references(() => certificateTemplates.id).notNull(),
  credentialId:    varchar('credential_id', { length: 64 }).unique().notNull(), // UUID for public verify
  title:           varchar('title', { length: 255 }).notNull(),
  issuedFor:       varchar('issued_for', { length: 255 }),              // Course/track/hackathon name
  issuerName:      varchar('issuer_name', { length: 255 }).default('BlueLearnerHub').notNull(),
  recipientName:   varchar('recipient_name', { length: 255 }).notNull(),
  issuedAt:        timestamp('issued_at').defaultNow().notNull(),
  expiresAt:       timestamp('expires_at'),                             // NULL = never expires
  verificationUrl: text('verification_url'),
  pdfUrl:          text('pdf_url'),                                     // S3 URL
  metadata:        jsonb('metadata'),                                   // Skills, score, etc.
});

// ────────────────────────────────────────────────────────────────────────────
// MODULE 5: LEARNING TRACKS (Career Paths)
// ────────────────────────────────────────────────────────────────────────────

/**
 * learning_tracks — structured career learning paths (Coursera-style)
 * e.g. "Full-Stack Software Engineer", "Investment Banking Analyst"
 */
export const learningTracks = pgTable('learning_tracks', {
  id:                    serial('id').primaryKey(),
  title:                 varchar('title', { length: 255 }).notNull(),
  slug:                  varchar('slug', { length: 255 }).unique().notNull(),
  description:           text('description'),
  domain:                varchar('domain', { length: 100 }).notNull(),
  careerOutcome:         varchar('career_outcome', { length: 255 }),    // "Become a ..."
  estimatedWeeks:        integer('estimated_weeks'),
  difficulty:            difficultyEnum('difficulty').default('beginner'),
  isPublished:           boolean('is_published').default(false).notNull(),
  enrollmentCount:       integer('enrollment_count').default(0).notNull(),
  certificateTemplateId: integer('certificate_template_id').references(() => certificateTemplates.id),
  thumbnailUrl:          text('thumbnail_url'),
  promoVideoUrl:         text('promo_video_url'),
  syllabus:              jsonb('syllabus'),                             // Structured outline
  createdAt:             timestamp('created_at').defaultNow().notNull(),
  updatedAt:             timestamp('updated_at').defaultNow().notNull(),
});

export const trackCourses = pgTable('track_courses', {
  trackId:    integer('track_id').references(() => learningTracks.id, { onDelete: 'cascade' }).notNull(),
  courseId:   integer('course_id').references(() => courses.id).notNull(),
  orderIndex: integer('order_index').notNull(),
  isRequired: boolean('is_required').default(true).notNull(),
}, (t) => ({
  pk: uniqueIndex('uq_track_course').on(t.trackId, t.courseId),
}));

export const trackEnrollments = pgTable('track_enrollments', {
  id:                 serial('id').primaryKey(),
  userId:             integer('user_id').references(() => users.id).notNull(),
  trackId:            integer('track_id').references(() => learningTracks.id).notNull(),
  enrolledAt:         timestamp('enrolled_at').defaultNow().notNull(),
  completedAt:        timestamp('completed_at'),
  progressPercentage: smallint('progress_percentage').default(0).notNull(),
  certificateId:      integer('certificate_id').references(() => certificates.id),
}, (t) => ({
  uniq: uniqueIndex('uq_track_enrollment').on(t.userId, t.trackId),
}));

// ────────────────────────────────────────────────────────────────────────────
// MODULE 6: ORGANIZATIONS (Corporate + University)
// ────────────────────────────────────────────────────────────────────────────

/**
 * organizations — company or university accounts
 */
export const organizations = pgTable('organizations', {
  id:               serial('id').primaryKey(),
  name:             varchar('name', { length: 255 }).notNull(),
  slug:             varchar('slug', { length: 255 }).unique().notNull(),
  type:             orgTypeEnum('type').notNull(),
  description:      text('description'),
  logoUrl:          text('logo_url'),
  website:          varchar('website', { length: 500 }),
  industry:         varchar('industry', { length: 100 }),
  country:          varchar('country', { length: 100 }),
  city:             varchar('city', { length: 100 }),
  employeeCount:    varchar('employee_count', { length: 50 }),          // '1-10', '100-500', etc.
  verified:         boolean('verified').default(false).notNull(),
  subscriptionTier: varchar('subscription_tier', { length: 50 }).default('FREE').notNull(),
  contactEmail:     varchar('contact_email', { length: 255 }),
  createdAt:        timestamp('created_at').defaultNow().notNull(),
  updatedAt:        timestamp('updated_at').defaultNow().notNull(),
});

export const orgMembers = pgTable('org_members', {
  orgId:    integer('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  userId:   integer('user_id').references(() => users.id).notNull(),
  role:     varchar('role', { length: 50 }).default('member').notNull(), // 'owner','admin','member'
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
}, (t) => ({
  pk: uniqueIndex('uq_org_member').on(t.orgId, t.userId),
}));

/**
 * talent_pool — corporations can save candidates they're interested in
 */
export const talentPool = pgTable('talent_pool', {
  id:          serial('id').primaryKey(),
  orgId:       integer('org_id').references(() => organizations.id).notNull(),
  candidateId: integer('candidate_id').references(() => users.id).notNull(),
  notes:       text('notes'),
  stage:       varchar('stage', { length: 100 }).default('prospects'),  // prospects, screening, interview, offer
  addedAt:     timestamp('added_at').defaultNow().notNull(),
  updatedAt:   timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
  uniq: uniqueIndex('uq_talent_pool').on(t.orgId, t.candidateId),
}));

/**
 * innovation_challenges — corporate problem statements for the community
 */
export const innovationChallenges = pgTable('innovation_challenges', {
  id:                serial('id').primaryKey(),
  orgId:             integer('org_id').references(() => organizations.id).notNull(),
  title:             varchar('title', { length: 255 }).notNull(),
  description:       text('description').notNull(),
  prizeDescription:  text('prize_description'),
  deadline:          timestamp('deadline'),
  submissionCount:   integer('submission_count').default(0).notNull(),
  status:            varchar('status', { length: 50 }).default('active').notNull(),
  evaluationCriteria: jsonb('evaluation_criteria'),
  createdAt:         timestamp('created_at').defaultNow().notNull(),
});

// ────────────────────────────────────────────────────────────────────────────
// MODULE 7: CONTENT EMBEDDINGS (Semantic Search via pgvector)
// ────────────────────────────────────────────────────────────────────────────
// Note: The actual vector column requires the pgvector extension and a raw SQL
// migration. This table stores metadata; the vector lives in pgvector tables
// created by the migration in database/migrations/005_pgvector.sql

/**
 * content_embeddings — tracks which content has been vectorized
 * The real embedding data lives in the pgvector-backed table created
 * by migration 005. This table is the index manifest.
 */
export const contentEmbeddings = pgTable('content_embeddings_manifest', {
  id:          serial('id').primaryKey(),
  contentType: varchar('content_type', { length: 50 }).notNull(),       // 'tutorial','qna','course'
  contentId:   integer('content_id').notNull(),
  model:       varchar('model', { length: 100 }).default('text-embedding-3-small').notNull(),
  dimensions:  integer('dimensions').default(1536).notNull(),
  updatedAt:   timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
  uniq: uniqueIndex('uq_embedding_content').on(t.contentType, t.contentId),
}));

// ────────────────────────────────────────────────────────────────────────────
// MODULE 8: STUDY NOTEBOOKS  (NotebookLM-style AI Research Assistant)
// ────────────────────────────────────────────────────────────────────────────

export const notebookSourceTypeEnum = pgEnum('notebook_source_type',   ['pdf', 'text', 'url']);
export const notebookSourceStatusEnum = pgEnum('notebook_source_status', ['pending', 'processing', 'ready', 'failed']);
export const notebookGenerateTypeEnum = pgEnum('notebook_generate_type', ['summary', 'study_guide', 'notebook_guide', 'faq', 'flashcards', 'quiz', 'audio_overview', 'compare_sources']);

/**
 * notebooks — a user's study workspace that can hold multiple source documents.
 * Inspired by Google NotebookLM: each notebook is a grounded AI research assistant.
 */
export const notebooks = pgTable('notebooks', {
  id:          serial('id').primaryKey(),
  userId:      integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title:       varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  emoji:       varchar('emoji', { length: 10 }).default('📓').notNull(),
  sourceCount: integer('source_count').default(0).notNull(),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
  updatedAt:   timestamp('updated_at').defaultNow().notNull(),
});

/**
 * notebook_sources — individual documents or text snippets added to a notebook.
 * Text is extracted, chunked, and embedded by the AI service.
 */
export const notebookSources = pgTable('notebook_sources', {
  id:         serial('id').primaryKey(),
  notebookId: integer('notebook_id').references(() => notebooks.id, { onDelete: 'cascade' }).notNull(),
  title:      varchar('title', { length: 255 }).notNull(),
  sourceType: notebookSourceTypeEnum('source_type').notNull(),
  content:    text('content'),                                          // raw / extracted text
  url:        text('url'),                                              // URL sources
  s3Key:      text('s3_key'),                                          // uploaded PDF S3 path
  chunkCount: integer('chunk_count').default(0).notNull(),
  wordCount:  integer('word_count').default(0).notNull(),
  status:     notebookSourceStatusEnum('status').default('pending').notNull(),
  createdAt:  timestamp('created_at').defaultNow().notNull(),
});

/**
 * notebook_chats — persisted conversation history for a notebook.
 * messages: ChatMessage[] — { role: 'user'|'assistant', content: string, sources?: CitationRef[] }
 */
export const notebookChats = pgTable('notebook_chats', {
  id:         serial('id').primaryKey(),
  notebookId: integer('notebook_id').references(() => notebooks.id, { onDelete: 'cascade' }).notNull(),
  userId:     integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  messages:   jsonb('messages').default([]).notNull(),
  createdAt:  timestamp('created_at').defaultNow().notNull(),
  updatedAt:  timestamp('updated_at').defaultNow().notNull(),
});

/**
 * notebook_generations — AI-generated study artefacts (study guides, FAQs, quizzes, etc.).
 * Stored so users can browse their generated materials without re-generating.
 */
export const notebookGenerations = pgTable('notebook_generations', {
  id:         serial('id').primaryKey(),
  notebookId: integer('notebook_id').references(() => notebooks.id, { onDelete: 'cascade' }).notNull(),
  type:       notebookGenerateTypeEnum('type').notNull(),
  title:      varchar('title', { length: 255 }).notNull(),
  content:    text('content').notNull(),                                // Markdown / JSON string
  createdAt:  timestamp('created_at').defaultNow().notNull(),
});

/**
 * notebook_source_annotations — saved highlights and user notes tied to source chunks.
 */
export const notebookSourceAnnotations = pgTable('notebook_source_annotations', {
  id:         serial('id').primaryKey(),
  notebookId: integer('notebook_id').references(() => notebooks.id, { onDelete: 'cascade' }).notNull(),
  sourceId:   integer('source_id').references(() => notebookSources.id, { onDelete: 'cascade' }).notNull(),
  userId:     integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  quote:      text('quote').notNull(),
  note:       text('note'),
  chunkIndex: integer('chunk_index'),
  createdAt:  timestamp('created_at').defaultNow().notNull(),
});

/**
 * notebook_behavior_events — user interaction stream used for adaptive guidance.
 */
export const notebookBehaviorEvents = pgTable('notebook_behavior_events', {
  id:          serial('id').primaryKey(),
  notebookId:  integer('notebook_id').references(() => notebooks.id, { onDelete: 'cascade' }).notNull(),
  userId:      integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  eventType:   varchar('event_type', { length: 100 }).notNull(),
  eventPayload: jsonb('event_payload').default({}).notNull(),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  notebookIdx: index('idx_notebook_behavior_events_notebook').on(t.notebookId, t.createdAt),
  userIdx:     index('idx_notebook_behavior_events_user').on(t.userId, t.createdAt),
}));

/**
 * learning_behavior_events — shared behavior telemetry for adaptive guidance
 * in tutorials, hackathons, and quizzes.
 */
export const learningBehaviorEvents = pgTable('learning_behavior_events', {
  id:           serial('id').primaryKey(),
  userId:       integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  moduleType:   varchar('module_type', { length: 50 }).notNull(), // tutorial | hackathon | quiz
  targetId:     integer('target_id').notNull(),
  eventType:    varchar('event_type', { length: 100 }).notNull(),
  eventPayload: jsonb('event_payload').default({}).notNull(),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  moduleIdx: index('idx_learning_behavior_module').on(t.moduleType, t.targetId, t.createdAt),
  userIdx:   index('idx_learning_behavior_user').on(t.userId, t.createdAt),
}));

// ────────────────────────────────────────────────────────────────────────────
// RELATIONS
// ────────────────────────────────────────────────────────────────────────────

export const tutorialsRelations = relations(tutorials, ({ many, one }) => ({
  sections:    many(tutorialSections),
  completions: many(tutorialCompletions),
  progress:    many(tutorialProgress),
  author:      one(users, { fields: [tutorials.authorId], references: [users.id] }),
}));

export const tutorialSectionsRelations = relations(tutorialSections, ({ one }) => ({
  tutorial: one(tutorials, { fields: [tutorialSections.tutorialId], references: [tutorials.id] }),
}));

export const qnaQuestionsRelations = relations(qnaQuestions, ({ many, one }) => ({
  answers: many(qnaAnswers),
  votes:   many(qnaVotes),
  tags:    many(qnaQuestionTags),
  author:  one(users, { fields: [qnaQuestions.authorId], references: [users.id] }),
}));

export const qnaAnswersRelations = relations(qnaAnswers, ({ one }) => ({
  question: one(qnaQuestions, { fields: [qnaAnswers.questionId], references: [qnaQuestions.id] }),
  author:   one(users, { fields: [qnaAnswers.authorId], references: [users.id] }),
}));

export const repositoriesRelations = relations(repositories, ({ many, one }) => ({
  files:        many(repositoryFiles),
  commits:      many(commits),
  issues:       many(issues),
  pullRequests: many(pullRequests),
  stars:        many(repositoryStars),
  owner:        one(users, { fields: [repositories.ownerId], references: [users.id] }),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  members:    many(orgMembers),
  talentPool: many(talentPool),
  challenges: many(innovationChallenges),
}));

export const learningTracksRelations = relations(learningTracks, ({ many }) => ({
  courses:     many(trackCourses),
  enrollments: many(trackEnrollments),
}));

// ── MODULE 8 RELATIONS ────────────────────────────────────────────────────

export const notebooksRelations = relations(notebooks, ({ one, many }) => ({
  user:        one(users,               { fields: [notebooks.userId],      references: [users.id] }),
  sources:     many(notebookSources),
  chats:       many(notebookChats),
  generations: many(notebookGenerations),
  annotations: many(notebookSourceAnnotations),
  behaviorEvents: many(notebookBehaviorEvents),
}));

export const notebookSourcesRelations = relations(notebookSources, ({ one, many }) => ({
  notebook: one(notebooks, { fields: [notebookSources.notebookId], references: [notebooks.id] }),
  annotations: many(notebookSourceAnnotations),
}));

export const notebookChatsRelations = relations(notebookChats, ({ one }) => ({
  notebook: one(notebooks, { fields: [notebookChats.notebookId], references: [notebooks.id] }),
  user:     one(users,     { fields: [notebookChats.userId],     references: [users.id] }),
}));

export const notebookGenerationsRelations = relations(notebookGenerations, ({ one }) => ({
  notebook: one(notebooks, { fields: [notebookGenerations.notebookId], references: [notebooks.id] }),
}));

export const notebookSourceAnnotationsRelations = relations(notebookSourceAnnotations, ({ one }) => ({
  notebook: one(notebooks, { fields: [notebookSourceAnnotations.notebookId], references: [notebooks.id] }),
  source:   one(notebookSources, { fields: [notebookSourceAnnotations.sourceId], references: [notebookSources.id] }),
  user:     one(users, { fields: [notebookSourceAnnotations.userId], references: [users.id] }),
}));

export const notebookBehaviorEventsRelations = relations(notebookBehaviorEvents, ({ one }) => ({
  notebook: one(notebooks, { fields: [notebookBehaviorEvents.notebookId], references: [notebooks.id] }),
  user:     one(users, { fields: [notebookBehaviorEvents.userId], references: [users.id] }),
}));

export const learningBehaviorEventsRelations = relations(learningBehaviorEvents, ({ one }) => ({
  user: one(users, { fields: [learningBehaviorEvents.userId], references: [users.id] }),
}));
