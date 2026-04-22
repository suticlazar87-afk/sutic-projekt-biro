export const References = () => {
  const items = [
    {
      loc: "Beograd · Zvezdara",
      title: "Stambeni objekat, Vidska 1a",
      type: "Al fasada + PVC stolarija",
      year: "Završeno",
    },
    {
      loc: "Beograd",
      title: "Stambeni objekat, Radoja Domanovića 1",
      type: "Projekat u izradi",
      year: "U toku",
    },
    {
      loc: "Beograd",
      title: "Poslovni objekat — alubond fasada",
      type: "Ventilirana fasada",
      year: "Referenca",
    },
  ];
  return (
    <section id="reference" className="py-24 md:py-32 bg-primary text-primary-foreground">
      <div className="container">
        <div className="mb-16 max-w-2xl">
          <div className="mb-4 flex items-center gap-3 text-primary-foreground/70">
            <span className="h-px w-10 bg-accent" />
            <span className="text-xs uppercase tracking-[0.25em]">Reference</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-medium leading-[1.05]">
            Odabrani projekti <span className="italic text-accent">i aktuelni radovi.</span>
          </h2>
        </div>

        <div className="divide-y divide-primary-foreground/15 border-y border-primary-foreground/15">
          {items.map((i, idx) => (
            <div
              key={i.title}
              className="group grid grid-cols-12 items-center gap-6 py-8 transition-colors hover:bg-primary-foreground/5 px-2"
            >
              <div className="col-span-1 font-display text-xl text-accent">
                0{idx + 1}
              </div>
              <div className="col-span-12 md:col-span-5">
                <h3 className="font-display text-2xl md:text-3xl">{i.title}</h3>
              </div>
              <div className="col-span-6 md:col-span-3 text-sm text-primary-foreground/70">
                {i.type}
              </div>
              <div className="col-span-6 md:col-span-2 text-sm text-primary-foreground/70">
                {i.loc}
              </div>
              <div className="col-span-12 md:col-span-1 text-right text-xs uppercase tracking-widest text-accent">
                {i.year}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default References;