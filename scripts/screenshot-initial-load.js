/**
 * Screenshot login page on initial load - NO interaction
 * Run: node scripts/screenshot-initial-load.js
 */

const { chromium } = require('playwright');

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  try {
    console.log('Navigating to http://localhost:3000/login...');
    await page.goto('http://localhost:3000/login', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    console.log('Taking screenshot (no interaction)...');
    await page.screenshot({ path: 'screenshots/initial-load.png', fullPage: true });
    console.log('Saved: screenshots/initial-load.png');
  } finally {
    await browser.close();
  }
}

capture();
