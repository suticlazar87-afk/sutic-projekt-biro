import pvcImg from "@/assets/staklene-baste.jpg"; // actually white PVC window
import alImg from "@/assets/al-stolarija.jpg";
import fasadeImg from "@/assets/alubond-fasade.jpg";
import basteImg from "@/assets/pvc-stolarija.jpg"; // actually conservatory-like glass

const services = [
  {
    nr: "01",
    title: "Al i PVC stolarija",
    desc: "Vrhunski profili sa višekomornim sistemom i troslojnim staklom. Odlična izolacija, dug vek i savršena estetika.",
    img: pvcImg,
  },
  {
    nr: "02",
    title: "Staklene fasade i alubond",
    desc: "Strukturalne staklene fasade i ventilirane alubond obloge za savremena zdanja — projektovane po meri objekta.",
    img: fasadeImg,
  },
  {
    nr: "03",
    title: "Aluminijumske konstrukcije",
    desc: "Tanki okviri, velike površine stakla i čiste linije — aluminijumska stolarija koja transformiše prostor.",
    img: alImg,
  },
  {
    nr: "04",
    title: "Staklene bašte",
    desc: "Zimske bašte i nadstrešnice po meri — produžetak doma kroz svetlost, toplotu i pogled na prirodu.",
    img: basteImg,
  },
];

export const Services = () => {
  return (
    <section id="usluge" className="py-24 md:py-32 bg-background">
      <div className="container">
        <div className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3 text-muted-foreground">
              <span className="h-px w-10 bg-accent" />
              <span className="text-xs uppercase tracking-[0.25em]">Naše usluge</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] text-foreground">
              Kompletna rešenja za <span className="italic text-accent">omotač objekta</span>.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Od prvog nacrta do završne ugradnje — pokrivamo ceo proces, bez
            podizvođača i bez kompromisa.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {services.map((s) => (
            <article
              key={s.nr}
              className="group relative overflow-hidden bg-secondary shadow-card transition-all duration-500 hover:shadow-elegant"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={s.img}
                  alt={s.title}
                  loading="lazy"
                  width={1200}
                  height={900}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-smooth group-hover:scale-105"
                />
              </div>
              <div className="p-8 md:p-10">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="mb-3 text-xs font-medium tracking-[0.2em] text-accent">
                      — {s.nr}
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl text-foreground">
                      {s.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-5 text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { t: "Termotehnika", d: "Klimatizacija, grejanje i ventilacija — kompletne instalacije." },
            { t: "Solarni sistemi", d: "Ušteda energije u domaćinstvima i poslovnim objektima." },
            { t: "Prateća oprema", d: "Roletne, komarnici, unutrašnje prozorske daske i okov." },
          ].map((x) => (
            <div key={x.t} className="border-l-2 border-accent pl-6 py-2">
              <h4 className="font-display text-xl text-foreground">{x.t}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{x.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;