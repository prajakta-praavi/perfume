import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { FragranceCard } from "@/components/FragranceCard";
import { fragrances, getFragrance } from "@/data/fragrances";
import { CinematicMotion } from "@/components/CinematicMotion";

export const Route = createFileRoute("/fragrances/$slug")({
  loader: ({ params }) => {
    const fragrance = getFragrance(params.slug);
    if (!fragrance) throw notFound();
    return { fragrance };
  },
  head: ({ loaderData }) => {
    const fragrance = loaderData?.fragrance;
    const title = fragrance ? `${fragrance.name} — Sylva` : "Fragrance — Sylva";
    const description = fragrance
      ? `${fragrance.tagline}. ${fragrance.description}`
      : "Hand-composed botanical eau de parfum from the Sylva atelier.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: fragrance?.tagline ?? description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: FragrancePage,
});

function FragrancePage() {
  const { fragrance } = Route.useLoaderData();
  const [sizeIndex, setSizeIndex] = useState(0);
  const size = fragrance.sizes[sizeIndex] ?? { ml: 50, price: "—" };
  const related = fragrances.filter((f) => f.slug !== fragrance.slug);

  const pyramid = [
    { label: "Top notes", list: fragrance.notes.top },
    { label: "Heart notes", list: fragrance.notes.heart },
    { label: "Base notes", list: fragrance.notes.base },
  ];

  return (
    <CinematicMotion>
      <section data-scroll-section="product-hero" className="pt-28 pb-20 md:pt-36">
        <div className="container-lux">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <Link to="/collections" className="link-gold uppercase tracking-[0.3em]">
              Collections
            </Link>
            <span className="mx-3 text-gold/60">/</span>
            <span className="uppercase tracking-[0.3em] text-foreground/60">{fragrance.name}</span>
          </nav>

          <div className="mt-10 grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div
              key={fragrance.slug}
              data-image-reveal
              className="bottle-stage card-media aspect-[4/5] self-start lg:sticky lg:top-28"
            >
              <img
                src={fragrance.cutout}
                alt={`${fragrance.name} — ${fragrance.tagline}`}
                width={640}
                height={960}
                className="bottle-cutout h-full w-full object-contain p-8"
              />
            </div>

            <div>
              <p className="eyebrow">
                {fragrance.collection} · {fragrance.concentration}
              </p>
              <h1 className="display-2 mt-4">{fragrance.name}</h1>
              <p className="mt-4 font-display text-2xl italic text-gold">{fragrance.tagline}</p>
              <p className="lede mt-6">{fragrance.description}</p>

              <div className="mt-10 border-t border-border pt-8">
                <p className="text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">
                  Select size
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {fragrance.sizes.map((s, i) => (
                    <button
                      key={s.ml}
                      type="button"
                      onClick={() => setSizeIndex(i)}
                      aria-pressed={i === sizeIndex}
                      className={
                        i === sizeIndex
                          ? "border border-gold bg-gold/10 px-5 py-2.5 text-[0.68rem] uppercase tracking-[0.25em] text-gold"
                          : "border border-foreground/20 px-5 py-2.5 text-[0.68rem] uppercase tracking-[0.25em] text-foreground/70 transition-colors duration-300 hover:border-gold/60 hover:text-gold"
                      }
                    >
                      {s.ml} ml — {s.price}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-5">
                <button type="button" className="btn-lux-solid">
                  Acquire — {size.price}
                </button>
                <p className="text-xs text-muted-foreground">
                  Two 2 ml samples of your choosing with every order.
                </p>
              </div>

              <div className="mt-12 border-t border-border pt-10">
                <p className="eyebrow">Olfactory Pyramid</p>
                <dl className="mt-7 grid gap-8 sm:grid-cols-3">
                  {pyramid.map((tier) => (
                    <div key={tier.label}>
                      <dt className="text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">
                        {tier.label}
                      </dt>
                      <dd className="mt-3 text-sm leading-relaxed text-foreground/85">
                        {tier.list.join(" · ")}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-10 border-t border-border pt-8">
                <p className="eyebrow">Key Botanicals</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {fragrance.ingredients.map((name) => (
                    <span
                      key={name}
                      className="border border-gold/40 px-4 py-2 text-[0.62rem] uppercase tracking-[0.25em] text-gold/90"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        data-scroll-section="product-story"
        className="bg-cream py-24 text-cream-foreground md:py-32"
      >
        <div className="container-narrow text-center">
          <p className="eyebrow">The Composition</p>
          <p className="mx-auto mt-9 max-w-3xl font-display text-2xl leading-relaxed font-light md:text-3xl">
            {fragrance.story}
          </p>
        </div>
      </section>

      <section data-scroll-section="related" className="py-24 md:py-32">
        <div className="container-lux">
          <SectionHeading eyebrow="Continue Exploring" title="More from the forest" />
          <div className="mt-14 grid gap-10 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
            {related.map((f) => (
              <FragranceCard key={f.slug} fragrance={f} />
            ))}
          </div>
        </div>
      </section>
    </CinematicMotion>
  );
}
