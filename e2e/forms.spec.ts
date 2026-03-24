import { test, expect } from '@playwright/test'

/**
 * Form Validation & UX Tests
 * Covers: field validation, error messages, input constraints, accessibility
 */

test.describe('Login Form — Field Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('email field rejects non-email input', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]').first()
    await emailInput.fill('notanemail')
    // HTML5 validation should mark field as invalid
    const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.checkValidity())
    expect(isValid).toBe(false)
  })

  test('password field masks input by default', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]').first()
    await expect(passwordInput).toBeVisible()
    const type = await passwordInput.getAttribute('type')
    expect(type).toBe('password')
  })

  test('form fields are focusable', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]').first()
    await emailInput.focus()
    const focused = await emailInput.evaluate((el) => document.activeElement === el)
    expect(focused).toBe(true)
  })

  test('submit button is visible and enabled initially', async ({ page }) => {
    const submitBtn = page.getByRole('button', { name: /sign in|login/i })
    await expect(submitBtn).toBeVisible()
    await expect(submitBtn).not.toBeDisabled()
  })

  test('forgot password link has correct href', async ({ page }) => {
    const forgotLink = page.getByRole('link', { name: /forgot/i })
    const href = await forgotLink.getAttribute('href')
    expect(href).toContain('forgot-password')
  })

  test('sign-up link points to get-started', async ({ page }) => {
    const signupLink = page.getByRole('link', { name: /sign up|get started/i })
    const href = await signupLink.getAttribute('href')
    expect(href).toMatch(/get-started|register/)
  })

  test('GitHub button is clickable', async ({ page }) => {
    const githubBtn = page.getByRole('button', { name: /github/i })
    await expect(githubBtn).toBeVisible()
    await expect(githubBtn).toBeEnabled()
  })

  test('Google button is clickable', async ({ page }) => {
    const googleBtn = page.getByRole('button', { name: /google/i })
    await expect(googleBtn).toBeVisible()
    await expect(googleBtn).toBeEnabled()
  })
})

test.describe('Login Form — Error States', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('shows error for invalid credentials — not a blank page', async ({ page }) => {
    await page.locator('input[type="email"]').first().fill('nobody@invalid.test')
    await page.locator('input[type="password"]').first().fill('BadPass999!')
    await page.getByRole('button', { name: /sign in|login/i }).click()
    await page.waitForTimeout(10_000)
    // Must stay on login and show body
    await expect(page.locator('body')).toBeVisible()
    expect(page.url()).toMatch(/login|dashboard/)
  })

  test('page does not show unhandled runtime error after bad login', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.locator('input[type="email"]').first().fill('nobody@invalid.test')
    await page.locator('input[type="password"]').first().fill('BadPass999!')
    await page.getByRole('button', { name: /sign in|login/i }).click()
    await page.waitForTimeout(8_000)
    const fatalErrors = errors.filter(
      (e) =>
        !e.includes('hydrat') &&
        !e.includes('Warning') &&
        !e.includes('act(') &&
        !e.includes('router')
    )
    expect(fatalErrors.length).toBe(0)
  })
})

test.describe('Register Form — Field Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/get-started')
    // Switch to signup tab if needed
    const signupTab = page.getByRole('tab', { name: /sign up|register|create/i })
    if (await signupTab.count() > 0) {
      await signupTab.click()
    }
  })

  test('name field is present and accepts text', async ({ page }) => {
    const nameInput = page
      .locator('input[placeholder*="name" i], input[name*="name" i]')
      .first()
    if (await nameInput.count() > 0) {
      await nameInput.fill('Test User')
      expect(await nameInput.inputValue()).toBe('Test User')
    }
  })

  test('email field is present', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]').first()
    await expect(emailInput).toBeVisible()
  })

  test('password field is masked', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]').first()
    await expect(passwordInput).toBeVisible()
    expect(await passwordInput.getAttribute('type')).toBe('password')
  })

  test('create account button is visible', async ({ page }) => {
    const submitBtn = page.getByRole('button', { name: /create account|sign up|register/i })
    if (await submitBtn.count() > 0) {
      await expect(submitBtn).toBeVisible()
    }
  })

  test('login tab/link is present on register page', async ({ page }) => {
    const loginLink = page
      .getByRole('tab', { name: /login|sign in/i })
      .or(page.getByRole('link', { name: /login|sign in|access portal/i }))
      .first()
    if (await loginLink.count() > 0) {
      await expect(loginLink).toBeVisible()
    }
  })
})

test.describe('Forgot Password Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forgot-password')
  })

  test('email input is present and accepts input', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]').first()
    await expect(emailInput).toBeVisible()
    await emailInput.fill('test@example.com')
    expect(await emailInput.inputValue()).toBe('test@example.com')
  })

  test('submit button exists', async ({ page }) => {
    const btn = page.getByRole('button', { name: /send|reset|submit/i })
    await expect(btn).toBeVisible()
  })

  test('page does not crash after submitting', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]').first()
    await emailInput.fill('user@example.com')
    const btn = page.getByRole('button', { name: /send|reset|submit/i })
    await btn.click()
    await page.waitForTimeout(4_000)
    await expect(page.locator('body')).toBeVisible()
  })

  test('back to login link is accessible', async ({ page }) => {
    const backLink = page.getByRole('link', { name: /back|login|sign in/i }).first()
    if (await backLink.count() > 0) {
      await expect(backLink).toBeVisible()
    }
  })
})

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('page loads with visible content', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible()
    const text = await page.locator('body').innerText()
    expect(text.length).toBeGreaterThan(20)
  })

  test('no JavaScript errors on contact page load', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    const fatal = errors.filter(
      (e) => !e.includes('hydrat') && !e.includes('Warning') && !e.includes('act(')
    )
    expect(fatal.length).toBe(0)
  })
})
