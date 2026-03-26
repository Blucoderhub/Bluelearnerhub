# BlueLearnerHub E2E Test Suite

## Overview

This directory contains comprehensive End-to-End (E2E) tests for BlueLearnerHub using Playwright.

## Test Structure

```
tests/
└── e2e/
    ├── landing.spec.ts       # Landing page tests
    ├── auth.spec.ts         # Authentication flow tests
    ├── dashboard.spec.ts     # Student dashboard tests
    ├── exercises.spec.ts     # Exercises page tests
    ├── daily-quiz.spec.ts   # Daily quiz tests
    └── api.spec.ts          # API and security tests
```

## Running Tests

### Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npm run test:e2e:install
   ```

### Run All Tests

```bash
# Start services first (in separate terminals)
npm run dev

# In another terminal, run tests
npm run test:e2e
```

### Run Specific Test Files

```bash
# Auth tests only
npx playwright test tests/e2e/auth.spec.ts

# Landing page tests
npx playwright test tests/e2e/landing.spec.ts

# API tests
npx playwright test tests/e2e/api.spec.ts
```

### Debug Mode

```bash
# Open Playwright UI
npm run test:e2e:ui

# Run with debugger
npm run test:e2e:debug
```

### Run Headed (See Browser)

```bash
npm run test:e2e:headed
```

## Test Categories

### 1. Landing Page (`landing.spec.ts`)
- [x] Page loads successfully
- [x] Navigation header displays
- [x] Login link works
- [x] Signup link works
- [x] Protected routes redirect without auth

### 2. Authentication (`auth.spec.ts`)
- [x] Login page displays correctly
- [x] Email format validation
- [x] Empty credentials rejection
- [x] Wrong credentials error handling
- [x] User registration flow
- [x] Successful login
- [x] Login persistence across reloads
- [x] Logout functionality

### 3. Student Dashboard (`dashboard.spec.ts`)
- [x] Dashboard access when authenticated
- [x] User stats display
- [x] Streak counter display
- [x] Navigation to exercises
- [x] Navigation to daily quiz
- [x] Navigation to learning tracks
- [x] Profile dropdown in header

### 4. Exercises (`exercises.spec.ts`)
- [x] Exercises page loads
- [x] Exercise list displays
- [x] Domain filter functionality
- [x] Difficulty filter
- [x] Navigation to exercise detail
- [x] Code editor functionality

### 5. Daily Quiz (`daily-quiz.spec.ts`)
- [x] Quiz page loads
- [x] Quiz domain display
- [x] Questions with options display
- [x] Answer selection
- [x] Submit button functionality
- [x] Results display after submission

### 6. API & Security (`api.spec.ts`)
- [x] Health endpoint returns 200
- [x] Auth endpoints exist
- [x] Protected routes require auth (401/403)
- [x] CORS headers present
- [x] Rate limiting headers
- [x] Error response consistency
- [x] Security headers (CSP, HSTS, etc.)
- [x] Form labels accessibility
- [x] Keyboard navigation
- [x] Button accessible names

## CI/CD Integration

### GitHub Actions

Add to your workflow:

```yaml
- name: Run E2E Tests
  run: |
    npm install
    npm run test:e2e:install
    npm run test:e2e
  env:
    BASE_URL: ${{ vars.STAGING_URL }}
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| BASE_URL | http://localhost:3000 | Test base URL |
| CI | - | Enable CI mode (retries, etc.) |

## Expected Results

When services are running and tests pass:

```
Running 42 tests using 1 worker

✓ Landing Page (5 tests)
✓ Authentication Flow (8 tests)
✓ Student Dashboard (7 tests)
✓ Exercises Page (6 tests)
✓ Daily Quiz (6 tests)
✓ API & Security (10 tests)

42 passed, 0 failed
```

## Troubleshooting

### Connection Refused Errors

Ensure services are running:
```bash
# Terminal 1: Start frontend
cd frontend && npm run dev

# Terminal 2: Start backend
cd backend && npm run dev
```

### Browser Installation Issues

```bash
npx playwright install --with-deps chromium
```

### Test Timeout

Increase timeout in `playwright.config.ts`:
```typescript
timeout: 60000, // 60 seconds
```
