import { Link } from "@tanstack/react-router";
import { useState } from "react";

const links = [
  { to: "/collections", label: "Collections" },
  { to: "/story", label: "Our Story" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      data-scroll-section="navbar"
      className="fixed inset-x-0 top-0 z-50 border-b border-foreground/10 bg-forest-deep/80 backdrop-blur-md"
    >
      <div className="container-lux flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="group flex flex-col" onClick={() => setOpen(false)}>
          <span className="font-display text-2xl leading-none font-normal tracking-[0.35em] text-foreground transition-colors duration-300 group-hover:text-gold">
            SYLVA
          </span>
          <span className="mt-1 text-[0.55rem] uppercase tracking-[0.5em] text-gold">
            Maison de Parfum
          </span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="link-gold text-[0.7rem] uppercase tracking-[0.3em]"
            >
              {l.label}
            </Link>
          ))}
          <Link to="/collections" className="btn-nav">
            Discover
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-foreground transition-colors hover:text-gold md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-foreground/10 bg-forest-deep/95 backdrop-blur-md md:hidden"
          aria-label="Mobile"
        >
          <div className="container-lux flex flex-col gap-6 py-8">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="link-gold text-sm uppercase tracking-[0.3em]"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/collections"
              onClick={() => setOpen(false)}
              className="btn-nav w-fit"
            >
              Discover
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
