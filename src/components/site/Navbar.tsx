import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "#usluge", label: "Usluge" },
  { href: "#konfigurator", label: "Konfigurator" },
  { href: "#o-nama", label: "O nama" },
  { href: "#reference", label: "Reference" },
  { href: "#kontakt", label: "Kontakt" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-smooth",
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border shadow-card"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-sm bg-primary">
            <div className="absolute inset-0 bg-gradient-accent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="absolute inset-0 grid place-items-center font-display text-lg font-semibold text-primary-foreground">
              Š
            </span>
          </div>
          <div className="leading-tight">
            <div className={cn("font-display text-base font-medium tracking-tight", scrolled ? "text-foreground" : "text-primary-foreground")}>
              Šutić Projekt Biro
            </div>
            <div className={cn("text-[11px] uppercase tracking-[0.18em]", scrolled ? "text-muted-foreground" : "text-primary-foreground/70")}>
              od 2009.
            </div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-medium transition-colors",
                scrolled
                  ? "text-foreground/80 hover:text-accent"
                  : "text-primary-foreground/90 hover:text-primary-foreground"
              )}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#kontakt"
          className={cn(
            "hidden md:inline-flex items-center text-sm font-medium px-5 py-2.5 rounded-sm transition-all duration-300",
            scrolled
              ? "bg-primary text-primary-foreground hover:bg-accent"
              : "bg-primary-foreground text-primary hover:bg-accent hover:text-accent-foreground"
          )}
        >
          Zatraži ponudu
        </a>
      </div>
    </header>
  );
};

export default Navbar;