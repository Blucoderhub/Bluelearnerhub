# BluelearnerHub EdTech Platform

## Project Overview
A comprehensive full-stack EdTech platform with gamification and mobile-first design:
- **Frontend**: Next.js 16 with Tailwind CSS v3, framer-motion — runs on port 5000
- **Backend**: Express + TypeScript API — runs on port 3001
- **AI Services**: Python FastAPI — runs on port 8000

## Architecture
- Monorepo with npm workspaces (`frontend/`, `backend/`)
- Frontend: Next.js App Router with role-based route groups (student, corporate, HR, admin, faculty, institution, candidate)
- Backend: Express with Drizzle ORM, PostgreSQL, Redis, Socket.io
- AI: FastAPI with Google Generative AI integration
- Auth: Cookie-based via backend API (`/auth/me`, `/auth/login`, `/auth/logout`) — no NextAuth/JWT

## Replit Configuration
- **Main workflow**: `cd frontend && npm run dev` (port 5000, webview)
- **Node.js**: v20
- **Frontend dev command**: `next dev --webpack -p 5000 -H 0.0.0.0` (webpack mode for Replit compatibility)
- **CSS**: Tailwind CSS v3 with HSL CSS variables, dark mode via `.dark` class

## Design System
- **Theme**: Dark-first design with midnight blue backgrounds
- **Primary color**: Emerald/mint green (HSL 160 80% 38%)
- **Gamification colors**: XP Gold (#d4a843), Streak Orange (#e08a3c), Level Purple (#8b5cf6), Achievement Cyan (#22d3ee)
- **Fonts**: Inter (body), Outfit (headings), JetBrains Mono (code)
- **Components**: glass-card, glass-morphism, xp-bar, level-badge, achievement-badge, streak-flame

## Gamification Components
Located in `frontend/src/components/gamification/`:
- `XPProgressBar` — Animated XP bar with level display
- `AchievementBadge` / `AchievementGrid` — Unlocked/locked/new achievement states
- `DailyChallenge` — Challenge card with timer and XP reward
- `LeaderboardPreview` — Mini leaderboard with rankings
- `StreakDisplay` — Streak counter with flame animation

## Key Files
- `frontend/next.config.ts` — Next.js config (webpack custom rules, allowedDevOrigins, optimizePackageImports)
- `frontend/tailwind.config.ts` — Tailwind v3 config with custom colors, fonts, animations
- `frontend/src/app/globals.css` — Global CSS with design tokens and gamification styles
- `frontend/src/styles/animations.css` — Animation keyframes
- `frontend/src/app/(student)/layout.tsx` — Student layout with sidebar + mobile bottom nav
- `frontend/src/app/(student)/student/dashboard/page.tsx` — Gamified student dashboard
- `frontend/src/components/layout/Header.tsx` — Marketing header with mobile drawer
- `frontend/src/components/layout/Footer.tsx` — Marketing footer
- `frontend/src/components/animations/IsometricHero.tsx` — Landing page hero

## Route Groups
- `(marketing)` — Public landing page, marketing sections
- `(student)` — Student dashboard, tutorials, exercises, IDE, AI companion, hackathons
- `(corporate)` — Corporate dashboard
- `(hr)` — HR recruitment dashboard
- `(admin)` — Admin panel
- `(faculty)` — Faculty dashboard
- `(institution)` — Institution dashboard
- `(candidate)` — Job candidate dashboard

## Required Environment Variables
### Database
- `DATABASE_URL` — PostgreSQL connection string
- `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`
- `SESSION_SECRET` — Session signing

### Optional
- `REDIS_URL` — Caching
- `SENDGRID_API_KEY` — Email
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET` — File storage
- `STRIPE_SECRET_KEY` — Payments
- `JUDGE0_API_KEY` — Code execution
- `AI_SERVICE_URL` — AI service endpoint

## Migrations Done for Replit
1. Updated frontend scripts to use `-p 5000 -H 0.0.0.0`
2. Upgraded Node.js from v18 to v20
3. Fixed conflicting dynamic route slugs (`[id]` vs `[hackathonId]`)
4. Added `allowedDevOrigins` and `turbopack.root` to next.config.ts
5. Removed NextAuth/JWT — auth is cookie-based via backend
6. Converted CSS from Tailwind v4 syntax to v3 compatible
7. Using `--webpack` flag instead of Turbopack for resource compatibility
8. Complete mobile-first redesign with gamification features
