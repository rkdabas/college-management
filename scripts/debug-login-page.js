/**
 * Debug script: Login page load, console errors, stylesheets
 * Run: node scripts/debug-login-page.js
 */

const { chromium } = require('playwright');
const fs = require('fs');

async function debugLoginPage() {
  const browser = await chromium.launch({ headless: true }); // Use headless - headed would need display
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const consoleLogs = [];
  const consoleErrors = [];

  // Capture console messages
  page.on('console', (msg) => {
    const text = msg.text();
    const type = msg.type();
    if (type === 'error') {
      consoleErrors.push({ type, text });
    }
    consoleLogs.push({ type, text });
  });

  // Capture page errors
  page.on('pageerror', (error) => {
    consoleErrors.push({ type: 'pageerror', text: error.message });
  });

  try {
    console.log('Navigating to http://localhost:3000/login...');
    await page.goto('http://localhost:3000/login', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    console.log('Waiting additional 10 seconds for full load...');
    await page.waitForTimeout(10000);

    // Take first screenshot
    await page.screenshot({ path: 'screenshots/debug-01-after-wait.png', fullPage: true });
    console.log('Screenshot saved: debug-01-after-wait.png');

    // Check for stylesheets and page structure
    const pageInfo = await page.evaluate(() => {
      const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(
        (el) => ({
          href: el.href,
          disabled: el.disabled,
        })
      );
      const styleTags = Array.from(document.querySelectorAll('style')).map((el) => ({
        length: el.textContent?.length || 0,
        preview: el.textContent?.substring(0, 200) || '',
      }));
      const hasVisibleContent = document.body?.innerText?.trim().length > 0;
      const bodyClasses = document.body?.className || '';
      const rootDiv = document.getElementById('__next');
      const rootHtml = rootDiv ? rootDiv.innerHTML?.substring(0, 500) : 'no __next';
      const computedBg = document.body
        ? window.getComputedStyle(document.body).backgroundColor
        : 'N/A';

      // Check computed styles of first heading and first card
      const h1 = document.querySelector('h1');
      const firstCard = document.querySelector('[class*="card"]') || document.querySelector('button');
      const headingStyle = h1 ? {
        color: window.getComputedStyle(h1).color,
        opacity: window.getComputedStyle(h1).opacity,
        visibility: window.getComputedStyle(h1).visibility,
        display: window.getComputedStyle(h1).display,
      } : null;
      const cardStyle = firstCard ? {
        color: window.getComputedStyle(firstCard).color,
        backgroundColor: window.getComputedStyle(firstCard).backgroundColor,
        opacity: window.getComputedStyle(firstCard).opacity,
        visibility: window.getComputedStyle(firstCard).visibility,
      } : null;

      return {
        stylesheets,
        styleTagsCount: styleTags.length,
        styleTags,
        hasVisibleContent,
        bodyTextLength: document.body?.innerText?.trim().length || 0,
        bodyTextPreview: document.body?.innerText?.substring(0, 300) || '',
        bodyClasses,
        rootHtmlPreview: rootHtml,
        computedBg,
        documentReadyState: document.readyState,
        headingStyle,
        cardStyle,
        h1Exists: !!h1,
        buttonCount: document.querySelectorAll('button').length,
      };
    });

    console.log('\n=== PAGE INFO ===');
    console.log(JSON.stringify(pageInfo, null, 2));

    // Screenshot shows blank but DOM has content - try click/scroll to trigger repaint
    const bodyText = await page.evaluate(() => document.body?.innerText?.trim() || '');
    const appearsBlank = bodyText.length < 50;

    // Try click and scroll - screenshot may show blank even when DOM has content (headless render issue)
    {
      console.log('\nClicking center of page (to trigger repaint)...');
      await page.mouse.click(640, 400);
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'screenshots/debug-02-after-click.png', fullPage: true });
      console.log('Screenshot saved: debug-02-after-click.png');

      // Try scrolling
      console.log('Scrolling down...');
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'screenshots/debug-03-after-scroll.png', fullPage: true });
      console.log('Screenshot saved: debug-03-after-scroll.png');
    }

    // Write console output to file
    const report = {
      consoleErrors,
      consoleLogs: consoleLogs.slice(-50), // Last 50
      pageInfo,
      appearsBlank,
    };
    fs.writeFileSync(
      'screenshots/debug-report.json',
      JSON.stringify(report, null, 2),
      'utf-8'
    );
    console.log('\nReport saved: screenshots/debug-report.json');

    console.log('\n=== CONSOLE ERRORS ===');
    if (consoleErrors.length === 0) {
      console.log('(No JavaScript errors detected)');
    } else {
      consoleErrors.forEach((e) => console.log(`[${e.type}] ${e.text}`));
    }
  } catch (error) {
    console.error('Error:', error.message);
    try {
      await page.screenshot({ path: 'screenshots/debug-error.png', fullPage: true });
      console.log('Error screenshot: debug-error.png');
    } catch (e) {}
    process.exit(1);
  } finally {
    await browser.close();
  }
}

debugLoginPage();
