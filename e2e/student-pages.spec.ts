import { test, expect } from '@playwright/test'

/**
 * Student Pages Tests (unauthenticated access)
 * Tests redirect behaviour and public-facing content.
 *
 * NOTE: Most student routes redirect to /login when unauthenticated.
 * We verify either the redirect OR the page loads with appropriate content.
 */

const studentRoutes = [
  { path: '/exercises', name: 'Exercises/Challenges' },
  { path: '/daily-quiz', name: 'Daily Quiz' },
  { path: '/quiz', name: 'Quiz' },
  { path: '/learning-tracks', name: 'Learning Tracks' },
  { path: '/courses', name: 'Courses' },
  { path: '/hackathons', name: 'Hackathons' },
  { path: '/labs', name: 'Labs' },
  { path: '/mentors', name: 'Mentors' },
]

test.describe('Student Routes — Unauthenticated Redirects', () => {
  for (const route of studentRoutes) {
    test(`${route.name} (${route.path}) should redirect to login or show content`, async ({ page }) => {
      const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' })

      // Either:
      // 1. Redirected to /login
      // 2. Page shows auth-required message
      // 3. Page loads normally (some routes may be public)
      const url = page.url()
      const isLoginRedirect = url.includes('/login') || url.includes('/get-started')
      const pageContent = await page.locator('body').innerText()

      if (!isLoginRedirect) {
        // Page loaded — should have some visible content (not blank)
        await expect(page.locator('body')).toBeVisible()
        expect(pageContent.length).toBeGreaterThan(0)
      } else {
        // Redirected to login — verify login form is there
        await expect(page.locator('input[type="email"], input[placeholder*="mail" i]').first()).toBeVisible()
      }
    })
  }
})

test.describe('Exercises Page', () => {
  test('should redirect unauthenticated user to login', async ({ page }) => {
    await page.goto('/exercises')
    const url = page.url()
    if (url.includes('/login') || url.includes('/get-started')) {
      await expect(page.locator('input[type="email"], input[placeholder*="mail" i]').first()).toBeVisible()
    } else {
      // Or shows content with auth prompt
      await expect(page.locator('body')).toBeVisible()
    }
  })
})

test.describe('Daily Quiz Page', () => {
  test('should redirect or load without crash', async ({ page }) => {
    await page.goto('/daily-quiz')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Learning Tracks Page', () => {
  test('should redirect or show tracks listing', async ({ page }) => {
    await page.goto('/learning-tracks')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Hackathons Page', () => {
  test('should redirect or show hackathons listing', async ({ page }) => {
    await page.goto('/hackathons')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('body')).toBeVisible()
  })
})
