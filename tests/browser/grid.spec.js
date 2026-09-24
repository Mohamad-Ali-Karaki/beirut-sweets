import { test, expect } from '@playwright/test';

test('compact grid keeps four laptop columns, two phone columns and clear Arabic', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?skipIntro=1');
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    const grid = page.locator('.menu-grid');
    const columns = await grid.evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length);
    expect(columns).toBe(width > 780 ? 4 : 2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const arabic = page.locator('.product-heading [lang="ar"]').first();
    await expect(arabic).toHaveCSS('color', 'rgb(25, 62, 53)');
    await expect(arabic).toHaveCSS('font-weight', '700');
    await expect(arabic).toHaveCSS('font-size', width > 780 ? '18px' : '17px');
    await expect(page.locator('.product-heading h3').first()).toHaveCSS('font-size', width > 780 ? '20px' : '17px');
    await expect(page.locator('.ambient-fruit-a')).toHaveCSS('opacity', width > 780 ? '0.52' : '0.46');
    expect(await page.locator('.menu-card').evaluateAll(cards => cards.every(card => card.scrollWidth <= card.clientWidth + 1))).toBe(true);
  }
  await page.getByRole('button', { name: 'Add Fruit Pieces Cocktail, Medium', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Open cart, 1 items' })).toBeVisible();
});
