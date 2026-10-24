import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/SectionHeading";
import { FragranceCard } from "@/components/FragranceCard";
import { collections, getFragrancesByCollection } from "@/data/fragrances";
import { CinematicMotion } from "@/components/CinematicMotion";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "The Collections — Sylva" },
      {
        name: "description",
        content:
          "Two chapters of one forest: The Forest Floor and The Sunlit Glade — hand-composed botanical eau de parfum from the Sylva atelier in Grasse.",
      },
      { property: "og:title", content: "The Collections — Sylva" },
      {
        property: "og:description",
        content:
          "Two chapters of one forest: The Forest Floor and The Sunlit Glade — hand-composed botanical eau de parfum.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CollectionsPage,
});

function CollectionsPage() {
  return (
    <CinematicMotion>
      <section
        data-scroll-section="collections-header"
        className="bg-forest-deep pt-36 pb-20 text-center md:pt-44 md:pb-24"
      >
        <div className="container-lux">
          <p className="eyebrow">The Collections</p>
          <h1 className="display-hero mt-6">Chapters of the Wood</h1>
          <p className="lede mx-auto mt-6 text-center">
            Every Sylva fragrance belongs to a chapter — a different light in the same forest.
          </p>
          <div className="hairline-gold mx-auto mt-10" />
        </div>
      </section>

      {collections.map((collection, index) => (
        <section
          key={collection.name}
          data-scroll-section={`collection-${collection.numeral}`}
          className={`py-20 md:py-28 ${index % 2 === 1 ? "bg-forest/40" : ""}`}
        >
          <div className="container-lux">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">Chapter {collection.numeral}</p>
                <h2 className="display-2 mt-4">{collection.name}</h2>
              </div>
              <p className="lede md:max-w-sm md:text-right">{collection.description}</p>
            </div>
            <div className="mt-14 grid gap-10 sm:grid-cols-2 md:mt-16">
              {getFragrancesByCollection(collection.name).map((fragrance) => (
                <FragranceCard key={fragrance.slug} fragrance={fragrance} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <section data-scroll-section="collections-outro" className="py-24 text-center">
        <div className="container-lux">
          <SectionHeading
            eyebrow="Not Sure Where to Begin"
            title="Try the discovery set"
            description="Four 2 ml vials, one from each corner of the wood, presented in a linen pouch. Credit towards your first full bottle."
          />
          <p className="mt-8 text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
            Enquire in the atelier — Grasse, or by correspondence
          </p>
        </div>
      </section>
    </CinematicMotion>
  );
}
