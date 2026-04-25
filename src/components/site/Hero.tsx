import heroImg from "@/assets/hero-facade.jpg";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden">
      <img
        src={heroImg}
        alt="Moderna staklena fasada sa aluminijumskom stolarijom"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover animate-hero-zoom"
      />
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-primary/20" />
      {/* Subtle vignette for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--primary)/0.55)_100%)]" />

      <div className="container relative z-10 flex min-h-[92vh] flex-col justify-end pb-24 md:pb-32 pt-32">
        <div className="max-w-3xl animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-3 text-primary-foreground/80">
            <span className="h-px w-10 bg-accent" />
            <span className="text-xs uppercase tracking-[0.25em]">Projektovanje · Inženjering · Izvođenje</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium leading-[1.02] text-primary-foreground">
            Prozori koji
            <br />
            <span className="italic text-accent">traju generacijama.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-primary-foreground/85 leading-relaxed">
            Više od petnaest godina projektujemo i ugrađujemo Al i PVC stolariju,
            staklene fasade i termotehničke instalacije — za domove i poslovne
            objekte koji zahtevaju preciznost.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/konfigurator"
              className="group relative inline-flex items-center gap-3 overflow-hidden bg-accent px-8 py-4 text-sm font-medium text-accent-foreground shadow-glow transition-all duration-500 hover:shadow-elegant"
            >
              <span className="absolute inset-0 -translate-x-full bg-primary-foreground transition-transform duration-500 ease-smooth group-hover:translate-x-0" />
              <span className="relative transition-colors duration-500 group-hover:text-primary">
                Konfiguriši svoj prozor
              </span>
              <span
                aria-hidden
                className="relative transition-all duration-500 group-hover:translate-x-1 group-hover:text-primary"
              >
                →
              </span>
            </Link>
            <a
              href="#usluge"
              className="inline-flex items-center gap-2 px-7 py-4 text-sm font-medium text-primary-foreground border border-primary-foreground/30 hover:bg-primary-foreground/10 hover:border-primary-foreground/60 transition-all duration-300"
            >
              Pogledajte usluge
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 text-primary-foreground/60">
        <span className="text-[10px] uppercase tracking-[0.3em]">Skroluj</span>
        <span className="block h-10 w-px bg-gradient-to-b from-primary-foreground/60 to-transparent animate-pulse" />
      </div>
    </section>
  );
};

export default Hero;