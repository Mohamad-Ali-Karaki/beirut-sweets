import { test, expect } from '@playwright/test';

test('real mobile side swipes cycle categories and keep the selected tab in view', async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Native mobile touch coverage');
  await page.goto('/?skipIntro=1');
  const session = await context.newCDPSession(page);
  const gesture = async (dx, dy = 0) => {
    const photo = page.locator('.product-image').first();
    await photo.scrollIntoViewIfNeeded();
    const box = await photo.boundingBox();
    const x = dx < 0 ? 300 : 80;
    const y = Math.min(600, Math.max(150, box.y + box.height / 2));
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let i = 1; i <= 6; i++) {
      await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx * i / 6, y: y + dy * i / 6 }] });
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  };
  for (const [name, count] of [['Cocktails & juices', 12], ['Milkshakes', 2], ['Crepes', 5], ['Kashta & fruit', 2], ['All treats', 21]]) {
    await gesture(-190);
    const tab = page.getByRole('button', { name, exact: true });
    await expect(tab).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.menu-card')).toHaveCount(count);
    expect(await tab.evaluate(element => {
      const box = element.getBoundingClientRect();
      const parent = element.parentElement.getBoundingClientRect();
      return box.left >= parent.left - 1 && box.right <= parent.right + 1;
    })).toBe(true);
  }
  await gesture(190);
  await expect(page.getByRole('button', { name: 'Kashta & fruit', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await gesture(4, -120);
  await expect(page.getByRole('button', { name: 'Kashta & fruit', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Open cart, 0 items' })).toBeVisible();
});
