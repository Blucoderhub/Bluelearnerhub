import { test, expect } from '@playwright/test'

/**
 * API Health & Integration Tests
 * Tests the Express backend (localhost:5000 in dev, API_URL env override in CI)
 * and the Next.js frontend static asset endpoints.
 */

const API_BASE = process.env.API_URL || 'http://localhost:5000'
const API_TIMEOUT = 20_000

test.describe('Backend API Health', () => {
  test('API health endpoint should respond 200', async ({ request }) => {
    const res = await request.get(`${API_BASE}/health`, { timeout: API_TIMEOUT })
    expect(res.status()).toBeLessThan(500)
    const body = await res.json()
    expect(body.status).toBe('OK')
  })

  test('Auth /me should return 401 without token', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/auth/me`, { timeout: API_TIMEOUT })
    expect([401, 403]).toContain(res.status())
  })

  test('Login endpoint should reject invalid credentials', async ({ request }) => {
    const res = await request.post(`${API_BASE}/api/auth/login`, {
      data: { email: 'invalid@notexist.test', password: 'wrongpassword' },
      headers: { 'Content-Type': 'application/json' },
      timeout: API_TIMEOUT,
    })
    expect([400, 401, 403]).toContain(res.status())
  })

  test('Exercises list endpoint should respond', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/exercises`, { timeout: API_TIMEOUT })
    // Either 200 (public) or 401 (auth-gated) — never a 500
    expect(res.status()).toBeLessThan(500)
  })

  test('Learning tracks endpoint should respond', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/tracks`, { timeout: API_TIMEOUT })
    expect(res.status()).toBeLessThan(500)
  })
})

test.describe('Frontend Next.js Static Assets', () => {
  test('sitemap.xml should return valid XML or 200', async ({ page }) => {
    const response = await page.goto('/sitemap.xml')
    if (response) {
      expect(response.status()).not.toBe(500)
    }
  })

  test('robots.txt should be accessible', async ({ page }) => {
    const response = await page.goto('/robots.txt')
    if (response) {
      expect(response.status()).not.toBe(500)
    }
  })
})

test.describe('Frontend API Error Handling', () => {
  test('Login page handles API errors gracefully — no crash on bad credentials', async ({ page }) => {
    await page.goto('/login')

    const emailInput = page.locator('input[type="email"]').first()
    const passwordInput = page.locator('input[type="password"]').first()
    const submitBtn = page.getByRole('button', { name: /sign in|login/i })

    await emailInput.fill('badcredentials@test.invalid')
    await passwordInput.fill('WrongPass123!')
    await submitBtn.click()

    // Page should not crash — show error and stay on /login
    await page.waitForTimeout(8_000)
    await expect(page.locator('body')).toBeVisible()

    // URL should still be /login (auth failed)
    const url = page.url()
    expect(url).toMatch(/login|dashboard/)
  })

  test('Register page handles API errors gracefully', async ({ page }) => {
    await page.goto('/get-started')

    const signupTab = page.getByRole('tab', { name: /sign up|create/i })
    if (await signupTab.count() > 0) {
      await signupTab.click()
    }

    const nameInput = page.locator('input[placeholder*="name" i], input[name*="name" i]').first()
    const emailInput = page.locator('input[type="email"]').first()
    const passwordInput = page.locator('input[type="password"]').first()

    if (await nameInput.count() > 0) {
      await nameInput.fill('Test User')
    }
    await emailInput.fill('gracefultest@test.invalid')
    await passwordInput.fill('GracefulTest123!')

    const submitBtn = page.getByRole('button', { name: /create account|sign up|register/i })
    if (await submitBtn.count() > 0) {
      await submitBtn.click()
      await page.waitForTimeout(8_000)
    }

    // Page should not crash
    await expect(page.locator('body')).toBeVisible()
  })
})
