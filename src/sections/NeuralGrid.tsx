import { useState } from "react";
import { ChevronDown, GitFork, Check, X } from "lucide-react";
import { clusters, synapsesMeta, type Synapse } from "../data/site";
import { Reveal, DeckHeader } from "../components/Reveal";
import { cn } from "../utils/cn";

/** A neural cluster: nodes as neurons, links as synapses that fire. */
function ClusterViz({ s }: { s: Synapse }) {
  const byId = Object.fromEntries(s.synapses.map((n) => [n.id, n]));
  return (
    <svg viewBox="0 0 100 88" className="h-32 w-full" role="img"
      aria-label={`Neural pathway: ${s.synapses.map((n) => n.label).join(" linked to ")}`}>
      {s.links.map(([a, b], i) => {
        const A = byId[a];
        const B = byId[b];
        if (!A || !B) return null;
        return (
          <g key={`${a}-${b}`}>
            <line
              x1={A.x} y1={A.y} x2={B.x} y2={B.y}
              stroke="rgba(185,140,255,.28)" strokeWidth="0.5"
            />
            <line
              className="synapse"
              x1={A.x} y1={A.y} x2={B.x} y2={B.y}
              stroke="url(#synapse-grad)" strokeWidth="0.8"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          </g>
        );
      })}
      <defs>
        <linearGradient id="synapse-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3ee8c8" />
          <stop offset="100%" stopColor="#b98cff" />
        </linearGradient>
      </defs>
      {s.synapses.map((n, i) => (
        <g key={n.id}>
          <circle
            cx={n.x} cy={n.y} r="3.4"
            fill="none" stroke="#b98cff" strokeWidth="0.45"
            className="pulse-node"
            style={{
              animationDelay: `${i * 0.6}s`,
              transformOrigin: `${n.x}px ${n.y}px`,
            }}
          />
          <circle cx={n.x} cy={n.y} r="2.1" fill="#0b171c" stroke="#3ee8c8" strokeWidth="0.7" />
          <circle cx={n.x} cy={n.y} r="0.9" fill="#7ff5e0" />
          <text
            x={n.x} y={n.y - 5.5}
            textAnchor="middle"
            fontFamily="IBM Plex Mono, monospace"
            fontSize="3.1"
            fill="#a3bfb9"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function PathwayCard({ cluster, defaultOpen }: { cluster: Synapse; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const id = `path-${cluster.id}`;

  return (
    <div className={cn("holo overflow-hidden", open && "border-line2")}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-panel2/50 sm:px-5"
        >
          <span
            aria-hidden
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-md border font-mono text-[10px] font-bold transition-colors",
              open ? "border-bio/60 bg-bio/12 text-bio" : "border-line bg-void/60 text-ink3"
            )}
          >
            <GitFork className="h-4 w-4" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="mb-1 flex flex-wrap items-center gap-2">
              <span className="chip border-bio/35 text-bio">{cluster.region}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink3">
                {cluster.ref}
              </span>
            </span>
            <span className="block font-display text-[16px] font-bold tracking-tight text-ink sm:text-[17px]">
              {cluster.title}
            </span>
          </span>

          <ChevronDown
            aria-hidden
            className={cn(
              "h-5 w-5 shrink-0 text-ink3 transition-transform duration-300",
              open && "rotate-180 text-bio"
            )}
          />
        </button>
      </h3>

      <div
        id={id}
        role="region"
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-5 border-t border-line bg-void/40 p-5 sm:p-6">
            {/* neural pathway viz */}
            <div className="rounded-lg border border-line bg-void/55 p-3">
              <ClusterViz s={cluster} />
            </div>

            <div>
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-bio">
                01 — Context
              </p>
              <p className="text-[13.5px] leading-relaxed text-ink2">{cluster.context}</p>
            </div>

            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bio">
                02 — Branches considered
              </p>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {cluster.branches.map((b) => (
                  <div key={b.name} className="rounded-lg border border-line bg-panel/60 p-3.5">
                    <p className="font-mono text-[11px] font-bold text-neural">{b.name}</p>
                    <p className="mt-2 flex gap-1.5 text-[11.5px] leading-relaxed text-ink2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-bio" />
                      {b.gain}
                    </p>
                    <p className="mt-1.5 flex gap-1.5 text-[11.5px] leading-relaxed text-ink3">
                      <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-signal" />
                      {b.cost}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-bio/35 bg-bio/[0.06] p-4">
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-bio">
                03 — Committed pathway
              </p>
              <p className="font-mono text-[12.5px] leading-relaxed text-ink">{cluster.pathway}</p>
            </div>

            <div>
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-bio">
                04 — Why it survives production
              </p>
              <p className="text-[13.5px] leading-relaxed text-ink2">{cluster.reason}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NeuralGrid() {
  return (
    <section
      id="neural"
      className="relative mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-7 sm:py-28"
    >
      <DeckHeader
        tracking="TRK-02"
        channel="Neural Architecture"
        title="How I"
        accent="think"
        intro={synapsesMeta.subtitle}
      />

      <div className="mt-12 space-y-4">
        {clusters.map((c, i) => (
          <Reveal key={c.id} delay={i * 60}>
            <PathwayCard cluster={c} defaultOpen={i === 0} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
