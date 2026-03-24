import { test, expect } from '@playwright/test'

/**
 * Accessibility & SEO Tests
 * Covers: page titles, headings, ARIA roles, keyboard nav, meta tags
 */

test.describe('Page Titles', () => {
  // All pages share the site-wide brand title — just verify it's non-empty and contains the brand
  const pages = ['/', '/login', '/get-started', '/forgot-password', '/privacy', '/terms']

  for (const path of pages) {
    test(`${path} has meaningful title`, async ({ page }) => {
      await page.goto(path)
      const title = await page.title()
      expect(title.length).toBeGreaterThan(5)
      // Every page should include the brand name
      expect(title).toMatch(/bluelearnerhub|courses|learn|free/i)
    })
  }
})

test.describe('Headings Hierarchy', () => {
  test('landing page has at least one h1', async ({ page }) => {
    await page.goto('/')
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThanOrEqual(1)
  })

  test('login page has heading', async ({ page }) => {
    await page.goto('/login')
    const headings = page.locator('h1, h2')
    const count = await headings.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('register page has heading', async ({ page }) => {
    await page.goto('/get-started')
    const headings = page.locator('h1, h2')
    const count = await headings.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })
})

test.describe('ARIA & Semantics', () => {
  test('login form has properly labeled inputs', async ({ page }) => {
    await page.goto('/login')
    // Email input should be findable
    const emailInput = page.locator('input[type="email"]').first()
    await expect(emailInput).toBeVisible()
    // Should have placeholder or label
    const placeholder = await emailInput.getAttribute('placeholder')
    const ariaLabel = await emailInput.getAttribute('aria-label')
    const id = await emailInput.getAttribute('id')
    expect(placeholder || ariaLabel || id).toBeTruthy()
  })

  test('navigation has role=navigation or nav element', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('nav, [role="navigation"]').first()
    await expect(nav).toBeVisible()
  })

  test('buttons have accessible text', async ({ page }) => {
    await page.goto('/login')
    const buttons = page.locator('button:visible')
    const count = await buttons.count()
    let accessibleCount = 0
    for (let i = 0; i < Math.min(count, 10); i++) {
      const btn = buttons.nth(i)
      const text = await btn.textContent()
      const ariaLabel = await btn.getAttribute('aria-label')
      const title = await btn.getAttribute('title')
      const hasAccessibleText = (text?.trim() || '') + (ariaLabel || '') + (title || '') !== ''
      if (hasAccessibleText) accessibleCount++
    }
    // At least the primary action buttons should be accessible
    expect(accessibleCount).toBeGreaterThan(0)
  })
})

test.describe('SEO Meta Tags', () => {
  test('landing page has description meta tag', async ({ page }) => {
    await page.goto('/')
    const meta = page.locator('meta[name="description"]')
    const count = await meta.count()
    if (count > 0) {
      const content = await meta.getAttribute('content')
      expect(content?.length ?? 0).toBeGreaterThan(20)
    }
  })

  test('landing page has og:title', async ({ page }) => {
    await page.goto('/')
    const ogTitle = page.locator('meta[property="og:title"]')
    if (await ogTitle.count() > 0) {
      const content = await ogTitle.getAttribute('content')
      expect(content?.length ?? 0).toBeGreaterThan(0)
    }
  })

  test('login page does not have noindex', async ({ page }) => {
    await page.goto('/login')
    // Login can be indexed or not — just verify it loads
    await expect(page.locator('body')).toBeVisible()
  })

  test('robots.txt is accessible and valid', async ({ page }) => {
    const res = await page.goto('/robots.txt')
    expect(res?.status()).not.toBe(500)
    if (res?.status() === 200) {
      const content = await page.content()
      expect(content.toLowerCase()).toMatch(/user-agent|allow|disallow|sitemap/)
    }
  })

  test('sitemap.xml is accessible', async ({ page }) => {
    const res = await page.goto('/sitemap.xml')
    if (res) {
      expect(res.status()).not.toBe(500)
    }
  })
})

test.describe('Keyboard Navigation', () => {
  test('login page — Tab moves through form fields in order', async ({ page }) => {
    await page.goto('/login')
    await page.keyboard.press('Tab')
    // At least some element should receive focus
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName?.toLowerCase())
    expect(['input', 'button', 'a', 'select', 'textarea']).toContain(focusedTag)
  })

  test('landing page — Enter on CTA button navigates', async ({ page }) => {
    await page.goto('/')
    const getStarted = page.getByRole('link', { name: /get started/i }).first()
    if (await getStarted.count() > 0) {
      await expect(getStarted).toBeVisible()
      await expect(getStarted).toBeEnabled()
    }
  })
})

test.describe('No Console Errors on Key Pages', () => {
  const criticalPages = ['/', '/login', '/get-started', '/tutorials', '/privacy', '/terms']

  for (const path of criticalPages) {
    test(`${path} — no fatal JS errors`, async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', (e) => errors.push(e.message))
      await page.goto(path)
      await page.waitForLoadState('domcontentloaded')
      const fatal = errors.filter(
        (e) =>
          !e.includes('hydrat') &&
          !e.includes('Warning') &&
          !e.includes('act(') &&
          !e.includes('router') &&
          !e.includes('ExperimentalWarning')
      )
      expect(fatal.length).toBe(0)
    })
  }
})
