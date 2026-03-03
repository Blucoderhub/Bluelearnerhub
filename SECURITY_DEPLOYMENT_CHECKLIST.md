# ✅ Production Security Deployment Checklist
**EdTech Platform - Pre-Deployment & Post-Deployment Security Verification**

---

## 🔴 CRITICAL: Secret Management

### Before Deployment

- [ ] **All hardcoded API keys removed from source code**
  - [ ] Gemini API key not in code
  - [ ] Database passwords not in code
  - [ ] JWT secrets not in code
  - Verify: `grep -r "AIzaSy" --include="*.ts" --include="*.js" --include="*.py" .`
  - Verify: `grep -r "SecurePassword123" --include="*.ts" --include="*.js" --include="*.py" .`

- [ ] **Environment variables configured for all services**
  - [ ] GEMINI_API_KEY set (new, restricted key)
  - [ ] JWT_SECRET set (long random string)
  - [ ] JWT_REFRESH_SECRET set
  - [ ] SESSION_SECRET set
  - [ ] DATABASE_URL set (with new password)
  - [ ] REDIS_PASSWORD set (new password)
  - [ ] FRONTEND_URL set to production domain
  - [ ] BACKEND_URL set to production domain

- [ ] **Secrets stored in secure location**
  - [ ] AWS Secrets Manager (if on AWS)
  - [ ] Google Secret Manager (if on Google Cloud)
  - [ ] CI/CD secrets manager (GitHub Secrets, GitLab CI, Azure KeyVault)
  - [ ] Password manager (1Password, Bitwarden) for team backup
  - [ ] NOT in `.env` files in git

- [ ] **Git history cleaned of secrets**
  - [ ] Ran `git log` to verify no exposed keys in history
  - [ ] If found, ran history cleanup (bfg or git filter-branch)
  - [ ] Verified with `git log -p --all -S "exposed-key"`

- [ ] **Database credentials rotated**
  - [ ] PostgreSQL password changed
  - [ ] Redis password changed
  - [ ] MongoDB password changed (if used)
  - [ ] Old credentials documented in secure place
  - [ ] Backup with old credentials created

---

## 🟠 CRITICAL: Authentication & Authorization

### Backend Security

- [ ] **HttpOnly cookies configured for tokens**
  - [ ] Access token in HttpOnly cookie
  - [ ] Refresh token in HttpOnly cookie
  - [ ] Cookies marked as `Secure` (HTTPS only)
  - [ ] Cookies marked as `SameSite=Strict`
  - [ ] No tokens in response body
  - Test: Navigate to DevTools > Application > Cookies, verify tokens present and HttpOnly enabled

- [ ] **Token validation implemented**
  - [ ] JWT signature verified on every request
  - [ ] Token expiration checked
  - [ ] User status validated (active/banned)
  - [ ] Role-based authorization enforced
  - [ ] Refresh token rotation implemented
  - [ ] Old refresh tokens invalidated

- [ ] **Account lockout implemented**
  - [ ] Max failed login attempts configured (5)
  - [ ] Lockout duration configured (15 minutes)
  - [ ] Lockout enforced on login attempt
  - [ ] Counter resets on successful login
  - Test: Attempt login 6 times, verify account locked

- [ ] **Password security**
  - [ ] Minimum 12 characters required
  - [ ] Complexity requirements enforced (uppercase, lowercase, number, special char)
  - [ ] Bcrypt hashing with 12 rounds (or more) configured
  - [ ] Passwords never logged or exposed in errors
  - [ ] Password reset sends verification token (not reset link with password)

### Frontend Security

- [ ] **No tokens in localStorage**
  - [ ] localStorage.getItem('token') removed
  - [ ] localStorage.setItem('token') removed
  - [ ] All token storage via HttpOnly cookies
  - Verify: `grep -r "localStorage.*token" frontend/`

- [ ] **API client configured for credentials**
  - [ ] `withCredentials: true` in axios config
  - [ ] Cookies automatically sent with requests
  - [ ] No manual Bearer token header (unless API client)

