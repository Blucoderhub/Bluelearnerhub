# 📚 EdTech Platform Documentation Index

Complete guide to all available documentation and resources.

## 🚀 Getting Started (Start Here!)

### For New Developers

1. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** ⭐ START HERE
   - Fast lookup for common commands
   - Quick setup instructions
   - Common troubleshooting

2. **[PLATFORM_SETUP.md](PLATFORM_SETUP.md)**
   - Complete step-by-step setup guide
   - Docker quick start
   - Service endpoints reference
   - Environment configuration

3. **[HEALTH_CHECK.md](HEALTH_CHECK.md)**
   - Verify all services are running
   - Comprehensive diagnostics
   - Common issues and solutions

### For Development

4. **[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)**
   - Development workflow
   - Code standards
   - Testing procedures
   - Git workflow

5. **[ai-services/LOGGING.md](ai-services/LOGGING.md)**
   - Logging usage guide
   - Log levels and formats
   - Best practices

6. **[ai-services/DATABASE.md](ai-services/DATABASE.md)**
   - Database patterns and examples
   - ORM usage
   - Cache utilities
   - Health checks

### For API Integration

7. **[docs/API.md](docs/API.md)**
   - Complete API reference
   - All endpoints documented
   - Request/response examples
   - Authentication

8. **[backend/README.md](backend/README.md)**
   - Backend-specific documentation
   - Project structure
   - Service details

9. **[ai-services/README.md](ai-services/README.md)**
   - AI services documentation
   - Setup instructions
   - Endpoints
   - Configuration

### For Production

10. **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**
    - Production deployment guide
    - Cloud setup (AWS, GCP, Azure)
    - SSL/TLS configuration
    - Monitoring and logging
    - Backup and recovery

11. **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**
    - System architecture overview
    - Component descriptions
    - Data flow diagrams
    - Technology stack

## 📖 Documentation Structure

```
edtech-platform/
├── README.md                      # This file (Meta index)
│
├── QUICK_REFERENCE.md             # ⭐ Quick commands and tips
├── PLATFORM_SETUP.md              # ⭐ Platform setup guide
├── HEALTH_CHECK.md                # ⭐ Service verification
│
├── backend/
│   └── README.md                  # Backend documentation
│
├── ai-services/
│   ├── README.md                  # AI services documentation
│   ├── QUICKSTART.md              # Quick start guide
│   ├── CONFIGURATION.md           # Configuration reference
│   ├── DATABASE.md                # Database usage patterns
│   └── LOGGING.md                 # Logging guide
│
└── docs/
    ├── README.md                  # Documentation index
    ├── ARCHITECTURE.md            # System architecture
    ├── DEVELOPMENT.md             # Development guide
    ├── DEPLOYMENT.md              # Deployment guide
    └── API.md                      # API reference
```

## 🎯 Quick Navigation by Role

### Frontend Developer

1. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Setup and commands
2. [docs/API.md](docs/API.md) - Available endpoints
3. [PLATFORM_SETUP.md](PLATFORM_SETUP.md) - Service URLs
4. [frontend/README.md](frontend/README.md) - Frontend setup

**Quick Start:**
```bash
docker-compose up
cd frontend && npm install && npm run dev
# Frontend at http://localhost:3000
# Backend API at http://localhost:5000
```

### Backend Developer

1. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Common commands
2. [backend/README.md](backend/README.md) - Backend structure
3. [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) - Development workflow
4. [HEALTH_CHECK.md](HEALTH_CHECK.md) - Verify setup

