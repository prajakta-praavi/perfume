import { Link } from "@tanstack/react-router";
import heroForest from "@/assets/dummy/forest-landscape.jpg";
import heroBottle from "@/assets/dummy/vetiver-noir.webp";

export function Hero() {
  return (
    <section
      data-scroll-section="hero"
      className="relative flex min-h-svh items-center justify-center overflow-hidden"
    >
      <div data-hero-depth className="absolute inset-0">
        <img
          data-hero-image
          src={heroForest}
          alt="Golden dawn over a misty forest valley"
          width={1600}
          height={900}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-forest-deep/70 via-forest-deep/25 to-background"
      />
      <div
        data-hero-atmosphere
        aria-hidden
        className="hero-atmosphere absolute inset-0 pointer-events-none"
      />

      <div className="hero-composition container-lux">
        <div data-hero-content className="hero-copy relative flex flex-col">
          <p data-hero-reveal className="eyebrow">
            Maison de Parfum Botanique
          </p>
          <h1 className="display-hero mt-8 text-foreground">
            <span className="hero-line-mask">
              <span data-hero-line>The Forest,</span>
            </span>
            <br />
            <span className="hero-line-mask">
              <span data-hero-line>Bottled</span>
            </span>
          </h1>
          <div data-hero-reveal className="hairline mt-10 max-w-xs" />
          <p
            data-hero-reveal
            className="mt-8 max-w-xl text-base leading-relaxed text-foreground/80 md:text-lg"
          >
            Rare botanicals, wild-harvested and composed by hand into perfumes of quiet drama.
          </p>
          <div data-hero-reveal className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
            <Link to="/collections" className="btn-lux-solid">
              Explore the Collections
            </Link>
            <Link to="/story" className="btn-lux-outline">
              Our Story
            </Link>
          </div>
        </div>
        <div data-hero-bottle-depth className="hero-bottle relative">
          <div aria-hidden className="hero-bottle-halo absolute inset-0" />
          <div data-hero-bottle-float className="h-full w-full">
            <img
              data-hero-bottle
              src={heroBottle}
              alt="Sylva Vetiver Noir botanical perfume in an emerald glass bottle"
              width={640}
              height={960}
              fetchPriority="high"
              className="bottle-cutout relative h-full w-full object-contain"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="text-[0.6rem] uppercase tracking-[0.4em] text-foreground/60">Scroll</span>
        <span className="h-12 w-px bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}
