import { Link } from "@tanstack/react-router";
import type { Fragrance } from "@/data/fragrances";

interface FragranceCardProps {
  fragrance: Fragrance;
  className?: string;
}

export function FragranceCard({ fragrance, className = "" }: FragranceCardProps) {
  return (
    <Link
      to="/fragrances/$slug"
      params={{ slug: fragrance.slug }}
      data-scroll-section="fragrance-card"
      className={`group block ${className}`}
    >
      <div className="bottle-stage card-media aspect-[4/5]">
        <div data-card-image-layer className="h-full w-full">
          <img
            src={fragrance.cutout}
            alt={`${fragrance.name} — ${fragrance.tagline}`}
            loading="lazy"
            width={640}
            height={960}
            className="bottle-cutout h-full w-full object-contain p-5 transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        </div>
      </div>
      <div className="mt-6 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl font-light tracking-wide text-foreground transition-colors duration-300 group-hover:text-gold">
          {fragrance.name}
        </h3>
        <p className="text-sm text-muted-foreground">from {fragrance.sizes[0]!.price}</p>
      </div>
      <p className="mt-2 text-[0.65rem] uppercase tracking-[0.3em] text-gold/90">
        {fragrance.collection} · {fragrance.concentration}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{fragrance.tagline}</p>
      <div className="mt-4 h-px w-8 bg-gold transition-all duration-500 ease-out group-hover:w-full" />
    </Link>
  );
}
