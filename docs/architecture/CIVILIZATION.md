# BLUELEARNERHUB — GLOBAL LEARNING CIVILIZATION
## Complete System Architecture & Implementation Blueprint

> *"We are not building a website. We are building the digital infrastructure
> for how engineers and innovators will learn, build, and collaborate — forever."*

---

## PART I — CURRENT STATE ANALYSIS

### What Exists Today

BlueLearnerHub has a solid foundation. The existing system is a multi-role EdTech
platform built with modern tooling:

| Layer         | Technology                           | Status    |
|---------------|--------------------------------------|-----------|
| Frontend      | Next.js 14, Tailwind, Radix UI       | ✅ Active  |
| Backend       | Node.js / Express / TypeScript       | ✅ Active  |
| AI Services   | Python / FastAPI / Gemini / AirLLM   | ✅ Active  |
| Database      | PostgreSQL 16 (Neon) + Redis         | ✅ Active  |
| Auth          | JWT + HttpOnly Cookies + RBAC        | ✅ Active  |
| Payments      | Stripe                               | ✅ Active  |
| Infrastructure| Docker / Nginx / AWS ECS             | ✅ Active  |

### Features Already Implemented
- 8-role authentication (Student, Corporate, HR, Faculty, Institution, Candidate, Admin)
- AI Quiz generation + adaptive difficulty
- Hackathon management with team formation
- Job marketplace with AI-powered screening
- Gamification (XP, levels, streaks, badges, leaderboards)
- AI Companion chatbot (Gemini + local Mistral via AirLLM)
- Learning paths, courses, modules
- Code editor (Monaco)
- Subscription system (4 tiers via Stripe)
- Real-time WebSockets
- Code evaluation via Judge0

### Critical Gaps (What Must Be Built)

| Module                          | Priority | Effort |
|---------------------------------|----------|--------|
| Interactive Tutorial Engine     | P0       | High   |
| Teacher Creator Platform        | P0       | High   |
| Q&A Knowledge Network           | P0       | High   |
| GitHub-style Developer Portal   | P0       | High   |
| Certificate & Credentialing     | P1       | Medium |
| Corporate/University Ecosystem  | P1       | Medium |
| AI Orchestration Layer          | P0       | High   |
| Vector Search (Semantic)        | P1       | Medium |
| Real-time Collaboration         | P1       | High   |
| AI Hackathon Auto-Generator     | P1       | Medium |

---

## PART II — THE CIVILIZATION VISION

### The Five Pillars

```
┌─────────────────────────────────────────────────────────────┐
│                    BLUELEARNERHUB                           │
│              Global Learning Civilization                   │
├─────────────┬─────────────┬──────────────┬─────────────────┤
│   LEARN     │    BUILD    │   COMPETE    │     CONNECT     │
│             │             │              │                  │
│  Tutorials  │  Dev Portal │  Hackathons  │   Q&A Network   │
│  Courses    │  Projects   │  Challenges  │   Mentorship    │
│  Paths      │  Repos      │  Rankings    │   Community     │
│  Certs      │  Portfolio  │  Prizes      │   Jobs          │
└─────────────┴─────────────┴──────────────┴─────────────────┘
                              ▲
                    AI INTELLIGENCE LAYER
             (Tutor / Generator / Reviewer / Judge)
```

### Platform Positioning

| Capability              | Inspired By      | Our Advantage              |
|-------------------------|------------------|----------------------------|
| Interactive Tutorials   | W3Schools        | AI-personalized, live code |
| Coding Challenges       | HackerRank       | Engineering-domain aware   |
| Knowledge Network       | StackOverflow    | AI moderation + semantic   |
| Structured Careers      | Coursera         | Industry-verified certs    |
| Developer Collaboration | GitHub           | Integrated with learning   |
| Engineering Depth       | Skill-Lync       | Multi-domain AI tutor      |

---

## PART III — COMPLETE SYSTEM ARCHITECTURE

### Service Architecture

```
                            INTERNET
                               │
                    ┌──────────▼──────────┐
                    │      Nginx / CDN     │
                    │  (SSL, Rate Limit,   │
                    │   Load Balancing)    │
                    └──────┬──────┬───────┘
                           │      │
            ┌──────────────▼──┐ ┌─▼──────────────────┐
            │  Next.js 14     │ │  Static Assets (S3) │
            │  Frontend App   │ │  Images, Videos,    │
            │  (Port 3000)    │ │  Code Bundles       │
            └────────┬────────┘ └────────────────────┘
                     │ REST + WebSocket
            ┌────────▼────────────────────────────────┐
            │         Node.js / Express Backend        │
            │              (Port 5000)                 │
            │                                          │
            │  Auth │ Quiz │ Hack │ Learn │ Jobs │     │
            │  QnA  │ Repo │ Cert │ Tuts  │ Corp │     │
            └────┬──────────────────────────┬─────────┘
                 │                          │
    ┌────────────▼──────────┐  ┌────────────▼──────────┐
    │   Python FastAPI      │  │   PostgreSQL 16        │
    │   AI Microservices    │  │   (Primary Database)   │
    │   (Port 8000)         │  │                        │
    │                       │  │   + pgvector           │
    │  AI Orchestrator      │  │   (Semantic Search)    │
    │  Tutor Engine         │  └────────────────────────┘
    │  Quiz Generator       │
    │  Code Reviewer        │  ┌────────────────────────┐
    │  Resume Analyzer      │  │   Redis 7              │
    │  Hackathon Judge      │  │   (Cache + Sessions    │
    │  Path Generator       │  │    + Pub/Sub + Queue)  │
    │  Tutorial Generator   │  └────────────────────────┘
    └───────────────────────┘
```

