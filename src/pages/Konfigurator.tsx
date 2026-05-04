import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowLeft } from "lucide-react";
import Configurator from "@/components/site/Configurator";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const navLinks = [
  { to: "/", label: "Početna" },
  { to: "/#usluge", label: "Usluge" },
  { to: "/#o-nama", label: "O nama" },
  { to: "/#reference", label: "Reference" },
  { to: "/#kontakt", label: "Kontakt" },
];

const Konfigurator = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {/* Slim top bar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative h-9 w-9 overflow-hidden rounded-sm bg-background">
              <img src={logo} alt="Šutić Projekt Biro logo" className="h-full w-full object-contain" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-sm font-medium text-foreground">
                Šutić Projekt Biro
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Konfigurator prozora
              </div>
            </div>
          </Link>

          <button
            onClick={() => setOpen(true)}
            aria-label="Otvori meni"
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-border hover:border-accent hover:text-accent transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Overlay menu */}
      <div
        className={cn(
          "fixed inset-0 z-[60] transition-all duration-500",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-primary/60 backdrop-blur-sm transition-opacity duration-500",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        {/* Panel */}
        <aside
          className={cn(
            "absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-elegant transition-transform duration-500 ease-smooth flex flex-col",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between h-16 px-6 border-b border-border">
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Meni
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Zatvori meni"
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm hover:text-accent transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-8">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 pb-6 mb-6 border-b border-border text-foreground hover:text-accent transition-colors"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="font-display text-lg">Nazad na početnu</span>
            </Link>

            <ul className="space-y-1">
              {navLinks.map((l, i) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline gap-4 py-4 border-b border-border/60 hover:border-accent transition-colors"
                  >
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-2xl text-foreground group-hover:text-accent transition-colors">
                      {l.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-6 py-6 border-t border-border text-sm text-muted-foreground">
            <div>dejan@sutic.net</div>
            <div className="text-xs mt-1">Šutić Projekt Biro · od 2009.</div>
          </div>
        </aside>
      </div>

      {/* Hero intro for configurator */}
      <section className="pt-28 pb-10 md:pt-36 md:pb-14 bg-gradient-subtle border-b border-border">
        <div className="container">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-accent transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Povratak na početnu
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-medium leading-[1.05] text-foreground max-w-3xl break-words">
            Konfigurator <span className="italic text-accent">prozora</span>.
          </h1>
          <p className="mt-5 max-w-xl text-sm sm:text-base text-muted-foreground">
            Izaberite tip otvaranja, dimenzije, materijal i staklo —
            pregled se iscrtava u realnom vremenu, a upit možete
            poslati jednim klikom.
          </p>
        </div>
      </section>

      <Configurator />

      <footer className="border-t border-border py-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} Šutić Projekt Biro</div>
          <Link to="/" className="hover:text-accent transition-colors">
            ← Povratak na početnu
          </Link>
        </div>
      </footer>
    </main>
  );
};

export default Konfigurator;