import { test } from '@playwright/test';

test('navigate to home', async ({ page }) => {
  await page.goto('/');
});
