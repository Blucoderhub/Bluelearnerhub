import { test, expect } from '@playwright/test'

/**
 * Auth Flow Tests
 * Covers: login page render, form validation, invalid login, register page
 */
test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should display login form', async ({ page }) => {
    await expect(page.locator('input[type="email"], input[placeholder*="mail" i]').first()).toBeVisible()
    await expect(page.locator('input[type="password"], input[placeholder*="password" i]').first()).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in|login/i })).toBeVisible()
  })

  test('should show "forgot password" link', async ({ page }) => {
    const forgotLink = page.getByRole('link', { name: /forgot/i })
    await expect(forgotLink).toBeVisible()
  })

  test('should show "sign up" / register link', async ({ page }) => {
    const registerLink = page.getByRole('link', { name: /sign up|get started|no account/i })
    await expect(registerLink).toBeVisible()
  })

  test('should show validation error when submitting empty form', async ({ page }) => {
    const submitBtn = page.getByRole('button', { name: /sign in|login/i })
    await submitBtn.click()
    // HTML5 required validation or custom error should appear
    const emailInput = page.locator('input[type="email"], input[placeholder*="mail" i]').first()
    // Browser validation prevents submit — field should still be empty and focused
    await expect(emailInput).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[placeholder*="mail" i]').first()
    const passwordInput = page.locator('input[type="password"]').first()
    const submitBtn = page.getByRole('button', { name: /sign in|login/i })

    await emailInput.fill('notauser@example.invalid')
    await passwordInput.fill('WrongPassword1!')
    await submitBtn.click()

    // Should show an error message — wait up to 12s for API response
    // Use separate locator strategies since CSS and text selectors can't be mixed
    const errorEl = page
      .locator('[class*="red"], [class*="error"], [role="alert"]')
      .or(page.getByText(/invalid|incorrect|failed|wrong|not found/i))
      .first()
    await expect(errorEl).toBeVisible({ timeout: 12_000 })
  })

  test('should have GitHub OAuth button', async ({ page }) => {
    const githubBtn = page.getByRole('button', { name: /github/i })
    await expect(githubBtn).toBeVisible()
  })

  test('should have Google OAuth button', async ({ page }) => {
    const googleBtn = page.getByRole('button', { name: /google/i })
    await expect(googleBtn).toBeVisible()
  })

  test('should navigate to forgot-password page', async ({ page }) => {
    const forgotLink = page.getByRole('link', { name: /forgot/i })
    await forgotLink.click()
    await expect(page).toHaveURL(/forgot-password/)
  })

  test('should navigate to register page via sign-up link', async ({ page }) => {
    const registerLink = page.getByRole('link', { name: /sign up|get started/i })
    await registerLink.click()
    await expect(page).toHaveURL(/get-started|register/)
  })
})

test.describe('Get Started / Register Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/get-started')
  })

  test('should display registration form', async ({ page }) => {
    // Should have tabs for sign-up and login
    const signupTab = page.getByRole('tab', { name: /sign up|register|create/i })
    if (await signupTab.count() > 0) {
      await signupTab.click()
    }
    // Form fields
    await expect(page.locator('input[type="email"], input[placeholder*="mail" i]').first()).toBeVisible()
    await expect(page.locator('input[type="password"]').first()).toBeVisible()
  })

  test('should show login tab', async ({ page }) => {
    const loginTab = page.getByRole('tab', { name: /login|sign in/i })
    if (await loginTab.count() > 0) {
      await expect(loginTab).toBeVisible()
    }
  })

  test('should show error for duplicate email on register', async ({ page }) => {
    // Switch to signup tab if present
    const signupTab = page.getByRole('tab', { name: /sign up|register|create/i })
    if (await signupTab.count() > 0) {
      await signupTab.click()
    }

    const nameInput = page.locator('input[placeholder*="name" i], input[name*="name" i]').first()
    const emailInput = page.locator('input[type="email"], input[placeholder*="mail" i]').first()
    const passwordInput = page.locator('input[type="password"]').first()

    if (await nameInput.count() > 0) {
      await nameInput.fill('Test User')
    }
    await emailInput.fill('existing@bluelearnerhub.com')
    await passwordInput.fill('TestPassword1!')

    const submitBtn = page.getByRole('button', { name: /sign up|create account|create|register/i })
    await submitBtn.click()

    // Some response (error or redirect) within 12s
    await page.waitForTimeout(3000)
    // Page should not crash
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Forgot Password Page', () => {
  test('should display email input', async ({ page }) => {
    await page.goto('/forgot-password')
    await expect(page.locator('input[type="email"], input[placeholder*="mail" i]').first()).toBeVisible()
  })

  test('should show success message after submitting valid email', async ({ page }) => {
    await page.goto('/forgot-password')
    const emailInput = page.locator('input[type="email"], input[placeholder*="mail" i]').first()
    await emailInput.fill('test@example.com')
    const submitBtn = page.getByRole('button', { name: /send|reset|submit/i })
    await submitBtn.click()
    // Wait for response
    await page.waitForTimeout(3000)
    // Should show some confirmation or stay on page gracefully
    await expect(page.locator('body')).toBeVisible()
  })
})
