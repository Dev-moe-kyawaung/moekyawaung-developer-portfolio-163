import { useEffect, useRef, useState } from "react";
import { X, Waypoints, Compass } from "lucide-react";
import { cn } from "../utils/cn";

/* ------------------------------------------------------------------
   ORACLE — a living system intelligence. Part organism, part
   mission operator. It renders Moe's architecture as neural
   pathways and guides visitors through the command deck.
------------------------------------------------------------------ */

type Pathway = {
  id: string;
  menu: string;
  title: string;
  signal: string;
  body: string;
  neurons: { id: string; label: string; x: number; y: number }[];
  links: [string, string][];
  facts: string[];
};

const PATHWAYS: Pathway[] = [
  {
    id: "render",
    menu: "Render Cortex",
    title: "RENDER CORTEX",
    signal: "60FPS LOCKED",
    body: "Intents enter one reducer; a single StateFlow hands Compose an immutable snapshot. Stability contracts do the rest.",
    neurons: [
      { id: "i", label: "INTENT", x: 10, y: 50 },
      { id: "r", label: "REDUCER", x: 36, y: 22 },
      { id: "s", label: "STATEFLOW", x: 64, y: 62 },
      { id: "u", label: "COMPOSE", x: 90, y: 40 },
    ],
    links: [["i", "r"], ["i", "s"], ["r", "u"], ["s", "u"]],
    facts: [
      "Compose skips a composable only when inputs are stable and equal.",
      "Lambda-deferred reads scope invalidation to draw, not composition.",
      "Macrobenchmark in CI blocks a merge that regresses the frame budget.",
    ],
  },
  {
    id: "sync",
    menu: "Sync Organism",
    title: "SYNC ORGANISM",
    signal: "0 DATA LOSS",
    body: "Room is the organism's memory. The network is a nutrient source, not a prerequisite for consciousness.",
    neurons: [
      { id: "w", label: "WRITE", x: 9, y: 54 },
      { id: "o", label: "OUTBOX", x: 36, y: 22 },
      { id: "k", label: "WORKER", x: 64, y: 64 },
      { id: "c", label: "CLOUD", x: 91, y: 38 },
    ],
    links: [["w", "o"], ["w", "k"], ["o", "k"], ["k", "c"]],
    facts: [
      "Outbox rows commit in the same SQLite transaction as the UI state.",
      "Expedited WorkManager survives process death, reboot, and Doze.",
      "WebSockets accelerate the foreground; they are never the truth.",
    ],
  },
  {
    id: "concurrency",
    menu: "Concurrency Web",
    title: "CONCURRENCY WEB",
    signal: "FULLY SCOPED",
    body: "suspend for imperative one-shots, cold Flow for streams, StateFlow at the sensory boundary.",
    neurons: [
      { id: "s", label: "SCOPE", x: 10, y: 48 },
      { id: "f", label: "FLOW", x: 37, y: 20 },
      { id: "sf", label: "STATEFLOW", x: 66, y: 60 },
      { id: "v", label: "SCREEN", x: 91, y: 34 },
    ],
    links: [["s", "f"], ["s", "sf"], ["f", "sf"], ["sf", "v"]],
    facts: [
      "Cancellation is inherited, never hand-rolled.",
      "Cold Flows are inert until something collects them.",
      "SharedFlow is reserved for genuine one-shot events.",
    ],
  },
  {
    id: "genome",
    menu: "Module Genome",
    title: "MODULE GENOME",
    signal: "9 MIN BUILDS",
    body: "Features are organs on a thin shared core. The dependency direction is enforced, so the architecture cannot rot quietly.",
    neurons: [
      { id: "c", label: ":CORE", x: 9, y: 50 },
      { id: "f", label: ":FEATURE", x: 37, y: 22 },
      { id: "d", label: ":DATA", x: 37, y: 70 },
      { id: "p", label: "PLAY", x: 80, y: 46 },
    ],
    links: [["c", "f"], ["c", "d"], ["f", "p"], ["d", "p"]],
    facts: [
      "A feature importing another feature fails the build in CI.",
      "Convention plugins keep Gradle config from drifting per module.",
      "Clean builds dropped from ~20 min to under 9 after the split.",
    ],
  },
  {
    id: "metabolism",
    menu: "Perf Metabolism",
    title: "PERF METABOLISM",
    signal: "240MS COLD",
    body: "Measure on device, budget in CI, ship the profile. Performance is a metabolic cycle, not a cleanup sprint.",
    neurons: [
      { id: "t", label: "TRACE", x: 9, y: 46 },
      { id: "b", label: "BASELINE", x: 37, y: 74 },
      { id: "m", label: "MACROBENCH", x: 65, y: 22 },
      { id: "g", label: "60FPS", x: 91, y: 50 },
    ],
    links: [["t", "b"], ["t", "m"], ["b", "m"], ["m", "g"]],
    facts: [
      "Startup tracing exposed main-thread I/O hiding in DI init.",
      "Baseline Profiles AOT-compile the hot path — first run stops janking.",
      "Budgets are reviewed like product requirements, with numbers attached.",
    ],
  },
];

