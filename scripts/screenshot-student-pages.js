/**
 * Script to capture screenshots of login and student pages for UI/CSS verification
 * Run: node scripts/screenshot-student-pages.js
 */

const { chromium } = require('playwright');

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  try {
    // 1. Navigate to login page, wait for full load, screenshot
    console.log('1. Navigating to login page...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForSelector('text=Select Your Role', { timeout: 10000 });
    await page.waitForSelector('text=Admin', { state: 'visible', timeout: 5000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'screenshots/01-login.png', fullPage: true });
    console.log('   Saved: 01-login.png');

    // 2. Login as student
    console.log('2. Logging in as student...');
    await page.locator('button').nth(2).click(); // Student role
    await page.waitForTimeout(500);
    await page.fill('input[id="username"]', '21CSE001');
    await page.fill('input[id="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/student/**', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Use in-app navigation (sidebar links) to preserve auth state - page.goto() causes full reload and loses Zustand

    // 3. Navigate to student/leave via sidebar, screenshot
    console.log('3. Navigating to student/leave...');
    await page.click('a[href="/student/leave"]');
    await page.waitForURL('**/student/leave**', { timeout: 5000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/02-leave.png', fullPage: true });
    console.log('   Saved: 02-leave.png');

    // 4. Navigate to student/events via sidebar, screenshot
    console.log('4. Navigating to student/events...');
    await page.click('a[href="/student/events"]');
    await page.waitForURL('**/student/events**', { timeout: 5000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/03-events.png', fullPage: true });
    console.log('   Saved: 03-events.png');

    // 5. Navigate to student/library via sidebar, screenshot
    console.log('5. Navigating to student/library...');
    await page.click('a[href="/student/library"]');
    await page.waitForURL('**/student/library**', { timeout: 5000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/04-library.png', fullPage: true });
    console.log('   Saved: 04-library.png');

    // 6. Navigate to student/profile via sidebar, screenshot
    console.log('6. Navigating to student/profile...');
    await page.click('a[href="/student/profile"]');
    await page.waitForURL('**/student/profile**', { timeout: 5000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/05-profile.png', fullPage: true });
    console.log('   Saved: 05-profile.png');

    console.log('\nDone! All screenshots saved to screenshots/ folder.');
  } catch (error) {
    console.error('Error:', error.message);
    try {
      await page.screenshot({ path: 'screenshots/error-state.png', fullPage: true });
      console.log('Error state saved to: screenshots/error-state.png');
    } catch (e) {}
    process.exit(1);
  } finally {
    await browser.close();
  }
}

captureScreenshots();
