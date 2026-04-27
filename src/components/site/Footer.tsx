export const Footer = () => (
  <footer className="bg-primary text-primary-foreground border-t border-primary-foreground/10">
    <div className="container py-12 grid gap-8 md:grid-cols-3 items-start">
      <div>
        <div className="font-display text-2xl">Šutić Projekt Biro</div>
        <p className="mt-2 text-sm text-primary-foreground/70 max-w-xs">
          Aluminijumske i PVC konstrukcije i termotehničke instalacije.
          Beograd.
        </p>
      </div>
      <div className="text-sm text-primary-foreground/80 space-y-1">
        <div>Radoja Domanovića 11</div>
        <div>11 120 Beograd, Srbija</div>
        <a href="mailto:dejan@sutic.net" className="block text-accent hover:underline mt-2">
          dejan@sutic.net
        </a>
      </div>
      <div className="text-sm text-primary-foreground/60 md:text-right">
        © {new Date().getFullYear()} Šutić Projekt Biro
        <br />
        <a href="http://www.sutic.net" className="hover:text-accent">www.sutic.net</a>
      </div>
    </div>
  </footer>
);

export default Footer;