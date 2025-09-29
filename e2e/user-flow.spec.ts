import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';

// Helper to load JSON data
function loadJSONData(filePath: string): any[] {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

test.describe('User Flow Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock all AI endpoints to prevent real API calls
    await page.route('**/api/ai/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: 'Static mock content - no AI quota used',
          id: 'mock-content-1'
        }),
      });
    });

    // Mock Gemini API calls
    await page.route('**/generativelanguage.googleapis.com/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          candidates: [{
            content: {
              parts: [{ text: 'Mock AI response - static data only' }]
            }
          }]
        }),
      });
    });
  });

  test('should display toolkit functionality', async ({ page }) => {
    // Check that toolkit blocks are clickable and functional
    await expect(page.locator('[data-testid="campaigns-block"]')).toBeVisible();
    await expect(page.locator('[data-testid="prep-block"]')).toBeVisible();
    await expect(page.locator('[data-testid="maps-block"]')).toBeVisible();

    // Click on prep block and verify navigation
    await page.click('[data-testid="prep-block"]');
    await expect(page).toHaveURL(/.*\/prep/);
    await expect(page.locator('text=Session Prep')).toBeVisible();
  });

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible(); // Content should still be visible

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('h1')).toBeVisible(); // Content should be visible on desktop
  });
});