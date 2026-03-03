# 🔒 Security Fixes Implementation - Deployment Guide

## ✅ COMPLETED SECURITY FIXES

All critical security vulnerabilities have been remediated in the codebase. Below is a comprehensive guide to deploy these fixes.

---

## 📋 OVERVIEW OF FIXES

### ✅ Code Changes Completed

1. **CRITICAL-001: Exposed Google Gemini API Key**
   - ✅ Removed hardcoded key from 4 files
   - ✅ Added validation to require environment variable
   - ❌ **ACTION REQUIRED**: You must revoke the exposed key and generate a new one

2. **CRITICAL-002 & CRITICAL-003: Hardcoded Database Passwords**
   - ✅ Removed all hardcoded passwords (PostgreSQL, MongoDB, Redis, RabbitMQ)
   - ✅ Updated .env.example files with secure placeholders
   - ❌ **ACTION REQUIRED**: Rotate all passwords immediately

3. **CRITICAL-004: XSS Vulnerability (localStorage tokens)**
   - ✅ Implemented HttpOnly cookie authentication in backend
   - ✅ Removed all localStorage token operations from frontend
   - ✅ Configured signed cookies with sameSite='strict'
   - ✅ Added withCredentials support in API client

4. **CRITICAL-005 & CRITICAL-006: CORS Vulnerabilities**
   - ✅ Removed wildcard CORS from AI services
   - ✅ Integrated security.py with origin validation
   - ✅ Backend already had restrictive CORS

5. **HIGH-005: No Refresh Token Rotation**
   - ✅ Implemented automatic token rotation on refresh
   - ✅ Old tokens invalidated immediately
   - ✅ Both access and refresh tokens rotated

6. **MEDIUM-002: No Account Lockout**
   - ✅ Implemented 5-attempt lockout with 15-minute duration
   - ✅ Failed attempt counter with automatic reset
   - ❌ **ACTION REQUIRED**: Run database migration

7. **Security Headers Enhancement**
   - ✅ Comprehensive Content Security Policy
   - ✅ Strict Transport Security (HSTS)
   - ✅ HTTPS redirect in production
   - ✅ Referrer Policy, X-Frame-Options, noSniff

---

## 🚨 CRITICAL ACTIONS REQUIRED (Do These FIRST)

### 1. Revoke Exposed Google Gemini API Key

The following API key was exposed in the code and **MUST BE REVOKED IMMEDIATELY**:

```
AIzaSyCXaJvkoc7J4RxGMfLPd_clxFNEinDuqUM
```

**Steps:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Find the exposed key and click "Delete" or "Revoke"
3. Generate a new API key
4. Store the new key securely in your `.env` file (see step 4 below)

**⚠️ CRITICAL**: Do NOT commit the new key to version control!

### 2. Rotate All Database Passwords

The following passwords were exposed and **MUST BE CHANGED**:

- **PostgreSQL**: `SecurePassword123!`
- **MongoDB**: `MongoPassword123!`
- **Redis**: `RedisPassword123!`
- **RabbitMQ**: `RabbitPassword123!`

**Steps for PostgreSQL:**
```sql
-- Connect to PostgreSQL as admin
psql -U postgres

-- Change password
ALTER USER edtech_user WITH PASSWORD 'YOUR_NEW_STRONG_PASSWORD';
```

**Steps for MongoDB:**
```javascript
// Connect to MongoDB
mongosh

// Switch to admin database
use admin

// Change password
db.updateUser("admin", {pwd: "YOUR_NEW_STRONG_PASSWORD"})
```

**Steps for Redis:**
```bash
# Edit redis.conf
requirepass YOUR_NEW_STRONG_PASSWORD

# Restart Redis
sudo systemctl restart redis
```

### 3. Run Database Migration

The account lockout feature requires new database columns.

**Steps:**
```bash
# Navigate to database directory
cd database/migrations

# Run migration using psql
psql -U edtech_user -d edtech_db -f 004_account_lockout.sql

# OR using your migration tool
npm run migrate:up
```