### Database Architecture

```
POSTGRESQL 16 + pgvector
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CORE DOMAIN
  users                    — All platform users
  user_profiles            — Extended profile info
  user_skills              — Skill inventory
  user_subscriptions       — Stripe subscription state
  user_credits             — AI token credits
  achievements             — Badge definitions
  user_achievements        — Earned badges

LEARNING DOMAIN
  domains                  — Engineering, Management, Finance
  specializations          — Sub-domains per domain
  learning_tracks          — Career tracks (e.g. SWE, MECH, IB)
  courses                  — Structured courses
  modules                  — Course modules
  lessons                  — Individual lessons (NEW)
  tutorials                — Interactive tutorials (NEW)
  tutorial_sections        — Tutorial steps with code (NEW)
  code_snippets            — Runnable code examples (NEW)
  exercises                — Practice exercises (NEW)
  exercise_submissions     — User exercise attempts (NEW)
  labs                     — Lab environments
  certificates             — Issued certificates (NEW)
  certificate_templates    — Certificate designs (NEW)

QUIZ DOMAIN
  quizzes                  — Quiz definitions
  questions                — Questions with metadata
  quiz_attempts            — Attempt history
  daily_challenges         — Daily auto-generated quizzes (NEW)
  streak_records           — Daily streak tracking (NEW)

HACKATHON DOMAIN
  hackathons               — Hackathon events
  hackathon_teams          — Teams
  hackathon_members        — Team membership (NEW)
  hackathon_resources      — Starter code, datasets (NEW)
  submissions              — Project submissions
  submission_reviews       — AI + human reviews (NEW)
  hackathon_sponsors       — Corporate sponsors (NEW)

Q&A KNOWLEDGE DOMAIN (NEW)
  questions_qna            — Asked questions
  answers                  — Answers
  answer_votes             — Upvote/downvote
  question_tags            — Tag associations
  tags                     — Technology tags
  user_reputation          — Reputation points
  expert_badges            — Domain expertise badges

DEVELOPER PORTAL DOMAIN (NEW)
  repositories             — User code repositories
  repository_commits       — Commit history
  repository_files         — File tree
  issues                   — Repository issues
  pull_requests            — Pull requests
  code_reviews             — Review comments
  project_docs             — Documentation pages
  developer_portfolios     — Public profiles

JOBS DOMAIN
  jobs                     — Job listings
  job_applications         — Applications
  job_rankings             — AI-ranked candidates

CORPORATE/UNIVERSITY DOMAIN (NEW)
  organizations            — Companies and universities
  org_members              — Members of org
  org_hackathons           — Organization-hosted events
  campus_programs          — University programs
  talent_pools             — Corporate talent tracking

VECTOR DOMAIN (pgvector)
  content_embeddings       — Tutorial/lesson embeddings
  question_embeddings      — Q&A semantic vectors
  user_skill_embeddings    — Skill profile vectors
```

---

## PART IV — MODULE SPECIFICATIONS

### Module 1: Interactive Tutorial Engine

**Vision:** Every engineering concept taught through an interactive, live-code
experience. Think MDN docs meets Codecademy.

**Architecture:**
```
Tutorial Page
├── Lesson Navigator (left sidebar)
├── Content Panel (center)
│   ├── Explanation (Markdown + LaTeX support)
│   ├── Live Code Editor (Monaco)
│   ├── Code Runner (Judge0 / sandboxed)
│   └── Visual Output Panel
├── Try-It Yourself (right panel)
│   ├── Challenge Prompt
│   ├── Code Editor
│   └── Test Runner
└── Progress Bar + XP Display
```

**API Endpoints:**
```
GET  /api/tutorials                    — Browse tutorials
GET  /api/tutorials/:slug              — Get tutorial content
GET  /api/tutorials/:slug/sections     — Get all sections
POST /api/tutorials/:id/progress       — Save progress
POST /api/tutorials/:id/run-code       — Execute code
POST /api/tutorials/:id/complete       — Mark complete + award XP
GET  /api/tutorials/search?q=          — Semantic search
POST /api/tutorials (TEACHER)          — Create tutorial
PUT  /api/tutorials/:id (TEACHER)      — Update tutorial
```

