const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Test desktop
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto('http://localhost:5173/onboarding');
  await page.screenshot({ path: 'test_desktop.png' });

  // Test mobile
  await page.setViewport({ width: 375, height: 812 });
  await page.screenshot({ path: 'test_mobile.png' });
  
  await browser.close();
})();
