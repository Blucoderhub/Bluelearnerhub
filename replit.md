# BluelearnerHub EdTech Platform

## Project Overview
A comprehensive full-stack EdTech platform with:
- **Frontend**: Next.js 14 (upgraded to run on Next.js 16 in Replit) — runs on port 5000
- **Backend**: Express + TypeScript API — runs on port 3001
- **AI Services**: Python FastAPI — runs on port 8000

## Architecture
- Monorepo with npm workspaces (`frontend/`, `backend/`)
- Frontend: Next.js App Router with role-based auth (next-auth)
- Backend: Express with Drizzle ORM, PostgreSQL, Redis, Socket.io
- AI: FastAPI with Google Generative AI integration

## Replit Configuration
- **Main workflow**: `cd frontend && npm run dev` (port 5000, webview)
- **Node.js**: v20 (required for Next.js >= 20.9.0)
- **Frontend dev command**: `next dev -p 5000 -H 0.0.0.0`

## Required Environment Variables
Set these as secrets in Replit:

### Critical (app won't work without these)
- `NEXTAUTH_SECRET` — Random secret for next-auth JWT signing
- `NEXTAUTH_URL` — Your Replit app URL (e.g. `https://your-repl.replit.app`)
- `NEXT_PUBLIC_API_URL` — Backend API URL (e.g. `http://localhost:3001`)

### Database
- `DATABASE_URL` — PostgreSQL connection string
- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`

### Backend Auth
- `JWT_SECRET` — Secret for JWT signing
- `JWT_REFRESH_SECRET` — Secret for JWT refresh tokens
- `SESSION_SECRET` / `COOKIE_SECRET`

### Optional (for full functionality)
- `REDIS_URL` / `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` — Caching
- `SENDGRID_API_KEY` — Email sending
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET` — File storage
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — Google OAuth
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — Payments
- `JUDGE0_API_KEY` — Code execution
- `AI_SERVICE_URL` — AI service endpoint

## Key Files
- `frontend/next.config.ts` — Next.js config (allowedDevOrigins set for Replit)
- `frontend/package.json` — Scripts updated to use port 5000 and bind 0.0.0.0
- `backend/src/config/index.ts` — Backend config (reads from env vars)

## Migrations Done for Replit
1. Updated `frontend/package.json` dev/start scripts to use `-p 5000 -H 0.0.0.0`
2. Upgraded Node.js from v18 to v20 (Next.js requirement)
3. Fixed conflicting dynamic route slugs (`[id]` vs `[hackathonId]` in hackathons route)
4. Added `allowedDevOrigins` and `turbopack.root` to `next.config.ts`
