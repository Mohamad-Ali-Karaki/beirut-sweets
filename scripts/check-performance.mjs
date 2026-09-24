import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ channel: 'chrome' });
for (const mobile of [false, true]) {
  const page = await browser.newPage({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 }, isMobile: mobile, hasTouch: mobile });
  const client = await page.context().newCDPSession(page);
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:5176/?skipIntro=1');
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.menu-card').first().scrollIntoViewIfNeeded();
  const frames = await page.evaluate(() => new Promise(resolve => {
    const samples = [];
    let last;
    function tick(time) {
      if (last) samples.push(time - last);
      last = time;
      window.scrollBy({ top: 3, behavior: 'instant' });
      if (samples.length < 90) requestAnimationFrame(tick);
      else resolve(samples);
    }
    requestAnimationFrame(tick);
  }));
  const sorted = frames.sort((a, b) => a - b);
  const images = await page.locator('.product-image img').evaluateAll(nodes => ({ loaded: nodes.filter(node => node.complete && node.naturalWidth > 0).length, total: nodes.length }));
  const thirdParty = await page.evaluate(() => performance.getEntriesByType('resource').filter(entry => !entry.name.startsWith(location.origin)).map(entry => entry.name));
  assert.equal(thirdParty.length, 0);
  assert.equal(errors.length, 0);
  if (mobile) {
    await page.evaluate(() => window.scrollTo({ top: document.querySelector('.menu-grid').getBoundingClientRect().top + scrollY - 160, behavior: 'instant' }));
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 320, y: 260 }] });
    for (let x = 290; x >= 80; x -= 30) await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: 265 }] });
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForFunction(() => document.querySelectorAll('.menu-card').length === 12);
  }
  console.log(JSON.stringify({ viewport: mobile ? 'mobile' : 'desktop', cpuThrottle: 4, medianFrameMs: +sorted[45].toFixed(1), p95FrameMs: +sorted[85].toFixed(1), images, externalRequests: thirdParty.length, runtimeErrors: errors, nativeTouchSwipe: mobile ? 'passed' : 'not applicable' }));
  await page.close();
}
await browser.close();
