import { test as base } from '@playwright/test';

/**
 * Custom fixtures for kwangdong-site tests
 * Extend the base test with custom fixtures as needed
 */

// Example: Custom fixture for authenticated user
// export const test = base.extend({
//   authenticatedPage: async ({ page }, use) => {
//     // Perform authentication here
//     await page.goto('/login');
//     // ... authentication steps
//     await use(page);
//   },
// });

// For now, export the base test
export const test = base;
export const expect = base.expect;




