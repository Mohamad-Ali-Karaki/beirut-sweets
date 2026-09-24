import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844], ['small-mobile', 320, 780], ['tablet', 768, 1024]]) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
  await page.goto('http://127.0.0.1:5173/');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `artifacts/${name}-hero.png` });
  await page.evaluate(() => window.scrollTo({ top: document.getElementById('menu').offsetTop - 95, behavior: 'instant' }));
  await page.waitForFunction(() => [...document.querySelectorAll('.product-image img')].filter(image => { const rect = image.getBoundingClientRect(); return rect.top < innerHeight && rect.bottom > 0; }).every(image => image.complete && image.naturalWidth > 0));
  await page.screenshot({ path: `artifacts/${name}-menu.png` });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  console.log(name + ' horizontal overflow: ' + overflow);
  await page.close();
}
await browser.close();