**Quick Start:**
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
```

### AI/ML Engineer

1. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick commands
2. [ai-services/QUICKSTART.md](ai-services/QUICKSTART.md) - Quick start
3. [ai-services/README.md](ai-services/README.md) - Full documentation
4. [ai-services/CONFIGURATION.md](ai-services/CONFIGURATION.md) - Configuration
5. [ai-services/DATABASE.md](ai-services/DATABASE.md) - Database usage
6. [ai-services/LOGGING.md](ai-services/LOGGING.md) - Logging

**Quick Start:**
```bash
cd ai-services
bash setup.sh  # or setup.bat on Windows
python app/main.py
# Runs on http://localhost:8000
```

### DevOps / Infrastructure

1. [PLATFORM_SETUP.md](PLATFORM_SETUP.md) - Full setup
2. [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - Production deployment
3. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - System architecture
4. [HEALTH_CHECK.md](HEALTH_CHECK.md) - Diagnostics

**Quick Start:**
```bash
docker-compose up
# All services running with orchestration
```

### QA / Testing

1. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Testing commands
2. [docs/API.md](docs/API.md) - API endpoints
3. [HEALTH_CHECK.md](HEALTH_CHECK.md) - Service verification
4. [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) - Test procedures

## 📋 Feature Documentation

### Authentication

- Location: [docs/API.md](docs/API.md#authentication)
- Backend: `backend/src/utils/jwt.ts`
- Setup: [PLATFORM_SETUP.md](PLATFORM_SETUP.md#-authentication)

### Quiz Module

- API: [docs/API.md](docs/API.md#quiz-endpoints)
- AI: [ai-services/README.md](ai-services/README.md#ai-services)
- Database: [ai-services/DATABASE.md](ai-services/DATABASE.md)

### Hackathon Module

- API: [docs/API.md](docs/API.md#hackathon-endpoints)
- AI: [ai-services/README.md](ai-services/README.md#code-analysis)

### Real-time Features

- Socket.IO: [backend/README.md](backend/README.md#socket-io)
- Events: [docs/API.md](docs/API.md#websocket-events)

### Logging

- Setup: [ai-services/LOGGING.md](ai-services/LOGGING.md)
- Configuration: [ai-services/CONFIGURATION.md](ai-services/CONFIGURATION.md#logging)

### Caching

- Database: [ai-services/DATABASE.md](ai-services/DATABASE.md#cache-utilities)
- Configuration: [ai-services/CONFIGURATION.md](ai-services/CONFIGURATION.md#caching)

## 🔧 Configuration Reference

### Backend Configuration

- File: `backend/.env`
- Template: `backend/.env.example`
- Reference: [PLATFORM_SETUP.md](PLATFORM_SETUP.md#backend-backendenv)

### AI Services Configuration

- File: `ai-services/.env`
- Template: `ai-services/.env.example`
- Reference: [ai-services/CONFIGURATION.md](ai-services/CONFIGURATION.md)
- Guide: [PLATFORM_SETUP.md](PLATFORM_SETUP.md#ai-services-ai-servicesenv)

## 📊 Service Endpoints

### Backend Endpoints

Complete list: [docs/API.md](docs/API.md) and [backend/README.md](backend/README.md)

Quick reference:
- Health: `GET http://localhost:5000/health`
- Auth: `POST http://localhost:5000/api/v1/auth/*`
- Quiz: `POST http://localhost:5000/api/v1/quiz/*`
- WebSocket: `ws://localhost:5000/socket.io`

### AI Services Endpoints

Complete list: [ai-services/README.md](ai-services/README.md) and [docs/API.md](docs/API.md)

Quick reference:
- Health: `GET http://localhost:8000/health`
- Swagger: `GET http://localhost:8000/docs`
- Quiz AI: `POST http://localhost:8000/api/v1/quiz/*`
- Code Analysis: `POST http://localhost:8000/api/v1/code/analyze`

## 🐛 Troubleshooting

### Quick Troubleshooting