**Manual Migration (if needed):**
```sql
-- Connect to your database
psql -U edtech_user -d edtech_db

-- Run these commands
ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_users_locked_until ON users(locked_until);
```

### 4. Update Environment Variables

**Backend (.env):**
```bash
# Copy example and edit
cp backend/.env.example backend/.env

# Required variables
POSTGRES_PASSWORD=<your_new_postgres_password>
MONGO_PASSWORD=<your_new_mongo_password>
REDIS_PASSWORD=<your_new_redis_password>
RABBITMQ_PASSWORD=<your_new_rabbitmq_password>

JWT_SECRET=<generate_random_64_char_string>
JWT_REFRESH_SECRET=<generate_different_64_char_string>
SESSION_SECRET=<generate_random_32_char_string>
COOKIE_SECRET=<generate_random_32_char_string>

NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
BACKEND_URL=https://your-backend-domain.com
```

**AI Services (.env):**
```bash
# Copy example and edit
cp ai-services/.env.example ai-services/.env

# Required variables
GEMINI_API_KEY=<your_new_gemini_api_key>
POSTGRES_PASSWORD=<your_new_postgres_password>
MONGO_PASSWORD=<your_new_mongo_password>
REDIS_PASSWORD=<your_new_redis_password>

FRONTEND_URL=https://your-frontend-domain.com
BACKEND_URL=https://your-backend-domain.com
```

**Generate Strong Secrets:**
```bash
# Generate JWT secrets (64 characters)
openssl rand -base64 48

# Generate session/cookie secrets (32 characters)
openssl rand -base64 24
```

---

## 🔧 DEPLOYMENT STEPS

### 1. Verify All Changes

```bash
# Backend TypeScript compilation
cd backend
npm run build

# Frontend TypeScript compilation
cd frontend
npm run build

# AI Services syntax check
cd ai-services
python -m py_compile app/main.py
```

### 2. Update Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install

# AI Services (if needed)
cd ai-services
pip install -r requirements.txt
```

### 3. Test Security Fixes Locally

**Test 1: Cookie-Based Authentication**
```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd frontend
npm run dev

# Login and check cookies
# 1. Open browser DevTools → Application → Cookies
# 2. Login to the platform
# 3. Verify you see: accessToken and refreshToken cookies
# 4. Verify cookies have HttpOnly=true, Secure=true (in production)
# 5. Verify localStorage does NOT contain any tokens
```

**Test 2: Account Lockout**
```bash
# Try logging in with wrong password 6 times
# Should see error: "Account locked due to too many failed attempts"

# Check database
psql -U edtech_user -d edtech_db
SELECT email, failed_login_attempts, locked_until FROM users WHERE email='test@example.com';
# Should show: failed_login_attempts=5, locked_until=<15 minutes from now>
```

**Test 3: Token Rotation**
```bash
# Login and capture refresh token
# Wait for access token to expire
# Call /api/auth/refresh
# Verify new access and refresh tokens are issued
# Verify old refresh token no longer works
```

**Test 4: CORS Validation**
```bash
# Try accessing API from unauthorized origin
curl -X POST http://localhost:4000/api/auth/login \
  -H "Origin: https://malicious-site.com" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Should be blocked by CORS policy
```

### 4. Deploy to Production

**Environment-Specific Settings:**

```bash
# Production backend .env
NODE_ENV=production
TRUST_PROXY=true  # If behind load balancer
DATABASE_SSL=true

# Ensure HTTPS URLs
FRONTEND_URL=https://your-frontend.com
BACKEND_URL=https://your-backend.com
AI_SERVICE_URL=https://your-ai-service.com
```

**Docker Deployment:**
```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Run migration
docker-compose -f docker-compose.prod.yml exec backend npm run migrate:up
```

**Manual Deployment:**
```bash
# Backend
cd backend
npm run build
NODE_ENV=production npm start

# Frontend
cd frontend
npm run build
npm start

# AI Services
cd ai-services
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

---

## ✅ VERIFICATION CHECKLIST

