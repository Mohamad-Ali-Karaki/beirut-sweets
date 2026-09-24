import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 100));
  await page.goto('http://127.0.0.1:5173/');
  await page.evaluate(() => document.fonts.ready);
  await page.clock.runFor(1100);
  await page.screenshot({ path: `artifacts/${name}-refresh-intro.png` });
  await page.clock.runFor(4000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('.menu-card').first().scrollIntoViewIfNeeded();
  await page.waitForFunction(() => [...document.querySelectorAll('.product-image img')]
    .filter(image => { const box = image.getBoundingClientRect(); return box.top < innerHeight && box.bottom > 0; })
    .every(image => image.complete && image.naturalWidth > 0));
  await page.screenshot({ path: `artifacts/${name}-refresh-cards.png` });
  await page.getByRole('button', { name: 'Add Fruit Pieces Cocktail, Medium', exact: true }).click();
  await page.getByRole('button', { name: 'Open cart, 1 items' }).click();
  await page.screenshot({ path: `artifacts/${name}-refresh-cart.png` });
  await page.close();
}
await browser.close();
