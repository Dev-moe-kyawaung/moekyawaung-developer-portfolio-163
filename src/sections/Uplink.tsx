import { useState } from "react";
import { Mail, Calendar, FileDown, Copy, Check, Satellite } from "lucide-react";
import { profile } from "../data/site";
import { Reveal } from "../components/Reveal";
import { GithubIcon, LinkedinIcon } from "../components/icons";

export function Uplink() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1900);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section
      id="uplink"
      className="relative mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-7 sm:py-28"
    >
      <Reveal>
        <div className="holo scanline relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-28 h-60 opacity-70"
            style={{
              background:
                "radial-gradient(ellipse at 50% 100%, rgba(62,232,200,.3), transparent 66%)",
              filter: "blur(30px)",
            }}
          />

          <div className="relative p-7 sm:p-11">
            <span className="eyebrow">
              <Satellite className="h-3.5 w-3.5" />
              Uplink established
              <span className="led h-1.5 w-1.5 rounded-full bg-bio" />
            </span>

            <h2 className="mt-5 max-w-3xl font-display text-[clamp(1.9rem,1.1rem+3.4vw,3.4rem)] font-extrabold leading-[1.05] tracking-tight text-ink">
              Open to Senior &amp; Staff
              <span className="text-bio"> Android roles.</span>
            </h2>

            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink2">
              {profile.availability.type} · {profile.availability.locationPreference}. Recruiters
              skip forms — mail me directly or book a 30-minute architecture call. I reply inside 24
              hours.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              <a href={`mailto:${profile.email}`} className="btn btn-bio">
                <Mail className="h-4 w-4" />
                {profile.email}
              </a>
              <button onClick={copy} className="btn btn-ghost" aria-label="Copy email address">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <a
                href={profile.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn border border-line bg-panel/70 text-ink2 hover:text-ink"
              >
                <Calendar className="h-4 w-4 text-bio" />
                Book 30 min
              </a>
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn border border-line bg-panel/70 text-ink2 hover:text-ink"
              >
                <FileDown className="h-4 w-4 text-bio" />
                Resume PDF
              </a>
            </div>

            <div className="mt-9 grid gap-2.5 border-t border-line pt-8 sm:grid-cols-3">
              {[
                {
                  label: "GitHub",
                  value: profile.githubHandle,
                  href: profile.githubUrl,
                  Icon: GithubIcon,
                },
                {
                  label: "LinkedIn",
                  value: profile.linkedinHandle,
                  href: profile.linkedinUrl,
                  Icon: LinkedinIcon,
                },
              ].map(({ label, value, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-lg border border-line bg-void/50 p-3.5 transition-colors hover:border-bio/60"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-md border border-line bg-panel text-ink2 transition-colors group-hover:text-bio">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink3">
                      {label}
                    </span>
                    <span className="block truncate font-mono text-[12.5px] text-ink">{value}</span>
                  </span>
                </a>
              ))}

              <div className="flex items-center gap-3 rounded-lg border border-line bg-void/50 p-3.5">
                <span className="grid h-9 w-9 place-items-center rounded-md border border-signal/40 bg-signal/10 text-signal">
                  <Satellite className="h-4 w-4" />
                </span>
                <span>
                  <span className="block font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink3">
                    Timezone overlap
                  </span>
                  <span className="block font-mono text-[12.5px] text-ink">EU · US · APAC</span>
                </span>
              </div>
            </div>

            <p className="mt-7 border-t border-line/70 pt-5 font-mono text-[11px] leading-relaxed text-ink3">
              <span className="text-bio">■</span> {profile.trustSignal}
            </p>
          </div>
        </div>
      </Reveal>

      <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-ink3 sm:flex-row">
        <span>© {new Date().getFullYear()} {profile.name} · Orbital Command {profile.callsign}</span>
        <span className="flex items-center gap-2">
          Kotlin <span className="text-ink3">/</span> Compose{" "}
          <span className="text-ink3">/</span> <span className="text-bio">60fps</span>
        </span>
      </footer>
    </section>
  );
}