/* ---------------- living organism avatar ---------------- */

function Organism({ size = 92, awake = true }: { size?: number; awake?: boolean }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} aria-hidden="true">
      {/* bioluminescent bloom */}
      <div
        className="absolute -inset-1/3 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(62,232,200,.4), rgba(185,140,255,.16) 48%, transparent 72%)",
        }}
      />
      {/* dendrite ring — slow orbit */}
      <div className={cn("absolute inset-0", awake && "orbit")} style={{ animationDuration: "18s" }}>
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {[0, 60, 120, 180, 240, 300].map((a) => {
            const rad = ((a - 90) * Math.PI) / 180;
            const x1 = 50 + Math.cos(rad) * 24;
            const y1 = 50 + Math.sin(rad) * 24;
            const x2 = 50 + Math.cos(rad) * 42;
            const y2 = 50 + Math.sin(rad) * 42;
            return (
              <g key={a}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(62,232,200,.35)" strokeWidth="0.7" />
                <circle cx={x2} cy={y2} r="1.7" fill="#3ee8c8" />
              </g>
            );
          })}
        </svg>
      </div>
      {/* nucleus */}
      <div
        className={cn("absolute inset-[26%] rounded-full", awake && "breathe")}
        style={{
          background:
            "radial-gradient(circle at 38% 32%, #d9fff6, #3ee8c8 42%, #0d5f52 88%)",
          boxShadow: "0 0 26px -4px rgba(62,232,200,.85), inset 0 -6px 14px rgba(4,30,26,.6)",
        }}
      />
    </div>
  );
}

/* ---------------- neural pathway board ---------------- */

