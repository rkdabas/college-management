/**
 * Script to verify CSS/styling of admin flow
 * Run: node scripts/screenshot-admin-pages.js
 */

const { chromium } = require('playwright');

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  try {
    // 1. Go to login, wait 5 seconds for full load, screenshot
    console.log('1. Navigating to login page...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(5000); // Wait at least 5 seconds as requested
    await page.screenshot({ path: 'screenshots/admin-01-login-initial.png', fullPage: true });
    console.log('   Saved: admin-01-login-initial.png');

    // 2. Click Admin role card, wait for login form, screenshot
    console.log('2. Clicking Admin role card...');
    await page.locator('button').first().click(); // Admin is first (0)
    await page.waitForSelector('input[id="username"]', { timeout: 5000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/admin-02-admin-login-form.png', fullPage: true });
    console.log('   Saved: admin-02-admin-login-form.png');

    // 3. Enter credentials, Sign In, wait for dashboard, screenshot
    console.log('3. Logging in as admin...');
    await page.fill('input[id="username"]', 'admin@college.edu');
    await page.fill('input[id="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin/dashboard**', { timeout: 10000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'screenshots/admin-03-dashboard.png', fullPage: true });
    console.log('   Saved: admin-03-dashboard.png');

    // 4. Click Attendance via sidebar
    console.log('4. Navigating to Attendance...');
    await page.click('a[href="/admin/attendance"]');
    await page.waitForURL('**/admin/attendance**', { timeout: 5000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/admin-04-attendance.png', fullPage: true });
    console.log('   Saved: admin-04-attendance.png');

    // 5. Click Academic Structure via sidebar
    console.log('5. Navigating to Academic Structure...');
    await page.click('a[href="/admin/academic-structure"]');
    await page.waitForURL('**/admin/academic-structure**', { timeout: 5000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/admin-05-academic-structure.png', fullPage: true });
    console.log('   Saved: admin-05-academic-structure.png');

    // 6. Click Students
    console.log('6. Navigating to Students...');
    await page.click('a[href="/admin/students"]');
    await page.waitForURL('**/admin/students**', { timeout: 5000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/admin-06-students.png', fullPage: true });
    console.log('   Saved: admin-06-students.png');

    // 7. Click Events
    console.log('7. Navigating to Events...');
    await page.click('a[href="/admin/events"]');
    await page.waitForURL('**/admin/events**', { timeout: 5000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/admin-07-events.png', fullPage: true });
    console.log('   Saved: admin-07-events.png');

    // 8. Click Reports
    console.log('8. Navigating to Reports...');
    await page.click('a[href="/admin/reports"]');
    await page.waitForURL('**/admin/reports**', { timeout: 5000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/admin-08-reports.png', fullPage: true });
    console.log('   Saved: admin-08-reports.png');

    console.log('\nDone! All admin screenshots saved to screenshots/ folder.');
  } catch (error) {
    console.error('Error:', error.message);
    try {
      await page.screenshot({ path: 'screenshots/admin-error.png', fullPage: true });
      console.log('Error state saved to: screenshots/admin-error.png');
    } catch (e) {}
    process.exit(1);
  } finally {
    await browser.close();
  }
}

captureScreenshots();
