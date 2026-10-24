# Perfume reel reference analysis

Reference: user-supplied 21.38-second video, 720 × 1280, filmed from a laptop screen.
Frame sheets: `artifacts/reference/sections.jpg` and `artifacts/reference/product-motion.jpg`.
These observations describe the visible result. The original site's source code and
input events are unavailable, so implementation mechanisms below are proposals rather
than claims about the original technology.

## Visible sequence (approximate video timestamps)

| Time | Section | Visible treatment |
| --- | --- | --- |
| 0–2 s | Nature hero | Landscape at sunset, a large botanical perfume bottle in front, oversized white type crossing the composition, compact green navigation bar. |
| 2–4 s | Brand introduction | Cream background, fragrance vocabulary strip, spacious text with botanical imagery embedded among the words. |
| 4–10 s | Herbal perfume collection | Dark stage with soft horizontal lighting; several isolated bottles at different sizes and depths. The featured bottle advances and enlarges, then exits while the next comes forward. Name, price and button update below it. |
| 10–14 s | Scent with character | Cream stage with an amber bottle; botanical information cards move and change orientation in front of/alongside the bottle. |
| 14–16 s | Botanical gallery | Dark green area with tall flower photographs and labels, presented as a horizontal series. |
| 16–18 s | Daily scent ritual | Bottle inside a tall cream arch, large editorial heading and short instructional steps on green. |
| 18–19 s | Information / FAQ | Quiet cream block separating the product narrative from the closing promotion. |
| 19–21 s | Closing CTA and footer | Wide nature artwork with a large white headline, followed by a dark ending. |

## What makes the reference distinctive

- Product silhouettes are isolated from their backgrounds. The bottle can move
  independently, overlap typography and pass in front of neighboring products.
- Depth comes from coordinated translation, scale, opacity and foreground blur.
  It looks dimensional; the recording does not establish whether actual 3D models
  are used. Cutout images with GSAP and CSS perspective can reproduce much of it.
- The collection area stays visually stable while products exchange the featured
  position. This suggests a pinned scroll sequence or controlled carousel. The
  recording alone cannot conclusively distinguish those input mechanisms.
- Cream and deep green alternate between scenes, giving the composition rhythm.
- Wide editorial layouts, limited copy and large whitespace give products room.
- Motion changes the composition and the featured product, rather than merely
  revealing otherwise static sections.
- The navigation and corner contact shortcut remain visible across multiple scenes.

## Comparison with the current Sylva project

The current project already supplies the forest/cream/gold palette, fragrance data,
product routes, editorial headings, GSAP lifecycle cleanup, responsive variants and
reduced-motion handling. These can be retained.

The main missing elements are a multi-product depth sequence, independently moving
bottle artwork, a bottle-and-card scene and the reference's horizontally composed
botanical gallery. Increasing fade distances and parallax alone will not produce
the same result.

The existing hero artwork combines the bottle and scenery in one image, while the
product photography includes its surrounding scene. Applying transforms to these
images moves the entire photograph. A separate background and transparent bottle
assets are necessary for the reference's independent product motion.

## Proposed implementation using the existing stack

1. Establish a consistent set of four transparent bottle images for Sylva's
   existing fragrances, plus a separate landscape background. Preserve product
   names, descriptions and destinations.
2. Recompose the hero into background, atmosphere, bottle and text layers, with
   independent scroll speeds and a slow, coordinated entrance.
3. Add a desktop collection stage with a pinned ScrollTrigger timeline. Move the
   active bottle forward and enlarge it; move the outgoing bottle off stage and
   bring the incoming bottle from depth. Update the associated product details at
   the corresponding scene boundary. Keep accessible product links available.
4. Compose the cream storytelling scene using a separate bottle layer and existing
   fragrance note cards. Give the cards independent perspective and staggered
   transitions without making the copy difficult to read.
5. Present the existing ingredients as a horizontal desktop narrative. Keep the
   current vertical or swipeable treatment on smaller screens.
6. Retain the existing brand story, quote and detail routes, using the cream/green
   scene rhythm to make their transitions coherent with the new composition.

## Constraints and validation

- Preserve the user's existing content, routes and responsive behavior. Reuse
  current brand material instead of copying the reference brand's text or labels.
- Reserve desktop stage travel before hydration. Avoid pinning a tall text block
  outside the available viewport.
- Keep touch scrolling native. Use a simpler mobile composition rather than
  compressing the desktop depth sequence into a narrow viewport.
- Provide a visible static product layout for reduced motion; no hidden content
  should depend on completing an animation.
- Keep transforms on separate wrappers so hover, entrance and scroll animations
  do not write to the same transform.
- Reuse route-scoped contexts and clean up triggers, Lenis, frame callbacks and
  listeners on navigation and preference changes.
- Verify actual intermediate animation states, reverse scrolling, product detail
  synchronization, keyboard access, resize, browser back, reduced motion, layout
  shifts and production build output.

No website implementation was changed during this analysis.
