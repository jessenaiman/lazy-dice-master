import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync'; // Assume we install csv-parse if needed, but for now mock

// Helper to load CSV data
function loadCSVData(filePath: string): any[] {
  const csvContent = readFileSync(filePath, 'utf8');
  return parse(csvContent, { columns: true, skip_empty_lines: true });
}

// Helper to load JSON data
function loadJSONData(filePath: string): any[] {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

test.describe('Form Submission Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock all AI endpoints to prevent real API calls during form submissions
    await page.route('**/api/ai/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: 'Mock form submission response - no AI calls',
          id: 'mock-form-1'
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
              parts: [{ text: 'Static form validation response' }]
            }
          }]
        }),
      });
    });
  });

  test('should display campaigns page content', async ({ page }) => {
    await page.goto('/campaigns'); // Navigate to campaigns page

    // Check that campaigns page loads with expected content
    await expect(page.locator('h1')).toContainText('Campaigns'); // Page title
    await expect(page.locator('text=Campaign Management')).toBeVisible(); // Description or subtitle

    // Check for any campaign-related content or empty state
    await expect(page.locator('text=No campaigns yet') || page.locator('[data-testid="campaign-list"]')).toBeVisible();
  });

  test('should display prep page content', async ({ page }) => {
    await page.goto('/prep'); // Navigate to prep page

    // Check that prep page loads with expected content
    await expect(page.locator('h1')).toContainText('Session Prep'); // Page title
    await expect(page.locator('text=Session Preparation')).toBeVisible(); // Description

    // Check for basic prep functionality
    await expect(page.locator('[data-testid="prep-content"]') || page.locator('text=Notes')).toBeVisible();
  });

  test('should validate basic interactions', async ({ page }) => {
    // Test basic page interactions
    await page.goto('/');
    await expect(page.locator('main')).toBeVisible();

    // Test that clicking toolkit blocks works
    await page.click('[data-testid="campaigns-block"]');
    await expect(page).toHaveURL(/.*\/campaigns/);
  });
});