- [ ] **Authentication state protected**
  - [ ] Protected routes require authentication
  - [ ] Unauthorized users redirected to login
  - [ ] Sensitive pages cleared on logout

---

## 🔒 CRITICAL: HTTPS & TLS

### Deployment

- [ ] **HTTPS enabled on all domains**
  - [ ] yourdomain.com → HTTPS
  - [ ] api.yourdomain.com → HTTPS
  - [ ] ai.yourdomain.com → HTTPS
  - [ ] www.yourdomain.com → HTTPS

- [ ] **SSL/TLS certificates valid**
  - [ ] Certificates from trusted CA (Let's Encrypt, Digicert, etc.)
  - [ ] Certificates not self-signed in production
  - [ ] Certificate expiry monitored (set reminder for renewal)
  - [ ] Wildcard or SAN certificates for subdomains
  - Test: `openssl s_client -connect yourdomain.com:443`

- [ ] **HTTP redirects to HTTPS**
  - [ ] All HTTP traffic redirects to HTTPS (301)
  - [ ] No sensitive data sent over HTTP
  - [ ] Redirect implemented at load balancer or app level
  - Test: `curl -I http://yourdomain.com` → Should redirect to https://

- [ ] **HSTS header configured**
  - [ ] `Strict-Transport-Security` header set
  - [ ] Max-age: at least 31536000 (1 year)
  - [ ] `includeSubDomains` enabled
  - [ ] `preload` enabled for HSTS preload list
  - Test: `curl -I https://yourdomain.com` → Check for HSTS header

- [ ] **TLS version** 
  - [ ] TLS 1.2+ required
  - [ ] TLS 1.0 and 1.1 disabled
  - [ ] Strong cipher suites configured
  - Test: `testssl.sh yourdomain.com`

---

## 🔐 CRITICAL: CORS Configuration

### Backend

- [ ] **Specific origins configured (not wildcard)**
  - [ ] ❌ `allow_origins: ["*"]` removed
  - [ ] ✅ Specific domains configured: `["https://yourdomain.com", "https://www.yourdomain.com"]`
  - [ ] CORS_ORIGINS environment variable set
  - Verify: Check `app.ts` and `main.py`

- [ ] **CORS headers properly configured**
  - [ ] `origin` validation works
  - [ ] `credentials: true` (for cookies)
  - [ ] `methods` limited to needed ones
  - [ ] `allowedHeaders` limited to needed ones
  - [ ] `maxAge` set to reasonable value (3600)
  - Test: `curl -H "Origin: https://malicious.com" http://api.yourdomain.com`
  - Expected: No CORS headers in response

- [ ] **Preflight requests handled**
  - [ ] OPTIONS method returns correct CORS headers
  - [ ] Non-allowed origins rejected
  - Test: `curl -X OPTIONS -H "Origin: https://yourdomain.com" http://api.yourdomain.com/api/auth/login`

---

## 🛡️ HIGH: Security Headers

### Response Headers

- [ ] **Content Security Policy (CSP)**
  - [ ] Header: `Content-Security-Policy` present
  - [ ] `default-src 'self'` configured
  - [ ] Inline scripts disabled (unless required by framework)
  - [ ] External sources whitelisted
  - [ ] Report-only mode before enforcing
  - Test: `curl -I https://yourdomain.com` → Check CSP header

- [ ] **X-Content-Type-Options**
  - [ ] `X-Content-Type-Options: nosniff` set
  - Test: Check response headers

- [ ] **X-Frame-Options**
  - [ ] `X-Frame-Options: DENY` set
  - [ ] Prevents clickjacking attacks
  - Test: Check response headers

- [ ] **X-XSS-Protection**
  - [ ] `X-XSS-Protection: 1; mode=block` set
  - Test: Check response headers

- [ ] **Referrer-Policy**
  - [ ] `Referrer-Policy: strict-origin-when-cross-origin` set
  - Test: Check response headers

- [ ] **Permissions-Policy**
  - [ ] `Permissions-Policy: geolocation=(), microphone=(), camera=()` set
  - Test: Check response headers

---

## 🚨 HIGH: Rate Limiting

### Authentication Endpoints

- [ ] **Login rate limited**
  - [ ] 5 attempts per 15 minutes
  - [ ] Per IP address
  - [ ] Account locked after threshold
  - Test: `for i in {1..6}; do curl -X POST http://api.yourdomain.com/api/auth/login -d '{"email":"test@test.com","password":"wrong"}'; sleep 1; done`
  - Expected: 6th request returns 429 (Too Many Requests)

- [ ] **Password reset rate limited**
  - [ ] 3 attempts per 15 minutes
  - [ ] Prevents enumeration attacks
  - Test: Multiple rapid password reset requests

- [ ] **General API rate limited**
  - [ ] 100 requests per 15 minutes for general endpoints
  - [ ] Returns 429 when exceeded
  - Per IP address
  - Test: Rapid requests to API endpoints

---

## 🔍 HIGH: Input Validation

### Data Validation

- [ ] **Email validation**
  - [ ] Valid email format required
  - [ ] Maximum length enforced
  - [ ] Normalization applied
  - Test: `POST /auth/register` with `email: "invalid"`

- [ ] **Password validation**
  - [ ] Minimum 12 characters
  - [ ] Uppercase required
  - [ ] Lowercase required
  - [ ] Number required
  - [ ] Special character required
  - Test: `POST /auth/register` with weak password

- [ ] **File upload validation**
  - [ ] File extension whitelisted
  - [ ] MIME type validated
  - [ ] File size limited (10MB)
  - [ ] Filename sanitized (no path traversal)
  - [ ] Virus scanning enabled (if available)
  - Test: Upload `.exe` file → Should be rejected

- [ ] **SQL injection protection**
  - [ ] Parameterized queries used everywhere
  - [ ] No string concatenation in SQL
  - [ ] User input never directly in queries
  - Verify: `grep -r "SELECT.*+" backend/src/` (should be none)

- [ ] **XSS protection**
  - [ ] HTML entities escaped in responses
  - [ ] CSP prevents inline script injection
  - [ ] React automatic escaping used
  - Test: Create user with name: `<script>alert('xss')</script>`

---

## 📊 HIGH: Logging & Monitoring

### Application Logging

- [ ] **Security events logged**
  - [ ] Login attempts (success/failure)
  - [ ] Failed authentication attempts
  - [ ] Account lockouts
  - [ ] Password changes
  - [ ] API key generation/rotation
  - [ ] Permission changes
  - [ ] File uploads
  - [ ] Data exports

- [ ] **Logs stored securely**
  - [ ] Not publicly accessible
  - [ ] Not in code repository
  - [ ] Encrypted at rest
  - [ ] Retention policy defined
  - [ ] Regular archival

- [ ] **Sensitive data not logged**
  - [ ] Passwords never logged
  - [ ] API keys never logged
  - [ ] Credit card info never logged
  - [ ] Personal information minimized
  - Verify: `grep -r "password" logs/ --include="*.log"` (should be none with actual passwords)

### Monitoring & Alerts

- [ ] **Performance monitoring**
  - [ ] Response time monitored (target: <500ms)
  - [ ] CPU usage monitored
  - [ ] Memory usage monitored
  - [ ] Disk space monitored

- [ ] **Error monitoring**
  - [ ] Unhandled exceptions logged
  - [ ] Error rate monitored
  - [ ] Alerts on error threshold

- [ ] **Security monitoring**
  - [ ] Failed auth attempts monitored
  - [ ] Rate limit violations alerted
  - [ ] Unusual request patterns detected
  - [ ] Alerts to security team

---

## 🗄️ HIGH: Database Security

### Database Configuration

- [ ] **Access control**
  - [ ] Database user has minimum required permissions
  - [ ] No root/admin user for application
  - [ ] Separate read-only user for analytics (if needed)
  - [ ] Database behind firewall
  - [ ] Not publicly accessible

- [ ] **Encryption**
  - [ ] Password field encryption at rest (if needed)
  - [ ] Connections to database encrypted (SSL/TLS)
  - [ ] Backups encrypted

- [ ] **Backups**
  - [ ] Regular automated backups (daily)
  - [ ] Backups tested for restore
  - [ ] Backup location: secure storage
  - [ ] Encryption enabled
  - [ ] Retention: 30 days minimum

---

## 🌐 MEDIUM: API Security

### API Endpoints

- [ ] **Authentication required**
  - [ ] All non-public endpoints require valid token
  - [ ] Invalid tokens rejected (401)
  - [ ] Expired tokens rejected (401)
  - [ ] Test: `curl http://api.yourdomain.com/api/protected` (no token)

- [ ] **Authorization enforced**
  - [ ] User can only access own data
  - [ ] Admin-only endpoints protected
  - [ ] Role-based access control enforced
  - [ ] Test: Access another user's profile as different user

- [ ] **API versioning**
  - [ ] Endpoints versioned (`/api/v1/`, `/api/v2/`)
  - [ ] Deprecated endpoints have sunset date
  - [ ] Breaking changes in new version only

- [ ] **Response includes no sensitive data**
  - [ ] User passwords never returned
  - [ ] API keys never returned
  - [ ] Internal IDs sanitized
  - [ ] Error messages don't leak information

---

## 🧪 MEDIUM: Testing

### Security Testing

- [ ] **Authentication tests pass**
  - [ ] Valid credentials allow login
  - [ ] Invalid credentials deny login
  - [ ] Expired tokens rejected
  - [ ] Invalid token format rejected
  - [ ] Lockout mechanism works

- [ ] **Authorization tests pass**
  - [ ] Users can access own data
  - [ ] Users can't access other users' data
  - [ ] Admin-only endpoints enforce admin role
  - [ ] Banned users can't login

- [ ] **Input validation tests pass**
  - [ ] Invalid email rejected
  - [ ] Weak password rejected
  - [ ] File upload restrictions enforced
  - [ ] XSS attempts blocked

- [ ] **Rate limiting tests pass**
  - [ ] Rate limits enforced
  - [ ] 429 response on limit exceeded
  - [ ] Limits reset properly

---

## 📋 MEDIUM: Documentation

- [ ] **Security documentation up to date**
  - [ ] SECURITY_AUDIT_REPORT.md reviewed
  - [ ] SECURITY_IMPLEMENTATION_GUIDE.md followed
  - [ ] Deployment checklist completed
  - [ ] Incident response plan documented
  - [ ] Security contacts defined

- [ ] **Environment documentation**
  - [ ] All environment variables documented
  - [ ] Secrets rotation schedule defined
  - [ ] Backup procedures documented
  - [ ] Recovery procedures tested

---

## 🚀 Pre-Deployment Final Checks

### 24 Hours Before Deployment

- [ ] **All code reviewed for secrets**
  - [ ] `npm audit` passed with no critical issues
  - [ ] No console.log of sensitive data
  - [ ] No hardcoded values
  - [ ] No test credentials in production config

- [ ] **Backups in place**
  - [ ] Database backup created and tested
  - [ ] Can be restored in < 1 hour
  - [ ] Backup stored securely

- [ ] **Rollback plan ready**
  - [ ] Previous version builds successfully
  - [ ] Database migration reversible
  - [ ] Rollback procedure tested
  - [ ] Team trained on rollback process

- [ ] **Monitoring configured**
  - [ ] Health check endpoint created
  - [ ] Error tracking enabled
  - [ ] Performance monitoring active
  - [ ] Alerts configured and tested
  - [ ] On-call schedule defined

- [ ] **Communication plan**
  - [ ] Stakeholders notified of deployment
  - [ ] Maintenance window scheduled (if needed)
  - [ ] Support team briefed
  - [ ] Rollback authorization defined

---

## 📍 Post-Deployment Verification (Immediate)

### 0-2 Hours After Deployment

- [ ] **Services are healthy**
  - [ ] `/health` endpoint returns 200
  - [ ] No error spikes in logs
  - [ ] Response times normal
  - [ ] Database connectivity verified
  - [ ] Cache connectivity verified

- [ ] **Authentication works**
  - [ ] Login succeeds with valid credentials
  - [ ] Login fails with invalid credentials
  - [ ] API requests work with valid token
  - [ ] Token refresh works
  - [ ] Logout works

- [ ] **HTTPS working**
  - [ ] SSL certificate valid
  - [ ] HTTP redirects to HTTPS
  - [ ] HSTS header present
  - [ ] No mixed content warnings

- [ ] **Security headers present**
  - [ ] `X-Content-Type-Options` header present
  - [ ] `X-Frame-Options` header present
  - [ ] `Strict-Transport-Security` header present
  - [ ] CSP header present
  - Test: `curl -I https://yourdomain.com` and verify headers

- [ ] **Rate limiting working**
  - [ ] Rapid requests return 429
  - [ ] Error message clear
  - [ ] Rate limit headers present

- [ ] **Logging working**
  - [ ] Logs are being written
  - [ ] No errors in startup logs
  - [ ] Authentication events logged
  - [ ] No debug info leaked

- [ ] **Error handling working**
  - [ ] 404 returns proper error
  - [ ] 500 doesn't leak stack trace
  - [ ] User-friendly error messages shown

---

## 📍 Post-Deployment Verification (24 Hours)

### 24 Hours After Deployment

- [ ] **No unexpected errors**
  - [ ] Error rate normal (< baseline)
  - [ ] No 500 errors in critical paths
  - [ ] Database query performance normal
  - [ ] API response times normal

- [ ] **Security events normal**
  - [ ] No unusual login patterns
  - [ ] No brute force attempts
  - [ ] Rate limits working as expected
  - [ ] No permission violations

- [ ] **Scaling working (if applicable)**
  - [ ] Multiple instances load balanced
  - [ ] Sessions shared across instances
  - [ ] Database connections pooled
  - [ ] Cache working across instances

---

## 🔄 Rollback Procedure (If Issues Found)

If critical issues discovered:

```bash
# 1. Alert team immediately
# 2. Check if issue can be fixed quickly (< 30 minutes)
# 3. If not, proceed with rollback

# Rollback steps:
# 1. Backup current database state (if changed)
pg_dump edtech_db > backup_after_failed_deploy.sql

# 2. Revert to previous version
git revert <commit-hash>
npm run build
npm start

# 3. Restore previous database state (if needed)
psql edtech_db < backup_before_deploy.sql

# 4. Verify health
curl https://yourdomain.com/api/health

# 5. Notify stakeholders
```

---

## 📞 Escalation Contacts

**If security incident detected:**

- [ ] Security Lead: [Contact Info]
- [ ] DevOps Lead: [Contact Info]
- [ ] CTO: [Contact Info]
- [ ] Legal/Compliance: [Contact Info]

**Communication channels:**
- Slack: #security #incidents
- Email: security@yourdomain.com
- Phone: [Incident hotline]

---

## ✅ Sign-Off

**Deployment completed and verified by:**

- [ ] **Backend Lead:** _________________ (Date: _________)
- [ ] **Frontend Lead:** ________________ (Date: _________)
- [ ] **DevOps Lead:** _________________ (Date: _________)
- [ ] **Security Lead:** _______________ (Date: _________)

---

**Deployment Date:** _______________  
**Deployment Time:** _______________  
**Next Security Review:** _______________  
**Status:** ✅ PRODUCTION  

---

**Documentation:**
- Full audit: [SECURITY_AUDIT_REPORT.md](./SECURITY_AUDIT_REPORT.md)
- Implementation: [SECURITY_IMPLEMENTATION_GUIDE.md](./SECURITY_IMPLEMENTATION_GUIDE.md)
- Incident response: [To be created]
- Security policy: [To be created]

