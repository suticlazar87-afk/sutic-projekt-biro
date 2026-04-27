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
            Šutić Projekt
            <br />
            <span className="italic text-accent">Biro.</span>
          </h2>
        </div>

        <div className="lg:col-span-7 space-y-6 text-lg leading-relaxed text-foreground/80">
          <p>
            <strong className="text-foreground">ŠUTIĆ PROJEKT BIRO</strong> se bavi
            projektovanjem, inženjeringom i izvođenjem aluminijumskih i PVC
            konstrukcija i termotehničkih instalacija — aluminijumske i PVC
            stolarije, staklenih fasada i alubonda, staklenih bašta, prateće
            opreme, termotehničkih instalacija i solarnih sistema.
          </p>
          <p>
            Projektni biro je proistekao iz dugogodišnjeg uspešnog rada
            <strong className="text-foreground"> Dejana Šutića, dipl. mašinskog inženjera</strong>,
            sada vlasnika biroa.
          </p>
          <p>
            ŠUTIĆ PROJEKT BIRO danas čini tim inženjera i projektanata koji su
            tu da Vam ponude i predlože najbolje rešenje za Vaš dom ili poslovni
            objekat, a u cilju uštede energije i samim tim Vašeg novca. Tu smo
            da izlazeći u susret Vašim idejama i predlozima projektanata i
            arhitekte udovoljimo zahtevima savremenog dizajna u skladu sa
            kriterijumima modernog življenja i uspešnog poslovanja.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;