function PathwayBoard({ p }: { p: Pathway }) {
  const byId = Object.fromEntries(p.neurons.map((n) => [n.id, n]));
  return (
    <svg viewBox="0 0 100 96" className="w-full" role="img"
      aria-label={`${p.title}: ${p.neurons.map((n) => n.label).join(" to ")}`}>
      <rect x="0" y="0" width="100" height="96" rx="5" fill="rgba(5,10,13,.6)" />
      {[...Array(7)].map((_, i) => (
        <line key={i} x1="0" y1={i * 16} x2="100" y2={i * 16}
          stroke="rgba(62,232,200,.07)" strokeWidth="0.5" />
      ))}
      {p.links.map(([a, b], i) => {
        const A = byId[a];
        const B = byId[b];
        if (!A || !B) return null;
        return (
          <g key={i}>
            <line x1={A.x} y1={A.y} x2={B.x} y2={B.y}
              stroke="rgba(62,232,200,.2)" strokeWidth="0.7" />
            <line x1={A.x} y1={A.y} x2={B.x} y2={B.y}
              className="flow-line" stroke="#3ee8c8" strokeWidth="0.9"
              style={{ animationDelay: `${i * 0.3}s` }} />
            <circle cx={B.x} cy={B.y} r="1.6" fill="#b98cff" />
          </g>
        );
      })}
      {p.neurons.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r="6" fill="rgba(11,23,28,.95)"
            stroke="#3ee8c8" strokeWidth="0.6" />
          <text x={n.x} y={n.y + 1.6} textAnchor="middle"
            fontFamily="IBM Plex Mono, monospace" fontSize="3.4" fill="#d9fff6">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ---------------- the dialog ---------------- */

export function Oracle({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [i, setI] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const p = PATHWAYS[i];

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => closeRef.current?.focus(), 30);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key === "Tab" && boxRef.current) {
        const f = boxRef.current.querySelectorAll<HTMLElement>("button");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <button aria-label="Close ORACLE" onClick={onClose}
        className="absolute inset-0 bg-void/88 backdrop-blur-sm" />

      <div
        ref={boxRef}
        role="dialog"
        aria-modal="true"
        aria-label="ORACLE system intelligence"
        className="holo relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden"
      >
        {/* header — the organism */}
        <div className="flex items-center gap-3.5 border-b border-line bg-panel2/60 px-4 py-3.5">
          <Organism size={56} />
          <div className="min-w-0">
            <p className="font-display text-[13px] font-bold uppercase tracking-[0.18em] text-ink">
              ORACLE
            </p>
            <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-bio">
              System intelligence · neural link stable
            </p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close ORACLE"
            className="ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-md border border-line text-ink3 transition-colors hover:border-bio hover:text-bio"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 md:grid-cols-[176px_1fr]">
          {/* pathway selector */}
          <nav aria-label="Neural pathways" className="shrink-0 border-b border-line p-2.5 md:border-b-0 md:border-r">
            <p className="px-2 pb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-ink3">
              ▸ Pathways
            </p>
            <div className="flex gap-1.5 overflow-x-auto md:flex-col md:overflow-visible">
              {PATHWAYS.map((pw, idx) => (
                <button
                  key={pw.id}
                  onClick={() => setI(idx)}
                  aria-pressed={idx === i}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded px-2.5 py-2 text-left font-mono text-[11px] uppercase tracking-[0.06em] transition-colors",
                    idx === i ? "bg-bio/12 text-bio" : "text-ink3 hover:bg-panel hover:text-ink2"
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 shrink-0 rounded-full",
                      idx === i ? "bg-bio shadow-[0_0_8px_#3ee8c8]" : "bg-line-strong"
                    )}
                  />
                  {pw.menu}
                </button>
              ))}
            </div>
          </nav>

          {/* readout */}
          <div className="min-h-0 overflow-y-auto p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-[15px] font-bold uppercase tracking-[0.1em] text-ink">
                {p.title}
              </h3>
              <span className="rounded border border-bio/40 bg-bio/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-bio">
                {p.signal}
              </span>
            </div>

            <p className="mt-2 text-[13.5px] leading-relaxed text-ink2">{p.body}</p>

            <div className="mt-4 rounded-lg border border-line bg-void/55 p-2.5">
              <PathwayBoard p={p} />
            </div>

            <ul className="mt-4 space-y-2">
              {p.facts.map((f) => (
                <li key={f} className="flex gap-2 text-[13px] leading-relaxed text-ink2">
                  <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neural" />
                  {f}
                </li>
              ))}
            </ul>

            {/* guidance row — the "mission operator" half */}
            <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
              {[
                { label: "Show missions", id: "missions" },
                { label: "Show decisions", id: "neural" },
                { label: "Show experience", id: "flightlog" },
                { label: "Contact Moe", id: "uplink" },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => {
                    onClose();
                    setTimeout(
                      () => document.getElementById(g.id)?.scrollIntoView({ behavior: "smooth", block: "start" }),
                      60
                    );
                  }}
                  className="btn border border-line2 bg-panel/60 px-3 py-1.5 text-[10.5px] text-bio hover:border-bio"
                >
                  <Compass className="h-3.5 w-3.5" />
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-line bg-panel2/60 px-4 py-2.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink3">
          <span className="flex items-center gap-2">
            <Waypoints className="h-3.5 w-3.5 text-bio" />
            {PATHWAYS.length} pathways indexed · grounded in production work
          </span>
          <span className="hidden sm:inline">Esc to disconnect</span>
        </div>
      </div>
    </div>
  );
}

/** Floating organic trigger. */
export function OracleTrigger({ onOpen, hidden }: { onOpen: () => void; hidden: boolean }) {
  return (
    <button
      onClick={onOpen}
      aria-label="Wake ORACLE system intelligence"
      className={cn(
        "group fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full border border-bio/50 bg-deep/92 py-2.5 pl-2.5 pr-4 backdrop-blur transition-all duration-300",
        "hover:border-bio hover:shadow-[0_0_30px_-6px_rgba(62,232,200,.9)]",
        hidden ? "pointer-events-none translate-y-4 opacity-0" : "opacity-100"
      )}
    >
      <span className="relative h-7 w-7">
        <Organism size={28} />
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink2 transition-colors group-hover:text-bio">
        Ask ORACLE
      </span>
    </button>
  );
}
