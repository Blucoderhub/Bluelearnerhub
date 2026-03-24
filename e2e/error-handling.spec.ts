import { test, expect } from '@playwright/test'

/**
 * Error Handling & Edge Case Tests
 * Covers: 404, API errors, network failures, invalid routes, boundary conditions
 */

const API_BASE = process.env.API_URL || 'http://localhost:5000'
const T = 20_000

test.describe('404 / Not Found Handling', () => {
  test('unknown route returns non-500 status', async ({ page }) => {
    const res = await page.goto('/this-page-does-not-exist-abc123xyz')
    const status = res?.status()
    if (status) expect(status).not.toBe(500)
    await expect(page.locator('body')).toBeVisible()
  })

  test('deeply nested unknown route is handled gracefully', async ({ page }) => {
    const res = await page.goto('/a/b/c/d/e/f/not/real')
    if (res?.status()) expect(res.status()).not.toBe(500)
    await expect(page.locator('body')).toBeVisible()
  })

  test('unknown API route returns 404 not 500', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/nonexistent-endpoint-xyz`, { timeout: T })
    expect(res.status()).not.toBe(500)
  })
})

test.describe('Auth Guard — Protected Routes', () => {
  const protectedRoutes = [
    '/student/dashboard',
    '/student/profile',
    '/exercises',
    '/daily-quiz',
    '/quiz',
    '/labs',
    '/hackathons',
    '/ai-companion',
    '/notebooks',
    '/ide',
  ]

  for (const route of protectedRoutes) {
    test(`${route} does not crash when accessed unauthenticated`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'domcontentloaded' })
      // Should redirect to login OR show auth-required content — never blank or 500
      await expect(page.locator('body')).toBeVisible()
      const content = await page.locator('body').innerText()
      expect(content.length).toBeGreaterThan(0)
    })
  }
})

test.describe('API Error Responses — Shape', () => {
  test('401 response has success: false', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/auth/me`, { timeout: T })
    expect([401, 403]).toContain(res.status())
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(typeof body.message).toBe('string')
  })

  test('invalid login response has success: false and message', async ({ request }) => {
    const res = await request.post(`${API_BASE}/api/auth/login`, {
      data: { email: 'bad@bad.test', password: 'bad' },
      headers: { 'Content-Type': 'application/json' },
      timeout: T,
    })
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(typeof body.message).toBe('string')
    expect(body.message.length).toBeGreaterThan(0)
  })

  test('invalid cert verification returns valid: false', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/certificates/verify/INVALID-CERT-ID`, {
      timeout: T,
    })
    expect(res.status()).not.toBe(500)
    const body = await res.json()
    expect(body.valid).toBe(false)
  })
})

test.describe('Frontend Network Error Resilience', () => {
  test('exercises page shows content or fallback when unauthenticated', async ({ page }) => {
    await page.goto('/exercises', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(3_000)
    // Should show something — either login redirect or fallback challenges
    await expect(page.locator('body')).toBeVisible()
    const text = await page.locator('body').innerText()
    expect(text.length).toBeGreaterThan(5)
  })

  test('daily quiz page shows content or fallback', async ({ page }) => {
    await page.goto('/daily-quiz', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(3_000)
    await expect(page.locator('body')).toBeVisible()
  })

  test('learning tracks page renders without crash', async ({ page }) => {
    await page.goto('/learning-tracks', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(3_000)
    await expect(page.locator('body')).toBeVisible()
    const content = await page.locator('body').innerText()
    expect(content.length).toBeGreaterThan(5)
  })

  test('hackathons page renders without crash', async ({ page }) => {
    await page.goto('/hackathons', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(3_000)
    await expect(page.locator('body')).toBeVisible()
  })

  test('QnA page renders without crash', async ({ page }) => {
    await page.goto('/qna', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(3_000)
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('SQL Injection / XSS — API Safety', () => {
  test('login endpoint rejects SQL injection payload gracefully', async ({ request }) => {
    const res = await request.post(`${API_BASE}/api/auth/login`, {
      data: {
        email: "' OR '1'='1",
        password: "' OR '1'='1' --",
      },
      headers: { 'Content-Type': 'application/json' },
      timeout: T,
    })
    // Should return 400/401/429 (rate-limited) — never 200 or 500
    expect([400, 401, 422, 429]).toContain(res.status())
  })

  test('search endpoint handles special characters without 500', async ({ request }) => {
    const res = await request.get(
      `${API_BASE}/api/tutorials/search?q=${encodeURIComponent('<script>alert(1)</script>')}`,
      { timeout: T }
    )
    expect(res.status()).not.toBe(500)
  })

  test('tutorials search with very long query does not 500', async ({ request }) => {
    const longQuery = 'a'.repeat(500)
    const res = await request.get(
      `${API_BASE}/api/tutorials/search?q=${encodeURIComponent(longQuery)}`,
      { timeout: T }
    )
    expect(res.status()).not.toBe(500)
  })
})

test.describe('API Rate Limiting — No Crashes', () => {
  test('multiple rapid requests to health do not 500', async ({ request }) => {
    const results = await Promise.all(
      Array.from({ length: 5 }, () =>
        request.get(`${API_BASE}/health`, { timeout: T })
      )
    )
    for (const res of results) {
      expect(res.status()).not.toBe(500)
    }
  })

  test('multiple rapid QnA list requests handled gracefully', async ({ request }) => {
    const results = await Promise.all(
      Array.from({ length: 3 }, () =>
        request.get(`${API_BASE}/api/qna/questions`, { timeout: T })
      )
    )
    for (const res of results) {
      expect(res.status()).not.toBe(500)
    }
  })
})

test.describe('Boundary Conditions — API Params', () => {
  test('tutorials with page=0 does not 500', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/tutorials?page=0`, { timeout: T })
    expect(res.status()).not.toBe(500)
  })

  test('tutorials with negative limit does not 500', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/tutorials?limit=-1`, { timeout: T })
    expect(res.status()).not.toBe(500)
  })

  test('leaderboard with limit=100 (capped) does not 500', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/gamification/leaderboard?limit=100`, {
      timeout: T,
    })
    expect(res.status()).toBe(200)
    const body = await res.json()
    // Backend caps at 50
    expect(body.data.length).toBeLessThanOrEqual(50)
  })

  test('leaderboard with non-numeric limit is handled', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/gamification/leaderboard?limit=abc`, {
      timeout: T,
    })
    expect(res.status()).not.toBe(500)
  })
})
