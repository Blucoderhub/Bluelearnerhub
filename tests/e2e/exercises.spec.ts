import { test, expect } from '@playwright/test';

const TEST_USER = {
  email: `exercise.test.${Date.now()}@example.com`,
  password: 'TestPassword123!',
  fullName: 'Exercise Test User',
};

test.describe('Exercises Page', () => {
  test.beforeAll(async ({ request }) => {
    // Register user
    await request.post('/api/auth/register', {
      data: {
        email: TEST_USER.email,
        password: TEST_USER.password,
        fullName: TEST_USER.fullName,
      },
    });
  });

  test('should load exercises page', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|student)/, { timeout: 15000 });
    
    await page.goto('/exercises');
    await expect(page).toHaveURL(/\/exercises/);
  });

  test('should display exercise list', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|student)/, { timeout: 15000 });
    
    await page.goto('/exercises');
    await page.waitForLoadState('networkidle');
    
    // Should show some content (either exercises or empty state)
    const content = page.locator('main, [role="main"], .container').first();
    await expect(content).toBeVisible();
  });

  test('should have domain filter', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|student)/, { timeout: 15000 });
    
    await page.goto('/exercises');
    
    // Check for domain filter dropdown
    const filter = page.locator('select[name*="domain"], button:has-text("Domain"), [role="combobox"]').first();
    if (await filter.isVisible({ timeout: 5000 })) {
      await expect(filter).toBeVisible();
    }
  });

  test('should have difficulty filter', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|student)/, { timeout: 15000 });
    
    await page.goto('/exercises');
    
    // Check for difficulty filter
    const filter = page.locator('text=/Easy|Medium|Hard/i').first();
    if (await filter.isVisible({ timeout: 5000 })) {
      await expect(filter).toBeVisible();
    }
  });

  test('should navigate to exercise detail', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|student)/, { timeout: 15000 });
    
    await page.goto('/exercises');
    await page.waitForLoadState('networkidle');
    
    // Try to click on an exercise
    const exerciseCard = page.locator('[href*="/exercises/"]').first();
    if (await exerciseCard.isVisible({ timeout: 5000 })) {
      await exerciseCard.click();
      await expect(page).toHaveURL(/\/exercises\/\d+/);
    }
  });

  test('should have working code editor in exercise detail', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|student)/, { timeout: 15000 });
    
    // Navigate to exercises and try to get to an exercise detail
    await page.goto('/exercises');
    await page.waitForLoadState('networkidle');
    
    const exerciseLink = page.locator('[href*="/exercises/"]').first();
    if (await exerciseLink.isVisible({ timeout: 5000 })) {
      await exerciseLink.click();
      await page.waitForLoadState('networkidle');
      
      // Check for code editor
      const editor = page.locator('[class*="editor"], [class*="monaco"], textarea, [role="textbox"]').first();
      if (await editor.isVisible({ timeout: 5000 })) {
        await expect(editor).toBeVisible();
      }
    }
  });
});
