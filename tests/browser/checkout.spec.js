import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/?skipIntro=1');
  await page.getByRole('button', { name: 'Add Fruit Pieces Cocktail, Medium', exact: true }).click();
  await page.getByRole('button', { name: 'Open cart, 1 items' }).click();
});

test('blocked WhatsApp popup preserves the cart and manual clear still requires confirmation', async ({ page }) => {
  await page.evaluate(() => { window.open = () => null; });
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Send order via WhatsApp' }).click();
  await expect(dialog.getByRole('alert')).toContainText('Your cart has been kept');
  await expect(dialog.locator('.cart-line')).toHaveCount(1);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('beirut-sweets-cart')).length)).toBe(1);
  await dialog.getByRole('button', { name: 'Clear cart', exact: true }).click();
  await dialog.getByRole('button', { name: 'Keep items' }).click();
  await expect(dialog.locator('.cart-line')).toHaveCount(1);
  await dialog.getByRole('button', { name: 'Clear cart', exact: true }).click();
  await dialog.getByRole('button', { name: 'Yes, clear' }).click();
  await expect(dialog.getByRole('button', { name: 'Send order via WhatsApp' })).toHaveCount(0);
});

test('actual popup handoff clears saved cart and severs its opener without sending an order', async ({ page, context }) => {
  // Fulfill locally: no WhatsApp request or real order leaves the test browser.
  await context.route('https://wa.me/**', route => route.fulfill({ contentType: 'text/html', body: '<p>Intercepted WhatsApp handoff</p>' }));
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Send order via WhatsApp' }).click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL(/https:\/\/wa\.me\/96176804192\?text=/);
  expect(await popup.evaluate(() => window.opener === null)).toBe(true);
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('beirut-sweets-cart')))).toEqual([]);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Open cart, 0 items' })).toBeVisible();
  await popup.close();
});

test('size selectors and add buttons share the category accent color', async ({ page }) => {
  await page.getByRole('button', { name: 'Close cart' }).click();
  const expected = { cocktails: 'rgb(255, 227, 74)', shakes: 'rgb(255, 153, 197)', crepes: 'rgb(255, 177, 107)', plates: 'rgb(184, 238, 105)' };
  for (const [category, color] of Object.entries(expected)) {
    const card = page.locator('.menu-card[data-category="' + category + '"]').first();
    await expect(card.locator('.add-button')).toHaveCSS('background-color', color);
    await expect(card.locator('.size-picker [aria-pressed="true"]')).toHaveCSS('background-color', color);
  }
});
