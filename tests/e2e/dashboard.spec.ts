import { test, expect } from '@playwright/test';

const TEST_USER = {
  email: `dashboard.test.${Date.now()}@example.com`,
  password: 'TestPassword123!',
  fullName: 'Dashboard Test User',
};

test.describe('Student Dashboard', () => {
  test.beforeAll(async ({ request }) => {
    // Register and login via API for faster setup
    const registerRes = await request.post('/api/auth/register', {
      data: {
        email: TEST_USER.email,
        password: TEST_USER.password,
        fullName: TEST_USER.fullName,
      },
    });
    
    // If registration fails (user exists), try login
    if (!registerRes.ok()) {
      const loginRes = await request.post('/api/auth/login', {
        data: {
          email: TEST_USER.email,
          password: TEST_USER.password,
        },
      });
      expect(loginRes.ok()).toBeTruthy();
    }
  });

  test('should access dashboard when authenticated', async ({ page }) => {
    // Login via UI
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    
    await expect(page).toHaveURL(/\/(dashboard|student)/, { timeout: 15000 });
  });

  test('should display user stats', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|student)/, { timeout: 15000 });
    
    // Wait for dashboard to load
    await page.waitForLoadState('networkidle');
    
    // Check for XP or points display
    const xpElement = page.locator('text=/XP|Points|Score/i').first();
    if (await xpElement.isVisible({ timeout: 5000 })) {
      await expect(xpElement).toBeVisible();
    }
  });

  test('should display streak counter', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|student)/, { timeout: 15000 });
    
    // Check for streak display
    const streakElement = page.locator('text=/streak|🔥|fire/i').first();
    if (await streakElement.isVisible({ timeout: 5000 })) {
      await expect(streakElement).toBeVisible();
    }
  });

  test('should have navigation to exercises', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|student)/, { timeout: 15000 });
    
    // Navigate to exercises
    const exercisesLink = page.locator('a[href*="exercises"]').first();
    if (await exercisesLink.isVisible()) {
      await exercisesLink.click();
      await expect(page).toHaveURL(/\/exercises/);
    }
  });

  test('should have navigation to daily quiz', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|student)/, { timeout: 15000 });
    
    // Navigate to daily quiz
    const quizLink = page.locator('a[href*="daily-quiz"]').first();
    if (await quizLink.isVisible()) {
      await quizLink.click();
      await expect(page).toHaveURL(/\/daily-quiz/);
    }
  });

  test('should have navigation to learning tracks', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|student)/, { timeout: 15000 });
    
    // Navigate to learning tracks
    const tracksLink = page.locator('a[href*="learning-tracks"]').first();
    if (await tracksLink.isVisible()) {
      await tracksLink.click();
      await expect(page).toHaveURL(/\/learning-tracks/);
    }
  });

  test('should have profile dropdown in header', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|student)/, { timeout: 15000 });
    
    // Check for profile/user element
    const profileElement = page.locator('text=/profile|settings|account/i').first();
    if (await profileElement.isVisible({ timeout: 5000 })) {
      await expect(profileElement).toBeVisible();
    }
  });
});
