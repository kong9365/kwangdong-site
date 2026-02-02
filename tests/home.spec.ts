import { test, expect } from '@playwright/test';

/**
 * Home page tests
 * Tests basic functionality of the home page
 */
test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load home page successfully', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/광동제약|kwangdong/i);
    
    // Verify header is visible
    const header = page.locator('header, [role="banner"]').first();
    await expect(header).toBeVisible();
  });

  test('should display main navigation elements', async ({ page }) => {
    // Check for navigation links or menu items
    const navigation = page.locator('nav, [role="navigation"]').first();
    await expect(navigation).toBeVisible();
  });

  test('should display factory selection options', async ({ page }) => {
    // Look for factory selection dropdown or buttons
    // This is based on the Home.tsx component structure
    const factorySelect = page.locator('select, [role="combobox"]').first();
    
    // Factory options should be present (GMP공장, 식품공장)
    const gmpOption = page.getByText(/GMP|GMP공장/i);
    const foodOption = page.getByText(/식품|식품공장/i);
    
    // At least one factory option should be visible
    await expect(gmpOption.or(foodOption)).toBeVisible();
  });

  test('should have footer visible', async ({ page }) => {
    const footer = page.locator('footer, [role="contentinfo"]').first();
    await expect(footer).toBeVisible();
  });
});




