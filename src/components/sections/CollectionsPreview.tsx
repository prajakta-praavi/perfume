import { Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/SectionHeading";
import { collections, getFragrance } from "@/data/fragrances";

export function CollectionsPreview() {
  return (
    <section data-scroll-section="collections-preview" className="py-24 md:py-32">
      <div className="container-lux">
        <SectionHeading
          eyebrow="Chapter One & Two"
          title="Two collections, drawn from one wood"
          description="Every Sylva fragrance belongs to a chapter — a different light falling through the same ancient canopy."
          align="center"
        />
      </div>

      <div className="mt-16 flex flex-col md:mt-20">
        {collections.map((collection) => {
          const lead = getFragrance(collection.lead);
          if (!lead) return null;
          return (
            <Link
              key={collection.name}
              to="/collections"
              data-scroll-section="collection-banner"
              data-parallax-frame
              className="group relative block h-[70vh] min-h-105 overflow-hidden"
            >
              <div data-parallax-layer className="parallax-layer absolute inset-0">
                <img
                  src={lead.image}
                  alt={`${collection.name} — ${lead.name}`}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-forest-deep/95 via-forest-deep/35 to-transparent"
              />
              <div className="container-lux relative z-10 flex h-full flex-col justify-end pb-14 md:pb-20">
                <p className="eyebrow">Chapter {collection.numeral}</p>
                <h3 className="display-2 mt-4 max-w-xl text-foreground">{collection.name}</h3>
                <p className="lede mt-4 text-foreground/80">{collection.description}</p>
                <span className="link-gold mt-7 w-fit text-[0.7rem] uppercase tracking-[0.3em]">
                  Enter the collection
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
