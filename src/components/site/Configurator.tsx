import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Darken/lighten a hex color by amount in [-1, 1]
function shade(hex: string, amount: number): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(full, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  const adj = (c: number) =>
    Math.max(0, Math.min(255, Math.round(c + (amount < 0 ? c * amount : (255 - c) * amount))));
  r = adj(r); g = adj(g); b = adj(b);
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}

type WindowType =
  | "single"
  | "double"
  | "triple"
  | "balcony"
  | "balcony-single"
  | "fixed"
  | "tilt";

type MaterialKind = "alu-wood" | "pvc" | "alu" | "steel";
type GlassType = "double" | "triple" | "triple-low-e";

const TYPES: { id: WindowType; label: string; desc: string; sashes: number; hasTilt: boolean; isDoor: boolean }[] = [
  { id: "single", label: "Jednokrilni", desc: "Otklopno-okretni, jedno krilo", sashes: 1, hasTilt: true, isDoor: false },
  { id: "double", label: "Dvokrilni", desc: "Dva krila sa srednjom letvicom", sashes: 2, hasTilt: true, isDoor: false },
  { id: "triple", label: "Trokrilni", desc: "Tri krila — panoramski pogled", sashes: 3, hasTilt: true, isDoor: false },
  { id: "fixed", label: "Fiksni", desc: "Bez otvaranja — maksimum svetla", sashes: 1, hasTilt: false, isDoor: false },
  { id: "tilt", label: "Samo kip", desc: "Otklopni prozor — ventilacija", sashes: 1, hasTilt: true, isDoor: false },
  { id: "balcony-single", label: "Balkonska vrata — jednokrilna", desc: "Jedno krilo, izlaz na terasu", sashes: 1, hasTilt: true, isDoor: true },
  { id: "balcony", label: "Balkonska vrata — dvokrilna", desc: "Prozor + vrata za izlaz", sashes: 2, hasTilt: true, isDoor: true },
];

const MATERIAL_KINDS: { id: MaterialKind; label: string; desc: string; priceM2: number }[] = [
  { id: "alu-wood", label: "Aluminijum-drvo", desc: "Spolja aluminijum, iznutra drvo (bajc)", priceM2: 420 },
  { id: "pvc", label: "PVC", desc: "Pet- ili šestokomorni profil", priceM2: 160 },
  { id: "alu", label: "Aluminijum", desc: "Sa termo prekidom, plastificiran", priceM2: 320 },
  { id: "steel", label: "Čelik", desc: "Profil sa termo prekidom", priceM2: 380 },
];

// Color presets for paintable materials (PVC / Aluminijum / Čelik)
const PAINT_COLORS: { id: string; label: string; frame: string; edge: string }[] = [
  { id: "white",      label: "Bela",            frame: "#f4f5f7", edge: "#cfd2d8" },
  { id: "cream",      label: "Krem",            frame: "#ece4d2", edge: "#bdb39a" },
  { id: "grey",       label: "Svetlo siva",     frame: "#b6b9bd", edge: "#7f8186" },
  { id: "anthracite", label: "Antracit",        frame: "#3a3f45", edge: "#1f2226" },
  { id: "black",      label: "Crna mat",        frame: "#1a1b1d", edge: "#0a0b0c" },
  { id: "bronze",     label: "Bronza",          frame: "#6b523a", edge: "#3b2c1e" },
  { id: "green",      label: "Tamno zelena",    frame: "#2f4a3a", edge: "#172a1f" },
  { id: "red",        label: "Vinsko crvena",   frame: "#6e1f24", edge: "#3b0f12" },
  { id: "blue",       label: "Plavi čelik",     frame: "#2b3a55", edge: "#15203a" },
];

// Bajc (stain) options for the wood interior of alu-wood
const WOOD_STAINS: { id: string; label: string; frame: string; edge: string }[] = [
  { id: "natural", label: "Prirodni",       frame: "#d6b07d", edge: "#8a6638" },
  { id: "oak",     label: "Zlatni hrast",   frame: "#9a6b36", edge: "#5e3f1e" },
  { id: "walnut",  label: "Orah",           frame: "#6b4226", edge: "#3a2414" },
  { id: "mahogany",label: "Mahagoni",       frame: "#5a2a20", edge: "#2c130d" },
  { id: "wenge",   label: "Wenge",          frame: "#2e221a", edge: "#16100b" },
];

