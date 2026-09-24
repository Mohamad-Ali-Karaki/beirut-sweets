# Beirut Sweets

A React + Vite menu for Beirut Sweets with 21 items transcribed from the supplied menu, size-based Lebanese-pound pricing, a persistent cart, and WhatsApp checkout to **+961 76 804 192**.

## Start the app

Requires Node.js (tested with v24.21.0) and npm.

```powershell
git clone https://github.com/Mohamad-Ali-Karaki/beirut-sweets.git
cd beirut-sweets
npm install
npm run dev
```

Open the address printed by Vite, normally **http://127.0.0.1:5173/**. If you already have the repository, open its folder and run `npm install` and `npm run dev` without cloning again.

If an existing PowerShell session cannot find Node, refresh that terminal's PATH:

```powershell
$env:Path = "C:\Program Files\nodejs;$env:Path"
```

If PowerShell blocks `npm.ps1`, use `npm.cmd` in place of `npm`.

## Verify

```powershell
npm run build
npm test
npm run test:e2e
```

The browser suite uses installed Google Chrome through Playwright and runs desktop and mobile projects. It launches a separate test server on port 5175. Tests cover menu navigation, English/Arabic search, size prices, quantities, cart reload persistence, removal, clear confirmation, delivery validation, WhatsApp URL contents, keyboard focus, and reduced motion. WhatsApp is intercepted: tests never send a real order.

`npm test` checks malformed saved carts, current catalog pricing, invalid variants, quantity limits, and encoded order summaries. To refresh viewport screenshots with the dev server running: `node scripts/capture.mjs`. Output goes to `artifacts/` (gitignored).

## Design and ordering

- Contemporary soft-ivory surfaces, generous typography, rounded inset photos, subtle shadows, and bright category accents. Custom citrus-shaped lowercase-b logo with a green leaf, also used as the browser icon.
- Category-specific photographic heading panels and stronger layered background images; the All treats/search view uses the general mixed-menu image.
- Layered photographic background with gentle pointer-driven movement. The handler is requestAnimationFrame-throttled, never rerenders React, and is disabled for touch, reduced motion and hidden tabs.
- Staggered scroll reveals, photo hover effects, animated cart feedback, and a four-second food-film intro with animated branding and a Skip control. The intro replays on every reload; reduced-motion and data-saver preferences skip it. Its cream, citrus, and coral styling matches the website.
- All 21 products are visible by default. On touch screens, swiping the product grid left or right changes categories.
- The earlier header cart button and right-side modal drawer are restored. A mobile bottom order bar appears only after adding items; the right-edge rail is removed.
- Native modal cart with focus containment, Escape/backdrop close and focus restoration.
- Saved carts are validated and repriced against the current menu. Storage failure does not prevent ordering.
- Checkout opens a prefilled WhatsApp message; the customer reviews and sends it. Pickup or delivery, optional name, address and notes are included. Availability, timing and delivery fees require restaurant confirmation.
- WhatsApp messages use a branded heading, numbered items, separate size/quantity/unit-price/line-total details, total quantity, a highlighted subtotal and a dedicated requests section. Delivery fees are explicitly excluded pending confirmation.
- Opening the order in WhatsApp clears the cart and its saved copy. Blocked popups or navigation errors keep the cart intact and display a retry message. The website cannot observe WhatsApp's actual Send action; this handoff behavior is stated next to checkout.
- All 21 cards have explicit, distinct local WebP image files. Juice photos are individually matched; banana and chocolate shakes are separate, and plain kashta no longer shows fruit. Stock photography remains illustrative, not verified photos of the restaurant's servings. Kinder and Crunchy still use representative chocolate-crepe photography; replace these with approved shop photos for exact toppings. Descriptions are editorial; allergy information should be confirmed with the restaurant.

Edit products and prices in `src/menu.js`, interface in `src/main.jsx`, base styles in `src/styles.css`, and the current contemporary theme in `src/modern.css`. The previous `refresh.css` theme is no longer imported. The custom vector logo is `public/images/beirut-brand-mark.svg`, used in the header, footer, intro, and browser tab. The original menu image lists a different phone number; checkout deliberately uses the number explicitly supplied by the user.

## Artwork

Built-in image generation created the project artwork, saved locally at:

- `public/images/beirut-sweets-hero.png` — cocktails, milkshake and chocolate crepes.
- `public/images/menu-collection.png` — original illustrative artwork, retained as a source. Only two appropriate individual crops are used now; the multi-megabyte sheet is not downloaded by the page.
- `public/images/*.webp` — optimized per-item photos from Pexels and Wikimedia, plus the named illustrations.
- `public/images/kashta-plain.png` and `.webp` — generated plain kashta illustration; prompt and provenance in `docs/kashta-artwork.md`.
- `public/video/crepe-intro.mp4` — preserved source footage.
- `public/video/crepe-intro-short.mp4` — actual four-second, silent, fast-start browser clip (~121 KB versus the original ~7.7 MB).

The final menu-collection prompt is documented in `docs/artwork.md`.

Stock sources and licenses are recorded in `docs/stock-media.md`; a public Photography & credits page preserves attribution for the Oreo photo. The exact commercial toppings may differ from the illustrative photography.

## Performance

- Hero WebP: approximately 105 KB (source PNG: 2.3 MB).
- Product images use native lazy loading, asynchronous decoding and fixed display frames.
- Fonts are bundled locally: no Google Fonts request or external image requests at runtime.
- Animations use opacity/transforms and reveal each card once; no continuously moving banner or idle animation loop.
- Intro is skippable, replays on reload, and is bypassed for reduced motion/data-saving mode. It does not require session storage. Playback failure reveals the menu.
- Re-export optimized media with `node scripts/optimize-media.mjs`. This requires the `ffmpeg-static` binary installed by its package installation script; it is not needed to run or build the already-exported site.
- Browser regression coverage additionally checks all 21 images, actual intro playback/automatic dismissal, denied browser storage, and background motion preferences.
