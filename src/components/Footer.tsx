import { Link } from "@tanstack/react-router";
import { fragrances } from "@/data/fragrances";

export function Footer() {
  return (
    <footer data-scroll-section="footer" className="border-t border-foreground/10 bg-forest-deep">
      <div className="container-lux grid gap-14 py-16 md:grid-cols-2 md:py-20 lg:grid-cols-4">
        <div>
          <Link to="/" className="group inline-block">
            <span className="font-display text-3xl tracking-[0.3em] text-foreground transition-colors duration-300 group-hover:text-gold">
              SYLVA
            </span>
            <span className="mt-1 block text-[0.55rem] uppercase tracking-[0.5em] text-gold">
              Maison de Parfum
            </span>
          </Link>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Rare botanicals, wild-harvested and composed by hand into perfumes of
            quiet drama.
          </p>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground/70">
            Atelier — 7 Chemin des Fleurs
            <br />
            06130 Grasse, France
          </p>
        </div>

        <div>
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-gold">
            The Fragrances
          </p>
          <ul className="mt-6 space-y-3">
            {fragrances.map((f) => (
              <li key={f.slug}>
                <Link
                  to="/fragrances/$slug"
                  params={{ slug: f.slug }}
                  className="link-gold text-sm"
                >
                  {f.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-gold">
            The Maison
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li>
              <Link to="/story" className="link-gold">
                Our Story
              </Link>
            </li>
            <li>
              <Link to="/story" className="link-gold">
                Ingredients
              </Link>
            </li>
            <li>
              <Link to="/collections" className="link-gold">
                All Fragrances
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-gold">
            Correspondence
          </p>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Letters from the atelier, four times a year. No noise, ever.
          </p>
          <form className="mt-5 flex" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              required
              placeholder="Your email"
              aria-label="Email address"
              className="input-lux min-w-0 flex-1"
            />
            <button
              type="submit"
              className="bg-gold px-5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-forest-deep transition-colors duration-300 hover:bg-gold-light"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-foreground/10">
        <div className="container-lux flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground/70 md:flex-row">
          <p>© 2026 Sylva — Maison de Parfum Botanique</p>
          <p>Composed &amp; bottled in Grasse</p>
        </div>
      </div>
    </footer>
  );
}
