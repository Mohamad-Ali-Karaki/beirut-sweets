# Redesign verification

Verified locally on 22 September 2026 using installed Chrome and Playwright.

- Production build: passed.
- Cart/menu unit tests: 5 passed.
- Desktop/mobile browser tests: 20 passed, 2 intentionally skipped project-specific duplicates.
- Visual checks: 1440px desktop, 768px tablet, 390px mobile and 320px small mobile. No horizontal overflow at these widths.
- All 21 menu image URLs are distinct, local WebP files and decode successfully.
- Actual four-second MP4 playback, auto exit, skip and per-tab suppression passed.
- WhatsApp checkout was intercepted to validate recipient, variants, totals and delivery details. No real order was sent.
- Native Chrome touch-event swipe changed categories successfully, in addition to the synthetic regression test.
- Production scroll probe at 4× CPU slowdown: 16.7ms median / 16.8ms p95 frame intervals for both desktop and mobile in this local run. No runtime errors or external resource requests. This is a controlled local measurement, not a guarantee for every device or network.

Reproduce with `npm test`, `npm run test:e2e`, `node scripts/capture.mjs` (dev server on 5173), and `node scripts/check-performance.mjs` (production preview on 5176).

Remaining media limitation: Kinder and Crunchy still use clearly documented representative real chocolate-crepe photos, not verified photos of those exact branded toppings. Approved shop photos are needed for exact serving fidelity. The public credits page distinguishes stock photography and AI illustrations.
