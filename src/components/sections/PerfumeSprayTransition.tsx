import cappedBottle from "@/assets/dummy/vetiver-noir.webp";
import darkForest from "@/assets/dummy/forest-landscape.jpg";
import atomizer from "@/assets/spray/vetiver-atomizer.webp";
import botanicalForest from "@/assets/spray/botanical-forest.jpg";
import botanicalAtlas from "@/assets/spray/botanical-atlas.webp";
import mistDesktop from "@/assets/spray/mist-desktop.webp";
import mistMobile from "@/assets/spray/mist-mobile.webp";
import type { CSSProperties } from "react";

const botanicals = [
  { x: 9, y: 23, kind: 0, rotation: -18, size: 160 },
  { x: 84, y: 28, kind: 1, rotation: 35, size: 130 },
  { x: 18, y: 72, kind: 2, rotation: -35, size: 210 },
  { x: 77, y: 77, kind: 0, rotation: 16, size: 180 },
  { x: 43, y: 15, kind: 3, rotation: 68, size: 120 },
  { x: 90, y: 55, kind: 2, rotation: -22, size: 170 },
  { x: 5, y: 49, kind: 1, rotation: -42, size: 110 },
  { x: 62, y: 85, kind: 3, rotation: 24, size: 135 },
  { x: 65, y: 12, kind: 0, rotation: 55, size: 100 },
  { x: 30, y: 87, kind: 1, rotation: -60, size: 140 },
  { x: 96, y: 10, kind: 3, rotation: 45, size: 190 },
  { x: 1, y: 89, kind: 0, rotation: -15, size: 200 },
];

/** Presentation stays usable without animation. The route owns the GSAP lifecycle. */
export function PerfumeSprayTransition() {
  return (
    <section
      id="perfume-spray"
      data-perfume-spray
      data-mist-desktop={mistDesktop}
      data-mist-mobile={mistMobile}
      className="perfume-spray"
      aria-labelledby="forest-essence-title"
    >
      <link
        rel="preload"
        as="image"
        href={atomizer}
        media="(prefers-reduced-motion: no-preference)"
      />
      <link
        rel="preload"
        as="image"
        href={mistDesktop}
        media="(min-width: 768px) and (prefers-reduced-motion: no-preference)"
      />
      <link
        rel="preload"
        as="image"
        href={mistMobile}
        media="(max-width: 767px) and (prefers-reduced-motion: no-preference)"
      />
      <noscript>
        <style>{".perfume-spray{height:auto!important}.spray-scene{min-height:75svh}"}</style>
      </noscript>
      <div data-spray-scene className="spray-scene">
        <div className="spray-environment" aria-hidden>
          <img
            data-spray-dark
            src={darkForest}
            alt=""
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            className="spray-background spray-dark-background"
          />
          <img
            data-spray-forest
            src={botanicalForest}
            alt=""
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            className="spray-background spray-botanical-background"
          />
          <div data-spray-shade className="spray-shade" />
        </div>

        <p data-spray-intro className="spray-intro eyebrow">
          Sylva · Vetiver Noir
        </p>
        <div className="spray-product-anchor" aria-hidden>
          <div data-spray-bottle className="spray-bottle">
            <img
              src={atomizer}
              alt=""
              width={640}
              height={960}
              decoding="async"
              className="spray-product-image spray-bottle-body"
            />
            <img
              data-spray-nozzle
              src={atomizer}
              alt=""
              width={640}
              height={960}
              decoding="async"
              className="spray-product-image spray-nozzle"
            />
            <img
              data-spray-cap
              src={cappedBottle}
              alt=""
              width={640}
              height={960}
              decoding="async"
              className="spray-product-image spray-cap"
            />
            <div className="spray-emitter-anchor">
              <div data-spray-emitter-press>
                <canvas data-spray-jet className="spray-jet" />
              </div>
            </div>
          </div>
        </div>

        <canvas data-spray-cover className="spray-cover" aria-hidden />
        <div className="spray-flower-field" aria-hidden>
          {botanicals.map((botanical, index) => (
            <span
              key={index}
              data-spray-botanical
              data-botanical-index={index}
              className={`spray-botanical spray-botanical-${botanical.kind}`}
              style={
                {
                  left: `${botanical.x}%`,
                  top: `${botanical.y}%`,
                  width: `clamp(70px, ${botanical.size / 12}vw, ${botanical.size}px)`,
                  aspectRatio: "1",
                  backgroundImage: `url(${botanicalAtlas})`,
                  "--botanical-rotation": `${botanical.rotation}deg`,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <div data-spray-reveal className="spray-reveal container-narrow">
          <p className="eyebrow">From root to reverie</p>
          <h2 id="forest-essence-title" className="display-2 mt-6">
            The Essence of the Forest
          </h2>
          <p className="lede mx-auto mt-6 text-foreground/85">
            A breath of wild botanicals. Roots, leaves and quiet blooms, composed by hand into a
            fragrance that stays with you.
          </p>
        </div>
        <a href="#chapters" className="spray-skip link-gold">
          Continue to the collections <span aria-hidden>↘</span>
        </a>
        <div className="spray-progress" aria-hidden>
          <span data-spray-step>01 / 05</span>
          <div className="spray-progress-track">
            <div data-spray-progress className="spray-progress-fill" />
          </div>
        </div>
      </div>
    </section>
  );
}
