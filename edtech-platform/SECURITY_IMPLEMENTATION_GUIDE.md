# 🔐 Security Implementation Guide
**EdTech Platform - Step-by-Step Remediation Instructions**

---

## Phase 1: IMMEDIATE ACTIONS (Within 24 Hours)

### 1.1 Revoke Exposed API Keys

**Action:** Immediately revoke the exposed Google Gemini API key

```bash
# Steps:
# 1. Go to https://console.cloud.google.com
# 2. Navigate to APIs & Services > Credentials
# 3. Find API key: AIzaSyCXaJvkoc7J4RxGMfLPd_clxFNEinDuqUM
# 4. Click the key and select "Delete"
# 5. Confirm deletion
```

**Create New Restricted Key:**

```bash
# Go back to Credentials
# Click "+ Create Credentials" > "API Key"
# New key will be generated

# RESTRICT THE NEW KEY:
# 1. Click on the new key
# 2. Under "API restrictions": Select "Google Generative AI API" ONLY
# 3. Under "Application restrictions": 
#    - Select "IP addresses (IPv4 only)"
#    - Add your server's public IP address(es)
# 4. Save and copy the new key
```

**Estimated Time:** 5-10 minutes

---

### 1.2 Rotate All Database Passwords

**PostgreSQL:**

```bash
# Connect to PostgreSQL
psql -U postgres -d edtech_db

# Generate new secure password
\c edtech_db

# Change password
ALTER USER edtech_user WITH PASSWORD 'NewSecurePassword64CharsRandom!';

# Verify
\q
```

**Generate Secure Password:**

```bash
# Option 1: Using Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# Option 2: Using OpenSSL
openssl rand -base64 32

# Option 3: Using tr
head -c 32 /dev/urandom | base64
```

**Save credentials in secure password manager** (1Password, Bitwarden, etc.)

**Estimated Time:** 10-15 minutes

---

### 1.3 Update Environment Variables

**Backend:** `backend/.env`

```env
# ❌ OLD (REMOVE)
# DATABASE_URL=postgresql://edtech_user:SecurePassword123!@localhost:5432/edtech_db
# REDIS_PASSWORD=RedisPassword123!
# GEMINI_API_KEY=AIzaSyCXaJvkoc7J4RxGMfLPd_clxFNEinDuqUM

# ✅ NEW (ADD)
DATABASE_URL=postgresql://edtech_user:YourActualNewPassword@your-db-host:5432/edtech_db
REDIS_PASSWORD=YourActualNewRedisPassword
GEMINI_API_KEY=AIzaSyYourActualNewKeyFromGoogleConsole

# Other critical secrets
JWT_SECRET=YourSecureJWTSecretHere64Chars
JWT_REFRESH_SECRET=YourSecureRefreshSecretHere64Chars
SESSION_SECRET=YourSecureSessionSecretHere64Chars

# Domains
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com

# Security
NODE_ENV=production
DEBUG=false

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**AI Services:** `ai-services/.env`

```env
# Database
DATABASE_URL=postgresql://edtech_user:YourNewPassword@your-db-host:5432/edtech_platform
POSTGRES_PASSWORD=YourNewPassword

# Redis
REDIS_PASSWORD=YourNewRedisPassword
REDIS_URL=redis://:YourNewRedisPassword@redis-host:6379

# Gemini API - Use the newly created key
GEMINI_API_KEY=AIzaSyYourNewActualKeyFromGoogleConsole

# JWT
JWT_SECRET=YourSecureJWTSecretHere64Chars

# Services
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
```

**Frontend:** `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=YourSecureNextAuthSecretHere64Chars
```

**Estimated Time:** 15-20 minutes

---

### 1.4 Clean .env Files from Git History

**Check if secrets are in git history:**

```bash
# Search git history for exposed key
git log -p --all -S "AIzaSyCXaJvkoc7J4RxGMfLPd_clxFNEinDuqUM" | head -20

# Search for common password patterns
git log -p --all -S "SecurePassword123" | head -20
```

**Clean Git History with bfg-repo-cleaner:**

```bash
# Install bfg
# macOS: brew install bfg
# Linux: apt-get install bfg

# Create a clean copy
git clone --mirror https://your-repo-url your-repo.git

# Remove secrets
cd your-repo.git
bfg --delete-files '.env' --replace-text '(AIzaSyCXaJvkoc7J4RxGMfLPd_clxFNEinDuqUM)==>REMOVED_API_KEY' .

