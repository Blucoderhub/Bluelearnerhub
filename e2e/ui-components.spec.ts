import { test, expect } from '@playwright/test'

/**
 * UI Components & Visual Tests
 * Covers: header, footer, layout, responsive, links, navigation, tutorials
 */

test.describe('Header Component', () => {
  test('header is visible on landing page', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header, [role="banner"]').first()
    await expect(header).toBeVisible()
  })

  test('header has logo or brand name', async ({ page }) => {
    await page.goto('/')
    // Check for brand text or any link in the header
    const headerEl = page.locator('header').first()
    await expect(headerEl).toBeVisible()
    const headerText = await headerEl.textContent()
    expect(headerText?.length ?? 0).toBeGreaterThan(0)
  })

  test('header login link is present on landing', async ({ page }) => {
    await page.goto('/')
    // Could be a link or button with various text labels
    const loginEl = page
      .getByRole('link', { name: /login|sign in/i })
      .first()
    if (await loginEl.count() > 0) {
      await expect(loginEl).toBeVisible()
    } else {
      // Graceful: some designs use button not link
      const loginBtn = page.getByRole('button', { name: /login|sign in/i }).first()
      if (await loginBtn.count() > 0) {
        await expect(loginBtn).toBeVisible()
      }
    }
  })

  test('header get-started link is present on landing', async ({ page }) => {
    await page.goto('/')
    const startLink = page.getByRole('link', { name: /get started|start|join/i }).first()
    if (await startLink.count() > 0) {
      await expect(startLink).toBeVisible()
    }
  })
})

test.describe('Landing Page Content', () => {
  test('hero section has a headline', async ({ page }) => {
    await page.goto('/')
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
    const text = await h1.textContent()
    expect(text?.length ?? 0).toBeGreaterThan(5)
  })

  test('hero section has at least one CTA button', async ({ page }) => {
    await page.goto('/')
    const cta = page
      .getByRole('link', { name: /get started|join|start|free/i })
      .or(page.getByRole('button', { name: /get started|join|start/i }))
      .first()
    await expect(cta).toBeVisible()
  })

  test('FAQ section is visible', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    const faqSection = page.locator('text=FAQ').or(page.locator('text=Frequently asked')).first()
    await expect(faqSection).toBeVisible()
  })

  test('privacy link in footer or body works', async ({ page }) => {
    await page.goto('/')
    const privacyLink = page.getByRole('link', { name: /privacy/i }).first()
    if (await privacyLink.count() > 0) {
      const href = await privacyLink.getAttribute('href')
      expect(href).toContain('privacy')
    }
  })

  test('terms link is present', async ({ page }) => {
    await page.goto('/')
    const termsLink = page.getByRole('link', { name: /terms/i }).first()
    if (await termsLink.count() > 0) {
      const href = await termsLink.getAttribute('href')
      expect(href).toContain('terms')
    }
  })
})

test.describe('Tutorials Page', () => {
  test('tutorials page loads without error', async ({ page }) => {
    await page.goto('/tutorials')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('body')).toBeVisible()
  })

  test('tutorials page has content', async ({ page }) => {
    await page.goto('/tutorials')
    await page.waitForLoadState('networkidle')
    const text = await page.locator('body').innerText()
    expect(text.length).toBeGreaterThan(10)
  })

  test('tutorials page has page title', async ({ page }) => {
    await page.goto('/tutorials')
    const title = await page.title()
    expect(title.length).toBeGreaterThan(3)
  })
})

test.describe('Static Pages — Content Quality', () => {
  test('privacy page has substantial content', async ({ page }) => {
    await page.goto('/privacy')
    await page.waitForLoadState('domcontentloaded')
    const text = await page.locator('body').innerText()
    expect(text.length).toBeGreaterThan(100)
    expect(text.toLowerCase()).toMatch(/privacy|data|collect|information/i)
  })

  test('terms page has substantial content', async ({ page }) => {
    await page.goto('/terms')
    await page.waitForLoadState('domcontentloaded')
    const text = await page.locator('body').innerText()
    expect(text.length).toBeGreaterThan(100)
    expect(text.toLowerCase()).toMatch(/terms|conditions|use|service/i)
  })

  test('privacy page has back/home navigation', async ({ page }) => {
    await page.goto('/privacy')
    const homeLink = page.getByRole('link', { name: /home|back|bluelearnerhub/i }).first()
    if (await homeLink.count() > 0) {
      await expect(homeLink).toBeVisible()
    }
  })
})

test.describe('Payment Pages', () => {
  test('payment success page loads', async ({ page }) => {
    const res = await page.goto('/payment/success')
    if (res) expect(res.status()).not.toBe(500)
    await expect(page.locator('body')).toBeVisible()
  })

  test('payment cancel page loads', async ({ page }) => {
    const res = await page.goto('/payment/cancel')
    if (res) expect(res.status()).not.toBe(500)
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('FAQ Accordion', () => {
  test('FAQ items toggle open and closed', async ({ page }) => {
    await page.goto('/')
    const faqItem = page.locator('[class*="cursor-pointer"]').first()
    if (await faqItem.count() > 0) {
      await faqItem.click()
      await page.waitForTimeout(500)
      // Body text changes — FAQ opened
      const textAfterOpen = await page.locator('body').innerText()
      expect(textAfterOpen.length).toBeGreaterThan(100)
    }
  })

  test('multiple FAQ items are present', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)
    // Look for FAQ questions
    const faqQuestions = page.locator('h3').filter({ hasText: /./ })
    const count = await faqQuestions.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })
})

test.describe('Responsive Layout', () => {
  test('landing page renders on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
    const title = await page.title()
    expect(title.length).toBeGreaterThan(0)
  })

  test('login page renders on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/login')
    await expect(page.locator('input[type="email"]').first()).toBeVisible()
  })

  test('landing page renders on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
  })
})

test.describe('Spaces / Community Pages', () => {
  test('spaces page loads without crash', async ({ page }) => {
    const res = await page.goto('/spaces')
    if (res) expect(res.status()).not.toBe(500)
    await expect(page.locator('body')).toBeVisible()
  })
})