**AI Integration:**
- AI generates "hint" for stuck users
- Auto-generates follow-up practice exercises
- Difficulty adapts based on completion speed

---

### Module 2: Teacher Creator Platform

**Vision:** Any faculty member, industry expert, or community contributor can
publish world-class courses with an AI-assisted content studio.

**Teacher Capabilities:**
```
Content Studio
├── Lesson Builder (WYSIWYG + Markdown)
│   ├── Text blocks
│   ├── Code blocks (multi-language)
│   ├── Video embed
│   ├── Image/diagram upload
│   └── Interactive quiz embed
├── Quiz Designer
│   ├── Manual question creation
│   └── AI Question Generator (prompt → questions)
├── Exercise Creator
│   ├── Problem statement
│   ├── Test cases (public + hidden)
│   └── Solution template
├── Learning Path Builder
│   ├── Drag-drop module ordering
│   └── Prerequisites tree
└── AI Content Assistant
    ├── "Generate introduction for this topic"
    ├── "Create 5 MCQ questions about this lesson"
    └── "Suggest exercises for this difficulty level"
```

**Teacher Dashboard:**
```
Analytics Panel
├── Enrollment counts
├── Completion rates
├── Average quiz scores
├── Student progress heatmap
├── Common wrong answers
└── Revenue (for paid courses)
```

---

### Module 3: Q&A Knowledge Network

**Vision:** A StackOverflow-quality knowledge base powered by community +
AI moderation, with domain-specific expert recognition.

**Data Flow:**
```
User asks question
       ↓
AI checks: is this a duplicate? (semantic search)
       ↓ (if yes) → show similar questions
       ↓ (if no) → publish question
       ↓
Community answers + votes
       ↓
AI moderates: spam / toxicity check
       ↓
AI suggests "accepted answer" if high confidence
       ↓
Asker marks accepted → reputation awarded
```

**Reputation System:**
```
Action                    XP / Reputation
─────────────────────────────────────────
Ask a question            +5 rep
Answer gets upvote        +10 rep
Answer accepted           +25 rep
Question upvoted          +5 rep
Give upvote               -1 rep (cost)
Bounty posted             -rep (stake)
Bounty awarded            +2x rep
```

**Expert Badge Tiers:**
```
0–99    Curious Learner
100–499 Contributing Member
500–999 Domain Helper
1000+   Domain Expert
5000+   Platform Authority
```

---

### Module 4: GitHub-Style Developer Portal

**Vision:** Every student builds their engineering portfolio inside BlueLearnerHub.
Projects submitted for hackathons, linked to certificates, visible to recruiters.

**Repository Features:**
```
Repository Page
├── File Browser (tree view)
├── Code Viewer (syntax highlighted)
├── Commit History (timeline)
├── Issues (bug tracking)
├── Pull Requests (code review)
├── README.md Renderer
├── Topics/Tags
└── Deploy Preview (for web projects)

Developer Profile
├── Bio + Skills
├── Contribution Graph (GitHub-style heatmap)
├── Pinned Projects
├── Achievements Display
├── Hackathon participations
└── Certificates earned
```

---

### Module 5: AI Orchestration Layer

**Vision:** A unified AI brain that powers every feature — not scattered
individual API calls, but a coordinated intelligence system.

```python
class BlueLearnerAI:
    """
    Central AI orchestrator for BlueLearnerHub.
    All AI features route through this coordinator.
    """
    agents = {
        "tutor":          AITutorAgent,          # Real-time teaching
        "quiz_gen":       QuizGeneratorAgent,     # Daily quiz creation
        "hackathon_gen":  HackathonGeneratorAgent,# Auto-generate hackathons
        "code_reviewer":  CodeReviewerAgent,      # Automated code review
        "resume_analyzer":ResumeAnalyzerAgent,    # Career AI
        "path_generator": LearningPathAgent,      # Personalized paths
        "judge":          HackathonJudgeAgent,    # Score submissions
        "moderator":      ContentModerationAgent, # Q&A safety
        "tutorial_gen":   TutorialGeneratorAgent, # Content creation
    }
```

---

## PART V — TECHNOLOGY ARCHITECTURE

### Frontend Technology Stack

```typescript
// Core
Next.js 14 (App Router)         — Framework
TypeScript 5                     — Type safety
Tailwind CSS 4                   — Styling
Radix UI + shadcn/ui             — Component primitives

// State & Data
Zustand                          — Client state
TanStack Query v5                — Server state + caching
Axios                            — HTTP client

// Real-time
Socket.io-client                 — WebSocket
EventSource                      — SSE for AI streaming

// Code & Content
Monaco Editor                    — Code editing
@uiw/react-md-editor             — Markdown editing (Teacher)
react-syntax-highlighter         — Code display
KaTeX / react-katex              — Math rendering (Engineering)

// Developer Portal
@gitgraph/react                  — Git graph visualization
diff2html                        — Diff viewer

// Rich Interactions
Framer Motion                    — Animations
react-beautiful-dnd              — Drag and drop (course builder)
recharts / tremor                — Data visualization
```

