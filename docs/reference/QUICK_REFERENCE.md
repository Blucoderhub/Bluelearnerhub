# Developer Quick Reference

Fast lookup guide for common development tasks and commands.

## 🚀 Start Services

### Docker (Recommended)

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f ai-services
```

### Manual Start (Separate Terminals)

```bash
# Terminal 1: Backend
cd backend
npm run dev
# Runs on http://localhost:5000

# Terminal 2: AI Services
cd ai-services
python app/main.py
# Runs on http://localhost:8000

# Terminal 3: Frontend (if needed)
cd frontend
npm run dev
# Runs on http://localhost:3000
```

## 📦 Installation & Setup

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Install new package
npm install package-name

# Build TypeScript
npm run build

# Format code
npm run format

# Run linter
npm run lint

# Type check
npm run type

# Run tests
npm test
```

### AI Services Setup

```bash
cd ai-services

# Run setup script
bash setup.sh          # macOS/Linux
setup.bat            # Windows

# Install dependencies manually
python -m venv venv
source venv/bin/activate  # or: venv\Scripts\activate on Windows
pip install -r requirements.txt

# Download ML models
bash download-models.sh    # macOS/Linux
download-models.bat       # Windows

# Install new package
pip install package-name

# Export requirements
pip freeze > requirements.txt
```

## 🔧 Configuration

### Backend Environment (`backend/.env`)

```bash
# Copy from example
cp .env.example .env

# Edit configuration
nano .env  # or: code .env

# Key variables:
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-here
```

### AI Services Environment (`ai-services/.env`)

```bash
# Copy from example
cp .env.example .env

# Edit configuration
nano .env  # or: code .env

# Key variables:
DEBUG=True
PORT=8000
DATABASE_URL=postgresql://user:pass@localhost:5432/db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-here
ML_DEVICE=cpu  # or 'cuda' for GPU
```

## 🧪 Testing

### Backend Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.ts

# Run specific test suite
npm test -- --testNamePattern="authentication"
```

### AI Services Tests

```bash
# Run all tests
pytest

# Run in verbose mode
pytest -v

# Run with coverage report
pytest --cov=app

# Run specific test file
pytest tests/test_quiz.py

# Run specific test function
pytest tests/test_quiz.py::test_generate_questions -v

# Run tests matching pattern
pytest -k "test_cache" -v
```

## 🔍 Debugging

### Backend Debugging

```bash
# Enable debug logging
DEBUG=true npm run dev

# Use Node debugger
node --inspect-brk dist/server.js

# Chrome DevTools: chrome://inspect
```

### AI Services Debugging

```bash
# Enable debug logging
DEBUG=True python app/main.py

# Python debugger
python -m pdb app/main.py

# Interactive shell
python
>>> from app.core import settings
>>> print(settings)
```

## 📊 Code Quality

### Backend

```bash
# Format code with Prettier
npm run format

# Check with ESLint
npm run lint

# Fix ESLint issues
npm run lint -- --fix

# TypeScript type check
npm run type

# Run all quality checks
npm run lint && npm run type && npm run format

# View test coverage
open coverage/index.html
```

### AI Services

```bash
# Format with Black
black app/

# Check code style
flake8 app/

# Type checking with mypy
mypy app/

# Run code quality checks
black --check app/ && flake8 app/ && mypy app/

# Autofix issues
autopep8 --in-place --aggressive --aggressive app/**/*.py
```

## 🐛 Common Commands

### Database

```bash
# Connect to database
psql -U edtech_user -d edtech_db

# List tables
\dt

# Run SQL query
psql -U edtech_user -d edtech_db -c "SELECT * FROM users LIMIT 10;"

# Create database
createdb -U edtech_user edtech_db

# Drop database
dropdb -U edtech_user edtech_db

# Backup database
pg_dump -U edtech_user edtech_db > backup.sql

# Restore database
psql -U edtech_user edtech_db < backup.sql
```

### Redis

```bash
# Connect to Redis CLI
redis-cli

# Ping
PING

# Get key
GET my_key

# Set key
SET my_key "value"

# Delete key
DEL my_key

# List all keys
KEYS *

# Clear database
FLUSHDB

# Get info
INFO

# Monitor commands
MONITOR
```

### Git

```bash
# Create feature branch
git checkout -b feature/my-feature

# Commit changes
git add .
git commit -m "feat(scope): description"

# Push to remote
git push origin feature/my-feature

# Create pull request
# (via GitHub/GitLab web interface)

# Update branch from main
git fetch origin
git rebase origin/main

# Squash commits
git rebase -i HEAD~3
```

## 📝 File Locations

### Backend Key Files

| File | Purpose |
|------|---------|
| `src/app.ts` | Express app factory |
| `src/server.ts` | Server startup |
| `src/config/app.config.ts` | Configuration |
| `src/middleware/` | Middleware functions |
| `src/routes/` | API routes |
| `src/controllers/` | Request handlers |
| `src/services/` | Business logic |
| `src/utils/` | Utility functions |
| `package.json` | Dependencies |
| `.env` | Environment variables |

### AI Services Key Files

| File | Purpose |
|------|---------|
| `app/main.py` | FastAPI initialization |
| `app/config.py` | Settings configuration |
| `app/core/database.py` | Database connectivity |
| `app/core/logging.py` | Logging setup |
| `app/core/__init__.py` | Core exports |
| `app/api/` | API endpoints |
| `app/services/` | Business logic |
| `app/models/` | Database models |
| `app/schemas/` | Request/response schemas |
| `requirements.txt` | Python dependencies |
| `.env` | Environment variables |

## 🔌 API Endpoints Quick Reference

### Backend

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/health` | Health check |
| `GET` | `/` | API info |
| `POST` | `/api/v1/auth/register` | Register user |
| `POST` | `/api/v1/auth/login` | Login user |
| `POST` | `/api/v1/quiz/generate` | Generate questions |
| `POST` | `/api/v1/quiz/submit` | Submit answers |
| `POST` | `/api/v1/hackathon/submit` | Submit code |

