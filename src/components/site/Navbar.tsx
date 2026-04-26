import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.jpg";

const links = [
  { href: "#usluge", label: "Usluge" },
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
          <div className={cn(
            "relative h-11 w-11 overflow-hidden rounded-sm transition-all duration-500",
            scrolled ? "bg-transparent" : "bg-background/90 ring-1 ring-primary-foreground/20"
          )}>
            <img src={logo} alt="Šutić Projekt Biro logo" className="h-full w-full object-contain" />
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

        <Link
          to="/konfigurator"
          className={cn(
            "hidden md:inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-sm transition-all duration-300",
            scrolled
              ? "bg-primary text-primary-foreground hover:bg-accent"
              : "bg-primary-foreground text-primary hover:bg-accent hover:text-accent-foreground"
          )}
        >
          Konfigurator prozora
          <span aria-hidden>→</span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;