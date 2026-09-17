import { ArrowDown, FileDown, Activity } from "lucide-react";
import { profile, telemetry } from "../data/site";
import { Reveal } from "../components/Reveal";
import { OrbitalRadar } from "../components/OrbitalRadar";
import { GithubIcon, LinkedinIcon } from "../components/icons";

export function Hero({ onOracle }: { onOracle: () => void }) {
  const jump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="top" className="relative overflow-hidden pt-24 pb-12 sm:pt-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-[58%] h-px bg-gradient-to-r from-transparent via-line2 to-transparent" />
        <div
          className="absolute -right-24 top-10 h-80 w-80 rounded-full opacity-25 blur-[110px]"
          style={{ background: "radial-gradient(circle, var(--color-bio) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-7">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          {/* ---- mission statement ---- */}
          <div>
            <Reveal className="eyebrow">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bio opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-bio" />
              </span>
              {profile.availability.status}
            </Reveal>

            <Reveal delay={70}>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-bio">
                {profile.title}
              </p>
              <h1 className="mt-3 font-display text-[clamp(2.3rem,1.1rem+5vw,4.4rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-ink">
                {profile.name.split(" ")[0]}{" "}
                <span className="text-bio">{profile.name.split(" ").slice(1).join(" ")}</span>
              </h1>
              <p className="mt-3 font-mono text-[12.5px] uppercase tracking-[0.14em] text-ink2">
                {profile.specialization}
              </p>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-ink2">
                {profile.positioning}
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#missions" onClick={jump("missions")} className="btn btn-bio">
                  View Missions
                  <ArrowDown className="h-4 w-4" />
                </a>
                <button onClick={onOracle} className="btn btn-ghost">
                  <Activity className="h-4 w-4 text-bio" />
                  Wake ORACLE
                </button>
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn border border-line bg-panel/70 text-ink2 hover:text-ink"
                >
                  <FileDown className="h-4 w-4" />
                  Resume
                </a>
              </div>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-7 flex items-center gap-2.5">
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="grid h-10 w-10 place-items-center rounded-full border border-line bg-panel text-ink2 transition-colors hover:border-bio hover:text-bio"
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="grid h-10 w-10 place-items-center rounded-full border border-line bg-panel text-ink2 transition-colors hover:border-bio hover:text-bio"
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
                <span className="ml-1.5 font-mono text-[11px] text-ink3">{profile.location}</span>
              </div>
            </Reveal>
          </div>

          {/* ---- radar ---- */}
          <Reveal delay={150} className="flex justify-center">
            <div className="relative">
              <OrbitalRadar size={360} />
              <span className="absolute -left-1 top-3 hidden rounded border border-line2 bg-void/85 px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-bio sm:block">
                6 domains tracked
              </span>
              <span className="absolute -bottom-2 right-0 hidden rounded border border-signal/40 bg-void/85 px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-signal sm:block">
                sweep active
              </span>
            </div>
          </Reveal>
        </div>

        {/* ---- telemetry strip ---- */}
        <Reveal delay={230} className="mt-14">
          <div className="holo overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <span className="eyebrow text-[10px]">
                <Activity className="h-3.5 w-3.5" />
                Live Telemetry
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink3">
                telemetry.json
              </span>
            </div>
            <dl className="grid grid-cols-2 sm:grid-cols-4">
              {telemetry.slice(0, 8).map((t, i) => (
                <div
                  key={t.label}
                  className="border-b border-line px-4 py-3.5 [&:nth-child(odd)]:border-r sm:[&:nth-child(2)]:border-b-0 sm:[&:nth-child(4)]:border-b-0 sm:[&:nth-child(6)]:border-b-0 sm:[&:nth-child(8)]:border-b-0"
                >
                  <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink3">
                    {t.label}
                  </dt>
                  <dd
                    className="mt-1 font-display text-lg font-bold tracking-tight"
                    style={{ color: i % 3 === 1 ? "#f2a03d" : "#3ee8c8" }}
                  >
                    {t.value}
                  </dd>
                  <dd className="font-mono text-[9.5px] text-ink3">{t.unit}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
