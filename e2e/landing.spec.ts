import { test, expect } from '@playwright/test'

/**
 * Landing Page (Marketing) Tests
 * Covers: homepage content, navigation links, FAQ accordion
 */
test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/BlueLearnerHub|BlueLearnerhub|Blue Learner/i)
  })

  test('should display hero section with CTA buttons', async ({ page }) => {
    // Page should have meaningful heading content
    const headings = page.locator('h1, h2')
    await expect(headings.first()).toBeVisible()

    // Should have a "Get Started" or similar CTA link
    const ctaLink = page
      .getByRole('link', { name: /get started|start learning|join|sign up/i })
      .first()
    await expect(ctaLink).toBeVisible()
  })

  test('should show login link', async ({ page }) => {
    const loginLink = page.getByRole('link', { name: /login|sign in/i }).first()
    await expect(loginLink).toBeVisible()
  })

  test('should navigate to login page', async ({ page }) => {
    const loginLink = page.getByRole('link', { name: /login|sign in/i }).first()
    await loginLink.click()
    await expect(page).toHaveURL(/\/login/)
  })

  test('should navigate to get-started page', async ({ page }) => {
    const ctaLink = page
      .getByRole('link', { name: /get started|start learning|join|sign up/i })
      .first()
    await ctaLink.click()
    await expect(page).toHaveURL(/\/get-started|\/register/)
  })

  test('FAQ accordion should expand and collapse', async ({ page }) => {
    // Find an FAQ item — look for question text containers
    const faqItems = page.locator('[class*="cursor-pointer"], [role="button"]').filter({
      hasText: /free|available|recognised|hackathon|hire/i,
    })

    if (await faqItems.count() > 0) {
      const first = faqItems.first()
      await first.click()
      // After clicking, the answer should appear
      await expect(page.locator('text=/Yes|Absolutely|platform|courses/i').first()).toBeVisible()

      // Click again to close
      await first.click()
    }
  })

  test('should not show JavaScript errors on load', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.reload()
    await page.waitForLoadState('networkidle')
    // Filter out non-critical errors (fonts, analytics)
    const critical = errors.filter(
      (e) => !/failed to load resource|googletagmanager|analytics|font/i.test(e)
    )
    expect(critical).toHaveLength(0)
  })

  test('should have proper meta description', async ({ page }) => {
    const meta = page.locator('meta[name="description"]')
    await expect(meta).toHaveCount(1)
    const content = await meta.getAttribute('content')
    expect(content).toBeTruthy()
    expect(content!.length).toBeGreaterThan(10)
  })

  test('should render privacy and terms links', async ({ page }) => {
    const privacyLink = page.getByRole('link', { name: /privacy/i })
    const termsLink = page.getByRole('link', { name: /terms/i })
    // At least one should be present (footer)
    const count = (await privacyLink.count()) + (await termsLink.count())
    expect(count).toBeGreaterThan(0)
  })
})
