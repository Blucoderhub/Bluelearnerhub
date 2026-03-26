# BluelearnerHub EdTech Platform

## Project Overview
A comprehensive full-stack EdTech platform with gamification, isometric animations, animated characters, and mobile-first design:
- **Frontend**: Next.js 16 with Tailwind CSS v3, framer-motion, SVG character animations — runs on port 5000
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
- **Deployment**: Autoscale mode, build: `cd frontend && npm run build`, run: `cd frontend && npm run start`
- **CSS**: Tailwind CSS v3 with HSL CSS variables, dark mode via `.dark` class

## Design System
- **Theme**: Dark-first design with midnight blue backgrounds
- **Primary color**: Emerald/mint green (HSL 160 80% 38%)
- **Gamification colors**: XP Gold (#d4a843), Streak Orange (#e08a3c), Level Purple (#8b5cf6), Achievement Cyan (#22d3ee)
- **Fonts**: Inter (body), Outfit (headings), JetBrains Mono (code)
- **Components**: glass-card, glass-morphism, xp-bar, level-badge, achievement-badge, streak-flame

## Animation System
### Isometric Scene (`frontend/src/components/animations/`)
- `IsometricScene.tsx` — Full isometric 3D scene with grid floor, 4 buildings, connection lines, particles, achievement badges
- `IsometricBuilding.tsx` — Reusable isometric building with configurable icon, color, glow, and floating animation
- CSS transforms (rotateX/rotateZ) for isometric perspective, framer-motion for entrance/float animations

### Animated Characters (`frontend/src/components/animations/characters/`)
- `CodingCharacter.tsx` — Person typing at desk with blinking cursor, code symbols
- `LearningCharacter.tsx` — Person reading with floating lightbulbs
- `CollaboratingCharacters.tsx` — Two people high-fiving with spark effects
- `CelebrationCharacter.tsx` — Person jumping with confetti
- All SVG-based, animated with framer-motion, lightweight (no external assets)

### Utilities
- `Confetti.tsx` — Reusable confetti animation with `useConfetti` hook
- `animations.css` — Keyframes for slide-in, float, shimmer, skeleton, confetti, XP burst
- `isometric.css` — Isometric scene-specific styles, grid, building entrance/float animations
- `prefers-reduced-motion` support for accessibility

## Gamification Components
Located in `frontend/src/components/gamification/`:
- `XPProgressBar` — Animated XP bar with level display, particle burst on level-up
- `AchievementBadge` / `AchievementGrid` — Unlocked/locked/new achievement states
- `DailyChallenge` — Challenge card with timer, XP reward, and CodingCharacter companion
- `LeaderboardPreview` — Mini leaderboard with rankings
- `StreakDisplay` — Streak counter with flame animation

## Key Files
- `frontend/next.config.ts` — Next.js config (webpack rules, allowedDevOrigins, optimizePackageImports)
- `frontend/tailwind.config.ts` — Tailwind v3 config with custom colors, fonts, animations
- `frontend/src/app/globals.css` — Global CSS with design tokens, gamification styles, isometric imports
- `frontend/src/styles/animations.css` — Animation keyframes and utility classes
- `frontend/src/styles/isometric.css` — Isometric 3D scene styles
- `frontend/src/app/(student)/layout.tsx` — Student layout with sidebar + mobile bottom nav + streak buddy
- `frontend/src/app/(student)/student/dashboard/page.tsx` — Gamified dashboard with celebrations
- `frontend/src/components/animations/IsometricHero.tsx` — Hero with isometric scene + characters
- `frontend/src/components/layout/Header.tsx` — Marketing header with mobile drawer
- `frontend/src/components/layout/Footer.tsx` — Marketing footer

## Route Groups
- `(marketing)` — Public landing page with isometric hero, marketing sections
- `(student)` — Student dashboard, tutorials, courses, exercises, quiz, labs, IDE, AI companion, hackathons, premium
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
