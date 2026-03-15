/**
 * Script to capture screenshots of login page and student dashboard
 * Run: npx playwright test scripts/screenshot-login.js --project=chromium
 * Or: node scripts/screenshot-login.js (using playwright directly)
 */

const { chromium } = require('playwright');

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  try {
    // 1. Navigate to login page and capture screenshot
    console.log('Navigating to http://localhost:3000/login...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 15000 });
    // Wait for role selection cards to be visible (ensures React has hydrated)
    await page.waitForSelector('text=Select Your Role', { timeout: 10000 });
    await page.waitForSelector('text=Admin', { state: 'visible', timeout: 5000 });
    await page.waitForTimeout(3000); // Allow CSS/animations to fully load
    await page.screenshot({ path: 'login-page.png', fullPage: true });
    console.log('Screenshot saved: login-page.png');

    // 2. Select Student role - click the Student card (third button: Admin=0, Teacher=1, Student=2)
    console.log('Selecting Student role...');
    await page.locator('button').nth(2).click();
    await page.waitForTimeout(800);

    // 3. Fill in credentials
    console.log('Entering credentials...');
    await page.fill('input[id="username"]', '21CSE001');
    await page.fill('input[id="password"]', 'password123');

    // 4. Click Sign In
    console.log('Clicking Sign In...');
    await page.click('button[type="submit"]');

    // 5. Wait for navigation to student dashboard
    await page.waitForURL('**/student/dashboard**', { timeout: 10000 });
    await page.waitForTimeout(2000); // Allow dashboard to fully load

    // 6. Capture student dashboard screenshot
    await page.screenshot({ path: 'student-dashboard.png', fullPage: true });
    console.log('Screenshot saved: student-dashboard.png');

    console.log('Done! Both screenshots captured successfully.');
  } catch (error) {
    console.error('Error:', error.message);
    // Try to capture current page state on error
    try {
      await page.screenshot({ path: 'error-state.png', fullPage: true });
      console.log('Error state saved to: error-state.png');
    } catch (e) {}
    process.exit(1);
  } finally {
    await browser.close();
  }
}

captureScreenshots();
