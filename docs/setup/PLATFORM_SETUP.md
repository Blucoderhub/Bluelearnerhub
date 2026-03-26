# EdTech Platform - Complete Setup Guide

A production-ready educational technology platform with AI-powered features including quiz generation, hackathon code analysis, and interview evaluation.

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (Recommended for quick start)
  - [Install Docker Desktop](https://www.docker.com/products/docker-desktop)
  
- **OR Manual Setup:**
  - Node.js 18+ (Backend)
  - Python 3.11+ (AI Services)
  - PostgreSQL 16+
  - Redis 7+

### One-Command Docker Start

```bash
# Start all services (backend, AI services, database, cache, frontend, nginx)
docker-compose up

# Services will be available at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:5000
# - AI Services: http://localhost:8000
# - Nginx Proxy: http://localhost:80
```

### Manual Setup (Without Docker)

The following sections walk through getting each component running
individually.

#### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env      # configure DB, JWT, etc.
npm run build
npm run dev                # or npm start for production
```

The backend listens on `http://localhost:5000`.

#### 2. AI Services Setup

```bash
cd ai-services

# Run automated setup (Unix/Linux/macOS)
bash setup.sh

# OR Windows
setup.bat

# This will:
# - Create Python virtual environment
# - Install dependencies
# - Download ML models (spaCy, NLTK)
# - Create a .env file

# Start AI services
python app/main.py
```

The AI services run on `http://localhost:8000`.

#### 3. AI System Setup

```bash
cd ai_system
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install openclaw python-dotenv
python orchestrator.py
```

#### 4. AI Model Setup

```bash
cd ai_model
# place your AirLLM model binary in knowledge_base/ (see AIRLLM.md)
export AIRLLM_MODEL_PATH=$(pwd)/knowledge_base/model.bin   # must be absolute or evaluated here
python -c "from airllm_model import AirLLMModel; print(AirLLMModel().generate('test'))"
```

#### 5. Telegram Bot Setup

```bash
cd telegram_bot
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install python-telegram-bot
export TELEGRAM_TOKEN=your_token_here
python bot.py
```

#### 6. Sales System Setup

```bash
cd sales_system
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
# no dependencies beyond standard library
# ensure SMTP vars are defined in .env
python -c "from lead_generator import generate_segments; print(generate_segments('test'))"
```

#### 7. AI Agent Setup

```bash
cd ai-agent
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
# set OPENCLAW_API_KEY in your shell or .env
python agent.py
```

#### 8. Database Setup

Ensure PostgreSQL 16+ is running with these credentials (from `.env` files):
```
Database: edtech_db
User: edtech_user
Password: (see .env files)
Port: 5432
```

Create the database:
```sql
CREATE DATABASE edtech_db;
CREATE USER edtech_user WITH PASSWORD 'your_password';
ALTER ROLE edtech_user SET client_encoding TO 'utf8';
ALTER ROLE edtech_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE edtech_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE edtech_db TO edtech_user;
```

#### 9. Redis Setup

Start Redis (default port 6379):
```bash
# Docker
docker run -d -p 6379:6379 redis:7

# OR native installation
redis-server
```


# Run automated setup (Unix/Linux/macOS)
bash setup.sh

# OR Windows
setup.bat

# This will:
# - Create Python virtual environment
# - Install dependencies
# - Download ML models (spaCy, NLTK)
# - Create .env file

# Start AI services
python app/main.py
```

#### 3. AI Agent Setup

```bash
cd ai-agent
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
# set OPENCLAW_API_KEY in your shell or .env
python agent.py
```

The agent provides a REPL for development automation; it can be run locally
alongside the other services or executed in CI as part of the pipeline.

#### 4. Database Setup

```bash
"""
AI Services will run on `http://localhost:8000`

#### 3. Database Setup

Ensure PostgreSQL 16+ is running with these credentials (from `.env` files):
```
Database: edtech_db
User: edtech_user
Password: (see .env files)
Port: 5432
```

Create the database:
```sql
CREATE DATABASE edtech_db;
CREATE USER edtech_user WITH PASSWORD 'your_password';
ALTER ROLE edtech_user SET client_encoding TO 'utf8';
ALTER ROLE edtech_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE edtech_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE edtech_db TO edtech_user;
```

#### 4. Redis Setup

Start Redis (default port 6379):
```bash
# Docker
docker run -d -p 6379:6379 redis:7

# OR native installation
redis-server
```

## 📁 Project Structure

```
edtech-platform/
├── backend/                  # Express.js + TypeScript + Socket.IO backend
│   ├── src/
│   │   ├── app.ts           # Express app factory
│   │   ├── server.ts        # Server startup with Socket.IO
│   │   ├── config/          # Configuration modules
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Database models
│   │   ├── services/        # Business logic
│   │   ├── sockets/         # Socket.IO handlers
│   │   └── utils/           # Utilities
│   ├── tests/               # Test files
│   ├── Dockerfile           # Production image
│   ├── Dockerfile.dev       # Development image
│   ├── package.json         # Dependencies
│   └── README.md            # Backend documentation
│
├── ai-services/             # FastAPI + Python + ML backend
│   ├── app/
│   │   ├── main.py          # FastAPI application
│   │   ├── config.py        # Configuration settings
│   │   ├── core/            # Core infrastructure
│   │   │   ├── __init__.py  # Exports
│   │   │   ├── config.py    # Config module
│   │   │   ├── database.py  # Database + Redis
│   │   │   └── logging.py   # Structured logging
│   │   ├── api/             # API endpoints
│   │   ├── models/          # AI models
│   │   ├── services/        # AI services
│   │   ├── schemas/         # Request/response schemas
│   │   └── utils/           # Utilities
│   ├── data/
│   │   ├── raw/             # Raw data
│   │   ├── processed/       # Processed data
│   │   └── models/          # ML models cache
│   ├── tests/               # Test files
│   ├── setup.sh             # Unix/Linux setup script
│   ├── setup.bat            # Windows setup script
│   ├── download-models.sh   # Unix/Linux model download
│   ├── download-models.bat  # Windows model download
│   ├── requirements.txt     # Python dependencies (72 packages)
│   ├── Dockerfile           # Production image
│   └── README.md            # AI services documentation
│
├── frontend/                # Next.js + TypeScript frontend
│   ├── app/                 # App router
│   ├── components/          # React components
│   ├── lib/                 # Utilities
│   ├── public/              # Static assets
│   ├── package.json         # Dependencies
│   └── README.md            # Frontend documentation
│
├── database/                # Database configuration
│   ├── migrations/          # SQL migrations
│   ├── scripts/             # Helper scripts
│   └── seeds/               # Seed data
│
├── docker/                  # Docker configurations
│   ├── nginx/               # Nginx proxy
│   ├── postgres/            # PostgreSQL config
│   └── redis/               # Redis config
│
├── docs/                    # Documentation
│   ├── API.md               # API documentation
│   ├── ARCHITECTURE.md      # System architecture
│   ├── DEPLOYMENT.md        # Deployment guide
│   ├── DEVELOPMENT.md       # Development guide
│   └── README.md            # Docs index
│
├── docker-compose.yml       # Multi-service orchestration
└── README.md               # This file
```

## 🔧 Service Endpoints

### Backend (Node.js/Express)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `http://localhost:5000/health` | Health check |
| `GET` | `http://localhost:5000/` | API info |
| `POST` | `http://localhost:5000/api/v1/auth/register` | User registration |
| `POST` | `http://localhost:5000/api/v1/auth/login` | User login |
| `WS` | `ws://localhost:5000/socket.io` | WebSocket connection |
| `POST` | `http://localhost:5000/api/v1/quiz/generate` | Generate quiz questions |
| `POST` | `http://localhost:5000/api/v1/hackathon/submit` | Submit hackathon code |

See [docs/API.md](docs/API.md) for complete endpoint documentation.

### AI Services (Python/FastAPI)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `http://localhost:8000/health` | Health check |
| `GET` | `http://localhost:8000/docs` | Swagger UI |
| `POST` | `http://localhost:8000/api/v1/quiz/generate` | AI: Generate questions |
| `POST` | `http://localhost:8000/api/v1/quiz/evaluate` | AI: Evaluate answers |
| `POST` | `http://localhost:8000/api/v1/code/analyze` | AI: Analyze code |
| `POST` | `http://localhost:8000/api/v1/interview/evaluate` | AI: Evaluate interview |

See [ai-services/README.md](ai-services/README.md) for complete documentation.

## 📊 Database Schema

### Core Tables

**users**
- id, email, password_hash, name, role, created_at, updated_at

**quizzes**
- id, title, description, topic, difficulty, created_by, created_at, updated_at

**quiz_questions**
- id, quiz_id, question, options (JSON), correct_answer, explanation, created_at

**quiz_submissions**
- id, user_id, quiz_id, answers (JSON), score, submitted_at

**hackathons**
- id, title, description, start_date, end_date, created_at, updated_at

**hackathon_submissions**
- id, user_id, hackathon_id, code, language, analysis (JSON), score, submitted_at

**interviews**
- id, user_id, position, questions (JSON), responses (JSON), score, created_at

## 🔐 Authentication

The platform uses JWT (JSON Web Tokens) for secure authentication.

### Backend JWT

- Token Type: Bearer
- Algorithm: HS256
- Expiration: 7 days
- Refresh Token: 30 days
- Created in: `backend/src/utils/jwt.ts`

### AI Services JWT

- Token Type: Bearer
- Algorithm: HS256
- Expiration: 24 hours
- Created in: `ai-services/app/core/config.py`

Example authenticated request:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/v1/quiz/get
```

## 📝 Environment Configuration

Both services use `.env` files for configuration.

### Backend (`backend/.env`)

```env
# Server
PORT=5000
NODE_ENV=development
HOST=localhost

# Database
DATABASE_URL=postgresql://edtech_user:password@localhost:5432/edtech_db

# Redis
REDIS_URL=redis://:password@localhost:6379

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# AI Services
AI_SERVICE_URL=http://localhost:8000

# API Keys (External services)
GEMINI_API_KEY=AIzaSyCXaJvkoc7J4RxGMfLPd_clxFNEinDuqUM
```

### AI Services (`ai-services/.env`)

```env
# Server
DEBUG=True
PORT=8000
LOG_LEVEL=INFO

# Database
DATABASE_URL=postgresql://edtech_user:password@localhost:5432/edtech_db
MONGODB_URI=mongodb://localhost:27017/edtech_logs
REDIS_URL=redis://:password@localhost:6379

# ML Settings
ML_DEVICE=cpu  # or 'cuda' for GPU
ML_BATCH_SIZE=32
ML_LEARNING_RATE=0.001

# Models
QUESTION_GEN_MODEL=gpt-3.5-turbo
RESPONSE_EVAL_MODEL=gpt-3.5-turbo
CODE_EVAL_SERVICE=judge0

# JWT
JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Celery (Background tasks)
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/1
```

See [ai-services/CONFIGURATION.md](ai-services/CONFIGURATION.md) for all options.

## 🐳 Docker Compose Services

Services orchestrated by `docker-compose.yml`:

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| `postgres` | postgres:16-alpine | 5432 | Primary database |
| `redis` | redis:7-alpine | 6379 | Caching + session store |
| `backend` | edtech-backend:latest | 5000 | Node.js/Express API |
| `ai-services` | edtech-ai-services:latest | 8000 | FastAPI/Python AI |
| `frontend` | node:18-alpine | 3000 | Next.js frontend |
| `nginx` | nginx:alpine | 80,443 | Reverse proxy |

Start individual service:
```bash
docker-compose up postgres redis
```

See `docker-compose.yml` for full configuration.

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- auth.test.ts
```

### AI Services Tests

```bash
cd ai-services

# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test
pytest tests/test_quiz_service.py -v
```

## 📱 Socket.IO Real-time Events

Backend supports WebSocket connections via Socket.IO:

**Client Events → Server:**
- `join_quiz` - Join live quiz session
- `submit_answer` - Submit quiz answer
- `join_hackathon` - Join hackathon room
- `code_update` - Real-time code collaboration

**Server Events → Client:**
- `question_update` - New quiz question available
- `user_joined` - User joined session
- `results_updated` - Quiz results updated
- `code_analyzed` - Code analysis complete

Example (Browser Console):

```javascript
const socket = io('http://localhost:5000', {
  auth: { token: 'YOUR_JWT_TOKEN' }
});

socket.on('connect', () => {
  console.log('Connected to server');
  socket.emit('join_quiz', { quizId: 123 });
});

socket.on('question_update', (data) => {
  console.log('New question:', data);
});
```

## 🚀 Production Deployment

### Docker Image Build

```bash
# Build backend
docker build -f backend/Dockerfile -t edtech-backend:latest backend/

# Build AI services
docker build -f ai-services/Dockerfile -t edtech-ai-services:latest ai-services/

# Build frontend
docker build -f frontend/Dockerfile -t edtech-frontend:latest frontend/
```

### Production Environment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for:
- Cloud deployment (AWS, GCP, Azure)
- SSL/TLS certificate setup
- Database backups
- Monitoring and logging
- CI/CD pipeline setup

## 📚 Documentation

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System design and components
- **[DEVELOPMENT.md](docs/DEVELOPMENT.md)** - Development setup and workflow
- **[API.md](docs/API.md)** - Complete API reference
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Deployment instructions
- **[backend/README.md](backend/README.md)** - Backend-specific docs
- **[ai-services/README.md](ai-services/README.md)** - AI services docs
- **[ai-services/QUICKSTART.md](ai-services/QUICKSTART.md)** - AI services quick start
- **[ai-services/CONFIGURATION.md](ai-services/CONFIGURATION.md)** - Configuration reference
- **[ai-services/DATABASE.md](ai-services/DATABASE.md)** - Database patterns
- **[ai-services/LOGGING.md](ai-services/LOGGING.md)** - Logging guide

## 🔧 Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches (e.g., `feature/quiz-generation`)
- `bugfix/*` - Bug fixes (e.g., `bugfix/auth-issue`)

### Pre-commit Checks

```bash
# Backend
npm run lint    # ESLint
npm run format  # Prettier
npm run type    # TypeScript type check

# AI Services
black app/      # Code formatting
flake8 app/     # Linting
mypy app/       # Type checking
```

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Example:
```
feat(quiz): add AI-powered question generation

Implement question generation using GPT-3.5-turbo with caching.

Closes #123
```

## 🐛 Troubleshooting

### Backend Issues

**"Cannot find module" errors**
```bash
cd backend
npm install
npm run build
```

**Port 5000 already in use**
```bash
# Change PORT in .env or:
lsof -i :5000
kill -9 <PID>
```

### AI Services Issues

**Python dependencies fail to install**
```bash
cd ai-services
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```

**Models fail to download**
```bash
bash download-models.sh
# Check internet connection and disk space
```

### Database Issues

**Cannot connect to PostgreSQL**
```bash
# Check if running
psql -U edtech_user -d edtech_db

# Create database if missing
createdb -U edtech_user edtech_db
```

**Redis connection refused**
```bash
# Check if running
redis-cli ping

# Start Redis
redis-server
```

## 📈 Performance Monitoring

### Backend Metrics

- Request latency (Morgan logger)
- WebSocket connection count
- Database query time
- Cache hit rate

### AI Services Metrics

- Model inference time
- API response time
- Redis cache utilization
- Database connection pool status

View metrics at (when running):
- Backend health: `http://localhost:5000/health`
- AI health: `http://localhost:8000/health`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 💬 Support

For issues and questions:
1. Check existing [Issues](issues)
2. Review [Troubleshooting](#-troubleshooting) section
3. Check documentation files
4. Create a new [Issue](issues)

## 📞 Contact

- **Engineer**: Shankar R
- **Project**: EdTech AI Platform
- **Last Updated**: March 2026

---

**Quick Commands Reference:**

```bash
# Docker start (all services)
docker-compose up

# Docker stop
docker-compose down

# Backend development
cd backend && npm run dev

# AI services development
cd ai-services && python app/main.py

# Run tests
npm test              # Backend
pytest               # AI services

# Format code
npm run format       # Backend
black app/          # AI services

# View API docs
http://localhost:8000/docs           # Swagger
http://localhost:8000/redoc         # ReDoc
```