### Backend Technology Stack

```typescript
// Core
Express.js + TypeScript          — API server
Drizzle ORM                      — Database ORM
PostgreSQL 16 + pgvector         — Primary DB + vector search
Redis 7                          — Cache, sessions, pub/sub, queues

// New Services
bull / bullmq                    — Job queues (AI tasks, emails)
isomorphic-git (server-side)     — Git operations for Dev Portal
nodemailer + sendgrid            — Email (certificates, notifications)
sharp                            — Image processing (certificates)
pdf-lib                          — PDF certificate generation
puppeteer                        — Screenshot/PDF rendering
```

### AI Services Stack

```python
# Core
FastAPI 0.104+                   — API framework
SQLAlchemy 2.0                   — Database ORM
Redis                            — Caching

# LLM Layer
Google Gemini 1.5 Pro            — Primary cloud LLM
Mistral 7B (AirLLM)             — Local inference fallback
Sentence-Transformers            — Embedding generation
pgvector                         — Vector similarity search

# AI Agents
langchain                        — Agent orchestration
openai (SDK)                     — Optional GPT-4 fallback

# Code Execution
judge0-python                    — Code evaluation
astroid + radon                  — Code quality metrics

# Content AI
diffusers                        — Diagram generation
```

### Infrastructure Stack

```yaml
# Container Orchestration
Docker + Docker Compose           — Local development
AWS ECS Fargate                   — Production containers
AWS Application Load Balancer     — Traffic distribution

# Database
AWS RDS PostgreSQL 16             — Primary database
ElastiCache Redis                 — Cache layer
AWS S3 + CloudFront               — Static assets + CDN

# Monitoring
Prometheus + Grafana              — Metrics
Sentry                            — Error tracking
Datadog / CloudWatch              — Logs + APM

# CI/CD
GitHub Actions                    — Build + test + deploy
AWS CodePipeline                  — Production deploy pipeline
```

---

## PART VI — DATABASE SCHEMA (EXTENDED)

### New Tables Required

