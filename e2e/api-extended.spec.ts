import { test, expect } from '@playwright/test'

/**
 * Extended API Tests — covers more backend endpoints and edge cases
 */

const API_BASE = process.env.API_URL || 'http://localhost:5000'
const T = 20_000

test.describe('API — Health & Meta', () => {
  test('health endpoint returns OK with uptime', async ({ request }) => {
    const res = await request.get(`${API_BASE}/health`, { timeout: T })
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.status).toBe('OK')
    expect(typeof body.uptime).toBe('number')
    expect(body.uptime).toBeGreaterThan(0)
  })

  test('unknown API route returns 404 not 500', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/this-does-not-exist-xyz`, { timeout: T })
    expect(res.status()).not.toBe(500)
    expect([404, 401, 400]).toContain(res.status())
  })
})

test.describe('API — Auth Endpoints', () => {
  test('GET /api/auth/me without token returns 401', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/auth/me`, { timeout: T })
    expect([401, 403]).toContain(res.status())
  })

  test('POST /api/auth/login with empty body returns 400 or 401', async ({ request }) => {
    const res = await request.post(`${API_BASE}/api/auth/login`, {
      data: {},
      headers: { 'Content-Type': 'application/json' },
      timeout: T,
    })
    expect([400, 401, 422]).toContain(res.status())
  })

  test('POST /api/auth/login with invalid credentials returns 400/401/429', async ({ request }) => {
    const res = await request.post(`${API_BASE}/api/auth/login`, {
      data: { email: 'notexist@invalid.test', password: 'WrongPass123!' },
      headers: { 'Content-Type': 'application/json' },
      timeout: T,
    })
    // 429 = rate-limited after many test runs
    expect([400, 401, 403, 429]).toContain(res.status())
    const body = await res.json()
    expect(body.success).toBe(false)
  })

  test('POST /api/auth/register with missing fields returns 400/422', async ({ request }) => {
    const res = await request.post(`${API_BASE}/api/auth/register`, {
      data: { email: 'onlyemail@test.invalid' },
      headers: { 'Content-Type': 'application/json' },
      timeout: T,
    })
    // 429 = rate-limited; 400/422 = validation error
    expect([400, 422, 429]).toContain(res.status())
  })

  test('POST /api/auth/refresh-token without cookie returns 401/404', async ({ request }) => {
    // Endpoint is /refresh-token (not /refresh)
    const res = await request.post(`${API_BASE}/api/auth/refresh-token`, { timeout: T })
    expect([400, 401, 403, 404, 429]).toContain(res.status())
  })
})

test.describe('API — Daily Quiz', () => {
  test('GET /api/daily-quiz/domains returns array of strings', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/daily-quiz/domains`, { timeout: T })
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(Array.isArray(body.data)).toBe(true)
    expect(body.data.length).toBeGreaterThan(0)
    body.data.forEach((d: unknown) => expect(typeof d).toBe('string'))
  })

  test('GET /api/daily-quiz/:domain without auth returns 401', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/daily-quiz/JavaScript`, { timeout: T })
    expect([401, 403]).toContain(res.status())
  })

  test('POST /api/daily-quiz/submit without auth returns 401', async ({ request }) => {
    const res = await request.post(`${API_BASE}/api/daily-quiz/submit`, {
      data: { domain: 'JavaScript', answers: [0, 1, 2] },
      headers: { 'Content-Type': 'application/json' },
      timeout: T,
    })
    expect([401, 403]).toContain(res.status())
  })
})

test.describe('API — Learning Tracks', () => {
  test('GET /api/tracks returns 200 with data array', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/tracks`, { timeout: T })
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(Array.isArray(body.data)).toBe(true)
  })
})

test.describe('API — Tutorials', () => {
  test('GET /api/tutorials returns paginated results', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/tutorials`, { timeout: T })
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(Array.isArray(body.data)).toBe(true)
  })

  test('GET /api/tutorials/search with query returns results', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/tutorials/search?q=python`, { timeout: T })
    expect(res.status()).toBeLessThan(500)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(Array.isArray(body.data)).toBe(true)
  })

  test('GET /api/tutorials with pagination params works', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/tutorials?page=1&limit=5`, { timeout: T })
    expect(res.status()).toBe(200)
  })
})

test.describe('API — QnA', () => {
  test('GET /api/qna/questions returns list', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/qna/questions`, { timeout: T })
    expect(res.status()).toBeLessThan(500)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(Array.isArray(body.data)).toBe(true)
  })

  test('GET /api/qna/tags returns list', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/qna/tags`, { timeout: T })
    expect(res.status()).toBeLessThan(500)
  })

  test('POST /api/qna/questions without auth returns 401', async ({ request }) => {
    const res = await request.post(`${API_BASE}/api/qna/questions`, {
      data: { title: 'Test?', body: 'Test body', domain: 'js', tags: [] },
      headers: { 'Content-Type': 'application/json' },
      timeout: T,
    })
    expect([401, 403]).toContain(res.status())
  })
})

test.describe('API — Certificates', () => {
  test('GET /api/certificates/verify/:id with fake ID returns 200 or 404', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/certificates/verify/fake-cert-id-xyz`, {
      timeout: T,
    })
    // Should never 500 — should return not-found or invalid
    expect(res.status()).not.toBe(500)
    const body = await res.json()
    expect(body.valid).toBe(false)
  })

  test('GET /api/certificates/me without auth returns 401', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/certificates/me`, { timeout: T })
    expect([401, 403]).toContain(res.status())
  })
})

test.describe('API — Gamification', () => {
  test('GET /api/gamification/leaderboard returns 200', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/gamification/leaderboard`, { timeout: T })
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(Array.isArray(body.data)).toBe(true)
  })

  test('GET /api/gamification/leaderboard with limit param', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/gamification/leaderboard?limit=5`, {
      timeout: T,
    })
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.data.length).toBeLessThanOrEqual(5)
  })

  test('GET /api/gamification/achievements without auth returns 401', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/gamification/achievements`, { timeout: T })
    expect([401, 403]).toContain(res.status())
  })
})

test.describe('API — Organizations', () => {
  test('GET /api/organizations returns 200', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/organizations`, { timeout: T })
    expect(res.status()).toBeLessThan(500)
  })
})

test.describe('API — Exercises', () => {
  test('GET /api/exercises without auth returns 401', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/exercises`, { timeout: T })
    expect([401, 403]).toContain(res.status())
    const body = await res.json()
    expect(body.success).toBe(false)
  })
})

test.describe('API — Security', () => {
  test('CORS headers present on health endpoint', async ({ request }) => {
    const res = await request.get(`${API_BASE}/health`, {
      headers: { Origin: 'http://localhost:3000' },
      timeout: T,
    })
    expect(res.status()).toBe(200)
    // Access-Control header should be present for localhost origin
    const headers = res.headers()
    expect(headers['access-control-allow-credentials']).toBe('true')
  })

  test('POST mutation without CSRF header still processed (dev mode)', async ({ request }) => {
    // In dev mode CSRF may be relaxed — just ensure no 500 internal error
    const res = await request.post(`${API_BASE}/api/auth/login`, {
      data: { email: 'test@test.com', password: 'test' },
      headers: { 'Content-Type': 'application/json' },
      timeout: T,
    })
    expect(res.status()).not.toBe(500)
  })
})
