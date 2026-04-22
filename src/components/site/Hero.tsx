import heroImg from "@/assets/hero-facade.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden">
      <img
        src={heroImg}
        alt="Moderna staklena fasada sa aluminijumskom stolarijom"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-primary/20" />

      <div className="container relative z-10 flex min-h-[92vh] flex-col justify-end pb-20 pt-32">
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
            <a
              href="#kontakt"
              className="inline-flex items-center gap-2 bg-accent px-7 py-4 text-sm font-medium text-accent-foreground shadow-glow transition-all duration-300 hover:bg-primary-foreground hover:text-primary"
            >
              Besplatna procena
              <span aria-hidden>→</span>
            </a>
            <a
              href="#usluge"
              className="inline-flex items-center gap-2 px-7 py-4 text-sm font-medium text-primary-foreground border border-primary-foreground/30 hover:bg-primary-foreground/10 transition-all duration-300"
            >
              Pogledajte usluge
            </a>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-px bg-primary-foreground/15 md:grid-cols-4 max-w-4xl">
          {[
            { k: "15+", v: "godina iskustva" },
            { k: "200+", v: "završenih projekata" },
            { k: "A+", v: "energetska klasa" },
            { k: "100%", v: "garancija kvaliteta" },
          ].map((s) => (
            <div key={s.v} className="bg-primary/40 backdrop-blur-sm px-6 py-5">
              <div className="font-display text-3xl text-primary-foreground">{s.k}</div>
              <div className="text-xs uppercase tracking-wider text-primary-foreground/70 mt-1">
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;