### AI Services

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/health` | Health check |
| `GET` | `/docs` | Swagger UI |
| `POST` | `/api/v1/quiz/generate` | Generate questions |
| `POST` | `/api/v1/quiz/evaluate` | Evaluate answers |
| `POST` | `/api/v1/code/analyze` | Analyze code |
| `POST` | `/api/v1/interview/evaluate` | Evaluate interview |

## 🌐 URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Backend | `http://localhost:5000` | API endpoints |
| Backend Health | `http://localhost:5000/health` | Health check |
| AI Services | `http://localhost:8000` | AI API endpoints |
| AI Docs | `http://localhost:8000/docs` | Swagger UI |
| AI Health | `http://localhost:8000/health` | Health check |
| Frontend | `http://localhost:3000` | Web interface |
| Nginx Proxy | `http://localhost` | Reverse proxy |
| Database | `localhost:5432` | PostgreSQL |
| Redis | `localhost:6379` | Cache/Queue |

## 📚 Documentation Links

- [PLATFORM_SETUP.md](PLATFORM_SETUP.md) - Complete setup guide
- [HEALTH_CHECK.md](HEALTH_CHECK.md) - Service verification
- [ai-services/LOGGING.md](ai-services/LOGGING.md) - Logging guide
- [ai-services/DATABASE.md](ai-services/DATABASE.md) - Database patterns
- [ai-services/CONFIGURATION.md](ai-services/CONFIGURATION.md) - Configuration reference
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - System architecture
- [docs/API.md](docs/API.md) - API reference
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - Deployment guide

## ⚡ Performance Tips

### Backend

```bash
# Enable compression
gzip: true

# Enable caching
Redis: on

# Use connection pooling
Pool Size: 10, Overflow: 20

# Monitor performance
npm run build:production
```

### AI Services

```bash
# Use GPU if available
ML_DEVICE=cuda

# Increase batch size for better throughput
ML_BATCH_SIZE=64

# Enable model caching
CACHE_ENABLED=true

# Use async endpoints
async def endpoint():
    ...
```

### Database

```bash
# Connection pooling
pool_size=10
max_overflow=20
pool_recycle=3600

# Indexes for queries
CREATE INDEX idx_user_email ON users(email);

# Query optimization
EXPLAIN ANALYZE SELECT * FROM users;
```

## 🚨 Emergency Commands

### Stop All Services

```bash
# Docker
docker-compose down

# Kill processes
pkill -f "node"
pkill -f "python app/main.py"
pkill -f "redis-server"
pkill -f "postgres"
```

### Reset Everything

```bash
# Remove containers and volumes
docker-compose down -v

# Remove node modules
rm -rf backend/node_modules
rm -rf frontend/node_modules

# Remove Python cache
rm -rf ai-services/__pycache__
rm -rf ai-services/.pytest_cache
rm -rf ai-services/venv

# Clean Git
git clean -fd
```

### Clear Caches

```bash
# Redis
redis-cli FLUSHALL

# NPM
npm cache clean --force

# Pip
pip cache purge

# OS
# macOS: rm -rf ~/Library/Caches
# Linux: rm -rf ~/.cache
# Windows: rmdir %TEMP% /s
```

## 💡 Quick Troubleshooting

### Blank Page on Frontend

1. Check backend is running: `curl http://localhost:5000/health`
2. Check AI services running: `curl http://localhost:8000/health`
3. Check browser console for errors
4. Clear browser cache: `Ctrl+Shift+Delete`

### API Returns 500 Error

1. Check service logs: `docker-compose logs backend`
2. Check database connection: `psql -U edtech_user -d edtech_db -c "SELECT 1;"`
3. Check Redis connection: `redis-cli ping`
4. Check environment variables: `cat .env`

### Slow API Response

1. Check database query time: Monitor slow queries
2. Check Redis cache: `redis-cli INFO stats`
3. Check connection pool: View logs for pool stats
4. Profile endpoint: Use APM tools

### Service Won't Start

1. Check port is available: `lsof -i :PORT`
2. Check environment variables: All required vars set?
3. Check dependencies installed: `npm list` or `pip list`
4. Check logs for specific error

## 📞 Getting Help

1. **Check logs:** `docker-compose logs -f SERVICE_NAME`
2. **Read docs:** Check relevant documentation files
3. **Search issues:** Look for similar problems
4. **Ask team:** Slack or team chat
5. **Debug locally:** Run with verbose logging

## 🎯 Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes and test
npm test  # Backend
pytest    # AI Services

# 3. Format and lint
npm run format && npm run lint
black app/ && flake8 app/

# 4. Commit changes
git add .
git commit -m "feat: add my feature"

# 5. Push and create PR
git push origin feature/my-feature

# 6. Merge after review
git checkout main
git merge feature/my-feature
```

---

**Quick Tip:** Bookmark this page and the relevant documentation for fast access during development!

**Last Updated:** March 2026  
**Maintained By:** EdTech Team
