# BluelearnerHub EdTech Platform 🚀

A comprehensive educational technology platform built with modern web technologies and **ready for deployment** on any hosting platform.

## 🌟 Key Features

- **Interactive Learning Environment** - Comprehensive course management and interactive lessons
- **AI-Powered Features** - Quiz generation, code evaluation, and interview simulation
- **Real-time Collaboration** - Live coding sessions and peer-to-peer learning
- **Advanced Analytics** - Learning progress tracking and performance insights
- **Multi-Platform Deployment** - Deploy on Vercel, Railway, AWS, or any hosting platform

## 🏗️ Architecture Overview

This platform consists of three production-ready microservices:

### 🎨 Frontend (Next.js 14+)
- Modern React with App Router and TypeScript
- Comprehensive UI component library
- Real-time features with Socket.io
- NextAuth authentication integration
- Production-optimized with security headers

### ⚙️ Backend (Node.js + Express)
- RESTful API with comprehensive error handling
- PostgreSQL database with Redis caching
- JWT-based security with refresh tokens
- Rate limiting and CORS protection
- Health checks and monitoring endpoints

### 🤖 AI Services (Python + FastAPI)
- Google Gemini-powered quiz generation
- Code evaluation and plagiarism detection
- Interview simulation and analysis
- Machine learning recommendation engine
- Scalable microservice architecture

## 🚀 Quick Deployment

**Choose your deployment platform:**

### Vercel (Frontend) + Railway (Backend)
```bash
# 1. Deploy frontend to Vercel
cd frontend && vercel --prod

# 2. Deploy backend to Railway
railway up
```

### Railway (Full Stack)
```bash
# Deploy entire platform
railway up
```

### AWS (Enterprise)
```bash
# Deploy to AWS with full infrastructure
./aws/deploy.sh
```

### Docker (Self-Hosted)
```bash
# Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

## 📋 Deployment Checklist

Before deploying, ensure you have:

- [ ] Environment variables configured
- [ ] Database and Redis services ready
- [ ] Domain name and SSL certificates (for production)
- [ ] Platform-specific configurations completed

**Run our deployment validation:**
```powershell
.\scripts\validate-deployment.ps1
```

## 📁 Directory Structure

```
edtech-platform/
├── frontend/              # Next.js application
├── backend/              # Node.js + Express API  
├── ai-services/          # FastAPI ML services
├── database/             # Migrations and seeds
├── aws/                  # AWS deployment configs
├── scripts/              # Deployment automation
├── .github/workflows/    # CI/CD pipelines
├── vercel.json          # Vercel configuration
├── railway.json         # Railway configuration
├── docker-compose.prod.yml  # Production Docker setup
└── DEPLOYMENT_GUIDE.md  # Complete deployment guide
```

## ⚡ Quick Start (Development)

### Prerequisites
- Node.js 18+
- Python 3.11+  
- PostgreSQL 14+
- Redis 7+
- Docker & Docker Compose (optional)

### Setup with Docker

```bash
docker-compose up -d
```

### Manual Setup

1. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

3. **AI Services Setup**
```bash
cd ai-services
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app/main.py
```

## 🚀 Production Deployment

### Supported Platforms

| Platform | Type | Complexity | Best For |
|----------|------|------------|----------|
| **Vercel** | Frontend Only | ⭐ Easy | Static sites, JAMstack |
| **Railway** | Full Stack | ⭐⭐ Medium | Complete apps with databases |
| **AWS** | Infrastructure | ⭐⭐⭐ Advanced | Enterprise, high scalability |
| **Docker** | Self-Hosted | ⭐⭐ Medium | Custom infrastructure, VPS |

### 1. Vercel Deployment (Frontend)

Deploy the frontend to Vercel and backend elsewhere:

```bash
# Deploy frontend
cd frontend
vercel --prod

# Backend must be deployed separately (use Railway/AWS)
```

### 2. Railway Deployment (Recommended)

Deploy the complete platform to Railway:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway up
```

**Railway Configuration:**
- Automatically uses `railway.json` for multi-service deployment
- Includes PostgreSQL and Redis databases
- Environment variables managed through Railway dashboard

### 3. AWS Deployment (Enterprise)

Deploy to AWS with complete infrastructure:

```bash
# Linux/macOS
./aws/deploy.sh

# Windows PowerShell  
.\aws\deploy.ps1
```

