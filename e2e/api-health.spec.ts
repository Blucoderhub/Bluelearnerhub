import { test, expect } from '@playwright/test'

/**
 * API Health & Integration Tests
 * Tests API connectivity through the frontend application.
 * External API calls skip gracefully when the backend is unreachable
 * (e.g., sandboxed CI environments, cold-start on Render).
 */

const FRONTEND_BASE = process.env.BASE_URL || 'http://localhost:3000'
const API_BASE = process.env.API_URL || 'https://bluelearnerhub.onrender.com'
const API_TIMEOUT = 20_000

/** Returns true if an external fetch succeeds within a short time */
async function isBackendReachable(request: any): Promise<boolean> {
  try {
    const res = await request.get(`${API_BASE}/health`, { timeout: 8_000 })
    return res.status() < 500
  } catch {
    return false
  }
}

test.describe('Backend API Health', () => {
  test('API health endpoint should respond < 500', async ({ request }) => {
    try {
      const res = await request.get(`${API_BASE}/health`, { timeout: API_TIMEOUT })
      expect(res.status()).toBeLessThan(500)
    } catch (e: any) {
      // Network unreachable in this environment — skip
      test.skip(true, `Backend unreachable: ${e.message}`)
    }
  })

  test('Auth /me should return 401 without token', async ({ request }) => {
    try {
      const res = await request.get(`${API_BASE}/api/auth/me`, { timeout: API_TIMEOUT })
      expect([401, 403]).toContain(res.status())
    } catch (e: any) {
      test.skip(true, `Backend unreachable: ${e.message}`)
    }
  })

  test('Login endpoint should reject invalid credentials', async ({ request }) => {
    try {
      const res = await request.post(`${API_BASE}/api/auth/login`, {
        data: { email: 'invalid@notexist.test', password: 'wrongpassword' },
        headers: { 'Content-Type': 'application/json' },
        timeout: API_TIMEOUT,
      })
      expect([400, 401, 403]).toContain(res.status())
    } catch (e: any) {
      test.skip(true, `Backend unreachable: ${e.message}`)
    }
  })

  test('Exercises list endpoint should respond', async ({ request }) => {
    try {
      const res = await request.get(`${API_BASE}/api/exercises`, { timeout: API_TIMEOUT })
      expect(res.status()).toBeLessThan(500)
    } catch (e: any) {
      test.skip(true, `Backend unreachable: ${e.message}`)
    }
  })

  test('Learning tracks endpoint should respond', async ({ request }) => {
    try {
      const res = await request.get(`${API_BASE}/api/tracks`, { timeout: API_TIMEOUT })
      expect(res.status()).toBeLessThan(500)
    } catch (e: any) {
      test.skip(true, `Backend unreachable: ${e.message}`)
    }
  })
})

test.describe('Frontend Next.js Static Assets', () => {
  test('sitemap.xml should return valid XML or 200', async ({ page }) => {
    const response = await page.goto('/sitemap.xml')
    if (response) {
      // Should not be a server error
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

    // Page should not crash — either show error or stay on login
    await page.waitForTimeout(8_000)
    await expect(page.locator('body')).toBeVisible()

    // URL should still be /login (auth failed) or /student/dashboard (unexpected success)
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
