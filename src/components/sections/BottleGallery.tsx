import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { fragrances } from "@/data/fragrances";

/** The route enhances every viewport; reduced motion keeps the static product rail. */
export function BottleGallery() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const fragrance = fragrances[active] ?? fragrances[0]!;

  useLayoutEffect(() => {
    const node = root.current;
    if (!node) return;
    const onChange = (event: Event) => {
      if (event instanceof CustomEvent && Number.isInteger(event.detail)) {
        setActive(Math.max(0, Math.min(fragrances.length - 1, event.detail)));
      }
    };
    node.addEventListener("bottle:change", onChange);
    return () => node.removeEventListener("bottle:change", onChange);
  }, []);

  return (
    <div
      ref={root}
      id="bottle-showcase"
      data-bottle-gallery
      className="bottle-gallery mt-16 md:mt-20"
    >
      <div className="bottle-gallery-stage">
        <p className="bottle-gallery-heading eyebrow">Sylva · Eau de Parfum</p>
        <div aria-hidden className="bottle-gallery-floor" />
        <div aria-hidden data-gallery-light className="bottle-gallery-light" />
        <div className="bottle-gallery-items">
          {fragrances.map((product, index) => (
            <figure key={product.slug} data-bottle-item className="bottle-gallery-item">
              <div data-bottle-silhouette className="bottle-gallery-silhouette">
                <img
                  src={product.cutout}
                  alt={`${product.name} botanical perfume bottle`}
                  width={640}
                  height={960}
                  loading="lazy"
                  className="bottle-cutout h-full w-full object-contain"
                />
              </div>
              <figcaption className="bottle-gallery-static-caption">
                <span className="eyebrow">0{index + 1}</span>
                <h3 className="mt-3 font-display text-2xl">{product.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{product.tagline}</p>
                <Link
                  to="/fragrances/$slug"
                  params={{ slug: product.slug }}
                  className="link-gold mt-5 inline-block text-xs"
                >
                  Discover · {product.sizes[0]!.price}
                </Link>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="bottle-gallery-caption" aria-live="polite" aria-atomic="true">
          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-gold">
            {fragrance.tagline}
          </p>
          <h3 className="mt-2 font-display text-4xl font-light">{fragrance.name}</h3>
          <Link
            to="/fragrances/$slug"
            params={{ slug: fragrance.slug }}
            className="link-gold mt-3 inline-block text-xs uppercase tracking-[0.18em]"
          >
            Discover · {fragrance.sizes[0]!.price}
          </Link>
        </div>
        <div className="bottle-gallery-controls" role="group" aria-label="Featured fragrance">
          {fragrances.map((product, index) => (
            <button
              key={product.slug}
              type="button"
              aria-label={`Show ${product.name}`}
              aria-pressed={active === index}
              onClick={() =>
                root.current?.dispatchEvent(new CustomEvent("bottle:navigate", { detail: index }))
              }
              className="bottle-gallery-step"
            >
              <span className="bottle-gallery-step-line" />
              <span>0{index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
