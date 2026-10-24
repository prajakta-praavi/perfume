import { Link } from "@tanstack/react-router";
import atelier from "@/assets/atelier.jpg";

export function BrandStoryTeaser() {
  return (
    <section data-scroll-section="brand-story" className="py-24 md:py-32">
      <div className="container-lux grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="eyebrow">The Maison</p>
          <h2 className="display-2 mt-5">
            Composed by hand, <em className="text-gold italic">slowly</em>
          </h2>
          <p className="lede mt-6">
            Since 1987, our atelier on the edge of Grasse has weighed, macerated and bottled every
            composition by hand. We work with twelve family farms and no ingredient arrives before
            its season.
          </p>
          <p className="lede mt-4">
            The result is perfume the slow way — small batches, numbered bottles, and a patience
            most houses gave up decades ago.
          </p>
          <Link
            to="/story"
            className="link-gold mt-9 inline-block text-[0.7rem] uppercase tracking-[0.3em]"
          >
            Read our story
          </Link>
        </div>

        <div
          data-image-reveal
          data-parallax-frame
          className="card-media group aspect-[4/5] max-h-160 w-full"
        >
          <div data-parallax-layer className="parallax-layer h-full w-full">
            <img
              src={atelier}
              alt="A perfumer weighing botanicals in the Sylva atelier"
              loading="lazy"
              width={1024}
              height={1024}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
