# Media provenance

All browser assets are served locally as WebP or MP4; no external media request is needed at runtime. Photos are representative, not verified Beirut Sweets servings. The original files are preserved.

## Real stock photography

Pexels assets are provided under the [Pexels license](https://www.pexels.com/license/). Sources below were checked against their named subjects and visually inspected. Display framing may crop originals.

| Item / usage | Photo source |
| --- | --- |
| Fruit Pieces Cocktail | https://www.pexels.com/photo/8042602/ |
| Blended Cocktail | https://www.pexels.com/photo/13273194/ (representative strawberry fruit blend) |
| Avocado | https://www.pexels.com/photo/11009209/ |
| Pineapple | https://www.pexels.com/photo/5817623/ |
| Strawberry | https://www.pexels.com/photo/4214381/ |
| Lemonade | https://www.pexels.com/photo/18142613/ |
| Pomegranate | https://www.pexels.com/photo/18142601/ |
| Orange | https://www.pexels.com/photo/8882541/ |
| Cantaloupe | https://www.pexels.com/photo/8146360/ |
| Berry | https://www.pexels.com/photo/9251276/ |
| Apple & Carrot | https://www.pexels.com/photo/12969366/ (representative carrot blend) |
| Chocolate Milkshake | https://www.pexels.com/photo/9730380/ |
| Banana Milkshake | https://www.pexels.com/photo/4051764/ |
| Nutella Crepe | https://www.pexels.com/photo/33017545/ |
| Kinder Crepe | https://www.pexels.com/photo/30910215/ (representative chocolate crepe, not verified Kinder topping) |
| Crunchy Crepe / story | https://www.pexels.com/photo/36048400/ (representative chocolate crepe, not verified wafer topping) |
| Intro video | https://www.pexels.com/video/6327749/ |

- Oreo Crepe: David Berkowitz, [Oreo Crepe — Eastern Market — October 2010](https://commons.wikimedia.org/wiki/File:Oreo_Crepe_-_Eastern_Market_-_Washington_DC_-_United_States_Capital_-_October_2010_(5132622445).jpg), [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/). Resized, converted to WebP and cropped by CSS. Attribution and license are exposed publicly at `/media-credits.html`, linked from the footer. No endorsement implied.
- Lotus Crepe: Andy Li, [Biscoff spread & biscuits — Oui Crêperie, 2024](https://commons.wikimedia.org/wiki/File:Biscoff_spread_%26_biscuits_-_Oui_Cr%C3%AAperie_2024-03-18.jpg), [CC0](https://creativecommons.org/publicdomain/zero/1.0/). Resized and converted to WebP.

## Illustrations

Hero, Fekhfakhina and Kashta & Fruits originate from the earlier built-in image-generation assets. Plain kashta was generated separately so it does not incorrectly show fruit: see `kashta-artwork.md` for its final prompt and project paths. These are not real restaurant photographs.

Every one of the 21 products has an explicit unique image path. Exact recipes/servings, especially Kinder and Crunchy toppings, still require approved photographs from the shop. Ingredient/allergy information should be verified by the restaurant.

## Performance exports

`scripts/optimize-media.mjs` creates smaller WebP copies, extracts the two retained contact-sheet items mechanically, and exports the silent four-second 960px fast-start MP4 and its poster. Original files are not overwritten by compression.
