import { createFileRoute, Link } from "@tanstack/react-router";
import { IngredientStory } from "@/components/sections/IngredientStory";
import { QuoteBanner } from "@/components/sections/QuoteBanner";
import atelier from "@/assets/atelier.jpg";
import { CinematicMotion } from "@/components/CinematicMotion";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Our Story — Sylva" },
      {
        name: "description",
        content:
          "Since 1987, the Sylva atelier on the edge of Grasse has composed botanical perfume by hand — wild sourcing, slow maceration, numbered bottles.",
      },
      { property: "og:title", content: "Our Story — Sylva" },
      {
        property: "og:description",
        content:
          "Since 1987, the Sylva atelier has composed botanical perfume by hand — wild sourcing, slow maceration, numbered bottles.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StoryPage,
});

const values = [
  {
    numeral: "01",
    title: "Wild Sourcing",
    text: "Vetiver rested eighteen months in the ground. Cedar felled only in moon-dark winters. Jasmine picked before the sun can touch the flower. Our rules come from the plants, not the calendar.",
  },
  {
    numeral: "02",
    title: "Slow Maceration",
    text: "Every composition macerates for at least eight weeks in copper before a single bottle is filled. If the batch is not ready, it waits — and so do we.",
  },
  {
    numeral: "03",
    title: "Hand Finishing",
    text: "Filled, corked, waxed and numbered by hand in Grasse. Each bottle carries the date of its maceration and the initials of the hand that finished it.",
  },
];

function StoryPage() {
  return (
    <CinematicMotion>
      <section
        data-scroll-section="story-header"
        className="bg-forest-deep pt-36 pb-20 text-center md:pt-44 md:pb-24"
      >
        <div className="container-lux">
          <p className="eyebrow">The Maison</p>
          <h1 className="display-hero mt-6">Rooted in Ritual</h1>
          <p className="lede mx-auto mt-6 text-center">
            The story of a small house that chose the forest over the factory.
          </p>
          <div className="hairline-gold mx-auto mt-10" />
        </div>
      </section>

      <section data-scroll-section="story-narrative" className="py-24 md:py-32">
        <div className="container-lux grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div
            data-image-reveal
            data-parallax-frame
            className="card-media group order-2 aspect-[4/5] max-h-160 w-full lg:order-1"
          >
            <div data-parallax-layer className="parallax-layer h-full w-full">
              <img
                src={atelier}
                alt="The Sylva perfumer at work among botanicals and apothecary bottles"
                loading="lazy"
                width={1024}
                height={1024}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="eyebrow">Grasse, 1987</p>
            <h2 className="display-2 mt-5">
              A departure, <em className="text-gold italic">not a retirement</em>
            </h2>
            <p className="lede mt-6">
              Élise Moreau left one of the great perfume dynasties with a single suitcase of
              botanical samples and a conviction: that a fragrance should begin in a field, not in a
              laboratory.
            </p>
            <p className="lede mt-4">
              She rented a stone barn on the edge of Grasse, planted a garden of herbs behind it,
              and spent the next decade learning what the old herbals had to teach — that the
              difference between a good perfume and a great one is almost entirely patience.
            </p>
            <p className="lede mt-4">
              Today the maison remains deliberately small: four compositions, one perfumer's bench,
              and a wood that supplies most of what we make.
            </p>
          </div>
        </div>
      </section>

      <section
        data-scroll-section="story-values"
        className="bg-cream py-24 text-cream-foreground md:py-32"
      >
        <div className="container-lux">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">The Method</p>
            <h2 className="display-2 mt-5">Three quiet rules</h2>
            <div className="hairline-gold mx-auto mt-8" />
          </div>
          <div className="mt-16 grid gap-12 md:mt-20 md:grid-cols-3 md:gap-10">
            {values.map((value) => (
              <article key={value.numeral} className="text-center">
                <p className="font-display text-5xl font-light text-gold md:text-6xl">
                  {value.numeral}
                </p>
                <h3 className="display-3 mt-5">{value.title}</h3>
                <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-cream-foreground/70">
                  {value.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <IngredientStory
        eyebrow="What We Grow"
        title="Ingredients with a memory"
        description="Twelve family farms supply the atelier. Each botanical carries a place, a season and a rule of harvest — and each rule is absolute."
      />

      <QuoteBanner />

      <section data-scroll-section="story-cta" className="py-24 text-center md:py-32">
        <div className="container-lux">
          <p className="eyebrow">Begin</p>
          <h2 className="display-2 mt-5">Choose your chapter</h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/collections" className="btn-lux-solid">
              Explore the Collections
            </Link>
            <Link to="/" className="btn-lux-outline">
              Return to the Forest
            </Link>
          </div>
        </div>
      </section>
    </CinematicMotion>
  );
}
