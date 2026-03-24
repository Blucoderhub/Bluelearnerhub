import { test, expect } from '@playwright/test'

/**
 * Performance & Load Time Tests
 * Covers: page load times, API response times, resource loading
 */

const API_BASE = process.env.API_URL || 'http://localhost:5000'
const SLOW_THRESHOLD = 10_000  // 10s max for any page
const API_THRESHOLD = 5_000    // 5s max for any API call

test.describe('Page Load Performance', () => {
  const pages = [
    { path: '/', name: 'Landing' },
    { path: '/login', name: 'Login' },
    { path: '/get-started', name: 'Register' },
    { path: '/tutorials', name: 'Tutorials' },
    { path: '/privacy', name: 'Privacy' },
    { path: '/terms', name: 'Terms' },
    { path: '/forgot-password', name: 'Forgot Password' },
  ]

  for (const { path, name } of pages) {
    test(`${name} loads in under ${SLOW_THRESHOLD / 1000}s`, async ({ page }) => {
      const start = Date.now()
      await page.goto(path, { waitUntil: 'domcontentloaded' })
      const elapsed = Date.now() - start
      expect(elapsed).toBeLessThan(SLOW_THRESHOLD)
    })
  }
})

test.describe('API Response Time', () => {
  test('health endpoint responds in under 2s', async ({ request }) => {
    const start = Date.now()
    await request.get(`${API_BASE}/health`, { timeout: API_THRESHOLD })
    const elapsed = Date.now() - start
    expect(elapsed).toBeLessThan(2_000)
  })

  test('quiz domains responds in under 5s', async ({ request }) => {
    const start = Date.now()
    await request.get(`${API_BASE}/api/daily-quiz/domains`, { timeout: API_THRESHOLD })
    const elapsed = Date.now() - start
    expect(elapsed).toBeLessThan(API_THRESHOLD)
  })

  test('tracks list responds in under 5s', async ({ request }) => {
    const start = Date.now()
    await request.get(`${API_BASE}/api/tracks`, { timeout: API_THRESHOLD })
    const elapsed = Date.now() - start
    expect(elapsed).toBeLessThan(API_THRESHOLD)
  })

  test('tutorials list responds in under 5s', async ({ request }) => {
    const start = Date.now()
    await request.get(`${API_BASE}/api/tutorials`, { timeout: API_THRESHOLD })
    const elapsed = Date.now() - start
    expect(elapsed).toBeLessThan(API_THRESHOLD)
  })

  test('leaderboard responds in under 5s', async ({ request }) => {
    const start = Date.now()
    await request.get(`${API_BASE}/api/gamification/leaderboard`, { timeout: API_THRESHOLD })
    const elapsed = Date.now() - start
    expect(elapsed).toBeLessThan(API_THRESHOLD)
  })

  test('QnA questions list responds in under 5s', async ({ request }) => {
    const start = Date.now()
    await request.get(`${API_BASE}/api/qna/questions`, { timeout: API_THRESHOLD })
    const elapsed = Date.now() - start
    expect(elapsed).toBeLessThan(API_THRESHOLD)
  })
})

test.describe('Resource Loading', () => {
  test('landing page loads without network errors on critical resources', async ({ page }) => {
    const failedRequests: string[] = []
    page.on('requestfailed', (req) => {
      // Only flag non-optional resources
      const url = req.url()
      if (!url.includes('analytics') && !url.includes('hotjar') && !url.includes('gtag')) {
        failedRequests.push(url)
      }
    })
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    // Filter out expected external failures (fonts, CDN, etc.)
    const criticalFailures = failedRequests.filter(
      (u) =>
        u.includes('localhost') &&
        !u.includes('favicon') &&
        !u.includes('.png') &&
        !u.includes('.jpg')
    )
    expect(criticalFailures.length).toBe(0)
  })

  test('login page has no missing local resources', async ({ page }) => {
    const failedLocal: string[] = []
    page.on('requestfailed', (req) => {
      if (req.url().includes('localhost:3000')) {
        failedLocal.push(req.url())
      }
    })
    await page.goto('/login', { waitUntil: 'domcontentloaded' })
    expect(failedLocal.length).toBe(0)
  })
})

test.describe('Concurrent Requests — Stability', () => {
  test('3 simultaneous health checks succeed', async ({ request }) => {
    const [r1, r2, r3] = await Promise.all([
      request.get(`${API_BASE}/health`, { timeout: API_THRESHOLD }),
      request.get(`${API_BASE}/health`, { timeout: API_THRESHOLD }),
      request.get(`${API_BASE}/health`, { timeout: API_THRESHOLD }),
    ])
    expect(r1.status()).toBe(200)
    expect(r2.status()).toBe(200)
    expect(r3.status()).toBe(200)
  })

  test('3 simultaneous tracks requests succeed', async ({ request }) => {
    const results = await Promise.all([
      request.get(`${API_BASE}/api/tracks`, { timeout: API_THRESHOLD }),
      request.get(`${API_BASE}/api/tracks`, { timeout: API_THRESHOLD }),
      request.get(`${API_BASE}/api/tracks`, { timeout: API_THRESHOLD }),
    ])
    for (const res of results) {
      expect(res.status()).not.toBe(500)
    }
  })
})
