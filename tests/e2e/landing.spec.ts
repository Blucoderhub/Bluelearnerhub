import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load landing page successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/BlueLearnerHub/i);
  });

  test('should display navigation header', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should have working login link', async ({ page }) => {
    await page.goto('/');
    const loginLink = page.locator('a[href="/login"]').first();
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('should have working signup link', async ({ page }) => {
    await page.goto('/');
    const signupLink = page.locator('a[href="/signup"]').first();
    if (await signupLink.isVisible()) {
      await signupLink.click();
      await expect(page).toHaveURL(/\/signup/);
    }
  });

  test('should not show protected routes without auth', async ({ page }) => {
    await page.goto('/student/dashboard');
    // Should redirect to login
    await expect(page).not.toHaveURL(/\/student\/dashboard/);
  });
});
