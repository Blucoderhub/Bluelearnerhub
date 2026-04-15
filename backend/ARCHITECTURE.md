# Backend Architecture Documentation

## Overview

BluelearnerHub uses a **hybrid multi-service architecture** with the following components:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js 16)                          │
│                           Port: 3000                                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│   Backend (Node.js/Express)     │   │   AI Services (Node.js + Python)│
│         Port: 5000               │   │          Port: 8000              │
│                                 │   │                                  │
│  - REST API (all core features) │   │  - Gemini AI (primary)           │
│  - JWT Authentication           │   │  - Ollama (local fallback)       │
│  - Socket.IO WebSockets         │   │  - Quiz Generation               │
│  - PostgreSQL + Redis            │   │  - Agent System (CTO/Dev/       │
│  - Drizzle ORM                   │   │    Product/Sales)               │
│  - Stripe Payments               │   │                                  │
└─────────────────────────────────┘   └─────────────────────────────────┘
            │                                   │
            ▼                                   ▼
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│       PostgreSQL (port 5432)     │   │         Redis (port 6379)        │
└─────────────────────────────────┘   └─────────────────────────────────┘
```

## Primary vs Secondary Services

### Primary Backend: Node.js/Express (`backend/`)
**Status: ACTIVE - Primary**

This is the **main backend** handling all core platform features:

| Feature | Endpoint | Service |
|---------|----------|---------|
| Authentication | `/api/auth/*` | JWT + httpOnly cookies |
| User Management | `/api/users/*` | Drizzle ORM |
| Learning Paths | `/api/learning/*` | PostgreSQL |
| Quizzes | `/api/quiz/*` | QuizService |
| Hackathons | `/api/hackathons/*` | HackathonService |
| Jobs | `/api/jobs/*` | JobService |
| Analytics | `/api/analytics/*` | PostgreSQL |
| Real-time | Socket.IO | WebSocket |
| Payments | Stripe | PaymentService |

### AI Services: Node.js + Python (`worker/ai-services/`)
**Status: ACTIVE - AI-Only**

These are **specialized AI services** called by the primary backend:

| Service | Called From | Purpose |
|---------|-------------|---------|
| `/api/ai/generate` | Backend `/api/ai/*` | AI content generation |
| `/api/ai/quiz` | Backend Quiz endpoint | AI-generated quizzes |
| `/api/ai/chat` | Frontend AI Companion | Real-time AI tutoring |
| `/api/agent/*` | Internal services | Multi-agent commands |

#### Architecture Note:
The Python/FastAPI layer (`worker/ai-services/app/`) is **partially implemented** but not currently running. The Node.js layer handles all AI requests via Gemini API. The Python layer provides:
- Advanced caching with Redis
- Multi-agent orchestration
- Training data generation pipeline
- (Future) Local LLM support via Ollama

## Database Queries: Avoiding N+1 Patterns

### Best Practices Implemented:

1. **Use JOINs for related data** - See `src/db/schema.ts` for relationships
2. **Eager loading with `.with()`** - Drizzle ORM eager loading:
   ```typescript
   // ✅ Good: Single query with JOIN
   const users = await db.query.users.findMany({
     with: { profile: true, achievements: true }
   })
   
   // ❌ Bad: N+1 queries
   for (const user of users) {
     await db.query.profiles.findFirst({ where: eq(profiles.userId, user.id) })
   }
   ```

3. **Pagination with cursor-based approach** - Use `limit` and `cursor` parameters

4. **DataLoader pattern** - When needed, use batching for repeated lookups

### Controllers Reviewed for N+1:

| Controller | Status | Notes |
|------------|--------|-------|
| `auth.controller.ts` | ✅ Good | Simple queries |
| `quiz.controller.ts` | ✅ Good | Uses eager loading |
| `hackathon.controller.ts` | ✅ Good | JOINs for teams/members |
| `job.controller.ts` | ✅ Good | Uses `with` for relations |
| `learning.controller.ts` | ✅ Good | Course/Lesson relations |
| `gamification.controller.ts` | ✅ Good | Leaderboard queries |

## Testing Strategy

### Backend Tests (`backend/tests/`)

| Test File | Coverage |
|-----------|----------|
| `tests/controllers/auth.test.ts` | Login, register, token refresh |
| `tests/controllers/gamification.test.ts` | Points, streaks, achievements |
| `tests/controllers/security.test.ts` | Rate limiting, CSRF |
| `tests/controllers/notebooks.controller.test.ts` | CRUD operations |
| `tests/controllers/errors.test.ts` | Error handling |
| `tests/utils/jwt.test.ts` | JWT signing/verification |

### Running Tests:
```bash
cd backend
npm test
```

### Adding New Tests:
1. Create `tests/controllers/<feature>.test.ts`
2. Use existing `tests/setup.ts` for test configuration
3. Mock Express req/res objects as shown in auth.test.ts

## Deployment

### Development:
```bash
# Start all services
cd devops && docker-compose up

# Or start individually:
cd backend && npm run dev      # Port 5000
cd worker/ai-services && npm start  # Port 8000
```

### Production:
- **Backend**: Express on ECS Fargate (port 5000)
- **AI Services**: Node.js on ECS Fargate (port 8000)
- **Database**: RDS PostgreSQL
- **Cache**: ElastiCache Redis

## Environment Variables

| Variable | Backend | AI Services | Description |
|----------|---------|-------------|-------------|
| `DATABASE_URL` | ✅ | ✅ | PostgreSQL connection |
| `REDIS_URL` | ✅ | ✅ | Redis connection |
| `JWT_SECRET` | ✅ | - | JWT signing key |
| `GEMINI_API_KEY` | - | ✅ | Google Gemini AI |
| `OLLAMA_URL` | - | ✅ | Local LLM (optional) |

---

**Last Updated**: April 2026
**Architecture Version**: 2.0