```sql
-- TUTORIAL SYSTEM
CREATE TABLE tutorials (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  author_id INTEGER REFERENCES users(id),
  domain VARCHAR(100) NOT NULL,      -- 'javascript', 'mechanical', 'finance'
  difficulty SMALLINT DEFAULT 1,     -- 1=beginner, 2=intermediate, 3=advanced
  estimated_minutes INTEGER,
  xp_reward INTEGER DEFAULT 50,
  is_published BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  embedding vector(1536),            -- pgvector for semantic search
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tutorial_sections (
  id SERIAL PRIMARY KEY,
  tutorial_id INTEGER REFERENCES tutorials(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,             -- Markdown + code blocks
  section_order INTEGER NOT NULL,
  has_exercise BOOLEAN DEFAULT false,
  exercise_prompt TEXT,
  exercise_starter_code TEXT,
  exercise_solution TEXT,
  exercise_test_cases JSONB,         -- [{input, expected_output}]
  language VARCHAR(50)               -- 'python', 'javascript', etc.
);

-- Q&A KNOWLEDGE NETWORK
CREATE TABLE qna_questions (
  id SERIAL PRIMARY KEY,
  author_id INTEGER REFERENCES users(id),
  title VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  domain VARCHAR(100),
  view_count INTEGER DEFAULT 0,
  answer_count INTEGER DEFAULT 0,
  vote_count INTEGER DEFAULT 0,
  is_answered BOOLEAN DEFAULT false,
  accepted_answer_id INTEGER,        -- Self-referencing after answers created
  bounty_amount INTEGER DEFAULT 0,
  embedding vector(1536),            -- For duplicate detection
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE qna_answers (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES qna_questions(id) ON DELETE CASCADE,
  author_id INTEGER REFERENCES users(id),
  body TEXT NOT NULL,
  vote_count INTEGER DEFAULT 0,
  is_accepted BOOLEAN DEFAULT false,
  ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE qna_votes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  target_type VARCHAR(20) NOT NULL,  -- 'question' or 'answer'
  target_id INTEGER NOT NULL,
  vote_type SMALLINT NOT NULL,       -- 1=upvote, -1=downvote
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  usage_count INTEGER DEFAULT 0
);

CREATE TABLE qna_question_tags (
  question_id INTEGER REFERENCES qna_questions(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id),
  PRIMARY KEY (question_id, tag_id)
);

-- DEVELOPER PORTAL
CREATE TABLE repositories (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  language VARCHAR(100),
  is_private BOOLEAN DEFAULT false,
  is_template BOOLEAN DEFAULT false,
  default_branch VARCHAR(100) DEFAULT 'main',
  star_count INTEGER DEFAULT 0,
  fork_count INTEGER DEFAULT 0,
  topics TEXT[],                     -- Tag array
  license VARCHAR(100),
  readme_content TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(owner_id, slug)
);

CREATE TABLE repository_files (
  id SERIAL PRIMARY KEY,
  repo_id INTEGER REFERENCES repositories(id) ON DELETE CASCADE,
  path VARCHAR(1024) NOT NULL,       -- e.g. 'src/main.py'
  content TEXT,
  language VARCHAR(100),
  size_bytes INTEGER DEFAULT 0,
  last_commit_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(repo_id, path)
);

CREATE TABLE commits (
  id SERIAL PRIMARY KEY,
  repo_id INTEGER REFERENCES repositories(id) ON DELETE CASCADE,
  sha VARCHAR(64) UNIQUE NOT NULL,
  author_id INTEGER REFERENCES users(id),
  message TEXT NOT NULL,
  changes_summary JSONB,             -- {files_changed, additions, deletions}
  parent_sha VARCHAR(64),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  repo_id INTEGER REFERENCES repositories(id) ON DELETE CASCADE,
  author_id INTEGER REFERENCES users(id),
  number INTEGER NOT NULL,           -- Issue #1, #2, etc. per repo
  title VARCHAR(500) NOT NULL,
  body TEXT,
  status VARCHAR(50) DEFAULT 'open', -- open, closed
  labels TEXT[],
  assignee_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  closed_at TIMESTAMP
);

CREATE TABLE pull_requests (
  id SERIAL PRIMARY KEY,
  repo_id INTEGER REFERENCES repositories(id) ON DELETE CASCADE,
  author_id INTEGER REFERENCES users(id),
  number INTEGER NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  source_branch VARCHAR(255) NOT NULL,
  target_branch VARCHAR(255) DEFAULT 'main',
  status VARCHAR(50) DEFAULT 'open', -- open, merged, closed
  diff_content TEXT,                 -- Unified diff
  ai_review_summary TEXT,            -- AI code review
  created_at TIMESTAMP DEFAULT NOW(),
  merged_at TIMESTAMP
);

-- CERTIFICATES
CREATE TABLE certificate_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  design_config JSONB NOT NULL,      -- Layout, colors, fonts
  type VARCHAR(100) NOT NULL,        -- 'course', 'track', 'hackathon'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE certificates (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  template_id INTEGER REFERENCES certificate_templates(id),
  credential_id VARCHAR(64) UNIQUE NOT NULL,  -- Verifiable UUID
  title VARCHAR(255) NOT NULL,
  issued_for VARCHAR(255),           -- Course/track/hackathon name
  issued_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,              -- NULL = does not expire
  verification_url TEXT,             -- Public verification link
  pdf_url TEXT,                      -- S3 URL to certificate PDF
  metadata JSONB                     -- Additional info
);

-- ORGANIZATIONS (Corporate + University)
CREATE TABLE organizations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,         -- 'corporate', 'university'
  description TEXT,
  logo_url TEXT,
  website VARCHAR(500),
  industry VARCHAR(100),
  country VARCHAR(100),
  verified BOOLEAN DEFAULT false,
  subscription_tier VARCHAR(50) DEFAULT 'FREE',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE org_members (
  org_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id),
  role VARCHAR(50) DEFAULT 'member',  -- 'owner', 'admin', 'member'
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (org_id, user_id)
);

-- LEARNING TRACKS (Structured Career Paths)
CREATE TABLE learning_tracks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  domain VARCHAR(100) NOT NULL,
  career_outcome VARCHAR(255),       -- "Becomes a Full-Stack Engineer"
  estimated_weeks INTEGER,
  difficulty SMALLINT DEFAULT 1,
  is_published BOOLEAN DEFAULT false,
  certificate_template_id INTEGER REFERENCES certificate_templates(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE track_courses (
  track_id INTEGER REFERENCES learning_tracks(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id),
  order_index INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT true,
  PRIMARY KEY (track_id, course_id)
);

CREATE TABLE track_enrollments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  track_id INTEGER REFERENCES learning_tracks(id),
  enrolled_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  progress_percentage SMALLINT DEFAULT 0,
  UNIQUE(user_id, track_id)
);

-- AI CONTENT EMBEDDINGS (pgvector)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE content_embeddings (
  id SERIAL PRIMARY KEY,
  content_type VARCHAR(50) NOT NULL, -- 'tutorial', 'qna_question', 'course'
  content_id INTEGER NOT NULL,
  embedding vector(1536) NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX ON content_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```

---

## PART VII — AI INFRASTRUCTURE PLAN

### AI Orchestration Architecture

