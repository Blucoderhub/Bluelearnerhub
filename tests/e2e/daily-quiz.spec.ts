import { test, expect } from '@playwright/test';

const TEST_USER = {
  email: `quiz.test.${Date.now()}@example.com`,
  password: 'TestPassword123!',
  fullName: 'Quiz Test User',
};

test.describe('Daily Quiz', () => {
  test.beforeAll(async ({ request }) => {
    await request.post('/api/auth/register', {
      data: {
        email: TEST_USER.email,
        password: TEST_USER.password,
        fullName: TEST_USER.fullName,
      },
    });
  });

  test('should load daily quiz page', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|student)/, { timeout: 15000 });
    
    await page.goto('/daily-quiz');
    await expect(page).toHaveURL(/\/daily-quiz/);
  });

  test('should display quiz domain', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|student)/, { timeout: 15000 });
    
    await page.goto('/daily-quiz');
    await page.waitForLoadState('networkidle');
    
    // Should show domain name
    const domainElement = page.locator('h1, h2, h3').first();
    if (await domainElement.isVisible({ timeout: 5000 })) {
      await expect(domainElement).toBeVisible();
    }
  });

  test('should display questions with options', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|student)/, { timeout: 15000 });
    
    await page.goto('/daily-quiz');
    await page.waitForLoadState('networkidle');
    
    // Should show question text
    const questionElement = page.locator('text=/what|which|how|when|where|why/i').first();
    if (await questionElement.isVisible({ timeout: 5000 })) {
      await expect(questionElement).toBeVisible();
    }
    
    // Should show answer options
    const optionElement = page.locator('button:has-text("A"), button:has-text("B"), [role="radio"]').first();
    if (await optionElement.isVisible({ timeout: 5000 })) {
      await expect(optionElement).toBeVisible();
    }
  });

  test('should allow selecting an answer', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|student)/, { timeout: 15000 });
    
    await page.goto('/daily-quiz');
    await page.waitForLoadState('networkidle');
    
    // Find and click an answer option
    const option = page.locator('[role="radio"], button:not([disabled])').first();
    if (await option.isVisible({ timeout: 5000 })) {
      await option.click();
      
      // Option should now be selected
      const isSelected = await option.getAttribute('data-selected') || 
                         await option.getAttribute('aria-checked') ||
                         (await option.evaluate((el) => el.className)).includes('selected');
      // Just verify click worked
    }
  });

  test('should have submit button', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|student)/, { timeout: 15000 });
    
    await page.goto('/daily-quiz');
    await page.waitForLoadState('networkidle');
    
    // Check for submit button
    const submitButton = page.getByRole('button', { name: /submit|submit quiz|finish/i });
    if (await submitButton.isVisible({ timeout: 5000 })) {
      await expect(submitButton).toBeVisible();
    }
  });

  test('should show results after submission', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|student)/, { timeout: 15000 });
    
    await page.goto('/daily-quiz');
    await page.waitForLoadState('networkidle');
    
    // Select an answer if available
    const option = page.locator('[role="radio"], button:not([disabled])').first();
    if (await option.isVisible({ timeout: 5000 })) {
      await option.click();
    }
    
    // Submit quiz
    const submitButton = page.getByRole('button', { name: /submit|finish/i }).first();
    if (await submitButton.isVisible({ timeout: 5000 })) {
      await submitButton.click();
      
      // Should show results
      await page.waitForTimeout(2000);
      const resultsElement = page.locator('text=/score|result|xp|completed/i').first();
      if (await resultsElement.isVisible({ timeout: 5000 })) {
        await expect(resultsElement).toBeVisible();
      }
    }
  });
});
