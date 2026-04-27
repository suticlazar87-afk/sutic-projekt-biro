export const About = () => {
  return (
    <section id="o-nama" className="relative py-24 md:py-32 bg-gradient-subtle overflow-hidden">
      {/* Decorative oversized number */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 right-0 font-display text-[16rem] md:text-[22rem] leading-none text-foreground/[0.04] select-none"
      >
        ŠPB
      </span>

      <div className="container relative grid gap-16 lg:grid-cols-12 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="mb-4 flex items-center gap-3 text-muted-foreground">
            <span className="h-px w-10 bg-accent" />
            <span className="text-xs uppercase tracking-[0.25em]">O nama</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-medium leading-[1.05] text-foreground">
            Inženjerski pristup
            <br />
            <span className="italic text-accent">svakom projektu.</span>
          </h2>
        </div>

        <div className="lg:col-span-7 space-y-6 text-lg leading-relaxed text-foreground/80">
          <p>
            Šutić Projekt Biro se bavi projektovanjem, izradom i ugradnjom
            aluminijumskih i PVC konstrukcija, kao i termotehničkih instalacija.
          </p>
          <p>
            Vodi nas <strong className="text-foreground">Dejan Šutić, dipl. inženjer mašinstva</strong>.
            Naš fokus je ušteda energije u domaćinstvima i poslovnim objektima —
            kroz pravilno odabrane sisteme stolarije, fasada i termotehnike.
          </p>
          <div className="pt-6 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-border">
            {[
              ["01", "Projektovanje", "Tehnička dokumentacija po meri objekta."],
              ["02", "Proizvodnja", "Kontrolisan kvalitet i provereni sistemi."],
              ["03", "Ugradnja", "Sopstveni tim, bez podizvođača."],
              ["04", "Servis", "Podrška i održavanje nakon isporuke."],
            ].map(([n, t, d]) => (
              <div key={t} className="group">
                <div className="text-[11px] font-medium tracking-[0.25em] text-accent mb-2">
                  — {n}
                </div>
                <h4 className="font-display text-xl text-foreground transition-colors group-hover:text-accent">
                  {t}
                </h4>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;