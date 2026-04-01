# BlueLearnerHub Deployment Guide

## Quick Deploy (Recommended for MVP)

### 1. Railway (Backend + Database)

1. **Create Railway Account**: https://railway.app

2. **Add PostgreSQL Database**:
   - Click "New Project" → "Provision PostgreSQL"
   - Copy the connection URL

3. **Deploy Backend**:
   ```
   - Connect your GitHub repo
   - Set root directory: `backend`
   - Environment Variables:
     DATABASE_URL: <your-postgres-url>
     JWT_SECRET: <generate-random-string>
     PORT: 5000
   ```

4. **Deploy Frontend** (Vercel):
   ```
   - Import your GitHub repo
   - Set root directory: `frontend`
   - Environment Variables:
     NEXT_PUBLIC_API_URL: https://your-backend.railway.app
   ```

### 2. Manual Docker Deploy

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or run containers separately
docker run -d --name edtech_db postgres:16-alpine
docker run -d -p 5000:5000 --link edtech_db your-backend-image
docker run -d -p 3000:3000 your-frontend-image
```

---

## Environment Variables

### Backend (Production)

```env
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Security (IMPORTANT: Change these!)
JWT_SECRET=generate-a-secure-random-string-here
JWT_REFRESH_SECRET=another-secure-random-string

# CORS
CORS_ORIGINS=https://your-domain.com
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Production)

```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## Domain Setup

### Vercel (Frontend)
1. Import project from GitHub
2. Add custom domain in Settings → Domains
3. Update CORS_ORIGINS in backend

### Railway (Backend)
1. Add custom domain in Settings → Networking → Domains
2. Update NEXT_PUBLIC_API_URL in frontend

---

## Database Migrations

Run migrations on production:

```bash
# Connect to production database
psql $DATABASE_URL < database/migrations/001_initial_schema.sql
```

Or use Drizzle push:

```bash
cd backend
npx drizzle-kit push
```

---

## Health Check

Verify deployment:

```bash
curl https://your-backend.railway.app/health
```

Expected response:
```json
{"status":"ok","timestamp":"..."}
```

---

## Troubleshooting

### Backend won't start
- Check logs: `railway logs`
- Verify DATABASE_URL is set correctly
- Check if port 5000 is exposed

### Database connection failed
- Verify DATABASE_URL format: `postgresql://user:pass@host:port/db`
- Check if database is accessible from backend's network

### CORS errors
- Update CORS_ORIGINS to include your frontend URL
- Use exact URLs, no wildcards for production

### Frontend can't reach backend
- Verify NEXT_PUBLIC_API_URL is correct
- Check if backend is responding to health checks

---

## Performance Tips

1. **Enable caching** on hackathons listing (Redis)
2. **Add CDN** for static assets (Vercel does this automatically)
3. **Database indexing** - indexes already added in migration
4. **Rate limiting** - already implemented

---

## Security Checklist

- [ ] Change JWT_SECRET from dev value
- [ ] Change all passwords
- [ ] Enable HTTPS (automatic on Railway/Vercel)
- [ ] Set proper CORS origins
- [ ] Enable rate limiting (already on)
- [ ] Add CSP headers

---

## Monitoring

Add these for production:

1. **Sentry** - Error tracking
   ```bash
   npm install @sentry/node
   ```

2. **Better Uptime** - Uptime monitoring
   - Add your health endpoint

3. **LogRocket** - Session replay (frontend)
