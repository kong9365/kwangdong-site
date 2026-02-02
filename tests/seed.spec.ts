import { test, expect } from '@playwright/test';

/**
 * Seed test for kwangdong-site application
 * This test sets up the environment and verifies basic application initialization
 */
test.describe('Application Seed', () => {
  test('seed - application initialization', async ({ page }) => {
    // Navigate to the application
    await page.goto('https://kwangdong-site.vercel.app/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify basic page elements are present
    await expect(page).toHaveTitle(/광동제약|kwangdong/i);

    // Verify header is visible
    const header = page.locator('header, [role="banner"]').first();
    await expect(header).toBeVisible();

    // Verify main content area is present
    const mainContent = page.locator('main, [role="main"]').first();
    await expect(mainContent).toBeVisible();

    // Verify page is interactive (no blocking errors)
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