const GLASS: { id: GlassType; label: string; u: string; factor: number }[] = [
  { id: "double", label: "Dvoslojno 4-16-4", u: "U = 1.1 W/m²K", factor: 1 },
  { id: "triple", label: "Troslojno 4-12-4-12-4", u: "U = 0.7 W/m²K", factor: 1.28 },
  { id: "triple-low-e", label: "Troslojno Low-E + Argon", u: "U = 0.5 W/m²K", factor: 1.55 },
];

export const Configurator = () => {
  const [type, setType] = useState<WindowType>("double");
  const [width, setWidth] = useState(1400); // mm
  const [height, setHeight] = useState(1400);
  const [materialKind, setMaterialKind] = useState<MaterialKind>("pvc");
  const [colorId, setColorId] = useState<string>("white");
  const [customColor, setCustomColor] = useState<string>("#f4f5f7");
  const [useCustomColor, setUseCustomColor] = useState<boolean>(false);
  const [stainId, setStainId] = useState<string>("oak");
  // Alu-wood: spoljna aluminijumska boja
  const [aluColorId, setAluColorId] = useState<string>("anthracite");
  const [aluCustomColor, setAluCustomColor] = useState<string>("#3a3f45");
  const [useAluCustomColor, setUseAluCustomColor] = useState<boolean>(false);
  const [glass, setGlass] = useState<GlassType>("triple");
  const [tilt, setTilt] = useState(true);

  const typeCfg = TYPES.find((t) => t.id === type)!;
  const matKind = MATERIAL_KINDS.find((m) => m.id === materialKind)!;
  const glassCfg = GLASS.find((g) => g.id === glass)!;

  const isWoodInside = materialKind === "alu-wood";
  const stain = WOOD_STAINS.find((s) => s.id === stainId) ?? WOOD_STAINS[1];
  const paint = PAINT_COLORS.find((c) => c.id === colorId) ?? PAINT_COLORS[0];
  const aluPaint = PAINT_COLORS.find((c) => c.id === aluColorId) ?? PAINT_COLORS[3];
  const aluLabel = useAluCustomColor
    ? `po izboru ${aluCustomColor.toUpperCase()}`
    : aluPaint.label;

  // Effective frame/edge for SVG preview
  let frameColor: string;
  let edgeColor: string;
  let colorLabel: string;
  if (isWoodInside) {
    frameColor = stain.frame;
    edgeColor = stain.edge;
    colorLabel = `Drvo iznutra: ${stain.label} (bajc) · Aluminijum spolja: ${aluLabel}`;
  } else if (useCustomColor) {
    frameColor = customColor;
    edgeColor = shade(customColor, -0.35);
    colorLabel = `Po izboru: ${customColor.toUpperCase()}`;
  } else {
    frameColor = paint.frame;
    edgeColor = paint.edge;
    colorLabel = paint.label;
  }

  const area = (width * height) / 1_000_000;
  const price = Math.round(area * matKind.priceM2 * glassCfg.factor);

  // Track stage size so SVG always fits the viewport
  const [stageW, setStageW] = useState(560);
  // SVG viewBox scales proportionally to real dimensions
  const ratio = width / height;
  const maxH = stageW < 380 ? 320 : stageW < 520 ? 380 : 420;
  const maxW = Math.max(160, stageW - 32);
  let svgH = maxH;
  let svgW = svgH * ratio;
  if (svgW > maxW) {
    svgW = maxW;
    svgH = svgW / ratio;
  }
  svgW = Math.max(160, svgW);
  svgH = Math.max(160, svgH);

  // Pinch-to-zoom + pan state for the preview
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setStageW(entry.contentRect.width);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const gesture = useRef<{
    startDist: number;
    startZoom: number;
    startMid: { x: number; y: number };
    startPan: { x: number; y: number };
  } | null>(null);

  const clampZoom = (z: number) => Math.min(4, Math.max(1, z));

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values());
      gesture.current = {
        startDist: Math.hypot(a.x - b.x, a.y - b.y),
        startZoom: zoom,
        startMid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
        startPan: { ...pan },
      };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && gesture.current) {
      const [a, b] = Array.from(pointers.current.values());
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const newZoom = clampZoom(
        gesture.current.startZoom * (dist / gesture.current.startDist),
      );
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      setZoom(newZoom);
      setPan({
        x: gesture.current.startPan.x + (mid.x - gesture.current.startMid.x),
        y: gesture.current.startPan.y + (mid.y - gesture.current.startMid.y),
      });
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) gesture.current = null;
  };

  const onWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    setZoom((z) => clampZoom(z * (e.deltaY < 0 ? 1.1 : 0.9)));
  };

  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const emailBody = useMemo(() => {
    const lines = [
      "Poštovani,",
      "",
      "Zainteresovan/a sam za sledeću konfiguraciju prozora:",
      "",
      `• Tip: ${typeCfg.label}`,
      `• Dimenzije: ${width} × ${height} mm (${area.toFixed(2)} m²)`,
      `• Materijal: ${matKind.label}`,
      `• Boja / završna obrada: ${colorLabel}`,
      `• Staklo: ${glassCfg.label} (${glassCfg.u})`,
      typeCfg.hasTilt ? `• Otklop (kip): ${tilt ? "da" : "ne"}` : "",
      "",
      `Okvirna procena: ${price} €`,
      "",
      "Molim Vas za detaljnu ponudu i izlazak na teren.",
      "",
      "Hvala,",
    ].filter(Boolean);
    return encodeURIComponent(lines.join("\n"));
  }, [typeCfg, width, height, area, matKind, colorLabel, glassCfg, tilt, price]);

  const mailto = `mailto:dejan@sutic.net?subject=${encodeURIComponent(
    "Upit iz konfiguratora — " + typeCfg.label,
  )}&body=${emailBody}`;

  return (
    <section id="konfigurator" className="py-24 md:py-32 bg-gradient-subtle">
      <div className="container">
        <div className="mb-14 max-w-2xl">
          <div className="mb-4 flex items-center gap-3 text-muted-foreground">
            <span className="h-px w-10 bg-accent" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em]">Konfigurator</span>
          </div>
          <h2 className="font-display text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] text-foreground break-words hyphens-auto">
            Vizualizujte <span className="italic text-accent">vaš prozor</span> pre nego što ga naručite.
          </h2>
          <p className="mt-5 text-sm sm:text-base text-muted-foreground">
            Izaberite tip, dimenzije, materijal i staklo — pregled se menja uživo.
            Pošaljite nam izbor jednim klikom.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] min-w-0">
          {/* Preview */}
          <div className="relative bg-background shadow-card p-4 sm:p-6 md:p-10 flex flex-col min-w-0">
            <div
              ref={stageRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onWheel={onWheel}
              className="relative flex-1 flex items-center justify-center min-h-[460px] bg-[radial-gradient(ellipse_at_center,hsl(var(--muted))_0%,hsl(var(--secondary))_100%)] rounded-sm overflow-hidden touch-none select-none"
              style={{ cursor: zoom > 1 ? "grab" : "default" }}
            >
              <div
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: "center center",
                  transition: gesture.current ? "none" : "transform 200ms ease-out",
                }}
              >
                <WindowPreview
                  type={typeCfg}
                  width={svgW}
                  height={svgH}
                  realWidth={width}
                  realHeight={height}
                  frame={frameColor}
                  edge={edgeColor}
                  tilt={tilt && typeCfg.hasTilt}
                />
              </div>

              {/* Zoom controls */}
              <div className="absolute top-3 right-3 flex flex-col gap-1 bg-background/80 backdrop-blur-sm border border-border rounded-sm">
                <button
                  type="button"
                  onClick={() => setZoom((z) => clampZoom(z * 1.25))}
                  className="h-8 w-8 grid place-items-center text-foreground hover:text-accent transition-colors"
                  aria-label="Uvećaj"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => clampZoom(z / 1.25))}
                  className="h-8 w-8 grid place-items-center text-foreground hover:text-accent transition-colors border-t border-border"
                  aria-label="Smanji"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={resetZoom}
                  className="h-8 w-8 grid place-items-center text-[10px] text-foreground hover:text-accent transition-colors border-t border-border"
                  aria-label="Resetuj"
                >
                  1:1
                </button>
              </div>

              <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground">
                Pinch / scroll za zumiranje
              </div>
            </div>

            {/* Dimension labels */}
            <div className="mt-6 flex items-center justify-between gap-2 text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground">
              <span className="whitespace-nowrap">Š: {width} mm</span>
              <span className="whitespace-nowrap">{area.toFixed(2)} m²</span>
              <span className="whitespace-nowrap">V: {height} mm</span>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-8 min-w-0">
            {/* Type */}
            <div>
              <Label>Tip prozora</Label>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={cn(
                      "text-left border p-3 transition-all duration-200",
                      type === t.id
                        ? "border-accent bg-accent/5 shadow-card"
                        : "border-border hover:border-foreground/40 bg-background",
                    )}
                  >
                    <div className="font-display text-base text-foreground">{t.label}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Slider
                label="Širina"
                value={width}
                min={500}
                max={3000}
                step={50}
                onChange={setWidth}
              />
              <Slider
                label="Visina"
                value={height}
                min={500}
                max={typeCfg.isDoor ? 2400 : 2200}
                step={50}
                onChange={setHeight}
              />
            </div>

            {/* Material kind */}
            <div>
              <Label>Materijal</Label>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {MATERIAL_KINDS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMaterialKind(m.id)}
                    className={cn(
                      "text-left border p-3 transition-all duration-200",
                      materialKind === m.id
                        ? "border-accent bg-accent/5 shadow-card"
                        : "border-border hover:border-foreground/40 bg-background",
                    )}
                  >
                    <div className="font-display text-base text-foreground">{m.label}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color / finish */}
            {isWoodInside ? (
              <div className="space-y-6">
                <div>
                  <Label>Bajc drveta (unutrašnja strana)</Label>
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {WOOD_STAINS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setStainId(s.id)}
                        className={cn(
                          "border p-2 text-left transition-all duration-200",
                          stainId === s.id
                            ? "border-accent shadow-card"
                            : "border-border hover:border-foreground/40",
                        )}
                      >
                        <span
                          className="block h-8 w-full mb-2 border border-border/60"
                          style={{ background: s.frame }}
                        />
                        <div className="text-[11px] text-foreground leading-tight">{s.label}</div>
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-[11px] text-muted-foreground">
                    Drvo se ne boji — samo se bajcuje.
                  </p>
                </div>

                <div>
                  <Label>Boja aluminijuma (spoljna strana)</Label>
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {PAINT_COLORS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setAluColorId(c.id);
                          setUseAluCustomColor(false);
                        }}
                        className={cn(
                          "border p-2 text-left transition-all duration-200",
                          !useAluCustomColor && aluColorId === c.id
                            ? "border-accent shadow-card"
                            : "border-border hover:border-foreground/40",
                        )}
                      >
                        <span
                          className="block h-8 w-full mb-2 border border-border/60"
                          style={{ background: c.frame }}
                        />
                        <div className="text-[11px] text-foreground leading-tight">{c.label}</div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={useAluCustomColor}
                        onChange={(e) => setUseAluCustomColor(e.target.checked)}
                        className="h-4 w-4 accent-[hsl(var(--accent))]"
                      />
                      <span className="text-xs text-foreground">Boja po izboru</span>
                    </label>
                    <input
                      type="color"
                      value={aluCustomColor}
                      onChange={(e) => {
                        setAluCustomColor(e.target.value);
                        setUseAluCustomColor(true);
                      }}
                      className="h-8 w-12 cursor-pointer border border-border bg-background"
                      aria-label="Izaberi boju aluminijuma"
                    />
                    <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
                      {useAluCustomColor ? aluCustomColor.toUpperCase() : "RAL po dogovoru"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Label>Boja okvira</Label>
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {PAINT_COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setColorId(c.id);
                        setUseCustomColor(false);
                      }}
                      className={cn(
                        "border p-2 text-left transition-all duration-200",
                        !useCustomColor && colorId === c.id
                          ? "border-accent shadow-card"
                          : "border-border hover:border-foreground/40",
                      )}
                    >
                      <span
                        className="block h-8 w-full mb-2 border border-border/60"
                        style={{ background: c.frame }}
                      />
                      <div className="text-[11px] text-foreground leading-tight">{c.label}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={useCustomColor}
                      onChange={(e) => setUseCustomColor(e.target.checked)}
                      className="h-4 w-4 accent-[hsl(var(--accent))]"
                    />
                    <span className="text-xs text-foreground">Boja po izboru</span>
                  </label>
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      setUseCustomColor(true);
                    }}
                    className="h-8 w-12 cursor-pointer border border-border bg-background"
                    aria-label="Izaberi boju"
                  />
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
                    {useCustomColor ? customColor.toUpperCase() : "RAL po dogovoru"}
                  </span>
                </div>
              </div>
            )}

            {/* Glass */}
            <div>
              <Label>Staklo</Label>
              <div className="mt-3 space-y-2">
                {GLASS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGlass(g.id)}
                    className={cn(
                      "w-full flex items-center justify-between border p-3 transition-all duration-200",
                      glass === g.id
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-foreground/40",
                    )}
                  >
                    <span className="text-sm text-foreground">{g.label}</span>
                    <span className="text-xs text-muted-foreground">{g.u}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tilt option */}
            {typeCfg.hasTilt && (
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={tilt}
                  onChange={(e) => setTilt(e.target.checked)}
                  className="h-4 w-4 accent-[hsl(var(--accent))]"
                />
                <span className="text-sm text-foreground">
                  Otklopno-okretno (kip) otvaranje
                </span>
              </label>
            )}

            {/* Price + CTA */}
            <div className="border-t border-border pt-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Okvirna procena
                </div>
                <div className="font-display text-4xl text-foreground mt-1">
                  {price} €
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  * informativno, bez ugradnje i dodatne opreme
                </div>
              </div>
              <a
                href={mailto}
                className="inline-flex items-center gap-2 bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:bg-accent"
              >
                Pošalji upit
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* -------------------- helpers -------------------- */

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3">
    <span className="h-px w-6 bg-accent" />
    <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
      {children}
    </span>
  </div>
);

