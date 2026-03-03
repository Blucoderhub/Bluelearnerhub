# Deployment Guide

## Prerequisites

- AWS Account (or your hosting provider)
- Docker and Docker Compose
- Git
- Environment variables configured

## Local Development Deployment

### Using Docker Compose

1. Clone the repository:
```bash
git clone <repository-url>
cd edtech-platform
```

2. Create environment files:
```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
cp ai-services/.env.example ai-services/.env
```

3. Build and start services:
```bash
docker-compose up -d
```

4. Initialize database:
```bash
docker-compose exec backend npm run migration:run
docker-compose exec backend npm run seed:data
```

5. Access the platform:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- AI Services: http://localhost:8000
- Nginx: http://localhost

## Production Deployment

### AWS EC2 Deployment

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t3.large or larger
   - Security group with ports 80, 443, 22 open

2. **Install Dependencies**
```bash
sudo apt update
sudo apt upgrade -y
sudo apt install docker.io docker-compose nginx -y
sudo usermod -aG docker $USER
```

3. **Setup SSL Certificate**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot certonly --standalone -d yourdomain.com
```

4. **Configure Nginx**
```bash
sudo cp docker/nginx/nginx.prod.conf /etc/nginx/sites-available/default
sudo nginx -t
sudo systemctl restart nginx
```

5. **Deploy Application**
```bash
git clone <repository-url>
cd edtech-platform
docker-compose -f docker-compose.prod.yml up -d
```

### Database Backup

```bash
# Backup PostgreSQL
docker-compose exec postgres pg_dump -U postgres edtech_platform > backup.sql

# Restore PostgreSQL
docker-compose exec -T postgres psql -U postgres edtech_platform < backup.sql
```

### Monitoring

Configure monitoring for:
- CPU and memory usage
- Disk space
- Database performance
- API response times
- Error rates

### Scaling

For high traffic:
1. Use load balancer (AWS ELB/ALB)
2. Deploy multiple backend instances
3. Use managed database service
4. Setup Redis cluster
5. Enable CDN for static assets

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<generate-secure-key>
```

### Backend (.env)
```
NODE_ENV=production
DB_HOST=<rds-endpoint>
DB_USER=postgres
DB_PASSWORD=<secure-password>
REDIS_HOST=<redis-endpoint>
JWT_SECRET=<secure-jwt-key>
```

### AI Services
```
DATABASE_URL=postgresql://user:password@host/db
OPENAI_API_KEY=<your-api-key>
```

## Health Checks

Ensure all services are healthy:

```bash
# Frontend
curl http://localhost:3000

# Backend
curl http://localhost:5000/health

# AI Services
curl http://localhost:8000/health

# Database
docker-compose exec postgres pg_isready -U postgres
```

## Rollback Procedures

1. Stop current version:
```bash
docker-compose down
```

2. Restore previous version:
```bash
git checkout <previous-tag>
docker-compose up -d
```

3. Run database migrations if needed:
```bash
docker-compose exec backend npm run migration:run
```

## Troubleshooting

### Services not starting
- Check Docker logs: `docker-compose logs <service>`
- Verify port availability
- Check environment variables

### Database connection errors
- Verify DATABASE_URL
- Check network connectivity
- Ensure database is running

### Out of memory
- Check current usage: `docker stats`
- Increase EC2 instance size
- Clear old containers and images
