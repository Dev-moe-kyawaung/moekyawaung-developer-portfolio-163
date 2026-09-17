import { useEffect, useState } from "react";
import { Menu, X, FileText } from "lucide-react";
import { profile } from "../data/site";
import { SatelliteIcon } from "./icons";
import { cn } from "../utils/cn";

const CHANNELS = [
  { id: "missions", label: "Missions" },
  { id: "neural", label: "Neural" },
  { id: "flightlog", label: "Flight Log" },
  { id: "uplink", label: "Uplink" },
];

export function Nav({ onOracle }: { onOracle: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("missions");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = CHANNELS.map((c) => document.getElementById(c.id)).filter(
      (e): e is HTMLElement => !!e
    );
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) setActive(vis.target.id);
      },
      { rootMargin: "-42% 0px -48% 0px", threshold: [0, 0.2, 0.6] }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open ? "border-b border-line bg-void/88 backdrop-blur-lg" : "border-b border-transparent"
      )}
    >
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-7">
        <a href="#top" className="group flex items-center gap-2.5">
          <span
            aria-hidden
            className="relative grid h-8 w-8 place-items-center rounded-full border border-line2 bg-panel text-bio transition-colors group-hover:border-bio"
          >
            <SatelliteIcon className="h-4 w-4" />
            <span className="pulse-node absolute inset-0 rounded-full border border-bio/60" />
          </span>
          <span className="font-display text-[13px] font-bold tracking-[0.12em] text-ink">
            {profile.callsign}
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-ink3 sm:block">
            / COMMAND
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {CHANNELS.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => go(c.id)}
                aria-current={active === c.id ? "true" : undefined}
                className={cn(
                  "rounded-md px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors",
                  active === c.id ? "bg-bio/12 text-bio" : "text-ink3 hover:bg-panel hover:text-ink2"
                )}
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={onOracle}
            className="hidden items-center gap-1.5 rounded-md border border-line2 bg-panel px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-bio transition-colors hover:border-bio sm:flex"
          >
            <span className="led h-1.5 w-1.5 rounded-full bg-bio" />
            ORACLE
          </button>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-md border border-line bg-panel px-3 py-1.5 font-mono text-[11px] text-ink2 transition-colors hover:border-bio/60 hover:text-bio md:flex"
          >
            <FileText className="h-3.5 w-3.5" />
            Resume
          </a>
          <button onClick={() => go("uplink")} className="btn btn-bio px-3.5 py-1.5 text-[11px]">
            Contact
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center rounded-md border border-line bg-panel text-ink lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line bg-deep/96 px-5 py-3 lg:hidden">
          <ul className="mx-auto max-w-6xl space-y-1">
            {CHANNELS.map((c, i) => (
              <li key={c.id}>
                <button
                  onClick={() => go(c.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded px-3 py-3 font-mono text-sm uppercase tracking-[0.1em]",
                    active === c.id ? "bg-bio/12 text-bio" : "text-ink2"
                  )}
                >
                  {c.label}
                  <span className="text-[10px] text-ink3">0{i + 1}</span>
                </button>
              </li>
            ))}
            <li className="pt-1">
              <button onClick={() => { setOpen(false); onOracle(); }} className="btn btn-ghost w-full">
                Wake ORACLE
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
