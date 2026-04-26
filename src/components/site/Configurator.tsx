import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type WindowType =
  | "single"
  | "double"
  | "triple"
  | "balcony"
  | "fixed"
  | "tilt";

type Material = "pvc-white" | "pvc-anthracite" | "pvc-oak" | "al-anthracite" | "al-black" | "al-bronze";
type GlassType = "double" | "triple" | "triple-low-e";

const TYPES: { id: WindowType; label: string; desc: string; sashes: number; hasTilt: boolean; isDoor: boolean }[] = [
  { id: "single", label: "Jednokrilni", desc: "Otklopno-okretni, jedno krilo", sashes: 1, hasTilt: true, isDoor: false },
  { id: "double", label: "Dvokrilni", desc: "Dva krila sa srednjom letvicom", sashes: 2, hasTilt: true, isDoor: false },
  { id: "triple", label: "Trokrilni", desc: "Tri krila — panoramski pogled", sashes: 3, hasTilt: true, isDoor: false },
  { id: "fixed", label: "Fiksni", desc: "Bez otvaranja — maksimum svetla", sashes: 1, hasTilt: false, isDoor: false },
  { id: "tilt", label: "Samo kip", desc: "Otklopni prozor — ventilacija", sashes: 1, hasTilt: true, isDoor: false },
  { id: "balcony", label: "Balkonska vrata", desc: "Prozor + vrata za izlaz", sashes: 2, hasTilt: true, isDoor: true },
];

const MATERIALS: { id: Material; label: string; frame: string; edge: string; group: "PVC" | "ALU" }[] = [
  { id: "pvc-white", label: "PVC Belo", frame: "#f4f5f7", edge: "#cfd2d8", group: "PVC" },
  { id: "pvc-anthracite", label: "PVC Antracit", frame: "#3a3f45", edge: "#1f2226", group: "PVC" },
  { id: "pvc-oak", label: "PVC Zlatni hrast", frame: "#9a6b36", edge: "#5e3f1e", group: "PVC" },
  { id: "al-anthracite", label: "AL Antracit", frame: "#2c3033", edge: "#15181a", group: "ALU" },
  { id: "al-black", label: "AL Crni mat", frame: "#1a1b1d", edge: "#0a0b0c", group: "ALU" },
  { id: "al-bronze", label: "AL Bronza", frame: "#6b523a", edge: "#3b2c1e", group: "ALU" },
];

const GLASS: { id: GlassType; label: string; u: string; factor: number }[] = [
  { id: "double", label: "Dvoslojno 4-16-4", u: "U = 1.1 W/m²K", factor: 1 },
  { id: "triple", label: "Troslojno 4-12-4-12-4", u: "U = 0.7 W/m²K", factor: 1.28 },
  { id: "triple-low-e", label: "Troslojno Low-E + Argon", u: "U = 0.5 W/m²K", factor: 1.55 },
];

// Base price per m² by material + glass
const BASE_PRICE: Record<Material, number> = {
  "pvc-white": 140,
  "pvc-anthracite": 175,
  "pvc-oak": 185,
  "al-anthracite": 320,
  "al-black": 340,
  "al-bronze": 340,
};

