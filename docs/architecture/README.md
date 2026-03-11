# System Architecture

## Overview

The EdTech Platform follows a microservices architecture with additional support components:

1. **Frontend** - Next.js SPA
2. **Backend** - Express.js API
3. **AI Services** - FastAPI microservice
4. **AI Agent** - development-time CLI tool (`ai-agent/`) based on OpenClaw.  It is used
   by developers for automation, code generation, and deployment helpers and is
   not a runtime component of the live service.

Additionally:
- **AI System** - a multi-agent orchestration layer (`ai_system/`) leveraging OpenClaw for CTO/Dev/Product/Sales agents
- **AI Model** - local AirLLM-based model (`ai_model/`)  used by agents for reasoning and content generation
- **Telegram Bot** - command center (`telegram_bot/`) exposing agents via chat interface
- **Sales System** - lead/email/CRM modules (`sales_system/`) for outreach automation


## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Layer                          │
│    Web Browser (Next.js SPA) + Mobile Apps                 │
└───────────────────────────┬─────────────────────────────────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
         ┌──────▼──────┐   │    ┌──────▼──────┐
         │   Nginx    │    │    │ Nginx       │
         │ (Reverse   │    │    │ (Reverse    │
         │  Proxy)    │    │    │  Proxy)     │
         └──────┬──────┘    │    └──────┬──────┘
                │           │           │
         ┌──────▼────────────┼─────────────┐
         │   Backend Layer   │             │
         │   (Express.js)    │             │
         └──────┬──────┬─────┼──┬────────┬─┘
                │      │     │  │        │
         ┌──────▼──┐   │  ┌──▼──▼──┐   │
         │ Socket  │   │  │ Redis  │   │
         │   IO    │   │  │ (Cache)│   │
         └─────────┘   │  └────────┘   │
                │      │               │
         ┌──────▼──────▼───────────────▼──┐
         │   Data & Cache Layer           │
         │   PostgreSQL + Redis           │
         └────────────────────────────────┘
                │               │
         ┌──────▼──────┐   ┌────▼──────────┐   ┌────▼──────────┐   ┌─────▼─────┐
         │  AI Services │   │  Background   │   │ AI Agent      │   │ AI System │
         │  (FastAPI)  │   │  Jobs (Bull)  │   │ (OpenClaw)    │   │ (agents)  │
         └─────────────┘   └───────────────┘   └──────────────┘   └───────────┘
                │                                           │
                │                                           │
         ┌──────▼──────┐                         ┌────────┴────────┐
         │ AI Model    │                         │ Telegram Bot    │
         │ (AirLLM)    │                         │ & Sales System  │
         └─────────────┘                         └─────────────────┘
```

## Database Schema

### Core Tables

- **users** - User accounts and profiles
- **learning_paths** - Learning path information
- **courses** - Course details
- **lessons** - Individual lessons
- **user_progress** - User learning progress
- **quizzes** - Quiz definitions
- **questions** - Quiz questions
- **quiz_responses** - User quiz responses
- **hackathons** - Hackathon events
- **submissions** - Code submissions
- **jobs** - Job listings
- **applications** - Job applications
- **interviews** - Interview sessions
- **interview_responses** - Interview responses

## Key Components

### Frontend
- **Pages**: App Router-based pages for different features
- **Components**: Reusable UI components
- **Stores**: Zustand stores for state management
- **Hooks**: Custom React hooks for logic
- **Services**: API client and utilities

### Backend
- **Controllers**: Request handlers
- **Routes**: API route definitions
- **Models**: Database models
- **Services**: Business logic
- **Middleware**: Authentication, validation, error handling
- **WebSockets**: Real-time communication

### AI Services
- **Quiz Models**: Question generation, difficulty prediction
- **Code Models**: Code evaluation, plagiarism detection
- **Interview Models**: Response evaluation, ranking
- **Analytics**: Performance analytics and recommendations

## Data Flow

### Quiz Submission Flow
1. User completes quiz in frontend
2. Frontend sends response to backend API
3. Backend stores response in database
4. Backend triggers AI service for evaluation
5. AI service evaluates response and returns score
6. Backend updates user progress
7. Frontend displays results via real-time update

### Code Submission Flow
1. User submits code in hackathon
2. Backend receives submission
3. Code is executed via code execution service
4. Results and plagiarism check done by AI service
5. Leaderboard updated
6. Real-time update sent to connected clients

## Security

- JWT-based authentication
- Role-based access control (RBAC)
- Rate limiting on API endpoints
- CORS policy enforcement
- Input validation and sanitization
- Secure password storage with bcrypt
- SQL injection prevention with parameterized queries

## Scalability Considerations

- Horizontal scaling with load balancing
- Database replication and caching
- Queue-based job processing
- Microservice separation
- CDN for static assets
- Redis caching layer

## Performance

- Database indexing on frequently queried fields
- Redis caching for common queries
- Pagination for large datasets
- Compression (gzip) for API responses
- Code splitting in frontend
- Image optimization
