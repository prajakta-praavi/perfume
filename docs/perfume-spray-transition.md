# Perfume spray transition

The existing homepage now flows from `Hero` directly into
`PerfumeSprayTransition`, then into the existing featured fragrance section. The
two collection banners and their introduction were removed from the homepage at
the user's request. Other sections, product data, navigation, footer and routes are preserved.
Preview the new scene at `http://localhost:8080/#perfume-spray` and scroll down.

## Files

| File | Responsibility |
| --- | --- |
| `src/components/sections/PerfumeSprayTransition.tsx` | Accessible section, bottle/cap/nozzle layers, mist canvases, botanical cutouts, final headline, working chapter link and critical image preloads. |
| `src/lib/perfume-spray-motion.ts` | One reversible 0–100 GSAP master timeline and its ScrollTrigger pin; responsive flower count; phase/progress updates and scoped cleanup. |
| `src/lib/perfume-mist-renderer.ts` | Decodes one transparent sprite atlas, blends neighboring frames, positions the jet at the nozzle, and renders the expanding mist into a bounded canvas. |
| `src/styles/perfume-spray.css` | Scene layout, pre-reserved pin travel, mobile sizing and a static reduced-motion/no-script presentation. |
| `src/lib/cinematic-motion.ts` | Integrates the new scene with the existing route media context, Lenis ticker and cleanup; excludes its text from generic reveal effects. |
| `src/routes/index.tsx` | Inserts the scene after the hero, removes the collection preview, and anchors the existing featured fragrances at `chapters` for the skip link. |
| `scripts/verify-spray.mjs` | Browser verification of the scene and actual wheel/touch input. |
| `scripts/verify-motion.mjs` | Updates existing pin assertions to distinguish signature and spray scenes. |
| `eslint.config.js` | Excludes local package caches and generated QA/build artifacts from linting. |
| `package.json` | Adds `test:spray`. No runtime dependency was added. |

## Timeline

| Scroll | Result |
| --- | --- |
| 0–20% | Existing Sylva cap artwork and matching bottle move from the hero-side position toward center; cap lifts away to expose the atomizer. The hero bottle is outside the viewport before the new bottle appears. |
| 20–35% | Independent actuator moves down, a fine droplet jet appears at the orifice, and the actuator releases. |
| 35–55% | Mist expands in depth across the viewport; the bottle and dark environment fade through it into the botanical environment. |
| 55–80% | Mist clears while individually photographed-style jasmine, rose-petal, fern and sage cutouts emerge and drift at different speeds and rotations. |
| 80–100% | “The Essence of the Forest” and the short brand description reveal; the botanical scene settles and the pin ends at the section boundary. |

The duration is driven entirely by scroll; the spray does not play in an automatic
or infinite loop. Scroll upward to reverse it. Desktop reserves 600 svh including
the viewport; mobile reserves 440 svh. `pinSpacing: false` uses that reserved travel
without adding an additional gap. Normal touch scrolling remains native and the
existing desktop Lenis instance continues to feed ScrollTrigger.

## Assets and honest limitations

Existing assets reused:

- `src/assets/dummy/vetiver-noir.webp`: original Sylva cap artwork.
- `src/assets/dummy/forest-landscape.jpg`: matches the existing hero environment.

New optimized assets are saved under `src/assets/spray/`:

| Asset | Description | Approximate bytes |
| --- | --- | --- |
| `vetiver-atomizer.webp` | Edit of the existing Sylva bottle with cap removed; the body and branding are preserved. The actuator is independently clipped from the same image. 640 × 960. | 110,162 |
| `mist-desktop.webp` | Transparent generated 4 × 4 atlas: 16 frames, 1536 × 1024. | 695,598 |
| `mist-mobile.webp` | Lower-resolution version of the same atlas, 768 × 512. | 139,972 |
| `botanical-atlas.webp` | Transparent 2 × 2 jasmine / rose-petal / fern / sage atlas, 1024 × 1024. | 197,314 |
| `botanical-forest.jpg` | Luminous botanical forest plate, 1600 × 900. | 425,626 |

These assets were made with the built-in image generation tool. Exact prompts and
edit-target details are saved in `docs/spray-generation-prompts.json`. Optimized
delivery files are included in the project. High-resolution working PNGs are also
retained locally under the ignored `artifacts/spray-source/` directory.

**The mist is an AI-generated, photograph-style image sequence, not recorded
high-speed atomizer footage.** Fractional frame blending smooths its 16 frames, but
this is still an illustrative VFX asset. A filmed/physically simulated hero-quality
mist sequence and physically accurate actuator photography were not provided.
The expanding full-screen mist is art-directed compositing of that sequence, not a
fluid simulation. No real footage or supplied production imagery is claimed.

For a final production footage upgrade, supply a transparent spray pulse sequence
matching the current 4 × 4 grid: source at 12% width / 50% height, direction right,
neutral-white droplets, no background, temporal order left-to-right/top-to-bottom.
Replace both mist WebPs. A different frame count/grid requires changing the renderer's
atlas constants. The nozzle coordinates are 54.7% × 11.3% of the bottle image; update
both CSS and renderer if replacing the bottle with different framing.

## Performance and accessibility

- Canvas rendering runs only when the scrubbed playhead or geometry changes; no
  independent perpetual requestAnimationFrame loop.
- Mobile uses six elements instead of twelve, a smaller mist atlas, two mist depth
  layers instead of three, and a DPR cap of 1.
- Desktop caps DPR at 1.5 and full-screen backing storage at 2.4 million pixels.
- Critical atomizer and device-appropriate mist atlas are preloaded. There are no
  per-frame React state updates; DOM phase text changes only at stage boundaries.
- Reduced motion removes the pin, mist and moving flower layers, leaving a readable
  botanical section and working chapter link. The preference can change live.
- Cleanup removes refresh listeners, disconnects ResizeObserver, cancels pending
  rendering, releases decoded images/backing stores, and reverts the route's GSAP
  context. Missing mist assets do not prevent the final botanical scene or skip link.

## Validation

Run the local server, then `npm run test:spray`. It covers insertion, five stages,
pressed-nozzle alignment within three pixels, nonempty canvas frames, wheel and
touch input, reverse frames, geometry refresh, pin release, reduced motion, mobile
resolution/count, navigation cleanup and runtime errors. Screenshots are written
to `artifacts/motion/spray-*.png`.

Production build and TypeScript checks pass. Changed application files pass targeted
ESLint. Full-project lint reports two existing Prettier errors in unchanged
`Navbar.tsx` and `Footer.tsx`, plus existing Fast Refresh warnings. Those files are
intentionally preserved as requested.
