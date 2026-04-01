# BlueLearnerHub MVP

A gamified skill portfolio platform for engineering students in India with hackathon hosting capabilities.

## Features

### For Students
- [x] Browse hackathons
- [x] View hackathon details
- [x] Register for hackathons
- [x] Profile with XP, level, streak
- [x] Public portfolio page
- [x] Achievements display
- [x] Leaderboard

### For Corporates
- [x] Create hackathons
- [x] View hosted hackathons
- [x] View registrations
- [x] Corporate dashboard

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, TailwindCSS
- **Backend**: Express 4, TypeScript, Node.js
- **Database**: PostgreSQL (via Drizzle ORM)
- **Auth**: JWT with HttpOnly cookies

## Quick Start

### Prerequisites
- Node.js 18+
- Docker (for PostgreSQL)

### 1. Setup Database

**Linux/Mac:**
```bash
./scripts/setup-database.sh
```

**Windows:**
```powershell
.\scripts\setup-database.ps1
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

The setup script creates `.env` files automatically. For manual setup:

**Backend** (`backend/.env`):
```
DATABASE_URL=postgresql://postgres:blh_pg_xK9mP2vL8qR4nW6yZ3aB7cD@localhost:5432/edtech_platform
JWT_SECRET=your-secret-key
```

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Run Development Servers

```bash
# Both frontend and backend
npm run dev

# Or individually:
npm run dev:backend  # Backend on http://localhost:5000
npm run dev:frontend # Frontend on http://localhost:3000
```

## Test Accounts

After running the migration, these accounts are created:

| Role | Email | Password |
|------|-------|----------|
| Student | student@test.com | Test@123456 |
| Corporate | corp@test.com | Test@123456 |

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Hackathons
- `GET /api/hackathons` - List all hackathons
- `GET /api/hackathons/:id` - Get hackathon details
- `POST /api/hackathons` - Create hackathon (corporate only)
- `POST /api/hackathons/:id/register` - Register for hackathon
- `GET /api/hackathons/:id/registrations` - View registrations (organizer only)
- `GET /api/hackathons/hosted` - Get hosted hackathons (corporate only)

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── services/       # Business logic
│   │   ├── models/         # Database models
│   │   ├── middleware/      # Auth, validation, etc.
│   │   └── db/            # Schema and migrations
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js pages
│   │   ├── components/     # Reusable components
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # API client
│   └── package.json
│
├── scripts/                # Setup scripts
└── database/
    └── migrations/         # SQL migrations
```

## Database

The database runs on PostgreSQL via Docker. Tables created:

- `users` - User accounts
- `hackathons` - Hackathon events
- `hackathon_registrations` - Student registrations
- `teams` - Team information
- `team_members` - Team membership
- `hackathon_submissions` - Project submissions
- `refresh_tokens` - JWT refresh tokens
- `user_skills` - User skills

## TODO (Post-MVP)

- [ ] Real payment integration (Razorpay/Stripe)
- [ ] AI quiz generation
- [ ] Anti-cheat system
- [ ] Certificate generation
- [ ] Email notifications
- [ ] Mobile app

## License

MIT
