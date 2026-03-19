# BlueLearnerHub — Claude Code Instructions

## Project Context
- **Purpose**: Skill portfolio platform for engineering students in India (NO hiring promises)
- **Stack**: Next.js 16.1.6 App Router + React 19, Express 4.18 + TypeScript 5.3, FastAPI, PostgreSQL (Neon), Redis
- **Auth**: JWT + HttpOnly cookies (`accessToken` 7d, `refreshToken` 30d), `authenticate` middleware
- **ORM**: Drizzle ORM — schema in `backend/src/db/schema.ts` (v1) + `schema-v2.ts` (v2, both merged)
- **API client**: `frontend/src/lib/api-civilization.ts` — returns `r.data` directly. Pages use `d?.length` NOT `d.data?.length`

## gstack Skills Available
Use these skills via `/skill-name`:
- `/plan-eng-review` — architecture + implementation audit before starting a feature
- `/review` — PR/code review after changes
- `/qa` — find + fix bugs end-to-end
- `/qa-only` — report bugs without fixing
- `/debug` — systematic root-cause debugging
- `/ship` — ship workflow (build, test, commit)
- `/design-review` — UI/UX audit + fix loop
- `/careful` — careful, step-by-step implementation for risky changes
- `/browse` — headless browser (Playwright) for web browsing. ALWAYS use this, never mcp__claude-in-chrome__*

## Key Patterns

### API Client Usage
```ts
// CORRECT — api-civilization.ts returns r.data directly
const tracks = await tracksAPI.list()
if (tracks?.length) { ... }

// WRONG — double unwrap
const r = await tracksAPI.list()
if (r.data?.length) { ... }  // ❌
```

### Auth Middleware
```ts
// req.user is always typed — never use (req as any).user
req.user!.id    // authenticated routes
req.user?.id    // optional auth routes
```

### XP Award
```ts
await GamificationService.awardXP(userId, amount, 'reason')
```

### Route Protection (Frontend)
- `middleware.ts` checks `accessToken` cookie
- Student routes: `/student/*`, `/daily-quiz`, `/exercises`, etc.
- Auth routes: `/login`, `/forgot-password`, `/reset-password`

## Design System (Glow Principles)

### Fonts (CORRECT — what should be used)
- **Headings**: DM Sans (weight 600–700)
- **Body**: Plus Jakarta Sans (weight 400–500)
- **Mono**: JetBrains Mono

> Current layout.tsx uses Inter + Lora — this needs to be updated to DM Sans + Plus Jakarta Sans

### Color Tokens (CSS variables)
```
--background: 240 10% 3.9%   (dark default)
--primary: 263.4 70% 50.4%   (violet)
--foreground: 0 0% 98%
```
Gamification tokens: `--xp-gold`, `--streak-orange`, `--level-purple`, `--achievement-cyan`, `--reward-green`

### Design Anti-patterns (AVOID)
- Generic gradients (purple-to-blue blob backgrounds)
- Uniform border-radius on everything
- Icon grids with no hierarchy
- Generic "glowing card" effects that look like AI slop
- Excessive animations that don't serve UX

### Design Principles (Glow-inspired)
- Sharp typographic hierarchy — DM Sans headings, tight letter-spacing
- Controlled whitespace — breathe but don't float
- Gamification elements feel earned, not decorative
- Dark base (`#0a0a0f`) with selective violet/amber accent moments
- Borders over backgrounds — use `border` to define cards, not shadow soup

## Directory Structure
```
frontend/src/
  app/
    (auth)/           # login, forgot-password, reset-password
    (student)/        # dashboard, exercises, daily-quiz, qna, etc.
    (mentor)/         # teacher studio + dashboard
    (admin)/          # admin dashboard
    (marketing)/      # landing page
  components/
    gamification/     # AchievementBadge, XPProgressBar, LeaderboardPreview
    dashboard/        # StatsCard, StreakCounter
    ui/               # shadcn base + custom
  lib/
    api.ts            # Axios instance (withCredentials: true)
    api-civilization.ts  # Typed API client — all module endpoints

backend/src/
  controllers/        # 20+ controllers
  routes/index.ts     # All routes registered here
  middleware/auth.ts  # authenticate + optionalAuth
  db/
    index.ts          # Drizzle init (merges both schemas)
    schema.ts         # v1 legacy
    schema-v2.ts      # v2 — 8-module civilization
  services/
    gamification.service.ts  # XP/levels
    ai.service.ts            # Gemini + AIR LLM
    dailyQuiz.service.ts     # node-cron midnight UTC
```

## Hackathon Priority (48h)

### P0 — Must Ship
1. Font update: Inter+Lora → DM Sans+Plus Jakarta Sans
2. Auth flow end-to-end (login → dashboard → logout)
3. Coding challenges (exercises page) — live API + Judge0 code execution
4. Gamification — XP award on quiz/challenge completion, badge unlock
5. Daily quiz — AI generation working

### P1 — Should Ship
6. Dashboard live data (streak, XP bar, leaderboard)
7. Landing page polish (no AI slop aesthetics)
8. Error states everywhere (not blank pages)

### P2 — Nice to Have
9. AWS deployment
10. Hackathon registration flow
11. Org/corporate portal

## Environment
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- AI Services: `http://localhost:8000`
- DB: Neon PostgreSQL (cloud) or local PostgreSQL via docker-compose