**AWS Features:**
- Complete VPC with public/private subnets
- ECS Fargate for containerized services
- RDS PostgreSQL and ElastiCache Redis
- Application Load Balancer with SSL
- Auto-scaling and health monitoring

### 4. Docker Deployment (Self-Hosted)

Deploy with Docker on any server:

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# With custom environment
cp .env.example .env
# Edit .env with your values
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Configuration

Each deployment method requires environment variables. See:
- `backend/.env.example` - Backend configuration
- `frontend/.env.example` - Frontend configuration  
- `ai-services/.env.example` - AI services configuration

### Deployment Validation

Ensure deployment readiness:

```powershell
# Validate all configurations
.\scripts\validate-deployment.ps1

# Platform-specific validation
.\scripts\validate-deployment.ps1 -Platform vercel
.\scripts\validate-deployment.ps1 -Platform railway
.\scripts\validate-deployment.ps1 -Platform aws
```

### Platform Setup Automation

Use our setup scripts for automated configuration:

```powershell  
# Auto-detect platform and setup
.\scripts\setup-platform.ps1

# Setup for specific platform
.\scripts\setup-platform.ps1 -Platform railway
```

## 📚 Documentation

- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Pre-deployment validation
- **[API Documentation](docs/API.md)** - REST API reference
- **[Architecture Guide](docs/ARCHITECTURE.md)** - System design and components

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # All services in development
npm run dev:frontend     # Frontend only (port 3000)
npm run dev:backend      # Backend only (port 5000)
npm run dev:ai           # AI services only (port 8000)

# Building
npm run build:all        # Build all services
npm run build:frontend   # Build frontend only
npm run build:backend    # Build backend only

# Testing
npm run test:all         # Run all tests
npm run lint:all         # Lint all services

# Deployment
npm run deploy:vercel    # Deploy to Vercel
npm run deploy:railway   # Deploy to Railway
npm run deploy:aws       # Deploy to AWS

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed sample data
```

### CI/CD Pipeline

Automated deployment pipeline with GitHub Actions:
- ✅ Automated testing on all PRs
- ✅ Security scanning with Trivy
- ✅ Multi-platform deployment
- ✅ Environment-specific deployments

## 🛡️ Security Features

- JWT authentication with refresh tokens
- Rate limiting and CORS protection  
- Input validation and sanitization
- Security headers and HTTPS enforcement
- Environment variable encryption
- Regular dependency updates

## 📈 Monitoring & Analytics

### Health Checks
- `GET /api/health` - Backend health
- `GET /health` - AI services health  
- `GET /api/health` - Frontend health (when deployed)

### Performance Monitoring
- Response time tracking
- Error rate monitoring
- Database connection pooling
- Redis cache hit rates

### Logging
- Structured logging with Winston
- Error tracking and reporting
- Request/response logging
- Performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test:all`
5. Validate deployment: `.\scripts\validate-deployment.ps1`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions
- **Documentation**: Check `docs/` directory
- **Deployment Help**: See `DEPLOYMENT_GUIDE.md`

---

**🎉 Ready to Deploy!**

Your BluelearnerHub EdTech Platform is production-ready and can be deployed to any major hosting platform. Choose your preferred deployment method above and follow the corresponding guide.

For the smoothest experience, we recommend starting with **Railway** for full-stack deployment or **Vercel + Railway** for optimized frontend performance.

- **Learning Management**: Courses, lessons, and learning paths
- **Interactive Quizzes**: Personalized quiz generation with AI
- **Hackathons**: Code challenges with real-time collaboration
- **Job Board**: Job listings and applications
- **Technical Interviews**: Interview practice with AI evaluation
- **Corporate Dashboard**: Tools for companies to manage talent
- **Analytics**: Performance tracking and recommendations

## Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- Zustand
- Socket.io

### Backend
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Redis
- Socket.io

### AI/ML Services
- FastAPI
- Python 3.11
- scikit-learn
- Transformers
- Google Gemini API

### Infrastructure
- Docker & Docker Compose
- Nginx
- PostgreSQL
- Redis

## Documentation

See the [docs/](./docs) directory for detailed documentation:
- [API Documentation](./docs/API.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Development Guide](./docs/DEVELOPMENT.md)

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT License - see LICENSE file for details
