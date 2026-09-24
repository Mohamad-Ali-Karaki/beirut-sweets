# Modern identity revision

Replaces the rejected retro/outlined treatment. Active stylesheet: `src/modern.css`; `src/refresh.css` is no longer imported and remains as the previous iteration.

The new direction uses soft ivory and apricot, restrained green, clean sentence-case typography, generous spacing, rounded inset photos, and subtle shadows instead of heavy borders, sticker shapes or offset black shadows. Existing category photographs, item prices, cart behavior, swipe gestures, and intro replay remain intact.

## Logo

Original vector artwork: `public/images/beirut-brand-mark.svg`.

A lowercase **b** combines with a citrus cross-section and a fresh green leaf. The apricot-to-orange fruit and green foliage connect it to the shop's drinks. Header/footer wordmark is rendered as live text for legibility; the symbol is also used in the intro and favicon. Created directly as SVG, not AI-generated raster artwork. No external font or image request is needed for it.

## Checks

Production build and six cart/message unit tests passed. Screenshots reviewed at desktop and mobile sizes, including 320px and 768px layout checks, with no horizontal page overflow. Browser coverage exercises logo loading, menu, search, cart, WhatsApp handoff, media, intro replay and reduced motion. Tests intercept WhatsApp and do not send real orders.
