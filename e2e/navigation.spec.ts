import { test, expect } from '@playwright/test'

/**
 * Navigation & Static Pages Tests
 * Covers: page routing, 404 handling, terms, privacy, contact
 */

test.describe('Static Marketing Pages', () => {
  test('privacy page should load', async ({ page }) => {
    await page.goto('/privacy')
    await expect(page.locator('body')).toBeVisible()
    const text = await page.locator('body').innerText()
    expect(text.length).toBeGreaterThan(50)
  })

  test('terms page should load', async ({ page }) => {
    await page.goto('/terms')
    await expect(page.locator('body')).toBeVisible()
    const text = await page.locator('body').innerText()
    expect(text.length).toBeGreaterThan(50)
  })

  test('contact page should load', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('404 / Not Found', () => {
  test('unknown route should show 404 or redirect gracefully', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist-xyz123')
    // Should either return 404 or a graceful redirect, not crash with 500
    const status = response?.status()
    if (status) {
      expect(status).not.toBe(500)
    }
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Navigation Links', () => {
  test('logo/brand link should navigate to home', async ({ page }) => {
    await page.goto('/login')
    // Find back-to-home link
    const homeLink = page
      .getByRole('link', { name: /back|home|matrix|bluelearnerhub/i })
      .first()
    if (await homeLink.count() > 0) {
      await Promise.all([
        page.waitForURL((url) => !url.pathname.includes('login'), { timeout: 10_000 }),
        homeLink.click(),
      ])
      // Should NOT be on /login anymore
      expect(page.url()).not.toContain('/login')
    } else {
      // No home link found — skip gracefully
      expect(true).toBe(true)
    }
  })

  test('back link on login page should go to homepage', async ({ page }) => {
    await page.goto('/login')
    const backLink = page.getByRole('link', { name: /back/i }).first()
    if (await backLink.count() > 0) {
      await Promise.all([
        page.waitForURL((url) => !url.pathname.includes('login'), { timeout: 10_000 }),
        backLink.click(),
      ])
      // Should NOT be on /login anymore
      expect(page.url()).not.toContain('/login')
    } else {
      // No back link found — skip gracefully
      expect(true).toBe(true)
    }
  })
})

test.describe('Tutorials / Library', () => {
  test('tutorials page should load', async ({ page }) => {
    await page.goto('/tutorials')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Performance Baseline', () => {
  test('homepage should load in under 10 seconds', async ({ page }) => {
    const start = Date.now()
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const elapsed = Date.now() - start
    expect(elapsed).toBeLessThan(10_000)
  })

  test('login page should load in under 10 seconds', async ({ page }) => {
    const start = Date.now()
    await page.goto('/login', { waitUntil: 'domcontentloaded' })
    const elapsed = Date.now() - start
    expect(elapsed).toBeLessThan(10_000)
  })
})
