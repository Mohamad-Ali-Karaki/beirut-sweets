import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/?skipIntro=1');
});

test('renders with no runtime errors, responsive layout, working navigation and scroll reveals', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('A little sip.');
  await expect(page.locator('.site-header .brand-mark')).toHaveAttribute('src', '/images/beirut-brand-mark.svg');
  await expect.poll(() => page.locator('.site-header .brand-mark').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(page.locator('.menu-card')).toHaveCount(21);
  await expect.poll(() => page.locator('.hero-image img').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Toggle navigation' }).click();
    await expect(page.getByRole('navigation')).toBeVisible();
    await page.getByRole('navigation').getByRole('link', { name: 'Our menu' }).click();
    await expect(page.getByRole('button', { name: 'Toggle navigation' })).toHaveAttribute('aria-expanded', 'false');
  } else await page.getByRole('link', { name: 'Find your favorite' }).click();
  await page.locator('.menu-card').first().scrollIntoViewIfNeeded();
  await expect(page.locator('.menu-card').first()).toHaveClass(/revealed/);
  await expect(page.getByRole('button', { name: 'More delicious things' })).toHaveCount(0);
  await page.getByRole('group', { name: 'Menu categories' }).getByRole('button', { name: 'Crepes', exact: true }).click();
  await expect(page.locator('.menu-card')).toHaveCount(5);
  await page.getByRole('group', { name: 'Menu categories' }).getByRole('button', { name: 'Milkshakes', exact: true }).click();
  await expect(page.locator('.menu-card')).toHaveCount(2);
  await page.getByRole('group', { name: 'Menu categories' }).getByRole('button', { name: 'Kashta & fruit', exact: true }).click();
  await expect(page.locator('.menu-card')).toHaveCount(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('search works across categories in English and Arabic, including empty results', async ({ page }) => {
  const search = page.getByRole('textbox', { name: 'Search all menu items' });
  await page.getByRole('group', { name: 'Menu categories' }).getByRole('button', { name: 'Crepes', exact: true }).click();
  await search.fill('Avocado');
  await expect(page.locator('.menu-card')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Avocado', exact: true })).toBeVisible();
  await search.fill('فراولة');
  await expect(page.getByRole('heading', { name: 'Strawberry', exact: true })).toBeVisible();
  await search.fill('not-a-real-drink');
  await expect(page.getByRole('heading', { name: 'No treats by that name.' })).toBeVisible();
  await page.getByRole('button', { name: 'Show the menu', exact: true }).click();
  await expect(page.locator('.menu-card')).toHaveCount(21);
});

test('cart variants, quantities, persistence, removal and WhatsApp delivery checkout', async ({ page }) => {
  await page.evaluate(() => { window.open = () => ({ opener: null, location: { replace: url => { window.__checkout = url; } }, close() {} }); });
  const fruit = page.getByRole('article', { name: 'Fruit Pieces Cocktail' });
  await fruit.getByRole('button', { name: 'Large', exact: true }).click();
  await expect(fruit.locator('.card-footer')).toContainText('400,000');
  await fruit.getByRole('button', { name: 'Add Fruit Pieces Cocktail, Large', exact: true }).click();
  await fruit.getByRole('button', { name: 'Add Fruit Pieces Cocktail, Large', exact: true }).click();
  await fruit.getByRole('button', { name: 'Medium', exact: true }).click();
  await fruit.getByRole('button', { name: 'Add Fruit Pieces Cocktail, Medium', exact: true }).click();
  await page.getByRole('button', { name: 'Open cart, 3 items', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.total-row')).toContainText('1,100,000');
  await dialog.getByRole('button', { name: 'Increase Fruit Pieces Cocktail Large', exact: true }).click();
  await expect(dialog.locator('.total-row')).toContainText('1,500,000');
  await dialog.getByRole('button', { name: 'Decrease Fruit Pieces Cocktail Large', exact: true }).click();
  await dialog.getByRole('button', { name: 'Remove Fruit Pieces Cocktail Medium', exact: true }).click();
  await expect(dialog.locator('.total-row')).toContainText('800,000');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await page.reload();
  await page.evaluate(() => { window.open = () => ({ opener: null, location: { replace: url => { window.__checkout = url; } }, close() {} }); });
  await page.getByRole('button', { name: 'Open cart, 2 items', exact: true }).click();
  await expect(dialog.locator('.total-row')).toContainText('800,000');
  await dialog.getByRole('radio', { name: 'Delivery', exact: true }).check();
  await dialog.getByRole('button', { name: 'Send order via WhatsApp' }).click();
  expect(await page.evaluate(() => window.__checkout)).toBeUndefined();
  await dialog.getByRole('textbox', { name: 'Delivery address' }).fill('Safad El Batikh, building 2');
  await dialog.getByRole('textbox', { name: 'Your name' }).fill('Rana');
  await dialog.getByRole('textbox', { name: 'Anything we should know?' }).fill('No sugar & extra ice');
  await dialog.getByRole('button', { name: 'Send order via WhatsApp' }).click();
  const url = new URL(await page.evaluate(() => window.__checkout));
  expect(url.origin + url.pathname).toBe('https://wa.me/96176804192');
  expect(url.searchParams.get('text')).toContain('1. *Fruit Pieces Cocktail*');
  expect(url.searchParams.get('text')).toContain('Size: Large · Qty: 2');
  expect(url.searchParams.get('text')).toContain('Line total: 800,000 L.L.');
  expect(url.searchParams.get('text')).toContain('Delivery address: Safad El Batikh, building 2');
  expect(url.searchParams.get('text')).toContain('Notes: No sugar & extra ice');
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Open cart, 0 items' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Open cart, 0 items' })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('beirut-sweets-cart')))).toEqual([]);

});

test('cart traps focus, restores focus and supports empty state', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Open cart, 0 items', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('button', { name: 'Close cart' })).toBeFocused();
  for (let step = 0; step < 6; step++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement.closest('dialog'))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(dialog).not.toBeVisible();
});

