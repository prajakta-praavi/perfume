# Sylva dummy assets

Created with the built-in image generation tool for the user's local reference
prototype. These are illustrative product mockups, not photographs of actual stock.

## Files and replacement

All deliverables are saved in `src/assets/dummy/`. Original PNGs are retained beside
the optimized delivery files. The browser uses only the delivery files below.

| File | Purpose | Delivery size |
| --- | --- | --- |
| `vetiver-noir.webp` | Emerald/olive bottle with vetiver roots | 640 × 960, transparent |
| `cedar-smoke.webp` | Amber bottle with cedar detailing | 640 × 960, transparent |
| `sage-reverie.webp` | Pale sage bottle with silver leaves | 640 × 960, transparent |
| `jasmine-fern.webp` | Champagne bottle with jasmine and fern | 640 × 960, transparent |
| `forest-landscape.jpg` | Separate golden-dawn forest environment | 1600 × 900 |

The four browser bottle images are approximately 110–116 KiB each, and the landscape
is approximately 347 KiB. Their source PNGs are not imported into the application.

`src/data/fragrances.ts` maps each product's `cutout` independently from its existing
campaign `image`. Cards, product detail pages and the signature use `cutout`; collection
banners retain the original photographs. The hero imports the landscape and Vetiver
Noir separately, allowing independent entrance and scroll transforms.

To replace the dummy products, export transparent 2:3 WebP images and update the four
cutout imports. Keep the same canvas framing, with the complete bottle inside the
canvas, to avoid unexpected changes in apparent scale. Update descriptive alt text
if the replacement design differs.

## Generation prompt set

Each bottle used this shared brief, followed by its fragrance-specific variation:

> Use case: product-mockup. Create one photorealistic luxury botanical perfume bottle
> cutout for a premium Sylva perfume website. Portrait 2:3 composition. Genuine
> transparent background with alpha, no backdrop, no floor plane, no cast shadow,
> no separate props, no watermarks. One bottle centered and fully visible, bottle
> fills 78% of image height with clear padding all around. Front-facing with a subtle
> three-quarter glass bevel, straight upright, consistent studio rim lighting from
> upper left. Elegant tall faceted glass bottle, softened rectangular shoulders,
> heavy clear glass base, cylindrical brushed champagne-gold cap, small cream paper
> label with thin gold border. Realistic refractive glass and liquid, luxurious
> handcrafted botanical detailing contained inside the glass. Label text only:
> 'SYLVA' and the fragrance name. The cutout will be independently animated on both
> dark forest and cream backgrounds, so keep clean edges and believable material highlights.

- Vetiver: Fragrance name: 'VETIVER NOIR'. Deep emerald green glass and warm olive
  perfume, delicate vetiver roots visible suspended within lower glass; restrained
  dark forest character.
- Cedar: Fragrance name: 'CEDAR & SMOKE'. Amber bronze glass and golden cognac
  perfume, a slender cedar twig subtly suspended within lower glass; warm resinous
  wood character.
- Sage: Fragrance name: 'SAGE REVERIE'. Pale sage green glass and light chartreuse
  perfume, delicate silver sage leaves subtly suspended within lower glass; fresh
  dawn herb character.
- Jasmine: Fragrance name: 'JASMINE & FERN'. Clear pale champagne glass and very light
  golden perfume, a small white jasmine blossom and delicate fern frond subtly
  suspended within lower glass; luminous floral character.

The landscape used:

> Use case: photorealistic-natural. Create a cinematic landscape-only background
> plate for the premium botanical perfume website Sylva. Wide 16:9 landscape. An
> ancient moss-covered forest valley at golden dawn, layered dark emerald hills,
> distant mist, ferns and moss in foreground, shafts of warm sunlight breaking
> through cloud on the right, sophisticated muted forest-green olive and honey
> palette, soft atmospheric depth, quiet luxurious mood, realistically photographed
> medium-format campaign image. Keep the central third open and low contrast to
> later overlay a separate perfume bottle and white editorial typography. No
> products, no bottles, no packaging, no people, no buildings, no text, no logos,
> no watermark. This is the environment layer only.
