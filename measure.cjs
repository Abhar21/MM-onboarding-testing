const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/onboarding');

  const metrics = await page.evaluate(() => {
    const nextBtn = document.querySelector('.btn-primary-blue');
    const rightContainer = document.querySelector('.onboarding-actions-bottom');
    const loginText = document.querySelector('.sidebar-login-text');
    const leftContainer = document.querySelector('.sidebar-login-footer');

    return {
      rightContainer: rightContainer ? rightContainer.getBoundingClientRect() : null,
      rightStyles: rightContainer ? {
        height: window.getComputedStyle(rightContainer).height,
        paddingTop: window.getComputedStyle(rightContainer).paddingTop,
        paddingBottom: window.getComputedStyle(rightContainer).paddingBottom,
        display: window.getComputedStyle(rightContainer).display,
        alignItems: window.getComputedStyle(rightContainer).alignItems,
      } : null,
      nextBtn: nextBtn ? nextBtn.getBoundingClientRect() : null,
      leftContainer: leftContainer ? leftContainer.getBoundingClientRect() : null,
      loginText: loginText ? loginText.getBoundingClientRect() : null,
    };
  });
  console.log(JSON.stringify(metrics, null, 2));
  await browser.close();
})();