# Clean reflog
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Push back to main
cd ../your-repo
git push origin --force-all
git push origin --force --tags
```

**Alternative: Using git filter-branch**

```bash
# More manual but works
git filter-branch --tree-filter 'rm -f .env' -- --all
git filter-branch --tree-filter 'find . -name ".env*" -delete' -- --all
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force-all
```

**Estimated Time:** 20-30 minutes

---

## Phase 2: URGENT (Within 1 Week)

### 2.1 Implement HttpOnly Cookie Authentication

**Step 1: Update Backend Auth Controller**

Replace `backend/src/controllers/auth.ts` with implementation from `backend/src/controllers/auth.secure.ts`

Key changes:
- Remove token from response body
- Set HttpOnly cookies for tokens
- Implement token rotation for refresh tokens

```bash
# Backup old file
cp backend/src/controllers/auth.ts backend/src/controllers/auth.ts.backup

# Use new secure implementation
cp backend/src/controllers/auth.secure.ts backend/src/controllers/auth.ts
```

**Step 2: Update Frontend API Client**

```typescript
// OLD: frontend/src/lib/api.ts (VULNERABLE)
// ❌ Storing tokens in localStorage
const token = localStorage.getItem('token')

// NEW: frontend/src/lib/api.ts (SECURE)
// ✅ Using HttpOnly cookies (automatic with credentials)
const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,  // Enable cookies
});

// Remove localStorage token retrieval
// Cookies are sent automatically
```

**Step 3: Update Frontend Auth Hook**

```typescript
// OLD: frontend/src/hooks/useAuth.ts (VULNERABLE)
// ❌ Manually managing localStorage tokens
localStorage.setItem('token', token)

// NEW: frontend/src/hooks/useAuth.ts (SECURE)
// ✅ Let backend manage tokens via cookies
const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password })
  // Cookies are set by backend automatically
  setUser(response.data.user)
}
```

**Step 4: Update Express App Configuration**

Replace `backend/src/app.ts` with `backend/src/app.secure.ts`

```bash
cp backend/src/app.secure.ts backend/src/app.ts
```

**Step 5: Test the Implementation**

```bash
# Start backend
cd backend
npm run dev

# In another terminal, test login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  -c cookies.txt

# Verify cookies were set
cat cookies.txt

# Use cookies in subsequent requests
curl http://localhost:4000/api/auth/me \
  -b cookies.txt
```

**Estimated Time:** 2-4 hours

---

### 2.2 Fix CORS Configuration

**Backend:**

```typescript
// Update backend/src/app.ts
const corsOptions = {
  origin: process.env.FRONTEND_URL,  // Specific domain
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600,
};

app.use(cors(corsOptions));
```

**AI Services:**

```python
# Update ai-services/app/main.py
from app.security import setup_security_middleware, validate_security_config

# Validate config first
validate_security_config()

# Setup security
setup_security_middleware(app)
```

**Environment Variables:**

```env
# Set these in your .env files
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**Test CORS:**

```bash
# Test from allowed origin
curl -H "Origin: https://yourdomain.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS http://localhost:4000/api/auth/login -v

# Should see: Access-Control-Allow-Origin: https://yourdomain.com

# Test from disallowed origin
curl -H "Origin: https://evil.com" \
  -X OPTIONS http://localhost:4000/api/auth/login -v

# Should NOT see Access-Control header
```

**Estimated Time:** 1-2 hours

---

### 2.3 Implement Account Lockout

**Update backend/src/services/auth.ts:**

```typescript
async login(email: string, password: string) {
  const user = await UserModel.findByEmail(email);
  
  // Check lockout
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw new Error('Account locked. Try again later.');
  }

  // Verify password
  const isValid = await comparePassword(password, user.password_hash);
  
  if (!isValid) {
    // Increment failed attempts
    const failedAttempts = (user.failedLoginAttempts || 0) + 1;
    
    if (failedAttempts >= 5) {
      // Lock account for 15 minutes
      await UserModel.update(user.id, {
        failedLoginAttempts,
        lockedUntil: new Date(Date.now() + 15 * 60 * 1000),
      });
      throw new Error('Too many failed attempts. Account locked 15 minutes.');
    }
    
    await UserModel.update(user.id, { failedLoginAttempts });
    throw new Error('Invalid credentials');
  }

  // Success - reset failed attempts
  await UserModel.update(user.id, {
    failedLoginAttempts: 0,
    lockedUntil: null,
  });

  // Generate tokens...
}
```

**Estimated Time:** 1-2 hours

---

### 2.4 Enable HTTPS

**Local Development:**

```bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365

# Update backend to use HTTPS
# See Node.js HTTPS server setup
```

**Production - AWS EC2:**

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com -d api.yourdomain.com

# Certificates will be in: /etc/letsencrypt/live/yourdomain.com/
```

**Production - Docker:**

```dockerfile
# Use nginx as reverse proxy with SSL
FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf
COPY /path/to/cert.pem /etc/nginx/certs/
COPY /path/to/key.pem /etc/nginx/certs/

