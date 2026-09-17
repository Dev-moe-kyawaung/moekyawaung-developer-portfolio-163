import { ArrowUpRight } from "lucide-react";
import { missions, missionsMeta, type Mission } from "../data/site";
import { HoloIn, DeckHeader } from "../components/Reveal";
import { GithubIcon, PlayStoreIcon } from "../components/icons";
import { cn } from "../utils/cn";

/** Animated telemetry counter — keeps prefix/suffix/sign intact. */
function Counter({ value }: { value: string }) {
  const m = value.match(/^([^\d-−]*)(-|−)?([\d.]+)(.*)$/);
  if (!m) return <>{value}</>;
  const [, prefix, sign, raw, suffix] = m;
  const target = parseFloat(raw);
  if (Number.isNaN(target)) return <>{value}</>;
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
  return (
    <span data-target={target} data-decimals={decimals}>
      {prefix}
      {sign ?? ""}
      <AnimatedNumber target={target} decimals={decimals} />
      {suffix}
    </span>
  );
}

import { useEffect, useRef, useState } from "react";

function AnimatedNumber({ target, decimals }: { target: number; decimals: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(target);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / 950);
          setN(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) raf = requestAnimationFrame(tick);
          else setN(target);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target]);

  return <span ref={ref}>{n.toFixed(decimals)}</span>;
}

function MissionPanel({ mission, index }: { mission: Mission; index: number }) {
  const wide = mission.span === "wide";

  return (
    <HoloIn
      as="article"
      delay={index * 70}
      className={cn("holo holo-live scanline relative flex flex-col", wide ? "lg:col-span-2" : "")}
    >
      {/* mission header strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bio">
            {mission.designation}
          </span>
          <span aria-hidden className="h-3 w-px bg-line" />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink3">
            {mission.domain}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip border-bio/35 text-bio">{mission.classification}</span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink3">
            <span className="h-1.5 w-1.5 rounded-full bg-bio shadow-[0_0_8px_#3ee8c8]" />
            {mission.status}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
          {mission.name}
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-ink2">{mission.summary}</p>

        {/* failure mode → countermeasure, the engineering payload */}
        <div className={cn("mt-5 grid gap-3", wide ? "sm:grid-cols-2" : "grid-cols-1")}>
          <div className="rounded-lg border border-signal/25 bg-signal/[0.05] p-3.5">
            <p className="mb-1 font-mono text-[9.5px] uppercase tracking-[0.18em] text-signal">
              ▾ Failure mode
            </p>
            <p className="text-[13px] leading-relaxed text-ink2">{mission.failureMode}</p>
          </div>
          <div className="rounded-lg border border-bio/25 bg-bio/[0.05] p-3.5">
            <p className="mb-1 font-mono text-[9.5px] uppercase tracking-[0.18em] text-bio">
              ▴ Countermeasure
            </p>
            <p className="text-[13px] leading-relaxed text-ink2">{mission.countermeasure}</p>
          </div>
        </div>

        {/* telemetry */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {mission.telemetry.map((t, i) => (
            <div key={t.label} className="rounded-lg border border-line bg-void/55 px-3 py-2.5">
              <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink3">
                {t.label}
              </div>
              <div
                className="mt-0.5 font-display text-base font-bold tracking-tight"
                style={{ color: i === 1 ? "#f2a03d" : "#3ee8c8" }}
              >
                <Counter value={t.value} />
              </div>
              <div aria-hidden className="mt-2 h-px w-full overflow-hidden bg-line">
                <div
                  className="fill-x h-px w-full"
                  style={{
                    background: "linear-gradient(90deg,#3ee8c8,#b98cff)",
                    animationDelay: `${280 + i * 130}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {mission.stack.map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
        </div>

        {/* deep links */}
        <div className="mt-auto flex flex-wrap gap-2.5 pt-6">
          <a
            href={mission.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-bio flex-1 px-3 py-2 text-[11px]"
            aria-label={`${mission.name} on Google Play`}
          >
            <PlayStoreIcon className="h-3.5 w-3.5" />
            Play Store
          </a>
          <a
            href={mission.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost flex-1 px-3 py-2 text-[11px]"
            aria-label={`${mission.name} source on GitHub`}
          >
            <GithubIcon className="h-3.5 w-3.5" />
            Source
            <ArrowUpRight className="h-3 w-3 opacity-60" />
          </a>
        </div>
      </div>
    </HoloIn>
  );
}

export function Missions() {
  return (
    <section
      id="missions"
      className="relative mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-7 sm:py-28"
    >
      <DeckHeader
        tracking="TRK-01"
        channel="Mission Logs"
        title="Shipped"
        accent="systems"
        intro={missionsMeta.subtitle}
      />

      <div
        className="mt-12 grid gap-5 lg:grid-cols-2"
        style={{ perspective: "1600px" }}
      >
        {missions.map((m, i) => (
          <MissionPanel key={m.id} mission={m} index={i} />
        ))}
      </div>
    </section>
  );
}
