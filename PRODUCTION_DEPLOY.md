# BlueLearnerHub Production Deployment Checklist

## ✅ Pre-Deployment (Complete This First)

### 1. Generate Secrets
```bash
# Run these commands to generate secure secrets:
openssl rand -hex 32  # JWT_SECRET
openssl rand -hex 32  # JWT_REFRESH_SECRET  
openssl rand -hex 32  # SESSION_SECRET
openssl rand -hex 32  # COOKIE_SECRET
```

### 2. Set Environment Variables
Edit `backend/.env.production` and set:
- [ ] DATABASE_URL (PostgreSQL from Neon/RDS)
- [ ] REDIS_URL (Upstash/Redis Cloud - REQUIRED for 600 users)
- [ ] JWT_SECRET (from step 1)
- [ ] JWT_REFRESH_SECRET (from step 1)
- [ ] SESSION_SECRET (from step 1)
- [ ] COOKIE_SECRET (from step 1)
- [ ] FRONTEND_URL (your production URL)
- [ ] BACKEND_URL (your API URL)

### 3. Optional Services
- [ ] GEMINI_API_KEY (AI features)
- [ ] RESEND_API_KEY (Email delivery)
- [ ] STRIPE_SECRET_KEY (Payments)
- [ ] JUDGE0_API_KEY (Code execution)

---

## 🚀 Deployment Commands

### Backend
```bash
cd backend
npm install
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run build
npm start
```

### With Docker
```bash
cd devops
docker-compose -f docker-compose.yml up --build
```

---

## ⚠️ Critical Notes

1. **REDIS is required** for 600 users - the app will fail without it in production
2. **SESSION_SECRET** - app will exit if not set in production
3. **CORS** - restricted to bluelearnerhub.com domains only
4. **Database** - use Neon (free tier works) or RDS

---

## 📊 Expected Performance

| Metric | Target |
|--------|-------|
| Concurrent Users | 600+ |
| API Response Time | <200ms |
| Database Connections | 50 |
| Rate Limit | 200/min |

---

## 🔧 Troubleshooting

### If connection errors:
- Check DATABASE_URL format: `postgresql://user:pass@host:5432/db?sslmode=require`
- Check Redis URL format: `rediss://:token@host:6379`

### If CORS errors:
- Verify FRONTEND_URL matches exactly

### If rate limited:
- Increase RATE_LIMIT_MAX_REQUESTS in .env.production