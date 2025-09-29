import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';

function loadCSVData(filePath: string): any[] {
  const csvContent = readFileSync(filePath, 'utf8');
  const lines = csvContent.split('\n').slice(1); // Skip header
  return lines.map(line => {
    const [name, email, age, notes] = line.split(',');
    return { name, email, age, notes };
  });
}

test.describe('Error Handling Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock all AI endpoints to prevent real API calls during error scenarios
    await page.route('**/api/ai/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: 'Mock error handling response - no AI calls',
          id: 'mock-error-1'
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
              parts: [{ text: 'Static error validation response' }]
            }
          }]
        }),
      });
    });
  });

  test('should handle page errors gracefully', async ({ page }) => {
    // Test 404 page
    await page.goto('/nonexistent-page');
    await expect(page.locator('text=404') || page.locator('text=Page Not Found')).toBeVisible();

    // Should be able to navigate back
    await page.goBack();
    await expect(page).toHaveURL('/');
  });

  test('should handle empty states', async ({ page }) => {
    // Check campaigns page for empty state
    await page.goto('/campaigns');
    await expect(page.locator('text=No campaigns yet') || page.locator('text=Get started')).toBeVisible();
  });

  test('should validate basic form interactions', async ({ page }) => {
    // Test basic accessibility and form structure
    await page.goto('/');
    await expect(page.locator('main')).toBeVisible(); // Main content area
    await expect(page.locator('h1')).toBeVisible(); // Main heading

    // Check for basic interactive elements
    const interactiveElements = page.locator('a, button, [role="button"]');
    await expect(interactiveElements.first()).toBeVisible();
  });
});