```
                    BlueLearner AI Brain
                   ┌──────────────────────────────────┐
                   │                                  │
        User       │   ┌─────────────────────────┐   │
        Request ──►│   │   AI Router / Planner   │   │
                   │   │   (intent classification│   │
                   │   │    + agent selection)   │   │
                   │   └────────────┬────────────┘   │
                   │                │                 │
                   │    ┌───────────┼───────────┐     │
                   │    │           │           │     │
                   │  Tutor     QuizGen     Judge     │
                   │  Agent     Agent       Agent     │
                   │    │           │           │     │
                   │  Path      Hacker     Moderator  │
                   │  Agent     Agent       Agent     │
                   │                                  │
                   │   ┌─────────────────────────┐   │
                   │   │   Shared Memory Store   │   │
                   │   │   (Redis + pgvector)    │   │
                   │   └─────────────────────────┘   │
                   └──────────────────────────────────┘
```

### AI Agent Specifications

| Agent               | Model              | Trigger                     | Output              |
|---------------------|--------------------|-----------------------------|---------------------|
| AI Tutor            | Gemini 1.5 Pro     | User question in tutorial   | Step-by-step guide  |
| Quiz Generator      | Gemini + Templates | Daily cron (midnight)       | 10 domain questions |
| Hackathon Generator | Gemini 1.5 Pro     | Admin trigger / scheduled   | Full hackathon spec |
| Code Reviewer       | Gemini + Radon     | PR / submission             | Review comments     |
| Resume Analyzer     | Gemini + spaCy     | File upload                 | Match score + gaps  |
| Path Generator      | Gemini + Embeddings| User skill assessment       | Personalized path   |
| Hackathon Judge     | Judge0 + Gemini    | Submission deadline         | Ranked leaderboard  |
| Content Moderator   | Gemini + rules     | Q&A post submission         | Approve/flag/remove |
| Tutorial Generator  | Gemini 1.5 Pro     | Teacher prompt              | Draft tutorial      |

---

## PART VIII — API STRUCTURE (COMPLETE)

### Backend API Routes (New + Existing)

```
/api/auth/*                    — Authentication (existing)
/api/quiz/*                    — Quiz system (existing)
/api/hackathons/*              — Hackathons (existing)
/api/learning/*                — Learning paths (existing)
/api/jobs/*                    — Jobs marketplace (existing)
/api/ai/*                      — AI companion (existing)
/api/payments/*                — Stripe (existing)
/api/analytics/*               — Analytics (existing)

NEW ROUTES:

/api/tutorials
  GET  /                       — List tutorials (paginated, filtered)
  GET  /search?q=              — Semantic search
  GET  /trending               — Popular this week
  GET  /:slug                  — Get tutorial + sections
  POST /                       — Create tutorial (TEACHER+)
  PUT  /:id                    — Update tutorial (owner)
  POST /:id/complete           — Mark section complete
  POST /:id/run-code           — Execute code snippet

/api/qna
  GET  /questions              — List questions
  GET  /questions/search?q=    — Semantic Q&A search
  GET  /questions/:id          — Question + answers
  POST /questions              — Ask question
  PUT  /questions/:id          — Edit question (owner)
  POST /questions/:id/answers  — Post answer
  PUT  /answers/:id            — Edit answer (owner)
  POST /votes                  — Cast vote
  POST /questions/:id/accept/:answerId — Accept answer

/api/repositories
  GET  /:username              — User repositories
  GET  /:username/:repo        — Repository detail
  GET  /:username/:repo/tree   — File tree
  GET  /:username/:repo/file   — File content
  POST /                       — Create repository
  POST /:id/commits            — Create commit (add/update files)
  GET  /:id/commits            — Commit history
  POST /:id/issues             — Create issue
  GET  /:id/issues             — List issues
  POST /:id/pulls              — Create pull request
  GET  /:id/pulls              — List pull requests
  POST /:id/pulls/:prId/review — AI code review

/api/certificates
  GET  /me                     — My certificates
  GET  /verify/:credentialId   — Public verify certificate
  POST /issue                  — Issue certificate (system)

/api/organizations
  GET  /:slug                  — Organization profile
  POST /                       — Create organization
  POST /:id/members            — Add member
  GET  /:id/hackathons         — Org hackathons
  POST /:id/challenges         — Post innovation challenge

/api/tracks
  GET  /                       — All learning tracks
  GET  /:slug                  — Track detail + courses
  POST /:id/enroll             — Enroll in track
  GET  /:id/progress           — Track progress
```

### AI Services API Routes (New)