EXPOSE 443
```

**Estimated Time:** 1-3 hours

---

## Phase 3: HIGH PRIORITY (Within 2 Weeks)

### 3.1 Implement Refresh Token Rotation

```typescript
// In backend/src/services/auth.ts
async refreshAccessToken(refreshToken: string) {
  // Verify token
  const decoded = verifyRefreshToken(refreshToken);
  
  // Generate NEW tokens (not re-use old ones)
  const newAccessToken = signAccessToken(decoded);
  const newRefreshToken = signRefreshToken(decoded);
  
  // Invalidate old refresh token (important!)
  await invalidateRefreshToken(refreshToken);
  
  // Store new refresh token
  await storeRefreshToken(decoded.userId, newRefreshToken);
  
  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}
```

**Estimated Time:** 2-3 hours

---

### 3.2 Add Security Audit Logging

```typescript
// Create backend/src/utils/audit.ts
import winston from 'winston';

export const auditLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/audit.log' }),
  ],
});

export const logSecurityEvent = (
  eventType: string,
  userId: string | null,
  ip: string,
  details: any
) => {
  auditLogger.info({
    timestamp: new Date().toISOString(),
    eventType,
    userId,
    ip,
    ...details,
  });
};
```

**Usage:**

```typescript
// In login endpoint
logSecurityEvent('login_attempt', userId, req.ip, {
  success: true,
  userAgent: req.get('user-agent'),
});

// Failed login
logSecurityEvent('login_failed', null, req.ip, {
  email: email,
  reason: 'invalid_password',
});
```

**Estimated Time:** 2-3 hours

---

### 3.3 Add Frontend Security Headers

```typescript
// frontend/next.config.ts
export default {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

**Estimated Time:** 1 hour

---

## Phase 4: ONGOING (Continuous)

### 4.1 Dependency Vulnerability Scanning

```bash
# Backend
cd backend
npm audit
npm audit fix
npm audit fix --force  # Use with caution

# Frontend
cd frontend
npm audit
npm audit fix

# AI Services
cd ai-services
pip install safety
safety check
```

**Set up automated scanning:**

```yaml
# .github/workflows/security.yml
name: Security Scan

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run npm audit
        run: npm audit --audit-level=moderate
      - name: Run OWASP dependency check
        uses: dependency-check/Dependency-Check_Action@main
```

**Estimated Time:** 1-2 hours setup

---

### 4.2 Regular Security Audits

Schedule reviews:
- Weekly: Check access logs for suspicious activity
- Monthly: Update dependencies and patches
- Quarterly: Full security audit
- Annually: Penetration testing

---

### 4.3 Monitoring & Alerting

Set up alerts for:

```typescript
// Log suspicious activities
- Failed login attempts > 3
- Rate limit violations
- Invalid tokens
- Database errors
- API errors > 500 status

// Send alerts to:
- Email (critical)
- Slack channel (high priority)
- Dashboard (all events)
```

---

## Roll-out Procedure

### Pre-Deployment Checklist

- [ ] All vulnerable code updated
- [ ] Secret values changed
- [ ] Tests pass locally
- [ ] CORS configured for production domains
- [ ] HTTPS certificates set up
- [ ] Environment variables set in CI/CD
- [ ] Database backups created
- [ ] Rollback plan documented

### Deployment Steps

```bash
# 1. Backup database
pg_dump edtech_db > backup_$(date +%Y%m%d).sql

# 2. Update secrets in environment
# (Via CI/CD secrets manager, not in code)

# 3. Deploy backend
git pull origin main
npm install
npm run build
npm start

# 4. Deploy AI services
docker build -t ai-services:latest .
docker run -e GEMINI_API_KEY=*** -d ai-services

# 5. Deploy frontend
npm run build
npm run export
# Deploy to hosting (Vercel, etc.)

# 6. Verify
curl https://yourdomain.com/api/health
curl https://api.yourdomain.com/health

# 7. Monitor
# Check logs for errors
# Monitor performance metrics
```

---

## Verification Checklist

After implementation, verify:

- [ ] No exposed API keys in git history
- [ ] No hardcoded passwords in source code
- [ ] HttpOnly cookies working (test with DevTools)
- [ ] CORS working for allowed origins
- [ ] HTTPS redirecting HTTP traffic
- [ ] Rate limiting active on sensitive endpoints
- [ ] Account lockout working (test with multiple wrong passwords)
- [ ] Security headers present (test with curl -I)
- [ ] Audit logging working (check logs for events)
- [ ] Tests passing
- [ ] No console errors in production

---

## Support & Resources

**Documentation:**
- [SECURITY_AUDIT_REPORT.md](./SECURITY_AUDIT_REPORT.md) - Full audit findings
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)

**Tools:**
- OWASP ZAP: Web app scanning
- Snyk: Dependency scanning
- TruffleHog: Secret detection
- Burp Suite: Penetration testing

---

**Last Updated:** 2024  
**Status:** CRITICAL ACTIONS REQUIRED  
**Next Review:** 30 days  
