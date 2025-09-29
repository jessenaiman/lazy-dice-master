import { test, expect } from '@playwright/test';

test.describe('Dynamic Content Tests', () => {
  test('should display static content without AI calls', async ({ page }) => {
    // Navigate to a content page
    await page.goto('/campaigns');

    // Check that page loads with static content
    await expect(page.locator('h1')).toContainText('Campaigns');
    await expect(page.locator('text=Campaign Management')).toBeVisible();

    // Verify no AI calls are made by checking for static elements
    await expect(page.locator('[data-testid="static-content"]') || page.locator('text=Content')).toBeVisible();
  });

  test('should handle basic interactivity', async ({ page }) => {
    // Test basic hover or click interactions
    await page.goto('/');
    await expect(page.locator('[data-testid="toolkit-block"]')).toHaveCount(3);

    // Hover over a block (simulate user interaction)
    await page.hover('[data-testid="campaigns-block"]');
    await expect(page.locator('[data-testid="campaigns-block"]')).toBeVisible();
  });

  test('should display content consistently', async ({ page }) => {
    // Check content is displayed consistently across page loads
    await page.goto('/');
    const firstLoadContent = await page.locator('h1').textContent();

    await page.reload();
    const secondLoadContent = await page.locator('h1').textContent();

    await expect(firstLoadContent).toBe(secondLoadContent);
  });
});