/**
 * The command deck visual: a radar sweep whose contacts are the domains
 * Moe works in. The sweep is a conic wedge; contacts pulse as it passes.
 * Neural synapse lines connect related domains. Pure SVG/CSS.
 */
export function OrbitalRadar({ size = 400 }: { size?: number }) {
  // Domain contacts, polar coords (angle°, orbit radius 0–1)
  const contacts = [
    { id: "kotlin", label: "KOTLIN", angle: -78, r: 0.92, primary: true },
    { id: "compose", label: "COMPOSE", angle: -18, r: 0.7, primary: true },
    { id: "arch", label: "ARCH", angle: 34, r: 0.86, primary: false },
    { id: "perf", label: "PERF", angle: 96, r: 0.62, primary: true },
    { id: "sync", label: "SYNC", angle: 152, r: 0.9, primary: false },
    { id: "sec", label: "SEC", angle: 206, r: 0.66, primary: false },
  ];

  const C = 50; // svg center in a 100-unit viewBox
  const pos = (angle: number, r: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: C + Math.cos(rad) * r * 46, y: C + Math.sin(rad) * r * 46 };
  };

  // Synapse relationships between domains
  const links: [string, string][] = [
    ["kotlin", "compose"],
    ["compose", "arch"],
    ["arch", "perf"],
    ["perf", "sync"],
    ["sync", "sec"],
    ["kotlin", "perf"],
  ];

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {/* bioluminescent bloom behind the dish */}
      <div
        aria-hidden
        className="absolute -inset-[14%] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(62,232,200,.28), rgba(185,140,255,.12) 45%, transparent 70%)",
        }}
      />

      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" role="img"
        aria-label="Radar sweep of engineering domains: Kotlin, Compose, Architecture, Performance, Sync, and Security, connected by neural synapses.">
        <defs>
          <radialGradient id="dish" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(62,232,200,.14)" />
            <stop offset="62%" stopColor="rgba(11,23,28,.5)" />
            <stop offset="100%" stopColor="rgba(5,10,13,.9)" />
          </radialGradient>
          <linearGradient id="beam" x1="50%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="rgba(62,232,200,.55)" />
            <stop offset="100%" stopColor="rgba(62,232,200,0)" />
          </linearGradient>
        </defs>

        {/* dish */}
        <circle cx={C} cy={C} r="47" fill="url(#dish)" />
        <circle cx={C} cy={C} r="47" fill="none" stroke="rgba(62,232,200,.35)" strokeWidth="0.5" />

        {/* graticule rings */}
        {[0.25, 0.5, 0.75].map((r) => (
          <circle
            key={r}
            cx={C}
            cy={C}
            r={r * 47}
            fill="none"
            stroke="rgba(62,232,200,.14)"
            strokeWidth="0.35"
          />
        ))}

        {/* cross hairs */}
        <line x1={C} y1="3" x2={C} y2="97" stroke="rgba(62,232,200,.1)" strokeWidth="0.35" />
        <line x1="3" y1={C} x2="97" y2={C} stroke="rgba(62,232,200,.1)" strokeWidth="0.35" />

        {/* orbital paths — dashed ellipses for a satellite feel */}
        <ellipse
          cx={C} cy={C} rx="44" ry="34"
          fill="none" stroke="rgba(242,160,61,.28)" strokeWidth="0.45"
          strokeDasharray="2 2.5"
          transform={`rotate(-16 ${C} ${C})`}
        />
        <ellipse
          cx={C} cy={C} rx="34" ry="43"
          fill="none" stroke="rgba(185,140,255,.22)" strokeWidth="0.45"
          strokeDasharray="2 2.5"
          transform={`rotate(24 ${C} ${C})`}
        />

        {/* synapse lines between domains */}
        {links.map(([a, b], i) => {
          const A = contacts.find((c) => c.id === a)!;
          const B = contacts.find((c) => c.id === b)!;
          const p1 = pos(A.angle, A.r);
          const p2 = pos(B.angle, B.r);
          const mx = (p1.x + p2.x) / 2 + (i % 2 === 0 ? 5 : -5);
          const my = (p1.y + p2.y) / 2 + (i % 2 === 0 ? -4 : 4);
          return (
            <path
              key={`${a}-${b}`}
              className="synapse"
              d={`M ${p1.x} ${p1.y} Q ${mx} ${my} ${p2.x} ${p2.y}`}
              fill="none"
              stroke="rgba(185,140,255,.5)"
              strokeWidth="0.4"
              style={{ animationDelay: `${i * 0.45}s` }}
            />
          );
        })}

        {/* radar sweep — conic wedge rotating about center */}
        <g className="sweep" style={{ transformOrigin: "50px 50px" }}>
          <path d={`M ${C} ${C} L ${C + 47} ${C} A 47 47 0 0 0 ${C + 18} ${C - 43} Z`} fill="url(#beam)" />
          <line x1={C} y1={C} x2={C + 47} y2={C} stroke="rgba(62,232,200,.85)" strokeWidth="0.6" />
        </g>

        {/* contacts */}
        {contacts.map((c, i) => {
          const p = pos(c.angle, c.r);
          const color = c.primary ? "#3ee8c8" : "#f2a03d";
          return (
            <g key={c.id}>
              {/* expanding ping */}
              <circle
                cx={p.x} cy={p.y} r="2.2"
                fill="none" stroke={color} strokeWidth="0.4"
                className="pulse-node"
                style={{ animationDelay: `${i * 0.5}s`, transformOrigin: `${p.x}px ${p.y}px` }}
              />
              <circle cx={p.x} cy={p.y} r="1.5" fill={color} />
              <text
                x={p.x}
                y={p.y - 4}
                textAnchor="middle"
                fontFamily="IBM Plex Mono, monospace"
                fontSize="3"
                letterSpacing="0.4"
                fill={color}
                opacity="0.95"
              >
                {c.label}
              </text>
            </g>
          );
        })}

        {/* nucleus */}
        <circle cx={C} cy={C} r="4.4" fill="rgba(62,232,200,.16)" />
        <circle cx={C} cy={C} r="2.1" fill="#3ee8c8" />
      </svg>

      {/* orbiting satellite marker on an amber path */}
      <div aria-hidden className="orbit absolute inset-0" style={{ animationDuration: "26s" }}>
        <span
          className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full"
          style={{
            background: "#f2a03d",
            boxShadow: "0 0 12px 3px rgba(242,160,61,.8)",
          }}
        />
      </div>
      <div aria-hidden className="orbit-rev absolute inset-[9%]" style={{ animationDuration: "34s" }}>
        <span
          className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
          style={{
            background: "#b98cff",
            boxShadow: "0 0 10px 2px rgba(185,140,255,.8)",
          }}
        />
      </div>
    </div>
  );
}
