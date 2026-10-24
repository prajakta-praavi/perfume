import { Link } from "@tanstack/react-router";
import { fragrances, getFragrance } from "@/data/fragrances";

export function SignatureShowcase() {
  const signature = getFragrance("vetiver-noir");
  if (!signature) return null;

  const pyramid = [
    { label: "Top notes", list: signature.notes.top },
    { label: "Heart notes", list: signature.notes.heart },
    { label: "Base notes", list: signature.notes.base },
  ];

  return (
    <section
      data-scroll-section="signature-showcase"
      className="cinematic-showcase bg-cream py-24 text-cream-foreground md:py-32"
    >
      <div
        data-showcase-stage
        className="container-lux grid items-center gap-14 lg:grid-cols-2 lg:gap-20"
      >
        <div data-showcase-media className="group relative mx-auto w-full max-w-lg">
          <div
            aria-hidden
            className="absolute -top-4 -left-4 h-full w-full border border-gold/60 transition-transform duration-500 group-hover:-translate-y-1 group-hover:-translate-x-1"
          />
          <div className="bottle-stage bottle-stage-cream card-media relative aspect-[4/5]">
            <img
              data-showcase-image
              src={signature.cutout}
              alt={`${signature.name} — ${signature.tagline}`}
              loading="lazy"
              width={640}
              height={960}
              className="bottle-cutout h-full w-full object-contain p-8"
            />
          </div>
        </div>

        <div>
          <p className="eyebrow">Signature Composition</p>
          <h2 className="display-2 mt-5">{signature.name}</h2>
          <p className="mt-4 font-display text-2xl italic text-cream-foreground/70">
            {signature.tagline}
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream-foreground/75 md:text-lg">
            {signature.description}
          </p>

          <dl className="mt-10 grid gap-8 border-t border-cream-foreground/15 pt-8 sm:grid-cols-3">
            {pyramid.map((tier) => (
              <div key={tier.label}>
                <dt className="text-[0.62rem] uppercase tracking-[0.3em] text-cream-foreground/50">
                  {tier.label}
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-cream-foreground/85">
                  {tier.list.join(" · ")}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link to="/fragrances/$slug" params={{ slug: signature.slug }} className="btn-lux-dark">
              Discover {signature.name}
            </Link>
            <p className="text-sm text-cream-foreground/60">
              From {signature.sizes[0]!.price} · {signature.sizes[0]!.ml} ml
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export const allFragrances = fragrances;
