import { test, expect } from '@playwright/test';

// Test navigation from homepage to key pages
test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock any potential AI calls during navigation
    await page.route('**/api/ai/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: 'Navigation mock response - no AI calls',
          id: 'mock-nav-1'
        }),
      });
    });

    // Navigate to homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/Lazy GM Toolkit/); // Actual title of the app
  });

  test('should load homepage successfully', async ({ page }) => {
    // Verify homepage loads with correct title and content
    await expect(page.locator('h1')).toContainText('Lazy GM Toolkit'); // Main heading
    await expect(page.locator('text=Welcome to the Lazy GM Toolkit')).toBeVisible(); // Welcome message
  });

  test('should display toolkit blocks on homepage', async ({ page }) => {
    // Check for toolkit blocks/cards on the homepage
    await expect(page.locator('[data-testid="toolkit-block"]')).toHaveCount(3); // Assuming 3 blocks
    await expect(page.locator('text=Campaigns')).toBeVisible(); // Campaigns block
    await expect(page.locator('text=Prep')).toBeVisible(); // Prep block
    await expect(page.locator('text=Maps')).toBeVisible(); // Maps block
  });

  test('should handle page navigation', async ({ page }) => {
    // Click on a toolkit block to navigate
    await page.click('[data-testid="campaigns-block"]');
    await expect(page).toHaveURL(/.*\/campaigns/);

    // Navigate back
    await page.goBack();
    await expect(page).toHaveURL('/');
  });
});