# Verdant Velvet Perfume House

Create a premium luxury herbal perfume brand website inspired by cinematic fragrance campaigns. Use React, TypeScript, Vite and Tailwind CSS. Design a full-screen nature-inspired hero section with a central perfume bottle, elegant editorial typography, dark forest-green, cream and gold palette. Include fragrance collections, ingredient storytelling, premium product showcase, brand story, product details pages, and elegant footer. Make all sections fully responsive. Use reusable components and high-quality image placeholders that can be replaced later. Focus on polished static UI and subtle hover effects only. Structure components so GSAP ScrollTrigger, parallax, pinned sections and advanced cinematic transitions can be added later in Codex. Avoid implementing complex animations now. Do not add backend, database or payment integration.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://verdant-velvet-perfume-house.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/39da9e09-47e4-4004-8bdf-1c65507be21a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Cinematic motion

GSAP and ScrollTrigger animate each hydrated page through `CinematicMotion` and
`src/lib/cinematic-motion.ts`. Hero entrances, text and card reveals use transforms
and opacity. Dedicated image layers keep parallax separate from hover transforms.
Images retain their existing aspect ratios and dimensions.

Lenis smooths desktop wheel scrolling on GSAP's ticker. Touch scrolling stays native.
The signature showcase pins only with a fine pointer, width of at least 1024 px and
height of at least 700 px. Its 60 vh travel is reserved in CSS; keep that value aligned
with the ScrollTrigger end distance when tuning it. Other viewports keep the normal
section flow and product pages retain their existing sticky images.

Reduced motion disables entrances, parallax, pinning and Lenis, including when the
preference changes while the page is open. Route changes and unmounts revert GSAP
contexts, remove listeners, cancel pending refreshes and destroy Lenis.

Validation: `npm run build`, `npx tsc --noEmit`, `npm test`, and `npm run test:motion`.
The motion smoke test needs the dev server on port 8080 and an installed Microsoft
Edge browser. Set `APP_URL` for another server or `PLAYWRIGHT_CHANNEL=chrome` for
Chrome. It checks desktop pinning, resizing, mobile overflow, reduced motion,
repeated SPA navigation, product size selection and browser errors. Screenshots are
written to `artifacts/motion/`.

The homepage now includes a multi-bottle scene at `/#bottle-showcase`. On desktop,
native sticky positioning reserves four viewport heights for the scene; GSAP scrubs
the bottles through scale, translation, perspective tilt and foreground blur. Product
captions and links follow the featured bottle, and the four numbered buttons scroll
to each composition. `src/lib/bottle-gallery-motion.ts` owns this choreography inside
the existing route context. Mobile and reduced-motion users get a native horizontal
product rail with an individual link for every fragrance. Hero floating and signature
tilt use separate wrappers from their entrance/scroll transforms.

Run `npm run test:bottles` with the dev server running to verify the four product
states, intermediate depth effects, reverse scroll, numbered controls, linked product
navigation, cleanup, reduced motion and mobile horizontal scrolling.
