import { useState } from "react";
import { toast } from "sonner";

export const Contact = () => {
  const [sending, setSending] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = (data.get("name") as string) || "";
    const email = (data.get("email") as string) || "";
    const phone = (data.get("phone") as string) || "";
    const message = (data.get("message") as string) || "";
    const subject = encodeURIComponent(`Upit za ponudu — ${name}`);
    const body = encodeURIComponent(
      `Ime: ${name}\nEmail: ${email}\nTelefon: ${phone}\n\nPoruka:\n${message}`
    );
    window.location.href = `mailto:dejan@sutic.net?subject=${subject}&body=${body}`;
    setTimeout(() => {
      toast.success("Otvaramo vaš email klijent…", {
        description: "Ukoliko se ne otvori, pišite direktno na dejan@sutic.net",
      });
      setSending(false);
    }, 300);
  };

  return (
    <section id="kontakt" className="py-24 md:py-32 bg-background">
      <div className="container grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="mb-4 flex items-center gap-3 text-muted-foreground">
            <span className="h-px w-10 bg-accent" />
            <span className="text-xs uppercase tracking-[0.25em]">Kontakt</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-medium leading-[1.05] text-foreground">
            Šutić Projekt <span className="italic text-accent">Biro.</span>
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Dejan Šutić, dipl. inženjer mašinstva.
          </p>

          <dl className="mt-10 space-y-6">
            {[
              ["Email", "dejan@sutic.net", "mailto:dejan@sutic.net"],
              ["Telefon", "+381 11 24 05 640", "tel:+381112405640"],
              ["Mobilni", "+381 64 11 85 967", "tel:+381641185967"],
              ["Adresa", "Radoja Domanovića 11, 11 120 Beograd", null],
            ].map(([k, v, href]) => (
              <div key={k as string} className="border-t border-border pt-4">
                <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {k}
                </dt>
                <dd className="mt-2 font-display text-xl text-foreground">
                  {href ? (
                    <a href={href as string} className="hover:text-accent transition-colors">
                      {v}
                    </a>
                  ) : (
                    v
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <form
          onSubmit={onSubmit}
          className="lg:col-span-7 bg-secondary p-8 md:p-12 shadow-card"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Ime i prezime" name="name" required />
            <Field label="Telefon" name="phone" type="tel" />
            <div className="md:col-span-2">
              <Field label="Email" name="email" type="email" required />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Vaš upit
              </label>
              <textarea
                name="message"
                required
                rows={6}
                className="mt-2 w-full bg-background border-b-2 border-border focus:border-accent outline-none resize-none p-3 text-foreground transition-colors"
                placeholder="Opišite projekat, dimenzije ili priložite ideje…"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={sending}
            className="mt-8 inline-flex items-center gap-2 bg-primary px-8 py-4 text-sm font-medium text-primary-foreground transition-all duration-300 hover:bg-accent disabled:opacity-60"
          >
            {sending ? "Slanje…" : "Pošalji upit"}
            <span aria-hidden>→</span>
          </button>
        </form>
      </div>
    </section>
  );
};

const Field = ({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) => (
  <div>
    <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
      {label}
      {required && <span className="text-accent"> *</span>}
    </label>
    <input
      name={name}
      type={type}
      required={required}
      className="mt-2 w-full bg-background border-b-2 border-border focus:border-accent outline-none p-3 text-foreground transition-colors"
    />
  </div>
);

export default Contact;