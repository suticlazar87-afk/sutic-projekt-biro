import pvcImg from "@/assets/staklene-baste.jpg"; // actually white PVC window
import alImg from "@/assets/al-stolarija.jpg";
import fasadeImg from "@/assets/alubond-fasade.jpg";
import basteImg from "@/assets/pvc-stolarija.jpg"; // actually conservatory-like glass

const services = [
  {
    nr: "01",
    title: "Al i PVC stolarija",
    desc: "Aluminijumska i PVC stolarija — prozori i vrata po meri objekta.",
    img: pvcImg,
  },
  {
    nr: "02",
    title: "Al fasade i alubond",
    desc: "Aluminijumske fasade i alubond obloge za stambene i poslovne objekte.",
    img: fasadeImg,
  },
  {
    nr: "03",
    title: "Staklene bašte",
    desc: "Staklene bašte i nadstrešnice u aluminijumskoj konstrukciji.",
    img: alImg,
  },
  {
    nr: "04",
    title: "Prateća oprema",
    desc: "Roletne, komarnici, unutrašnje prozorske daske i okov.",
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
              className="group relative overflow-hidden bg-secondary shadow-card transition-all duration-500 hover:shadow-elegant hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={s.img}
                  alt={s.title}
                  loading="lazy"
                  width={1200}
                  height={900}
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-smooth group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute top-5 left-5 font-display text-6xl text-primary-foreground/0 group-hover:text-primary-foreground/90 transition-all duration-500 -translate-y-2 group-hover:translate-y-0">
                  {s.nr}
                </div>
                <div className="absolute bottom-6 left-8 right-8 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-primary-foreground">
                    Saznajte više
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </div>
              <div className="p-8 md:p-10">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="mb-3 text-xs font-medium tracking-[0.2em] text-accent">
                      — {s.nr}
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl text-foreground transition-colors group-hover:text-accent">
                      {s.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-5 text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
              <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-smooth" />
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { t: "Klimatizacija, grejanje i ventilacija", d: "Termotehničke instalacije za stambene i poslovne objekte." },
            { t: "Solarni sistemi", d: "Ušteda energije u domaćinstvima i poslovnim objektima." },
            { t: "Aluminijumske i PVC konstrukcije", d: "Projektovanje i izvođenje kompletnih sistema." },
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