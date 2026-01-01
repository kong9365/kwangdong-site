const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
  });
  const page = await context.newPage();

  try {
    console.log('Navigating to https://kwangdong-site.vercel.app/...');
    await page.goto('https://kwangdong-site.vercel.app/', { waitUntil: 'networkidle' });

    // Wait a bit for the page to fully load
    await page.waitForTimeout(2000);

    // Get page title
    const title = await page.title();
    console.log('Page Title:', title);

    // Take screenshot
    await page.screenshot({ path: 'homepage-screenshot.png', fullPage: true });
    console.log('Screenshot saved to homepage-screenshot.png');

    // Get all visible text
    const bodyText = await page.locator('body').textContent();
    console.log('\n=== Visible Text on Page ===');
    console.log(bodyText);

    // Get all buttons
    const buttons = await page.locator('button').all();
    console.log('\n=== Buttons Found ===');
    for (const button of buttons) {
      const text = await button.textContent();
      console.log('- Button:', text?.trim());
    }

    // Get all links
    const links = await page.locator('a').all();
    console.log('\n=== Links Found ===');
    for (const link of links) {
      const text = await link.textContent();
      const href = await link.getAttribute('href');
      console.log(`- Link: "${text?.trim()}" -> ${href}`);
    }

    // Get all input fields
    const inputs = await page.locator('input').all();
    console.log('\n=== Input Fields Found ===');
    for (const input of inputs) {
      const type = await input.getAttribute('type');
      const placeholder = await input.getAttribute('placeholder');
      const name = await input.getAttribute('name');
      console.log(`- Input: type="${type}", placeholder="${placeholder}", name="${name}"`);
    }

    console.log('\n=== Page exploration complete! ===');
    console.log('Press Ctrl+C to exit or wait 30 seconds...');

    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
