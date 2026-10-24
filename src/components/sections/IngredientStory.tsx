import { SectionHeading } from "@/components/SectionHeading";
import { ingredients } from "@/data/fragrances";

interface IngredientStoryProps {
  eyebrow?: string;
  title?: string;
  description?: string;
}

export function IngredientStory({
  eyebrow = "From the Field",
  title = "Ingredients with a memory",
  description = "Twelve family farms supply the atelier. Each botanical carries a place, a season and a rule of harvest — and each rule is absolute.",
}: IngredientStoryProps) {
  return (
    <section data-scroll-section="ingredients" className="py-24 md:py-32">
      <div className="container-lux">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        <div className="mt-16 grid gap-12 md:mt-20 md:grid-cols-3 md:gap-10">
          {ingredients.map((ingredient, i) => (
            <article
              key={ingredient.name}
              data-scroll-section="ingredient"
              className={i === 1 ? "md:mt-14" : ""}
            >
              <div data-parallax-frame className="card-media group aspect-[3/4]">
                <div data-parallax-layer className="parallax-layer h-full w-full">
                  <img
                    src={ingredient.image}
                    alt={ingredient.name}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                </div>
              </div>
              <p className="eyebrow mt-7">{ingredient.origin}</p>
              <h3 className="display-3 mt-3">{ingredient.name}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {ingredient.description}
              </p>
              <p className="mt-5 text-[0.62rem] uppercase tracking-[0.25em] text-gold/80">
                Found in {ingredient.usedIn.join(" · ")}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
