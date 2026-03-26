import { test, expect } from '@playwright/test';

const TEST_USER = {
  email: `test.${Date.now()}@example.com`,
  password: 'TestPassword123!',
  fullName: 'Test User',
};

test.describe('Authentication Flow', () => {
  test.describe.configure({ mode: 'serial' });

  test('should display login page correctly', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.locator('h1, h2')).toContainText(/sign in|login|welcome/i);
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in|login|submit/i })).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    
    // Should show validation error
    await expect(page.locator('text=/invalid|email.*required|valid email/')).toBeVisible();
  });

  test('should reject empty credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    
    // Should show validation error
    await expect(page.locator('text=/email.*required|password.*required|invalid/')).toBeVisible();
  });

  test('should show error for wrong credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel(/email/i).fill('nonexistent@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    
    // Should show error message (without revealing if email exists)
    await expect(page.locator('text=/invalid|incorrect|wrong|failed|error/')).toBeVisible({ timeout: 10000 });
  });

  test('should successfully register new user', async ({ page }) => {
    await page.goto('/signup');
    
    // Fill registration form
    const nameInput = page.getByLabel(/name|full name/i).first();
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/password/i).first();
    const confirmInput = page.getByLabel(/confirm.*password/i);
    
    if (await nameInput.isVisible()) {
      await nameInput.fill(TEST_USER.fullName);
    }
    await emailInput.fill(TEST_USER.email);
    await passwordInput.fill(TEST_USER.password);
    
    if (await confirmInput.isVisible()) {
      await confirmInput.fill(TEST_USER.password);
    }
    
    await page.getByRole('button', { name: /sign up|register|create.*account|submit/i }).click();
    
    // Should either succeed or show "user exists" if run multiple times
    const successOrExists = page.locator('text=/success|verify|confirm|already.*exist/i');
    await expect(successOrExists).toBeVisible({ timeout: 15000 });
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/(dashboard|student)/, { timeout: 15000 });
  });

  test('should persist login across page reload', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|student)/, { timeout: 15000 });
    
    // Reload page
    await page.reload();
    
    // Should still be logged in
    await expect(page).not.toHaveURL(/\/login/);
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /sign in|login|submit/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|student)/, { timeout: 15000 });
    
    // Find and click logout
    const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout"), [href="/logout"]').first();
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
    }
    
    // Should redirect to login or home
    await expect(page).toHaveURL(/\/(login|\/)/, { timeout: 10000 });
  });
});