```
/api/v1/tutor
  POST /ask                    — AI tutoring question
  POST /explain/:tutorialId    — Explain tutorial concept
  POST /hint/:exerciseId       — Get exercise hint

/api/v1/content
  POST /generate-tutorial      — AI draft a full tutorial
  POST /generate-quiz          — Generate quiz questions (existing, enhanced)
  POST /generate-exercises     — Create exercises for topic
  POST /generate-hackathon     — Auto-generate hackathon spec

/api/v1/review
  POST /code                   — Code review (PR or submission)
  POST /essay                  — Essay/report review
  POST /resume                 — Resume analysis

/api/v1/search
  POST /semantic               — Vector similarity search
  POST /recommend              — Personalized recommendations

/api/v1/judge
  POST /evaluate               — Judge hackathon submission
  POST /rank                   — Rank all submissions
```

---

## PART IX — UI COMPONENT SYSTEM

### Design Principles
```
Apple    → Simplicity, negative space, premium feel
Stripe   → Data-dense but never cluttered, excellent typography
Notion   → Flexible content creation, blocks-based editing
Linear   → Speed, keyboard-first, minimal chrome
```

### Component Library Structure

```
src/components/
├── ui/                        — Base primitives (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── badge.tsx
│   └── ...
│
├── tutorial/                  — Tutorial Engine
│   ├── TutorialLayout.tsx     — Three-panel layout
│   ├── LessonNav.tsx          — Left sidebar navigation
│   ├── ContentViewer.tsx      — Markdown + code renderer
│   ├── CodePlayground.tsx     — Live code editor + runner
│   ├── ExercisePanel.tsx      — Practice challenge panel
│   ├── TutorialProgress.tsx   — Progress indicator
│   └── TutorialCard.tsx       — Browse card
│
├── teacher/                   — Creator Studio
│   ├── ContentStudio.tsx      — Main editor layout
│   ├── LessonBuilder.tsx      — Block-based editor
│   ├── CodeBlockEditor.tsx    — Code block with language selector
│   ├── QuizBuilder.tsx        — Question designer
│   ├── ExerciseBuilder.tsx    — Test case creator
│   ├── PublishPanel.tsx       — Publish settings
│   └── TeacherAnalytics.tsx   — Student performance charts
│
├── qna/                       — Knowledge Network
│   ├── QuestionCard.tsx       — Question preview
│   ├── QuestionDetail.tsx     — Full question + answers
│   ├── AnswerCard.tsx         — Single answer
│   ├── VoteWidget.tsx         — Up/down vote UI
│   ├── AskQuestion.tsx        — Question form with AI duplicate check
│   ├── TagSelector.tsx        — Tag autocomplete
│   └── ReputationBadge.tsx    — User rep display
│
├── devportal/                 — Developer Portal
│   ├── RepoCard.tsx           — Repository summary card
│   ├── FileTree.tsx           — Directory tree browser
│   ├── CodeViewer.tsx         — Syntax-highlighted file view
│   ├── CommitHistory.tsx      — Timeline of commits
│   ├── IssueTracker.tsx       — Issue list + creation
│   ├── PRReview.tsx           — Pull request + diff view
│   ├── ContributionGraph.tsx  — GitHub-style heatmap
│   └── DeveloperProfile.tsx   — Public portfolio
│
├── certificates/              — Credentialing
│   ├── CertificateCard.tsx    — Certificate preview
│   ├── CertificateViewer.tsx  — Full certificate display
│   └── VerificationBadge.tsx  — Verified credential badge
│
├── tracks/                    — Learning Tracks
│   ├── TrackCard.tsx          — Career track overview
│   ├── TrackProgress.tsx      — Progress visualization
│   └── TrackRoadmap.tsx       — Visual learning path
│
└── ai/                        — AI Interface (expanded)
    ├── AITutorChat.tsx        — Context-aware tutoring
    ├── AIHintButton.tsx       — Inline exercise hints
    ├── AIReviewPanel.tsx      — Code review display
    └── AIStatusIndicator.tsx  — Provider status
```

---

## PART X — DEVELOPMENT ROADMAP

### Phase 1: Foundation Completion (Weeks 1-4)
*Get existing features production-ready*

- [ ] Fix all TypeScript compilation errors
- [ ] Complete database migrations for new schema
- [ ] Wire up certificate PDF generation
- [ ] Finalize subscription tier gating
- [ ] Production Redis configuration
- [ ] S3 file upload pipeline
- [ ] Comprehensive test suite (Jest + pytest)

### Phase 2: Tutorial Engine (Weeks 5-8)
*The core learning product*

- [ ] Tutorial data model + API
- [ ] Section-by-section reader UI
- [ ] Live code execution (Judge0)
- [ ] Exercise + test runner
- [ ] Tutorial progress tracking
- [ ] Teacher content studio (basic)
- [ ] 20 seed tutorials (Python, JavaScript, ML basics)

### Phase 3: Knowledge Network (Weeks 9-11)
*Community intelligence layer*

- [ ] Q&A database schema + API
- [ ] Question posting with duplicate detection (pgvector)
- [ ] Answer + voting system
- [ ] Reputation engine
- [ ] AI moderation pipeline
- [ ] Expert badge automation
- [ ] Full-text + semantic search

