# Quick Start - BluelearnerHub Web Platform

This document provides instructions to get the platform running quickly in development mode on Windows.

## Prerequisites

✅ **Required:**
- Node.js (v18+)
- npm (v8+)
- Python (v3.9+)
- Git

⚠️ **Database Docker Setup:**
- Docker Desktop (required for PostgreSQL/Redis)
- OR PostgreSQL + Redis installed locally

## ⚡ Quick Start (60 seconds)

### Step 1: Install Dependencies

```powershell
cd C:\Users\"Shankar R"\Downloads\Bluelearnerhub\edtech-platform

# Install backend dependencies
cd backend
npm install --legacy-peer-deps

# Install frontend dependencies
cd ../frontend
npm install --legacy-peer-deps

# Install AI services dependencies
cd ../ai-services
pip install -r requirements.txt
```

### Step 2: Setup Environment Files

✅ Created automatically:
- `.env` (root) - Main configuration
- `backend/.env` - Backend API configuration
- `ai-services/.env` - AI services configuration
- `frontend/.env.local` - Frontend configuration

**No additional setup needed** - all files are pre-configured for development!

### Step 3: Start Database Services

**Option A: Using Docker (Recommended)**
```powershell
cd C:\Users\"Shankar R"\Downloads\Bluelearnerhub\edtech-platform

# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Wait for services to be ready (10-15 seconds)
Write-Host "✅ Database services started!"
```

**Option B: Using Local PostgreSQL**
If you have PostgreSQL installed locally and running on port 5432:
```powershell
# Just ensure your local PostgreSQL is running
# For development, the connection string is already configured to: 
# postgresql://postgres:postgres@localhost:5432/edtech_platform_dev
```

### Step 4: Launch Services (In Separate Terminals)

**Terminal 1 - Backend API (Port 5000)**
```powershell
cd C:\Users\"Shankar R"\Downloads\Bluelearnerhub\edtech-platform\backend
npm run dev
# Expected: Server running on http://localhost:5000
```

**Terminal 2 - AI Services (Port 8000)**
```powershell
cd C:\Users\"Shankar R"\Downloads\Bluelearnerhub\edtech-platform\ai-services
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
# Expected: API running on http://localhost:8000
```

**Terminal 3 - Frontend (Port 3000)**
```powershell
cd C:\Users\"Shankar R"\Downloads\Bluelearnerhub\edtech-platform\frontend
npm run dev
# Expected: App running on http://localhost:3000
```

### Step 5: Access the Platform

Once all services are running:

```
🌐 Frontend: http://localhost:3000
📡 Backend:  http://localhost:5000/api/v1
🤖 AI:       http://localhost:8000
```

## 🎯 What You'll See

### Frontend Features
- 📚 Quiz Generation and Practice
- 💼 Hackathon Browse & Join
- 🏢 Job Listings & Applications
- 👤 User Dashboard & Progress
- 🎓 Learning Path & Recommendations

### Backend Services
- ✅ User Authentication (JWT)
- ✅ Quiz Management API
- ✅ Hackathon Management
- ✅ Job Board API
- ✅ AI Integration Endpoints

### AI Services (Google Gemini Powered)
- ✅ Quiz Generation
- ✅ Interview Simulation
- ✅ Code Review & Analysis
- ✅ Training Data Generation

## 📊 Database Schema

The platform uses PostgreSQL with pre-defined schemas for:
- Users & Authentication
- Quizzes & Questions
- Hackathons & Teams
- Jobs & Applications
- Interview Sessions
- Learning Paths

**Migrations are applied automatically** on first backend run.

## 🔧 Development Configuration

### API Endpoints

```bash
# Test Backend API
curl http://localhost:5000/api/v1/health

# Test AI Services
curl http://localhost:8000/docs

# Test Frontend
open http://localhost:3000
```

### Debug Logging

All services have SQL logging and detailed error reporting enabled:
- Backend: Check `src/logs/` 
- AI Services: Check console output
- Frontend: Browser DevTools

### Hot Reload

All services support hot reload:
- **Frontend (Next.js)**: Save changes, browser updates automatically
- **Backend (ts-node-dev)**: Save changes, server restarts automatically
- **AI Services (Uvicorn)**: Save changes, API reloads automatically

## 🚀 Common Tasks

### Reset Database

```powershell
# Drop and recreate database
docker-compose down -v
docker-compose up -d postgres redis
```

### View Logs

```powershell
# Backend logs
cd backend && npm run dev

# AI Services logs
# Check console where Python process is running

# Frontend logs
# Check browser console (F12)
```

### Stop Services

```powershell
# Stop all services
Ctrl + C in each terminal

# Stop Docker containers
docker-compose down
```

### Install New Dependencies

```powershell
# Frontend
cd frontend && npm install --legacy-peer-deps

# Backend
cd backend && npm install --legacy-peer-deps

# AI Services
cd ai-services && pip install -r requirements.txt
```

## ✅ Verification Checklist

Make sure everything is working:

- [ ] Backend running on port 5000
- [ ] AI Services running on port 8000
- [ ] Frontend accessible on port 3000
- [ ] Can load homepage without errors
- [ ] Can see API documentation on http://localhost:8000/docs
- [ ] Database connection working (no connection errors in logs)

## 🆘 Troubleshooting

### Port Already in Use

```powershell
# Find what's using port 5000
Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess, State

# Kill the process
Stop-Process -Id <PID> -Force
```

### Database Connection Error

```
Error: Cannot connect to postgresql://postgres:postgres@localhost:5432/edtech_platform_dev
```

**Solution:** 
- Ensure PostgreSQL is running (Docker or local)
- Verify `DATABASE_URL` in `.env` files
- Check PostgreSQL credentials match

### Module Not Found Errors

```
Error: Cannot find module '@/...'
```

**Solution:**
```powershell
# Reinstall dependencies
cd backend
rm -r node_modules package-lock.json
npm install --legacy-peer-deps
```

### Frontend Build Error

```
Error: Next.js build failed
```

**Solution:**
```powershell
cd frontend
npm run build
# Check error details in console output
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Google Gemini API](https://makersuite.google.com/app/apikey)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 💡 Tips

1. **Use Chrome DevTools** for frontend debugging (F12)
2. **Check browser console** for API errors
3. **Look at terminal output** for service startup messages
4. **Review `.env` files** if services can't connect
5. **Restart services** if you change environment variables

---

**Platform is ready for testing!** 🎉

Go to http://localhost:3000 in your browser to see the platform in action.