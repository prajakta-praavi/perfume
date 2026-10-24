import { createFileRoute, Link } from "@tanstack/react-router";
import { Hero } from "@/components/sections/Hero";
import { SignatureShowcase } from "@/components/sections/SignatureShowcase";
import { IngredientStory } from "@/components/sections/IngredientStory";
import { BrandStoryTeaser } from "@/components/sections/BrandStoryTeaser";
import { QuoteBanner } from "@/components/sections/QuoteBanner";
import { SectionHeading } from "@/components/SectionHeading";
import { FragranceCard } from "@/components/FragranceCard";
import { fragrances } from "@/data/fragrances";
import { CinematicMotion } from "@/components/CinematicMotion";
import { BottleGallery } from "@/components/sections/BottleGallery";
import { PerfumeSprayTransition } from "@/components/sections/PerfumeSprayTransition";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sylva — The Forest, Bottled" },
      {
        name: "description",
        content:
          "Sylva is a maison de parfum botanique: rare botanicals, wild-harvested and composed by hand in Grasse into perfumes of quiet drama.",
      },
      { property: "og:title", content: "Sylva — The Forest, Bottled" },
      {
        property: "og:description",
        content:
          "Rare botanicals, wild-harvested and composed by hand into perfumes of quiet drama.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <CinematicMotion>
      <Hero />
      <PerfumeSprayTransition />
      <FeaturedFragrances />
      <SignatureShowcase />
      <IngredientStory />
      <BrandStoryTeaser />
      <QuoteBanner />
    </CinematicMotion>
  );
}

function FeaturedFragrances() {
  return (
    <section id="chapters" data-scroll-section="featured" className="py-24 md:py-32">
      <div className="container-lux">
        <SectionHeading
          eyebrow="The Collection"
          title="Four compositions, one forest"
          description="Each fragrance is macerated for a minimum of eight weeks, filled by hand and numbered. No batches are repeated."
        />
        <BottleGallery />
        <div className="mt-16 grid gap-10 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
          {fragrances.map((fragrance) => (
            <FragranceCard key={fragrance.slug} fragrance={fragrance} />
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link to="/collections" className="btn-lux-outline">
            View All Fragrances
          </Link>
        </div>
      </div>
    </section>
  );
}
