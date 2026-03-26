# BluelearnerHub Deployment Guide

This guide provides comprehensive instructions for deploying BluelearnerHub to various hosting platforms including Vercel, Railway, AWS, and more.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Vercel Deployment](#vercel-deployment)
4. [Railway Deployment](#railway-deployment)
5. [AWS Deployment](#aws-deployment)
6. [Docker Deployment](#docker-deployment)
7. [Local Development Setup](#local-development-setup)
8. [Database Setup](#database-setup)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed
- Docker and Docker Compose installed
- Git installed
- Account on your chosen platform (Vercel, Railway, AWS, etc.)
- PostgreSQL database access
- Redis instance access (optional for some deployments)

## Environment Variables

Create the following environment variables for your deployment:

### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database
REDIS_URL=redis://host:port

# JWT Secrets (generate with: openssl rand -base64 32)
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env.local)
```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-url.com

# NextAuth Configuration
NEXTAUTH_URL=https://your-frontend-url.com
NEXTAUTH_SECRET=your_nextauth_secret_here

# Environment
NODE_ENV=production
```

### AI Services (.env)
```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database
REDIS_URL=redis://host:port

# Google Gemini
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# Server Configuration
HOST=0.0.0.0
PORT=8000
WORKERS=2
```

## Vercel Deployment

### Step 1: Frontend Deployment

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your repository
   - Set root directory to `frontend`
   - Add environment variables from Frontend section above
   - Deploy

3. **Configure Custom Domain** (optional):
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Step 2: Backend Deployment (Railway/AWS/VPS)

Since Vercel doesn't support backend APIs with databases, deploy your backend separately:

**Option A: Railway**
- Follow Railway deployment steps below for backend + AI services

**Option B: AWS**
- Follow AWS deployment steps below

**Option C: VPS/DigitalOcean**
- Use Docker deployment steps below

## Railway Deployment

Railway can host all your services in one place.

### Step 1: Setup Railway Project

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Initialize**:
   ```bash
   railway login
   railway init
   ```

3. **Deploy using railway.json**:
   ```bash
   railway up
   ```

### Step 2: Configure Services

Railway will automatically detect the `railway.json` configuration and deploy:
- Frontend service (port 3000)
- Backend service (port 5000)
- AI Services (port 8000)

### Step 3: Add Environment Variables

In Railway dashboard, add environment variables for each service:

1. **Frontend Service**:
   - Add frontend environment variables
   - Set `NEXT_PUBLIC_API_URL` to your backend Railway URL

2. **Backend Service**:
   - Add backend environment variables
   - Set `DATABASE_URL` to Railway PostgreSQL URL
   - Set `REDIS_URL` to Railway Redis URL

3. **AI Services**:
   - Add AI services environment variables
   - Use same database and Redis URLs

### Step 4: Setup Databases

1. **Add PostgreSQL**:
   ```bash
   railway add postgresql
   ```

2. **Add Redis**:
   ```bash
   railway add redis
   ```

## AWS Deployment

### Step 1: Prerequisites

1. **Install AWS CLI**:
   ```bash
   # macOS
   brew install awscli
   
   # Windows
   # Download and install from AWS website
   
   # Linux
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   ```

2. **Configure AWS Credentials**:
   ```bash
   aws configure
   ```

3. **Install Docker**:
   - Download and install Docker Desktop

### Step 2: Deploy Infrastructure

1. **Run Deployment Script**:
   ```bash
   # Linux/macOS
   chmod +x aws/deploy.sh
   ./aws/deploy.sh
   
   # Windows PowerShell
   .\aws\deploy.ps1
   ```

2. **Wait for Deployment**:
   - This creates all AWS resources (VPC, ECS, RDS, etc.)
   - Builds and pushes Docker images to ECR
   - Deploys ECS services

### Step 3: Configure Domain and SSL

1. **Route 53 (if using AWS domain)**:
   - Create hosted zone for your domain
   - Update nameservers with your domain registrar
   - Create A record pointing to ALB

2. **Certificate Manager**:
   - Request SSL certificate for your domain
   - Add certificate to Application Load Balancer

### Step 4: Database Migration

1. **Connect to RDS**:
   ```bash
   psql -h your-rds-endpoint -U postgres -d edtech_platform
   ```

2. **Run Migrations**:
   ```sql
   \i database/migrations/001_full_schema.sql
   \i database/migrations/002_frontend_errors.sql
   ```

## Docker Deployment

For self-hosted deployment on VPS or dedicated servers.

### Step 1: Environment Setup

1. **Clone Repository**:
   ```bash
   git clone your-repo-url
   cd edtech-platform
   ```

2. **Create Environment Files**:
   ```bash
   # Copy example files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   cp ai-services/.env.example ai-services/.env
   
   # Edit with your values
   nano backend/.env
   nano frontend/.env.local
   nano ai-services/.env
   ```

### Step 2: Deploy with Docker Compose

1. **Start Services**:
   ```bash
   docker-compose up -d
   ```

2. **Check Status**:
   ```bash
   docker-compose ps
   docker-compose logs
   ```

### Step 3: Setup Nginx (Reverse Proxy)

1. **Install Nginx**:
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Configure Nginx**:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
       
       location /api {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
       
       location /ai {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

3. **Setup SSL with Certbot**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

## Local Development Setup

### Step 1: Install Dependencies

```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend && npm install && cd ..

# Backend dependencies
cd backend && npm install && cd ..

# AI services dependencies
cd ai-services && pip install -r requirements.txt && cd ..
```

### Step 2: Setup Databases

1. **PostgreSQL**:
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql
   createdb edtech_platform
   
   # Ubuntu
   sudo apt install postgresql
   sudo -u postgres createdb edtech_platform
   ```

2. **Redis**:
   ```bash
   # macOS
   brew install redis
   brew services start redis
   
   # Ubuntu
   sudo apt install redis-server
   sudo systemctl start redis
   ```

### Step 3: Run Development Servers

```bash
# Start all services
npm run dev

# Or start individually
npm run dev:frontend  # Port 3000
npm run dev:backend   # Port 5000
npm run dev:ai        # Port 8000
```

## Database Setup

### PostgreSQL Schema

Run the following migrations in order:

1. **Full Schema**:
   ```bash
   psql -d edtech_platform -f database/migrations/001_full_schema.sql
   ```

2. **Frontend Errors**:
   ```bash
   psql -d edtech_platform -f database/migrations/002_frontend_errors.sql
   ```

### Seed Data (Optional)

```bash
psql -d edtech_platform -f database/seeds/sample_data.sql
```

## Monitoring and Logging

### Production Monitoring

1. **Health Checks**:
   - Frontend: `https://yourdomain.com/api/health`
   - Backend: `https://yourdomain.com/api/health`
   - AI Services: `https://yourdomain.com/ai/health`

2. **Logging**:
   - **Vercel**: Check Vercel dashboard logs
   - **Railway**: Check Railway dashboard logs
   - **AWS**: CloudWatch Logs
   - **Docker**: `docker-compose logs -f`

3. **Metrics**:
   - Response times
   - Error rates
   - Database connections
   - Memory usage

### Error Tracking

The application includes comprehensive error boundary and logging:

- Frontend errors are captured and logged
- Backend errors include stack traces and request context
- AI service errors include model and processing information

## Troubleshooting

### Common Issues

1. **Database Connection Failed**:
   - Check `DATABASE_URL` format
   - Verify database is running
   - Check firewall/security group settings

2. **Redis Connection Failed**:
   - Check `REDIS_URL` format
   - Verify Redis is running
   - Check network connectivity

3. **CORS Errors**:
   - Update `ALLOWED_ORIGINS` in backend
   - Check API URLs in frontend

4. **Build Failures**:
   - Check Node.js version (requires 18+)
   - Clear node_modules and reinstall
   - Check for TypeScript errors

5. **SSL Certificate Issues**:
   - Verify domain ownership
   - Check DNS propagation
   - Renew certificates if expired

### Debug Commands

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs service-name

# Check database connectivity
psql $DATABASE_URL -c "SELECT 1"

# Check Redis connectivity
redis-cli -u $REDIS_URL ping

# Test API endpoints
curl https://yourdomain.com/api/health
curl https://yourdomain.com/ai/health
```

### Performance Optimization

1. **Database**:
   - Add indexes for frequently queried fields
   - Use connection pooling
   - Regular maintenance and vacuuming

2. **Frontend**:
   - Enable Next.js image optimization
   - Use CDN for static assets
   - Implement proper caching headers

3. **Backend**:
   - Use Redis for session storage
   - Implement API response caching
   - Use compression middleware

4. **AI Services**:
   - Use model caching
   - Implement request batching
   - Use GPU acceleration if available

## Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Rotate JWT secrets regularly
- [ ] Implement rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable CORS with specific origins
- [ ] Regular security updates
- [ ] Database connection encryption
- [ ] Input validation and sanitization
- [ ] Authentication and authorization
- [ ] Error message sanitization

## Support

For issues and questions:

1. Check this deployment guide
2. Review application logs
3. Check platform-specific documentation
4. Contact support team

---

**Note**: Replace placeholder values (URLs, secrets, etc.) with your actual values. Keep your environment variables secure and never commit them to version control.