### Phase 4: Developer Portal (Weeks 12-16)
*The portfolio and collaboration system*

- [ ] Repository creation + file management
- [ ] Commit history simulation
- [ ] Issue tracker
- [ ] Pull request + diff viewer
- [ ] AI code review on PRs
- [ ] Developer public profile
- [ ] Contribution graph

### Phase 5: AI Intelligence Upgrade (Weeks 17-20)
*Move from reactive AI to proactive AI*

- [ ] AI Orchestrator service
- [ ] pgvector semantic search for all content
- [ ] AI Tutorial Generator for teachers
- [ ] AI Hackathon auto-generator
- [ ] Personalized learning path engine
- [ ] AI-powered daily recommendations

### Phase 6: Organization Ecosystem (Weeks 21-24)
*Corporate and university integration*

- [ ] Organization profiles + dashboards
- [ ] Corporate hackathon hosting portal
- [ ] University campus program management
- [ ] Talent pool (corporate recruiter tools)
- [ ] API for university LMS integration

### Phase 7: Scale & Polish (Weeks 25-28)
*Production hardening*

- [ ] CDN integration (CloudFront)
- [ ] Database read replicas
- [ ] Background job queue (BullMQ)
- [ ] Monitoring (Prometheus + Grafana)
- [ ] Mobile-responsive audit
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Internationalization (i18n) foundation

### Phase 8: Global Launch (Weeks 29-32)
*Go live*

- [ ] Public launch (Product Hunt, HN)
- [ ] University partnerships (5 pilot schools)
- [ ] Corporate pilot program (3 companies)
- [ ] Press kit + documentation site
- [ ] Community Discord
- [ ] Ambassador program for top contributors

---

## PART XI — SCALABILITY DESIGN

### Traffic Assumptions
```
Year 1:     100,000 users
Year 2:     1,000,000 users
Year 3:     10,000,000 users (global civilization scale)
```

### Database Scaling Strategy
```
Phase 1 (0-100K users)
  Single PostgreSQL (RDS)         — Sufficient
  Single Redis                    — Sufficient

Phase 2 (100K-1M users)
  Read replicas (2x RDS Read)     — Scale read traffic
  Redis Cluster (3 nodes)         — Scale cache
  Table partitioning (quizzes, submissions by date)

Phase 3 (1M-10M users)
  PgBouncer connection pooling    — 10K concurrent connections
  Citus (sharding extension)      — Horizontal DB sharding
  Dedicated Redis per service     — Service isolation
  Separate database per domain    — Full microservices DB
```

### Caching Strategy
```
L1: In-memory (Node.js process cache)    — 5 second TTL
L2: Redis                               — 1 hour TTL
L3: CDN (CloudFront)                    — 24 hour TTL for static

Cache what:
  - Tutorial content (rendered markdown)  → 1 hour
  - Leaderboards                         → 5 minutes
  - User profiles                        → 15 minutes
  - Q&A questions (popular)              → 30 minutes
  - AI-generated content                 → 24 hours
  - Certificate verification             → 7 days
```

### Real-time Architecture
```
WebSocket Rooms (Socket.io):
  hackathon:{id}       — Live leaderboard updates
  classroom:{id}       — Teacher-student real-time
  qna:{questionId}     — Live answer notifications
  ai-stream:{userId}   — AI response streaming

Redis Pub/Sub channels:
  events:xp            — XP award events
  events:submission    — New submission events
  events:certificate   — Certificate issued
```

---

## PART XII — SECURITY ARCHITECTURE

```
LAYER 1: Edge (Nginx)
  - Rate limiting (100 req/15min per IP)
  - DDoS mitigation (connection limits)
  - SSL termination
  - Bot detection headers

LAYER 2: Application
  - JWT with rotating refresh tokens
  - HttpOnly, Secure, SameSite=Strict cookies
  - CSRF tokens for state-changing ops
  - Input validation (Zod schemas)
  - SQL injection prevention (parameterized queries)
  - XSS prevention (CSP headers)

LAYER 3: AI Services
  - API key rotation
  - Prompt injection detection
  - Output sanitization before DB storage
  - Rate limiting per user (AI credits)

LAYER 4: Data
  - Encryption at rest (RDS)
  - Encryption in transit (TLS 1.3)
  - PII data separation
  - GDPR-compliant data export/delete
  - Audit log for all sensitive operations

LAYER 5: Code Execution
  - Judge0 sandboxed execution
  - Resource limits (CPU, memory, time)
  - No network access in sandbox
  - Container isolation per submission
```

---

*This document is the foundation of BlueLearnerHub's transformation into a
global engineering education civilization. Every line of code written from
this point forward should serve this vision.*

**Version:** 1.0
**Date:** 2026-03-10
**Status:** Active Architecture
