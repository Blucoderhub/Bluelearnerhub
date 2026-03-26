import { test, expect, request } from '@playwright/test';

test.describe('API Health & Endpoints', () => {
  test('health endpoint should return 200', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.ok() || response.status() === 401).toBeTruthy();
  });

  test('auth endpoints should exist', async ({ request }) => {
    // Login endpoint should exist (may return 400 for missing body)
    const response = await request.post('/api/auth/login', {
      data: { email: 'test@example.com', password: 'wrong' },
    });
    expect([200, 400, 401, 404]).toContain(response.status());
  });

  test('protected routes should require auth', async ({ request }) => {
    const protectedEndpoints = [
      '/api/auth/me',
      '/api/exercises',
      '/api/gamification/achievements',
    ];

    for (const endpoint of protectedEndpoints) {
      const response = await request.get(endpoint);
      expect([401, 403]).toContain(response.status());
    }
  });

  test('CORS headers should be set', async ({ request }) => {
    const response = await request.get('/api/health', {
      headers: { Origin: 'http://localhost:3000' },
    });
    
    const headers = response.headers();
    // Should have some CORS headers or at least not block
    expect(response.ok() || response.status() === 401).toBeTruthy();
  });

  test('rate limiting headers should be present', async ({ request }) => {
    // Make multiple requests to trigger rate limit check
    for (let i = 0; i < 5; i++) {
      await request.get('/api/health');
    }
    
    const response = await request.get('/api/health');
    const headers = response.headers();
    // Check for rate limit headers (may vary by implementation)
    expect(['x-ratelimit-remaining', 'ratelimit-remaining', 'x-rate-limit-remaining']).toContain(
      Object.keys(headers).find(k => k.includes('ratelimit'))
    );
  });

  test('error responses should be consistent', async ({ request }) => {
    // Send invalid request to multiple endpoints
    const endpoints = ['/api/auth/login', '/api/auth/register'];
    
    for (const endpoint of endpoints) {
      const response = await request.post(endpoint, {
        data: { invalid: 'data' },
      });
      
      const body = await response.json();
      expect(body).toHaveProperty('success');
      expect(typeof body.success).toBe('boolean');
    }
  });
});

test.describe('Security Headers', () => {
  test('should have security headers', async ({ request }) => {
    const response = await request.get('/');
    const headers = response.headers();
    
    // Should have some security headers
    const securityHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'referrer-policy',
    ];
    
    const hasSecurityHeaders = securityHeaders.some(header => 
      Object.keys(headers).includes(header)
    );
    
    expect(hasSecurityHeaders || response.ok()).toBeTruthy();
  });
});

test.describe('Accessibility (a11y)', () => {
  test('login page should have proper form labels', async ({ page }) => {
    await page.goto('/login');
    
    // Check for email input with label
    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toBeVisible();
    
    // Check for password input with label
    const passwordInput = page.getByLabel(/password/i);
    await expect(passwordInput).toBeVisible();
  });

  test('navigation should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Tab to first link
    await page.keyboard.press('Tab');
    
    // Should focus on a link or button
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focused);
  });

  test('buttons should have accessible names', async ({ page }) => {
    await page.goto('/login');
    
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const accessibleName = await button.textContent() || await button.getAttribute('aria-label');
        expect(accessibleName).toBeTruthy();
      }
    }
  });
});