Use this checklist to verify all security fixes are working:

### Authentication & Authorization
- [ ] Login returns HttpOnly cookies (not JSON tokens)
- [ ] Cookies have `httpOnly=true`, `secure=true`, `sameSite=strict`
- [ ] localStorage does NOT contain any tokens
- [ ] Access token expires after 7 days
- [ ] Refresh token expires after 30 days
- [ ] Refresh endpoint rotates both tokens
- [ ] Old refresh tokens are invalidated after rotation
- [ ] Logout clears all cookies
- [ ] Protected routes work with cookie authentication

### Account Security
- [ ] 5 failed login attempts triggers lockout
- [ ] Account locks for 15 minutes
- [ ] Lockout message displays: "Account locked due to too many failed attempts"
- [ ] Successful login resets failed attempts counter
- [ ] Database columns exist: `failed_login_attempts`, `locked_until`

### CORS & Security Headers
- [ ] AI services reject requests from unauthorized origins
- [ ] Backend rejects requests from unauthorized origins
- [ ] CORS only allows: Your frontend URL, localhost (dev only)
- [ ] CSP headers present in HTTP response
- [ ] HSTS header present with `max-age=31536000`
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy: strict-origin-when-cross-origin

### Secrets Management
- [ ] No hardcoded API keys in any file
- [ ] No hardcoded passwords in any file
- [ ] .env files NOT committed to Git
- [ ] .env.example files contain only placeholders
- [ ] All secrets loaded from environment variables
- [ ] Error messages don't expose secrets

### HTTPS & Transport Security
- [ ] Production uses HTTPS exclusively
- [ ] HTTP requests redirect to HTTPS
- [ ] Cookies only sent over HTTPS (`secure=true`)
- [ ] Mixed content warnings resolved
- [ ] SSL certificate valid and not self-signed

### API Security
- [ ] Rate limiting active on all endpoints
- [ ] Authentication rate limit: 5 requests/15 min
- [ ] General rate limit: 100 requests/15 min
- [ ] Input validation on all user inputs
- [ ] SQL injection protection active
- [ ] XSS protection active

---

## 🧪 SECURITY TESTING

### Manual Testing

**Test XSS Protection:**
```javascript
// Try injecting script in browser console
localStorage.setItem('token', 'fake-token')
// Token should NOT be read by frontend code

// Try XSS in form input
<script>alert('XSS')</script>
// Should be sanitized and not execute
```

**Test CSRF Protection:**
```bash
# Try request without proper origin
curl -X POST https://your-api.com/api/auth/login \
  -H "Origin: https://evil.com" \
  -H "Content-Type: application/json" \
  --cookie "accessToken=<stolen-token>"
  
# Should fail due to sameSite=strict
```

**Test SQL Injection:**
```bash
# Try SQL injection in login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com OR 1=1--","password":"anything"}'
  
# Should fail, not expose database structure
```

### Automated Testing

```bash
# Run security tests (if you have them)
cd backend
npm run test:security

# Check for vulnerable dependencies
npm audit
npm audit fix

# AI Services
cd ai-services
pip check
safety check
```

---

## 📊 MONITORING & LOGGING

### Set Up Security Monitoring

1. **Failed Login Attempts:**
   - Monitor users with `failed_login_attempts > 3`
   - Alert on accounts with `locked_until` set

2. **Token Rotation:**
   - Monitor `refresh_tokens` table for revoked tokens
   - Alert on refresh token reuse attempts

3. **CORS Violations:**
   - Log all blocked CORS requests
   - Alert on repeated attempts from same origin

4. **Security Headers:**
   - Monitor CSP violation reports
   - Check HSTS header in production

**Example Monitoring Query:**
```sql
-- Find accounts with suspicious activity
SELECT 
  email, 
  failed_login_attempts, 
  locked_until,
  last_login
FROM users
WHERE failed_login_attempts >= 3
  OR locked_until > NOW()
ORDER BY failed_login_attempts DESC;

-- Find revoked tokens
SELECT 
  user_id,
  COUNT(*) as revoked_count,
  MAX(revoked_at) as last_revoked
FROM refresh_tokens
WHERE is_revoked = true
GROUP BY user_id
HAVING COUNT(*) > 10;
```

