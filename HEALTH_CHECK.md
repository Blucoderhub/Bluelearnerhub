# Health Check & Verification Guide

Complete guide to verify all services are running correctly and diagnose issues.

## 🏥 Quick Health Check

Run this after starting services to verify everything is working:

```bash
# Backend health
curl http://localhost:5000/health

# AI Services health
curl http://localhost:8000/health

# Database connectivity
psql -U edtech_user -d edtech_db -c "SELECT 1;"

# Redis connectivity
redis-cli ping
```

Expected outputs:
- Backend: `{"status": "ok", "timestamp": "..."}`
- AI Services: `{"status": "ok", "services": {...}}`
- Database: `1`
- Redis: `PONG`

## 📋 Comprehensive Verification

### 1. Services Running Check

#### Backend (Port 5000)

```bash
# Check if listening
netstat -tuln | grep 5000
# or
lsof -i :5000

# Test connection
nc -zv localhost 5000
# or
curl -I http://localhost:5000
```

Expected: Connection successful or `Connected to localhost.5000`

#### AI Services (Port 8000)

```bash
# Check if listening
netstat -tuln | grep 8000
# or
lsof -i :8000

# Test connection
curl -I http://localhost:8000
```

Expected: HTTP response (200, 404, etc. - just means it's running)

#### Database (Port 5432)

```bash
# Check if listening
netstat -tuln | grep 5432

# Test connection
psql -h localhost -U edtech_user -c "\l"
```

Expected: List of databases

#### Redis (Port 6379)

```bash
# Check if listening
netstat -tuln | grep 6379

# Test connection
redis-cli ping
```

Expected: `PONG`

### 2. Backend Verification

#### Startup Check

```bash
# Look for startup banner in logs
npm run dev

# Expected output:
# ╔════════════════════════════════════════════════════════════════╗
# ║         🚀 EdTech Backend Server Started                       ║
# ║  Environment: development                                       ║
# ║  Port: 5000                                                     ║
# ║  Node Version: 18.x.x                                           ║
# ║  Database: Connected ✓                                          ║
# ║  Redis: Connected ✓                                             ║
# ╚════════════════════════════════════════════════════════════════╝
```

#### API Endpoints Check

```bash
# Root endpoint
curl http://localhost:5000/
# Expected: {"service": "EdTech Backend API", ...}

# Health endpoint
curl http://localhost:5000/health
# Expected: {"status": "ok", "timestamp": "..."}

# Health with details
curl http://localhost:5000/health
# Expected: {"status": "ok", "database": "connected", "redis": "connected"}
```

#### Database Connection Check

```bash
# From backend code, this should work:
# The backend tests DB on startup
npm run dev

# Check logs for:
# "✓ Database connection successful"
```

#### Rate Limiting Check

```bash
# Make multiple requests quickly
for i in {1..15}; do
  curl http://localhost:5000/health
done

# After 10 requests from same IP, should see 429 (Too Many Requests)
# Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
```

#### Socket.IO Connection Test

```bash
# Using curl with WebSocket upgrade headers
curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  http://localhost:5000/socket.io/?EIO=4&transport=websocket

# Expected: 101 Switching Protocols
```

Or use browser console:

```javascript
const socket = io('http://localhost:5000');
socket.on('connect', () => console.log('✓ Connected'));
socket.on('disconnect', () => console.log('✗ Disconnected'));
```

### 3. AI Services Verification

#### Startup Check

```bash
# Look for startup output
python app/main.py

# Wait for:
# INFO:     Uvicorn running on http://0.0.0.0:8000
# INFO:     Application startup complete
```

#### API Endpoints Check

```bash
# Root endpoint
curl http://localhost:8000/
# Expected: {"message": "EdTech AI Services API", ...}

# Health endpoint
curl http://localhost:8000/health
# Expected: {"status": "ok", "database": "connected", "redis": "connected"}

# Swagger UI
curl http://localhost:8000/docs
# Expected: HTML with Swagger interface
```

#### Configuration Check

```bash
# View loaded configuration (careful with secrets!)
curl http://localhost:8000/config
# Expected: Current configuration values (if endpoint exposed)

# Or check in Python:
from app.config import settings
print(settings.dict())
```

#### Database Connection Check

```bash
# Python script to test
python << 'EOF'
from app.core import test_db_connection
import asyncio

try:
    asyncio.run(test_db_connection())
    print("✓ Database connection OK")
except Exception as e:
    print(f"✗ Database connection failed: {e}")
EOF
```

#### Redis Connection Check

```bash
# Python script to test
python << 'EOF'
from app.core import test_redis_connection
import asyncio

try:
    asyncio.run(test_redis_connection())
    print("✓ Redis connection OK")
except Exception as e:
    print(f"✗ Redis connection failed: {e}")
EOF
```

#### Cache Functionality Test

```bash
# Python script to test caching
python << 'EOF'
import asyncio
from app.core import set_cache, get_cache, delete_cache

async def test_cache():
    # Set
    await set_cache("test_key", {"data": "hello"})
    print("✓ Cache set")
    
    # Get
    value = await get_cache("test_key")
    print(f"✓ Cache get: {value}")
    
    # Delete
    await delete_cache("test_key")
    print("✓ Cache delete")

asyncio.run(test_cache())
EOF
```

### 4. Database Verification

#### PostgreSQL Connection

```bash
# Connect and verify
psql -U edtech_user -d edtech_db -c "
SELECT 
    datname as database,
    pg_size_pretty(pg_database_size(datname)) as size
FROM pg_database
WHERE datname = 'edtech_db';
"

# Expected output:
#   database  |  size
# -----------+-------
#  edtech_db | 50 MB
```

#### Tables and Schema

```bash
# List all tables
psql -U edtech_user -d edtech_db -c "\dt"

# Expected: List of tables (initially may be empty if using ORM)
```

#### Connection Pool Status

```bash
# From backend or AI services logging
# Check logs for connection pool stats:
# "Connection pool: 8 active, 2 waiting"
```

#### Query Performance

```bash
# Simple query timing
psql -U edtech_user -d edtech_db -c "\timing on"
psql -U edtech_user -d edtech_db -c "SELECT 1;"

# Expected output:
# 1
# Time: 2.345 ms
```

### 5. Redis Verification

#### Basic Commands

```bash
# Ping
redis-cli ping
# Expected: PONG

# Set and Get
redis-cli SET edtech_test "hello"
redis-cli GET edtech_test
# Expected: OK then "hello"

# Keys
redis-cli KEYS "edtech*"
# Expected: List of matching keys

# Info
redis-cli INFO
# Expected: Server info and statistics
```

#### Cache Verification

```bash
# Monitor cache operations
redis-cli MONITOR

# In another terminal, trigger cache operations
# Observe: "SET", "GET", "DEL" commands

# Check memory usage
redis-cli INFO memory
# Expected: "used_memory_human" showing usage

# Check connected clients
redis-cli INFO clients
# Expected: "connected_clients: X"
```

#### Database Selection

```bash
# AI Services uses DB 0 for cache, DB 1 for Celery
redis-cli SELECT 0
redis-cli DBSIZE
# Expected: Number of keys in database 0

redis-cli SELECT 1
redis-cli DBSIZE
# Expected: Number of keys in database 1 (for background jobs)
```

### 6. Docker Compose Verification

#### Service Status

```bash
# Check all services
docker-compose ps

# Expected: All services with "Up" status
# CONTAINER ID   IMAGE            STATUS
# xyz...          postgres:16      Up
# abc...          redis:7          Up
# def...          edtech-backend   Up
# ...
```

#### Service Logs

```bash
# View logs for specific service
docker-compose logs backend
docker-compose logs ai-services
docker-compose logs postgres
docker-compose logs redis

# Follow logs in real-time
docker-compose logs -f backend

# Last 50 lines
docker-compose logs --tail=50 backend
```

#### Network Connectivity

```bash
# Test service-to-service communication
docker-compose exec backend curl http://ai-services:8000/health
docker-compose exec ai-services curl http://backend:5000/health

# Expected: JSON responses from each service
```

#### Volume Verification

```bash
# Check volume status
docker volume ls

# Inspect volume
docker volume inspect edtech-platform_postgres-data

# Expected: MountPoint and other metadata
```

## 🔍 Diagnostic Commands

### Backend Diagnostics

```bash
# TypeScript compilation check
cd backend
npm run build
# Expected: No compilation errors

# Code quality
npm run lint
npm run type

# Test suite
npm test

# Dependency audit
npm audit
```

### AI Services Diagnostics

```bash
# Environment check
cd ai-services
python -c "from app.config import settings; print(settings)"

# Dependencies
pip list

# Code quality
black --check app/
flake8 app/
mypy app/

# Test suite
pytest --verbose
```

## 📊 Performance Checks

### Backend Performance

```bash
# Measure response time
time curl http://localhost:5000/health

# Expected: <100ms for local health check

# Measure with Apache Bench
ab -n 100 -c 10 http://localhost:5000/health

# Expected: >1000 requests/sec on local machine
```

### AI Services Performance

```bash
# Measure response time
time curl http://localhost:8000/health

# Expected: <100ms for health check

# Stress test with wrk
wrk -t12 -c400 -d30s http://localhost:8000/health

# Expected: High throughput without errors
```

### Database Performance

```bash
# Check slow query log
psql -U edtech_user -d edtech_db -c "
SELECT 
    query,
    calls,
    total_time,
    mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
"

# Expected: List of queries by execution time
```

### Redis Performance

```bash
# Benchmark
redis-cli --latency

# Expected: Latency <1ms for local Redis

# Memory usage
redis-cli INFO memory | grep used_memory_human
# Expected: Reasonable memory usage
```

## 🚨 Common Issues & Solutions

### Issue: Cannot Connect to Database

**Symptoms:** `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# Start PostgreSQL (macOS)
brew services start postgresql

# Start PostgreSQL (Linux)
sudo systemctl start postgresql

# Start PostgreSQL (Docker)
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:16
```

### Issue: Cannot Connect to Redis

**Symptoms:** `Error: connect ECONNREFUSED 127.0.0.1:6379`

**Solution:**
```bash
# Check if Redis is running
redis-cli ping

# Start Redis (macOS)
brew services start redis

# Start Redis (Linux)
sudo systemctl start redis

# Start Redis (Docker)
docker run -d -p 6379:6379 redis:7
```

### Issue: Port Already in Use

**Symptoms:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3000 npm run dev
```

### Issue: JWT Token Expired

**Symptoms:** `401 Unauthorized: JWT expired`

**Solution:**
```bash
# Get new token via login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }'

# Use new token
curl -H "Authorization: Bearer NEW_TOKEN" \
  http://localhost:5000/api/v1/quiz
```

### Issue: CORS Errors

**Symptoms:** `Access to XMLHttpRequest at 'http://localhost:5000' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution:**
```bash
# Check CORS config in backend/.env
CORS_ORIGINS=http://localhost:3000,http://localhost:4000

# Verify in code
# app.ts should include:
# app.use(cors({
#   origin: [process.env.CORS_ORIGINS].flat(),
# }));
```

### Issue: Model Download Timeout

**Symptoms:** `Timeout downloading spaCy model`

**Solution:**
```bash
# Increase timeout
pip install --default-timeout=1000 spacy

# Download models manually
python -m spacy download en_core_web_lg
python -m nltk.downloader punkt stopwords wordnet
```

## ✅ Pre-Deployment Checklist

Before deploying to production:

- [ ] All services start without errors
- [ ] Health checks return `status: "ok"`
- [ ] Database connectivity verified
- [ ] Redis connectivity verified
- [ ] API endpoints respond correctly
- [ ] JWT authentication works
- [ ] Rate limiting active
- [ ] CORS properly configured
- [ ] Environment variables set
- [ ] Logs are structured JSON
- [ ] No console errors or warnings
- [ ] Database backups configured
- [ ] Connection pools configured
- [ ] SSL certificates valid
- [ ] Monitoring/alerting setup

## 🔗 Related Documentation

- [PLATFORM_SETUP.md](PLATFORM_SETUP.md) - Setup instructions
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - Production deployment
- [backend/README.md](backend/README.md) - Backend documentation
- [ai-services/README.md](ai-services/README.md) - AI services documentation
- [ai-services/DATABASE.md](ai-services/DATABASE.md) - Database patterns
- [ai-services/LOGGING.md](ai-services/LOGGING.md) - Logging guide

## 📞 Getting Help

If verification fails:

1. Check relevant service logs
2. Review this guide's troubleshooting section
3. Check related documentation
4. Verify all prerequisites are installed
5. Create detailed issue report with logs

---

**Last Updated:** March 2026  
**Maintenance:** Complete platform health verification