const Slider = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) => (
  <div>
    <div className="flex items-baseline justify-between gap-2 min-w-0">
      <Label>{label}</Label>
      <span className="font-display text-base sm:text-lg text-foreground whitespace-nowrap">{value} mm</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="mt-3 w-full accent-[hsl(var(--accent))]"
    />
    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
      <span>{min}</span>
      <span>{max}</span>
    </div>
  </div>
);

/* -------------------- SVG preview -------------------- */

type TypeCfg = (typeof TYPES)[number];

const WindowPreview = ({
  type,
  width,
  height,
  realWidth,
  realHeight,
  frame,
  edge,
  tilt,
}: {
  type: TypeCfg;
  width: number;
  height: number;
  realWidth: number;
  realHeight: number;
  frame: string;
  edge: string;
  tilt: boolean;
}) => {
  // Real-world frame thickness in mm — converted to SVG units so it stays
  // visually proportional regardless of window size.
  const FRAME_MM = 70;
  const SASH_MM = 55;
  const GAP_MM = 12;
  const scale = width / realWidth; // svg units per mm
  const FRAME = FRAME_MM * scale;
  const SASH = SASH_MM * scale;
  const GAP = GAP_MM * scale;

  const innerX = FRAME;
  const innerY = FRAME;
  const innerW = width - FRAME * 2;
  const innerH = height - FRAME * 2;

  const sashCount = type.sashes;
  const sashW = (innerW - GAP * (sashCount - 1)) / sashCount;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="drop-shadow-[0_30px_40px_rgba(15,30,55,0.25)]"
    >
      <defs>
        {/* Realistic sky reflection in glass */}
        <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7fa8c4" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#b8d4e3" stopOpacity="0.85" />
          <stop offset="65%" stopColor="#dce9f0" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#8fb4c9" stopOpacity="0.85" />
        </linearGradient>
        {/* Diagonal light streak */}
        <linearGradient id="glassReflect" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        {/* Frame top highlight (sun from above-left) */}
        <linearGradient id="frameTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        {/* Frame left highlight */}
        <linearGradient id="frameLeft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        {/* Frame right shadow */}
        <linearGradient id="frameRight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.32" />
        </linearGradient>
        {/* Frame bottom shadow */}
        <linearGradient id="frameBot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
        </linearGradient>
        {/* Inner profile step (glazing bead) */}
        <linearGradient id="beadHi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="beadLo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
        </linearGradient>
        {/* Soft shadow inside glass cavity */}
        <radialGradient id="glassDepth" cx="0.5" cy="0.5" r="0.7">
          <stop offset="60%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
        </radialGradient>
      </defs>

      {/* ===== Outer frame — multi-step profile (chamfer + bead) ===== */}
      {(() => {
        const ch = Math.max(2, FRAME * 0.12); // chamfer
        return (
          <g>
            {/* base color */}
            <rect x={0} y={0} width={width} height={height} fill={frame} />
            {/* outer chamfer — top */}
            <polygon
              points={`0,0 ${width},0 ${width - ch},${ch} ${ch},${ch}`}
              fill={shade(frame, 0.25)}
            />
            {/* outer chamfer — left */}
            <polygon
              points={`0,0 ${ch},${ch} ${ch},${height - ch} 0,${height}`}
              fill={shade(frame, 0.15)}
            />
            {/* outer chamfer — right */}
            <polygon
              points={`${width},0 ${width},${height} ${width - ch},${height - ch} ${width - ch},${ch}`}
              fill={shade(frame, -0.25)}
            />
            {/* outer chamfer — bottom */}
            <polygon
              points={`0,${height} ${ch},${height - ch} ${width - ch},${height - ch} ${width},${height}`}
              fill={shade(frame, -0.32)}
            />
            {/* directional light wash */}
            <rect x={0} y={0} width={width} height={height} fill="url(#frameTop)" />
            <rect x={0} y={0} width={width} height={height} fill="url(#frameLeft)" />
            <rect x={0} y={0} width={width} height={height} fill="url(#frameRight)" />
            <rect x={0} y={0} width={width} height={height} fill="url(#frameBot)" />
            {/* outer crisp edge */}
            <rect
              x={0.5}
              y={0.5}
              width={width - 1}
              height={height - 1}
              fill="none"
              stroke={shade(edge, -0.2)}
              strokeWidth={1}
            />

            {/* ===== Inner step (glazing rebate) ===== */}
            {/* recessed dark cavity */}
            <rect x={innerX} y={innerY} width={innerW} height={innerH} fill={shade(edge, -0.4)} />
            {/* inner bead highlight (top edge of recess) */}
            <rect
              x={innerX}
              y={innerY}
              width={innerW}
              height={Math.max(1, ch * 0.6)}
              fill="#000"
              opacity={0.45}
            />
            <rect
              x={innerX}
              y={innerY}
              width={Math.max(1, ch * 0.5)}
              height={innerH}
              fill="#000"
              opacity={0.35}
            />
            {/* inner bead light leak (bottom/right) */}
            <rect
              x={innerX}
              y={innerY + innerH - Math.max(1, ch * 0.5)}
              width={innerW}
              height={Math.max(1, ch * 0.5)}
              fill="#fff"
              opacity={0.18}
            />
            <rect
              x={innerX + innerW - Math.max(1, ch * 0.4)}
              y={innerY}
              width={Math.max(1, ch * 0.4)}
              height={innerH}
              fill="#fff"
              opacity={0.14}
            />
          </g>
        );
      })()}

      {Array.from({ length: sashCount }).map((_, i) => {
        const sx = innerX + i * (sashW + GAP);
        const sy = innerY;
        const sw = sashW;
        const sh = innerH;

        // For balcony doors, make the last sash a door (taller visual split handle lower)
        const isDoor = type.isDoor && i === sashCount - 1;

        const gx = sx + SASH;
        const gy = sy + SASH;
        const gw = sw - SASH * 2;
        const gh = sh - SASH * 2;

        const sCh = Math.max(1.5, SASH * 0.14);

        return (
          <g key={i}>
            {/* ===== Sash — multi-step profile ===== */}
            <rect x={sx} y={sy} width={sw} height={sh} fill={frame} />
            {/* sash chamfer top */}
            <polygon
              points={`${sx},${sy} ${sx + sw},${sy} ${sx + sw - sCh},${sy + sCh} ${sx + sCh},${sy + sCh}`}
              fill={shade(frame, 0.22)}
            />
            {/* sash chamfer left */}
            <polygon
              points={`${sx},${sy} ${sx + sCh},${sy + sCh} ${sx + sCh},${sy + sh - sCh} ${sx},${sy + sh}`}
              fill={shade(frame, 0.12)}
            />
            {/* sash chamfer right */}
            <polygon
              points={`${sx + sw},${sy} ${sx + sw},${sy + sh} ${sx + sw - sCh},${sy + sh - sCh} ${sx + sw - sCh},${sy + sCh}`}
              fill={shade(frame, -0.22)}
            />
            {/* sash chamfer bottom */}
            <polygon
              points={`${sx},${sy + sh} ${sx + sCh},${sy + sh - sCh} ${sx + sw - sCh},${sy + sh - sCh} ${sx + sw},${sy + sh}`}
              fill={shade(frame, -0.3)}
            />
            {/* directional light on sash */}
            <rect x={sx} y={sy} width={sw} height={sh} fill="url(#frameTop)" />
            <rect x={sx} y={sy} width={sw} height={sh} fill="url(#frameLeft)" />
            <rect x={sx} y={sy} width={sw} height={sh} fill="url(#frameRight)" />
            <rect x={sx} y={sy} width={sw} height={sh} fill="url(#frameBot)" />
            {/* sash edge */}
            <rect
              x={sx + 0.5}
              y={sy + 0.5}
              width={sw - 1}
              height={sh - 1}
              fill="none"
              stroke={shade(edge, -0.15)}
              strokeWidth={1}
            />
            {/* Glazing bead step (inner ridge around glass) */}
            <rect
              x={sx + SASH - sCh * 1.5}
              y={sy + SASH - sCh * 1.5}
              width={sw - (SASH - sCh * 1.5) * 2}
              height={sh - (SASH - sCh * 1.5) * 2}
              fill={shade(frame, 0.05)}
            />
            <rect
              x={sx + SASH - sCh * 1.5}
              y={sy + SASH - sCh * 1.5}
              width={sw - (SASH - sCh * 1.5) * 2}
              height={sh - (SASH - sCh * 1.5) * 2}
              fill="url(#beadHi)"
              opacity={0.6}
            />
            {/* Glazing rebate (dark gasket where glass sits) */}
            <rect
              x={sx + SASH - sCh * 0.5}
              y={sy + SASH - sCh * 0.5}
              width={sw - (SASH - sCh * 0.5) * 2}
              height={sh - (SASH - sCh * 0.5) * 2}
              fill={shade(edge, -0.5)}
            />
            {/* Glass */}
            <rect x={gx} y={gy} width={gw} height={gh} fill="url(#glass)" />
            {/* Diagonal light streak */}
            <rect x={gx} y={gy} width={gw} height={gh} fill="url(#glassReflect)" />
            {/* Subtle horizon line — fake landscape reflection */}
            <line
              x1={gx}
              y1={gy + gh * 0.62}
              x2={gx + gw}
              y2={gy + gh * 0.62}
              stroke="#ffffff"
              strokeOpacity={0.18}
              strokeWidth={0.6}
            />
            {/* Cavity depth shadow */}
            <rect x={gx} y={gy} width={gw} height={gh} fill="url(#glassDepth)" />
            {/* Glass spacer bar (warm-edge, around inner perimeter) */}
            <rect
              x={gx + sCh * 0.4}
              y={gy + sCh * 0.4}
              width={gw - sCh * 0.8}
              height={gh - sCh * 0.8}
              fill="none"
              stroke="#9aa3ad"
              strokeOpacity={0.55}
              strokeWidth={Math.max(0.6, sCh * 0.35)}
            />
            {/* Inner glass border */}
            <rect
              x={gx + 0.5}
              y={gy + 0.5}
              width={gw - 1}
              height={gh - 1}
              fill="none"
              stroke="#000"
              strokeOpacity={0.35}
              strokeWidth={1}
            />

            {/* Opening indicator */}
            {type.id !== "fixed" && (
              <OpeningIndicator
                x={sx}
                y={sy}
                w={sw}
                h={sh}
                inset={SASH + 4}
                tilt={tilt}
                isDoor={isDoor}
                side={sashCount === 1 ? "right" : i === 0 ? "right" : "left"}
              />
            )}

            {/* Handle */}
            {type.id !== "fixed" && (
              <Handle
                x={i === 0 ? sx + sw - SASH - 4 : sx + SASH + 4}
                y={isDoor ? sy + sh * 0.55 : sy + sh * 0.5}
                side={i === 0 ? "right" : "left"}
                color={edge}
                scale={scale}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};

const OpeningIndicator = ({
  x,
  y,
  w,
  h,
  inset,
  tilt,
  isDoor,
  side,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  inset: number;
  tilt: boolean;
  isDoor: boolean;
  side: "left" | "right";
}) => {
  // Keep the opening indicator strictly inside the glass area
  const pad = inset;
  const x1 = x + pad;
  const y1 = y + pad;
  const x2 = x + w - pad;
  const y2 = y + h - pad;
  // Hinge side — triangle apex
  const apexX = side === "left" ? x1 : x2;
  const apex = `${apexX},${(y1 + y2) / 2}`;
  // Opposite side corners
  const top = `${side === "left" ? x2 : x1},${y1}`;
  const bottom = `${side === "left" ? x2 : x1},${y2}`;

  return (
    <g stroke="#1f2937" strokeWidth={1} fill="none" opacity={0.45}>
      {/* Turn (open) triangle */}
      <polyline points={`${top} ${apex} ${bottom}`} strokeDasharray="4 3" />
      {/* Tilt indicator — second triangle with apex at bottom center */}
      {tilt && !isDoor && (
        <polyline
          points={`${x1 + 2},${y2} ${(x1 + x2) / 2},${y1 + 4} ${x2 - 2},${y2}`}
          strokeDasharray="2 3"
          opacity={0.9}
        />
      )}
    </g>
  );
};

const Handle = ({
  x,
  y,
  side,
  color,
  scale,
}: {
  x: number;
  y: number;
  side: "left" | "right";
  color: string;
  scale: number;
}) => {
  // Real-world handle dimensions (mm) → svg units
  const len = 140 * scale;
  const baseW = 50 * scale;
  const baseH = 60 * scale;
  const leverH = 24 * scale;
  const offset = 24 * scale;
  const baseX = side === "right" ? x - offset : x - offset;
  const leverX = side === "right" ? x - offset - len : x - offset;
  return (
    <g>
      {/* Soft shadow under handle */}
      <ellipse cx={side === "right" ? x - len / 2 : x + len / 2} cy={y + leverH * 1.4} rx={len / 1.6} ry={leverH * 0.5} fill="#000" opacity={0.18} />
      {/* Metal base plate */}
      <rect x={baseX} y={y - baseH / 2} width={baseW} height={baseH} rx={baseW * 0.25} fill={color} />
      <rect x={baseX} y={y - baseH / 2} width={baseW} height={baseH * 0.3} rx={baseW * 0.2} fill="#fff" opacity={0.25} />
      {/* Lever (chrome look) */}
      <rect x={leverX} y={y - leverH / 2} width={len} height={leverH} rx={leverH / 2} fill={color} />
      <rect x={leverX} y={y - leverH / 2} width={len} height={leverH * 0.35} rx={leverH / 2} fill="#fff" opacity={0.55} />
      <rect x={leverX} y={y + leverH * 0.25} width={len} height={leverH * 0.25} rx={leverH / 2} fill="#000" opacity={0.25} />
      {/* Pivot screw */}
      <circle cx={x} cy={y} r={baseW * 0.12} fill="#000" opacity={0.4} />
    </g>
  );
};

export default Configurator;