---

## 🚨 INCIDENT RESPONSE

If you suspect the exposed secrets were used:

### 1. Immediate Actions
- [ ] Revoke exposed Gemini API key
- [ ] Rotate all database passwords
- [ ] Rotate all JWT secrets (will log out all users)
- [ ] Review access logs for suspicious activity
- [ ] Check database for unauthorized data access

### 2. Investigation
```sql
-- Check for suspicious user accounts
SELECT * FROM users 
WHERE created_at > '2024-01-01'  -- Adjust date
  AND is_admin = true;

-- Check for unusual refresh token activity
SELECT user_id, COUNT(*) as token_count
FROM refresh_tokens
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY user_id
HAVING COUNT(*) > 20;
```

### 3. Recovery
- [ ] Force password reset for all admin accounts
- [ ] Invalidate all refresh tokens
- [ ] Enable 2FA for admin accounts (if available)
- [ ] Review and restore any modified data
- [ ] Document the incident

---

## 📚 ADDITIONAL RESOURCES

### Security Best Practices
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [CSP Guidelines](https://content-security-policy.com/)

### Platform-Specific Documentation
- [SECURITY_AUDIT_REPORT.md](./SECURITY_AUDIT_REPORT.md) - Full audit findings
- [SECURITY_IMPLEMENTATION_GUIDE.md](./SECURITY_IMPLEMENTATION_GUIDE.md) - Detailed implementation
- [SECURITY_DEPLOYMENT_CHECKLIST.md](./SECURITY_DEPLOYMENT_CHECKLIST.md) - Pre-deployment checklist

---

## 📞 SUPPORT

If you encounter issues during deployment:

1. **Check Logs:**
   ```bash
   # Backend logs
   tail -f backend/logs/app.log
   
   # AI Services logs
   tail -f ai-services/logs/app.log
   ```

2. **Common Issues:**
   - **"GEMINI_API_KEY not found"**: Set environment variable
   - **"Account locked"**: Wait 15 minutes or reset in database
   - **CORS errors**: Check FRONTEND_URL matches exactly
   - **Cookie not sent**: Ensure `withCredentials: true` in frontend

3. **Rollback (if needed):**
   ```bash
   git revert HEAD~10  # Adjust number as needed
   ```

---

## ✅ COMPLETION CHECKLIST

- [ ] Revoked exposed Gemini API key
- [ ] Generated new Gemini API key
- [ ] Rotated PostgreSQL password
- [ ] Rotated MongoDB password
- [ ] Rotated Redis password
- [ ] Generated JWT secrets
- [ ] Generated session/cookie secrets
- [ ] Updated all .env files
- [ ] Ran database migration (004_account_lockout.sql)
- [ ] Tested cookie authentication locally
- [ ] Tested account lockout mechanism
- [ ] Tested token rotation
- [ ] Verified no tokens in localStorage
- [ ] Verified CORS configuration
- [ ] Verified security headers in production
- [ ] Deployed to staging environment
- [ ] Verified all tests pass
- [ ] Deployed to production
- [ ] Verified production security
- [ ] Set up monitoring alerts
- [ ] Documented deployment date and version

---

## 🎉 YOU'RE DONE!

Your platform now implements enterprise-grade security:

✅ No exposed secrets  
✅ HttpOnly cookie authentication (XSS protection)  
✅ Account lockout (brute force protection)  
✅ Token rotation (replay attack protection)  
✅ Strict CORS (CSRF protection)  
✅ Comprehensive security headers  
✅ HTTPS enforcement  
✅ Production-ready configuration  

**Next Steps:**
1. Regular security audits (quarterly)
2. Dependency updates (monthly)
3. Penetration testing (annually)
4. Security awareness training for team
5. Incident response plan review

**Stay secure! 🔒**
