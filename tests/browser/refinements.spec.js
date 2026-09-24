import { test, expect } from "@playwright/test";

test('menu leads directly to the footer without numbered steps or story image', async ({ page }) => {
  await page.goto('/?skipIntro=1');
  await expect(page.locator('.menu-card')).toHaveCount(21);
  await expect(page.locator('.promise-strip, .story, a[href="#story"]')).toHaveCount(0);
  await expect(page.locator('main > :last-child')).toHaveAttribute('id', 'menu');
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('#contact')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('category selections update the photographic backdrop and search restores the general background', async ({ page }) => {
  await page.goto('/?skipIntro=1');
  const background = page.locator('.ambient-scene');
  const nav = page.getByRole('group', { name: 'Menu categories' });
  const seen = new Set();
  for (const [label, id] of [['All treats', 'all'], ['Cocktails & juices', 'cocktails'], ['Milkshakes', 'shakes'], ['Crepes', 'crepes'], ['Kashta & fruit', 'plates']]) {
    await nav.getByRole('button', { name: label, exact: true }).click();
    await expect(background).toHaveAttribute('data-category', id);
    await expect.poll(() => background.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
    seen.add(await background.locator('img').first().getAttribute('src'));
  }
  expect(seen.size).toBe(5);
  await page.getByRole('textbox', { name: 'Search all menu items' }).fill('Orange');
  await expect(background).toHaveAttribute('data-category', 'all');
});

test("all 21 item photographs load, use distinct assets and keep a nonwhite backdrop", async ({
  page,
}) => {
  await page.goto("/?skipIntro=1");
  const photos = page.locator(".product-image img");
  await expect(photos).toHaveCount(21);
  const sources = await photos.evaluateAll((images) =>
    images.map((image) => image.getAttribute("src")),
  );
  expect(new Set(sources).size).toBe(21);
  expect(sources.every((source) => source.endsWith(".webp"))).toBe(true);
  await photos.evaluateAll((images) => {
    images.forEach((image) => {
      image.loading = "eager";
    });
  });
  await expect
    .poll(() =>
      photos.evaluateAll((images) =>
        images.every((image) => image.complete && image.naturalWidth > 0),
      ),
    )
    .toBe(true);
  await expect(page.locator(".ambient-scene")).toHaveCSS(
    "background-color",
    "rgb(255, 248, 238)",
  );
  await expect(page.locator(".cart-rail")).toHaveCount(0);
  await expect(page.locator(".cart-button")).toBeVisible();
});

test("intro video plays and automatically exits after four seconds", async ({
  page,
}) => {
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await page.clock.pauseAt(new Date('2026-01-01T00:00:01Z'));
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const video = page.locator(".intro-screen video");
  await expect(video).toBeVisible();
  await expect
    .poll(() => video.evaluate((element) => element.currentTime))
    .toBeGreaterThan(0.2);
  const duration = await video.evaluate((element) => element.duration);
  expect(duration).toBeGreaterThanOrEqual(3.9);
  expect(duration).toBeLessThan(4.2);
  await page.clock.runFor(4500);
  await expect(page.locator(".intro-screen")).toHaveCount(0, { timeout: 6000 });
  await expect(
    page.getByRole("link", { name: "Find your favorite" }),
  ).toBeVisible();
  await page.reload();
  await expect(page.locator(".intro-screen")).toBeVisible();
  await expect(page.locator(".intro-screen")).toHaveCSS('background-color', 'rgb(255, 250, 243)');
  await page.clock.runFor(4500);
  await expect(page.locator(".intro-screen")).toHaveCount(0);
});

test("denied browser storage does not block menu or cart", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException("Disabled", "SecurityError");
    };
    Storage.prototype.setItem = () => {
      throw new DOMException("Disabled", "SecurityError");
    };
  });
  await page.goto("/?skipIntro=1");
  await expect(page.locator(".intro-screen")).toHaveCount(0);
  await expect(page.locator(".menu-card")).toHaveCount(21);
  await page.getByRole("button", { name: "Dismiss notice" }).click();
  await page.getByRole("button", { name: "Open cart, 0 items" }).click();
  await expect(
    page.getByRole("dialog", { name: "Your sweet selection" }),
  ).toBeVisible();
});

test("background motion respects pointer type and reduced motion", async ({
  page,
}, testInfo) => {
  await page.goto("/?skipIntro=1");
  await page.mouse.move(150, 150);
  const scene = page.locator(".ambient-scene");
  if (testInfo.project.name === "desktop") {
    await expect
      .poll(() =>
        scene.evaluate((element) =>
          element.style.getPropertyValue("--drift-x"),
        ),
      )
      .not.toBe("");
  } else await expect(scene).not.toHaveAttribute("style", /--drift/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.mouse.move(300, 200);
  await expect
    .poll(() =>
      scene.evaluate((element) => element.style.getPropertyValue("--drift-x")),
    )
    .toBe("");
});
