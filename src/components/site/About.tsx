export const About = () => {
  return (
    <section id="o-nama" className="py-24 md:py-32 bg-gradient-subtle">
      <div className="container grid gap-16 lg:grid-cols-12 items-start">
        <div className="lg:col-span-5">
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
            Šutić Projekt Biro osnovan je 2009. godine u Beogradu. Specijalizovani
            smo za projektovanje, izradu i ugradnju aluminijumskih i PVC
            konstrukcija, kao i termotehničkih instalacija.
          </p>
          <p>
            Vodi nas <strong className="text-foreground">Dejan Šutić, dipl. inženjer mašinstva</strong>. Svaki projekat
            — od porodične kuće do staklene fasade poslovne zgrade — prolazi kroz
            isti proces: pažljivo merenje, tehnički proračun, odabir materijala i
            nadzor nad ugradnjom.
          </p>
          <div className="pt-6 grid grid-cols-2 gap-6 border-t border-border">
            {[
              ["Projektovanje", "Tehnička dokumentacija po meri objekta."],
              ["Proizvodnja", "Kontrolisan kvalitet i provereni sistemi."],
              ["Ugradnja", "Sopstveni tim, bez podizvođača."],
              ["Servis", "Podrška i održavanje nakon isporuke."],
            ].map(([t, d]) => (
              <div key={t}>
                <h4 className="font-display text-lg text-foreground">{t}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;