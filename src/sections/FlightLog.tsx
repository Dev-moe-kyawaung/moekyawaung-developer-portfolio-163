import { Rocket, Layers, CheckCircle2 } from "lucide-react";
import { flightLog, flightLogMeta, type LogEntry } from "../data/site";
import { Reveal, DeckHeader } from "../components/Reveal";
import { cn } from "../utils/cn";

export function FlightLog() {
  return (
    <section
      id="flightlog"
      className="relative mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-7 sm:py-28"
    >
      <DeckHeader
        tracking="TRK-03"
        channel="Flight Record"
        title="Career"
        accent="trajectory"
        intro={flightLogMeta.subtitle}
      />

      {/* key */}
      <Reveal delay={90} className="mt-8 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em]">
        <span className="text-ink3">Marker key:</span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-bio/45 bg-bio/10 px-2.5 py-1 text-bio">
          <Rocket className="h-3 w-3" /> Shipped to production
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-signal/45 bg-signal/10 px-2.5 py-1 text-signal">
          <Layers className="h-3 w-3" /> Platform / architecture
        </span>
      </Reveal>

      <div className="relative mt-10 space-y-5 pl-7 sm:pl-10">
        {/* orbital trajectory line */}
        <div
          aria-hidden
          className="absolute bottom-3 left-[7px] top-3 w-px sm:left-[15px]"
          style={{
            background: "linear-gradient(180deg,#3ee8c8,#b98cff 52%,#f2a03d)",
            boxShadow: "0 0 12px rgba(62,232,200,.55)",
          }}
        />

        {flightLog.map((log: LogEntry, i: number) => {
          const shipped = log.kind === "production";
          const hue = shipped ? "#3ee8c8" : "#f2a03d";

          return (
            <Reveal key={log.id} delay={i * 75} as="article" className="relative">
              <span
                aria-hidden
                className="absolute -left-7 top-6 grid h-3.5 w-3.5 place-items-center rounded-full border-2 bg-void sm:-left-10"
                style={{ borderColor: hue, boxShadow: `0 0 12px ${hue}` }}
              >
                <span className="h-1 w-1 rounded-full" style={{ background: hue }} />
              </span>

              <div className="holo holo-live p-5 sm:p-6">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <span
                      className={cn(
                        "mb-2 inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.16em]",
                        shipped
                          ? "border-bio/45 bg-bio/10 text-bio"
                          : "border-signal/45 bg-signal/10 text-signal"
                      )}
                    >
                      {shipped ? <Rocket className="h-3 w-3" /> : <Layers className="h-3 w-3" />}
                      {shipped ? "Production release" : "Platform / architecture"}
                    </span>
                    <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                      {log.role}
                    </h3>
                    <p className="mt-0.5 font-mono text-[12px] text-bio">{log.org}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-ink3">
                    {log.dates}
                  </span>
                </div>

                <ul className="mt-4 space-y-2">
                  {log.readouts.map((r) => (
                    <li key={r} className="flex gap-2 text-[13.5px] leading-relaxed text-ink2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-bio" />
                      {r}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap items-center gap-1.5 border-t border-line pt-4">
                  <span className="mr-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink3">
                    Stack:
                  </span>
                  {log.stack.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