test('reduced motion and malformed saved cart remain usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => localStorage.setItem('beirut-sweets-cart', '{broken'));
  await page.reload();
  await expect(page.getByRole('button', { name: 'Open cart, 0 items' })).toBeVisible();
  await expect(page.locator('.menu-card').first()).toHaveCSS('opacity', '1');
  await expect(page.locator('.intro-screen')).toHaveCount(0);
});

test('four-second intro can be skipped and replays on reload', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'intro behavior only needs one browser pass');
  await page.evaluate(() => sessionStorage.removeItem('beirut-sweets-intro'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.intro-screen')).toBeAttached();
  await expect(page.locator('.intro-screen video')).toHaveAttribute('autoplay', '');
  await expect(page.locator('.intro-brand h1')).toContainText('beirut');
  await page.getByRole('button', { name: 'Skip intro' }).evaluate(button => button.click());
  await expect(page.locator('.intro-screen')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('.intro-screen')).toBeVisible();
  await page.getByRole('button', { name: 'Skip intro' }).click();
  await expect(page.locator('.intro-screen')).toHaveCount(0);
});

test('horizontal swipe navigates menu categories', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'touch gesture is exercised on the mobile project');
  const grid = page.locator('.menu-grid');
  await expect(page.locator('.menu-card')).toHaveCount(21);
  await grid.evaluate(element => {
    const start = new Touch({ identifier: 1, target: element, clientX: 320, clientY: 400 });
    const end = new Touch({ identifier: 1, target: element, clientX: 80, clientY: 405 });
    element.dispatchEvent(new TouchEvent('touchstart', { changedTouches: [start], bubbles: true }));
    element.dispatchEvent(new TouchEvent('touchend', { changedTouches: [end], bubbles: true }));
  });
  await expect(page.locator('.menu-card')).toHaveCount(12);
  await expect(page.getByRole('button', { name: 'Cocktails & juices', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await grid.evaluate(element => {
    const start = new Touch({ identifier: 2, target: element, clientX: 80, clientY: 400 });
    const end = new Touch({ identifier: 2, target: element, clientX: 320, clientY: 402 });
    element.dispatchEvent(new TouchEvent('touchstart', { changedTouches: [start], bubbles: true }));
    element.dispatchEvent(new TouchEvent('touchend', { changedTouches: [end], bubbles: true }));
  });
  await expect(page.locator('.menu-card')).toHaveCount(21);
});