export const Configurator = () => {
  const [type, setType] = useState<WindowType>("double");
  const [width, setWidth] = useState(1400); // mm
  const [height, setHeight] = useState(1400);
  const [material, setMaterial] = useState<Material>("pvc-white");
  const [glass, setGlass] = useState<GlassType>("triple");
  const [tilt, setTilt] = useState(true);

  const typeCfg = TYPES.find((t) => t.id === type)!;
  const mat = MATERIALS.find((m) => m.id === material)!;
  const glassCfg = GLASS.find((g) => g.id === glass)!;

  const area = (width * height) / 1_000_000;
  const price = Math.round(area * BASE_PRICE[material] * glassCfg.factor);

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
      `• Materijal / boja: ${mat.label}`,
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
  }, [typeCfg, width, height, area, mat, glassCfg, tilt, price]);

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
                  frame={mat.frame}
                  edge={mat.edge}
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

            {/* Material */}
            <div>
              <Label>Materijal i boja</Label>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MATERIALS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMaterial(m.id)}
                    className={cn(
                      "group border p-3 text-left transition-all duration-200",
                      material === m.id
                        ? "border-accent shadow-card"
                        : "border-border hover:border-foreground/40",
                    )}
                  >
                    <span
                      className="block h-8 w-full mb-2 border border-border/60"
                      style={{ background: m.frame }}
                    />
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {m.group}
                    </div>
                    <div className="text-xs text-foreground">{m.label.replace(/^(PVC|AL)\s/, "")}</div>
                  </button>
                ))}
              </div>
            </div>

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
  frame,
  edge,
  tilt,
}: {
  type: TypeCfg;
  width: number;
  height: number;
  frame: string;
  edge: string;
  tilt: boolean;
}) => {
  const FRAME = 14; // outer frame thickness
  const SASH = 10; // sash thickness
  const GAP = 2;

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
        {/* Frame highlight (top/left bevel) */}
        <linearGradient id="frameHi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        {/* Frame shadow (bottom/right bevel) */}
        <linearGradient id="frameLo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </linearGradient>
        {/* Soft shadow inside glass cavity */}
        <radialGradient id="glassDepth" cx="0.5" cy="0.5" r="0.7">
          <stop offset="60%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
        </radialGradient>
      </defs>

      {/* Outer frame with bevel */}
      <rect x={0} y={0} width={width} height={height} fill={frame} />
      <rect x={0} y={0} width={width} height={height} fill="url(#frameHi)" />
      <rect x={0} y={0} width={width} height={height} fill="url(#frameLo)" />
      <rect
        x={0.5}
        y={0.5}
        width={width - 1}
        height={height - 1}
        fill="none"
        stroke={edge}
        strokeWidth={1}
      />
      {/* Inner cutout — recessed look */}
      <rect x={innerX} y={innerY} width={innerW} height={innerH} fill={edge} opacity={0.35} />
      <rect
        x={innerX}
        y={innerY}
        width={innerW}
        height={2}
        fill="#000"
        opacity={0.25}
      />

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

        return (
          <g key={i}>
            {/* Sash frame with bevel */}
            <rect x={sx} y={sy} width={sw} height={sh} fill={frame} />
            <rect x={sx} y={sy} width={sw} height={sh} fill="url(#frameHi)" />
            <rect x={sx} y={sy} width={sw} height={sh} fill="url(#frameLo)" />
            <rect
              x={sx + 0.5}
              y={sy + 0.5}
              width={sw - 1}
              height={sh - 1}
              fill="none"
              stroke={edge}
              strokeWidth={1}
            />
            {/* Inner sash rebate (where glass sits) */}
            <rect
              x={sx + SASH - 2}
              y={sy + SASH - 2}
              width={sw - (SASH - 2) * 2}
              height={sh - (SASH - 2) * 2}
              fill={edge}
              opacity={0.5}
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
            {/* Inner glass border */}
            <rect
              x={gx + 0.5}
              y={gy + 0.5}
              width={gw - 1}
              height={gh - 1}
              fill="none"
              stroke="#000"
              strokeOpacity={0.2}
              strokeWidth={0.75}
            />

            {/* Opening indicator: dashed lines forming triangle */}
            {type.id !== "fixed" && <OpeningIndicator x={sx} y={sy} w={sw} h={sh} tilt={tilt} isDoor={isDoor} side={i === 0 ? "left" : i === sashCount - 1 ? "right" : "left"} />}

            {/* Handle */}
            {type.id !== "fixed" && (
              <Handle
                x={i === 0 ? sx + sw - SASH - 4 : sx + SASH + 4}
                y={isDoor ? sy + sh * 0.55 : sy + sh * 0.5}
                side={i === 0 ? "right" : "left"}
                color={edge}
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
  tilt,
  isDoor,
  side,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  tilt: boolean;
  isDoor: boolean;
  side: "left" | "right";
}) => {
  const pad = 12;
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
}: {
  x: number;
  y: number;
  side: "left" | "right";
  color: string;
}) => {
  const len = 18;
  return (
    <g fill={color}>
      <rect x={x - 3} y={y - 3} width={6} height={6} rx={1} />
      <rect
        x={side === "right" ? x - 3 - len : x - 3}
        y={y - 1.5}
        width={len}
        height={3}
        rx={1}
      />
    </g>
  );
};

export default Configurator;