- [HEALTH_CHECK.md](HEALTH_CHECK.md#-common-issues--solutions) - Common issues
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md#-emergency-commands) - Emergency commands
- [PLATFORM_SETUP.md](PLATFORM_SETUP.md#-troubleshooting) - Service-specific troubleshooting

### Issue: Service won't start

- Backend: [backend/README.md](backend/README.md)
- AI Services: [ai-services/QUICKSTART.md](ai-services/QUICKSTART.md#troubleshooting)
- Infrastructure: [HEALTH_CHECK.md](HEALTH_CHECK.md)

### Issue: API errors

- [docs/API.md](docs/API.md) - API reference
- [backend/README.md](backend/README.md) - Backend documentation
- [ai-services/README.md](ai-services/README.md) - AI services documentation

### Issue: Database problems

- [ai-services/DATABASE.md](ai-services/DATABASE.md) - Database usage
- [HEALTH_CHECK.md](HEALTH_CHECK.md#4-database-verification) - Database diagnostics

## 📚 Learning Resources

### Understanding the Architecture

1. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - Read first
2. [PLATFORM_SETUP.md](PLATFORM_SETUP.md#-service-endpoints) - Know the ports
3. [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) - Development practices

### Learning the APIs

1. [docs/API.md](docs/API.md) - API documentation
2. [QUICK_REFERENCE.md](QUICK_REFERENCE.md#-api-endpoints-quick-reference) - Quick reference
3. Test with: `curl http://localhost:5000/health`

### Learning the Codebase

1. [PLATFORM_SETUP.md](PLATFORM_SETUP.md#-project-structure) - Directory structure
2. [backend/README.md](backend/README.md) - Backend structure
3. [ai-services/README.md](ai-services/README.md) - AI services structure
4. Read source code starting with entry points

### Learning DevOps

1. [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - Production setup
2. [PLATFORM_SETUP.md](PLATFORM_SETUP.md#-docker-compose-services) - Docker services
3. Docker documentation: https://docs.docker.com

## 🔑 Key Files Reference

### Backend Entry Points

- `backend/src/server.ts` - Server startup
- `backend/src/app.ts` - Express app factory
- `backend/src/config/app.config.ts` - Configuration

### AI Services Entry Points

- `ai-services/app/main.py` - FastAPI initialization
- `ai-services/app/config.py` - Settings configuration
- `ai-services/app/core/__init__.py` - Core exports

### Configuration Files

- `docker-compose.yml` - Service orchestration
- `.env` files - Environment variables
- `.env.example` - Configuration template

### Documentation Files

- `PLATFORM_SETUP.md` - Platform setup
- `HEALTH_CHECK.md` - Verification
- `QUICK_REFERENCE.md` - Quick lookup
- `docs/*.md` - Detailed documentation
- `**/README.md` - Service-specific docs

## 🚀 Common Workflows

### Starting Development

```bash
# 1. Setup
docker-compose up

# 2. Backend development (new terminal)
cd backend && npm run dev

# 3. AI services development (new terminal)
cd ai-services && python app/main.py

# 4. Frontend development (new terminal)
cd frontend && npm run dev
```

See [QUICK_REFERENCE.md](QUICK_REFERENCE.md#-start-services) for details.

### Making Code Changes

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes
# 3. Test
npm test  # Backend
pytest    # AI Services

# 4. Format and lint
npm run format && npm run lint    # Backend
black app/ && flake8 app/         # AI Services

# 5. Push and create PR
git push origin feature/my-feature
```

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for full workflow.

### Deploying to Production

```bash
# 1. Read deployment guide
# docs/DEPLOYMENT.md

# 2. Build images
docker build -f backend/Dockerfile ...
docker build -f ai-services/Dockerfile ...

# 3. Push to registry
# 4. Deploy to cloud
# 5. Configure monitoring
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for details.

## 📞 Getting Help

### For Issues

1. Check [HEALTH_CHECK.md](HEALTH_CHECK.md) for diagnostics
2. Search project [Issues](issues)
3. Check relevant documentation file
4. Create new issue with full context

### Documentation Not Clear?

1. Check related files for examples
2. Read code in `src/` or `app/`
3. Create issue or ask team

### Emergency / Something Broken

1. Check [HEALTH_CHECK.md](HEALTH_CHECK.md#-emergency-commands)
2. View service logs: `docker-compose logs SERVICE`
3. Run diagnostics: [HEALTH_CHECK.md](HEALTH_CHECK.md)

## 📊 Documentation Status

| Document | Status | Last Updated |
|----------|--------|--------------|
| QUICK_REFERENCE.md | ✅ Complete | March 2026 |
| PLATFORM_SETUP.md | ✅ Complete | March 2026 |
| HEALTH_CHECK.md | ✅ Complete | March 2026 |
| ai-services/LOGGING.md | ✅ Complete | March 2026 |
| ai-services/DATABASE.md | ✅ Complete | March 2024 |
| ai-services/CONFIGURATION.md | ✅ Complete | March 2024 |
| ai-services/QUICKSTART.md | ✅ Complete | March 2024 |
| ai-services/README.md | ✅ Complete | March 2024 |
| backend/README.md | ✅ Complete | March 2024 |
| docs/ARCHITECTURE.md | ✅ Complete | March 2024 |
| docs/DEVELOPMENT.md | ✅ Complete | March 2024 |
| docs/DEPLOYMENT.md | ✅ Complete | March 2024 |
| docs/API.md | ✅ Complete | March 2024 |

## 🎯 Pick a Starting Point

**I'm new and want to get started:**
→ Start with [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

**I want the complete setup guide:**
→ Read [PLATFORM_SETUP.md](PLATFORM_SETUP.md)

**I want to verify everything is working:**
→ Follow [HEALTH_CHECK.md](HEALTH_CHECK.md)

**I want to understand the system:**
→ Study [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

**I want to develop:**
→ Reference [QUICK_REFERENCE.md](QUICK_REFERENCE.md) and [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)

**I want to deploy:**
→ Follow [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

**I want API details:**
→ Read [docs/API.md](docs/API.md)

---

## 📈 Next Steps

1. ✅ Read [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
2. ✅ Setup services using [PLATFORM_SETUP.md](PLATFORM_SETUP.md)
3. ✅ Verify with [HEALTH_CHECK.md](HEALTH_CHECK.md)
4. ✅ Start development using [QUICK_REFERENCE.md](QUICK_REFERENCE.md#-development-workflow)
5. 📖 Explore features via [docs/API.md](docs/API.md)

---

**Documentation Last Updated:** March 2026  
**Maintained By:** EdTech Development Team  
**Total Documentation:** 15 files with 2000+ lines of guides
