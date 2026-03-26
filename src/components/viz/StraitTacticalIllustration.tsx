/**
 * The Strait from Above — Tactical Geography
 * Refined editorial diagram showing the narrowness, the threat proximity,
 * and the asymmetry of control. Not trying to be a map — the HormuzMap
 * component handles that. This is a TACTICAL SCHEMATIC.
 *
 * Design: horizontal strip showing the 10km navigable corridor as the
 * focal point, with the Iranian coast above (elevated, armed) and
 * Omani coast below (flat, unarmed). The visual story is PROXIMITY.
 */

import { Chart } from './Chart';

export function StraitTacticalIllustration() {
  return (
    <Chart
      title="The narrowest point: 10 kilometres of navigable water"
      subtitle="Tactical view of the Strait of Hormuz — two 3.2 km shipping lanes, a buffer zone, and Iranian military positions minutes from the corridor"
      source="CRS / S&P Global, adapted. Positions approximate."
      aspectRatio={0.62}
    >
      {({ width }) => {
        const h = Math.min(width * 0.62, 580);
        return (
          <svg viewBox="0 0 960 580" width={width} height={h} className="select-none overflow-visible">
            <defs>
              {/* Water texture gradient */}
              <linearGradient id="water-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-viz-cyan)" stopOpacity={0.03} />
                <stop offset="50%" stopColor="var(--color-viz-cyan)" stopOpacity={0.07} />
                <stop offset="100%" stopColor="var(--color-viz-cyan)" stopOpacity={0.03} />
              </linearGradient>
              {/* Iranian terrain gradient — darker, elevated */}
              <linearGradient id="iran-terrain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-ink)" stopOpacity={0.12} />
                <stop offset="60%" stopColor="var(--color-ink)" stopOpacity={0.08} />
                <stop offset="100%" stopColor="var(--color-ink)" stopOpacity={0.04} />
              </linearGradient>
              {/* Omani terrain gradient — flatter, lighter */}
              <linearGradient id="oman-terrain" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="var(--color-ink)" stopOpacity={0.07} />
                <stop offset="100%" stopColor="var(--color-ink)" stopOpacity={0.03} />
              </linearGradient>
            </defs>

            {/* ═══ WATER BODY ═══ */}
            <rect x="0" y="0" width="960" height="580" fill="url(#water-grad)" />
            {/* Subtle wave lines */}
            {[0, 1, 2].map(i => (
              <path key={i} d={`M0,${200 + i * 120} Q120,${195 + i * 120} 240,${200 + i * 120} Q360,${205 + i * 120} 480,${200 + i * 120} Q600,${195 + i * 120} 720,${200 + i * 120} Q840,${205 + i * 120} 960,${200 + i * 120}`} stroke="var(--color-viz-cyan)" strokeWidth="0.75" opacity={0.08} fill="none" />
            ))}

            {/* ═══ IRANIAN COAST (top) — rugged, elevated ═══ */}
            <path d="M0,0 L960,0 L960,100 Q920,125 880,118 Q840,112 800,122 Q760,132 720,125 Q680,115 640,128 Q600,142 560,135 Q520,125 480,132 Q440,140 400,128 Q360,118 320,130 Q280,140 240,130 Q200,120 160,128 Q120,138 80,125 Q40,115 0,122 Z" fill="url(#iran-terrain)" />
            {/* Coastline with rugged detail */}
            <path d="M0,122 Q40,115 80,125 Q120,138 160,128 Q200,120 240,130 Q280,140 320,130 Q360,118 400,128 Q440,140 480,132 Q520,125 560,135 Q600,142 640,128 Q680,115 720,125 Q760,132 800,122 Q840,112 880,118 Q920,125 960,100" stroke="var(--color-ink)" strokeWidth="2.5" opacity={0.2} fill="none" />
            {/* Contour lines suggesting elevation */}
            <path d="M0,105 Q60,95 120,108 Q200,98 280,112 Q360,100 440,115 Q520,105 600,118 Q680,100 760,110 Q840,95 920,105 L960,82" stroke="var(--color-ink)" strokeWidth="0.75" opacity={0.06} fill="none" />
            <path d="M0,88 Q80,78 160,85 Q280,75 400,88 Q520,78 640,85 Q760,75 880,82 L960,65" stroke="var(--color-ink)" strokeWidth="0.5" opacity={0.04} fill="none" />

            {/* IRAN label */}
            <text x="480" y="48" textAnchor="middle" fontSize="18" fontFamily="var(--font-sans)" fontWeight="700" fill="var(--color-ink)" opacity={0.3} letterSpacing="8">IRAN</text>
            <text x="480" y="70" textAnchor="middle" fontSize="11" fontFamily="var(--font-sans)" fontWeight="400" fill="var(--color-ink)" opacity={0.2}>Elevated coastline — heights command the shipping lanes</text>

            {/* ═══ OMANI COAST (bottom) — flat ═══ */}
            <path d="M0,580 L960,580 L960,478 Q920,472 880,476 Q840,480 800,474 Q760,470 720,475 Q680,480 640,473 Q600,468 560,474 Q520,478 480,472 Q440,468 400,474 Q360,478 320,470 Q280,466 240,472 Q200,476 160,470 Q120,465 80,472 Q40,476 0,470 Z" fill="url(#oman-terrain)" />
            <path d="M0,470 Q40,476 80,472 Q120,465 160,470 Q200,476 240,472 Q280,466 320,470 Q360,478 400,474 Q440,468 480,472 Q520,478 560,474 Q600,468 640,473 Q680,480 720,475 Q760,470 800,474 Q840,480 880,476 Q920,472 960,478" stroke="var(--color-ink)" strokeWidth="1.5" opacity={0.12} fill="none" />
            <text x="480" y="530" textAnchor="middle" fontSize="15" fontFamily="var(--font-sans)" fontWeight="600" fill="var(--color-ink)" opacity={0.22} letterSpacing="5">OMAN</text>
            <text x="480" y="548" textAnchor="middle" fontSize="11" fontFamily="var(--font-sans)" fill="var(--color-ink)" opacity={0.15}>Musandam Peninsula</text>

            {/* ═══ ISLANDS — with contour rings for terrain feel ═══ */}
            {/* Qeshm — large, elongated */}
            <g transform="rotate(-12, 195, 175)">
              <ellipse cx="195" cy="175" rx="85" ry="28" fill="var(--color-ink)" opacity={0.1} />
              <ellipse cx="195" cy="175" rx="70" ry="20" fill="none" stroke="var(--color-ink)" strokeWidth="0.5" opacity={0.06} />
              <ellipse cx="195" cy="175" rx="50" ry="12" fill="none" stroke="var(--color-ink)" strokeWidth="0.5" opacity={0.04} />
              <ellipse cx="195" cy="175" rx="85" ry="28" fill="none" stroke="var(--color-ink)" strokeWidth="1.5" opacity={0.18} />
            </g>
            <text x="195" y="168" textAnchor="middle" fontSize="13" fontFamily="var(--font-sans)" fontWeight="600" fill="var(--color-ink)" opacity={0.55}>Qeshm</text>
            <text x="195" y="183" textAnchor="middle" fontSize="11" fontFamily="var(--font-sans)" fill="var(--color-ink)" opacity={0.3}>largest island</text>

            {/* Hormuz Island */}
            <ellipse cx="365" cy="185" rx="24" ry="16" fill="var(--color-ink)" opacity={0.1} stroke="var(--color-ink)" strokeWidth="1.5" strokeOpacity={0.18} />
            <ellipse cx="365" cy="185" rx="14" ry="8" fill="none" stroke="var(--color-ink)" strokeWidth="0.5" opacity={0.06} />
            <text x="365" y="188" textAnchor="middle" fontSize="12" fontFamily="var(--font-sans)" fontWeight="600" fill="var(--color-ink)" opacity={0.55}>Hormuz</text>

            {/* Larak */}
            <ellipse cx="540" cy="170" rx="20" ry="13" fill="var(--color-ink)" opacity={0.1} stroke="var(--color-ink)" strokeWidth="1.5" strokeOpacity={0.18} />
            <text x="540" y="174" textAnchor="middle" fontSize="12" fontFamily="var(--font-sans)" fontWeight="500" fill="var(--color-ink)" opacity={0.5}>Larak</text>

            {/* Abu Musa (smaller, farther west) */}
            <ellipse cx="720" cy="155" rx="14" ry="9" fill="var(--color-ink)" opacity={0.08} stroke="var(--color-ink)" strokeWidth="1" strokeOpacity={0.15} />
            <text x="720" y="145" textAnchor="middle" fontSize="11" fontFamily="var(--font-sans)" fill="var(--color-ink)" opacity={0.4}>Abu Musa</text>

            {/* ═══ SHIPPING LANES — the main event ═══ */}

            {/* Outbound lane (closer to Iran — the danger) */}
            <rect x="80" y="235" width="800" height="55" rx="3" fill="var(--color-viz-blue)" opacity={0.08} />
            <line x1="80" y1="235" x2="880" y2="235" stroke="var(--color-viz-blue)" strokeWidth="1.5" strokeDasharray="10 5" strokeOpacity={0.3} />
            <line x1="80" y1="290" x2="880" y2="290" stroke="var(--color-viz-blue)" strokeWidth="1.5" strokeDasharray="10 5" strokeOpacity={0.3} />
            <text x="480" y="225" textAnchor="middle" fontSize="13" fontFamily="var(--font-sans)" fontWeight="700" fill="var(--color-viz-blue)" opacity={0.65} letterSpacing="1">OUTBOUND LANE — 3.2 km</text>

            {/* Ships — outbound (heading left/west) */}
            {[180, 340, 520, 700].map((x, i) => (
              <g key={`out-${i}`} transform={`translate(${x}, 263)`}>
                {/* Hull */}
                <path d="M-20,0 L-24,-3 L-24,3 Z" fill="var(--color-viz-blue)" opacity={0.5} />
                <rect x="-20" y="-4" width="36" height="8" rx="3" fill="var(--color-viz-blue)" opacity={0.4} />
                {/* Bridge */}
                <rect x="10" y="-7" width="6" height="5" rx="1" fill="var(--color-viz-blue)" opacity={0.35} />
              </g>
            ))}

            {/* Buffer zone */}
            <rect x="80" y="296" width="800" height="35" rx="2" fill="var(--color-ink)" opacity={0.02} />
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={i} x1={100 + i * 40} y1="296" x2={100 + i * 40 + 25} y2="331" stroke="var(--color-ink)" strokeWidth="0.5" opacity={0.05} />
            ))}
            <text x="480" y="318" textAnchor="middle" fontSize="11" fontFamily="var(--font-sans)" fontWeight="500" fill="var(--color-ink)" opacity={0.25} letterSpacing="1">BUFFER — 3.2 km</text>

            {/* Inbound lane (closer to Oman — safer) */}
            <rect x="80" y="337" width="800" height="55" rx="3" fill="var(--color-viz-cyan)" opacity={0.08} />
            <line x1="80" y1="337" x2="880" y2="337" stroke="var(--color-viz-cyan)" strokeWidth="1.5" strokeDasharray="10 5" strokeOpacity={0.3} />
            <line x1="80" y1="392" x2="880" y2="392" stroke="var(--color-viz-cyan)" strokeWidth="1.5" strokeDasharray="10 5" strokeOpacity={0.3} />
            <text x="480" y="406" textAnchor="middle" fontSize="13" fontFamily="var(--font-sans)" fontWeight="700" fill="var(--color-viz-cyan)" opacity={0.65} letterSpacing="1">INBOUND LANE — 3.2 km</text>

            {/* Ships — inbound (heading right/east) */}
            {[200, 400, 600, 780].map((x, i) => (
              <g key={`in-${i}`} transform={`translate(${x}, 365)`}>
                <rect x="-16" y="-4" width="36" height="8" rx="3" fill="var(--color-viz-cyan)" opacity={0.4} />
                <path d="M20,0 L24,-3 L24,3 Z" fill="var(--color-viz-cyan)" opacity={0.5} />
                <rect x="-16" y="-7" width="6" height="5" rx="1" fill="var(--color-viz-cyan)" opacity={0.35} />
              </g>
            ))}

            {/* ═══ MILITARY POSITIONS — on the Iranian side ═══ */}

            {/* Missile batteries — along the rugged coast */}
            {[{ x: 140, y: 128 }, { x: 340, y: 128 }, { x: 580, y: 135 }, { x: 780, y: 120 }].map((pos, i) => (
              <g key={`missile-${i}`} transform={`translate(${pos.x}, ${pos.y})`}>
                {/* Base */}
                <rect x="-10" y="-2" width="20" height="6" rx="2" fill="var(--color-viz-red)" opacity={0.5} />
                {/* Launcher angled toward lanes */}
                <line x1="0" y1="-2" x2="8" y2="-16" stroke="var(--color-viz-red)" strokeWidth="2" opacity={0.5} strokeLinecap="round" />
                <circle cx="8" cy="-16" r="2.5" fill="var(--color-viz-red)" opacity={0.5} />
                {/* Range arc — showing threat reaches the lanes */}
                <path d={`M-40,${235 - pos.y + 30} A80,80 0 0,1 40,${235 - pos.y + 30}`} stroke="var(--color-viz-red)" strokeWidth="0.75" strokeDasharray="4 4" opacity={0.12} fill="none" />
              </g>
            ))}

            {/* IRGC fast-boat berths — tucked in coves */}
            {[{ x: 240, y: 140 }, { x: 460, y: 135 }, { x: 680, y: 128 }].map((pos, i) => (
              <g key={`boat-${i}`} transform={`translate(${pos.x}, ${pos.y})`}>
                {/* Berth marker */}
                <rect x="-8" y="-3" width="16" height="6" rx="3" fill="var(--color-viz-amber)" opacity={0.5} stroke="var(--color-viz-amber)" strokeWidth="1" strokeOpacity={0.35} />
                {/* Small boats fanning out */}
                {[-12, 0, 12].map((angle, j) => (
                  <line key={j} x1="0" y1="3" x2={angle * 0.8} y2="14" stroke="var(--color-viz-amber)" strokeWidth="0.75" opacity={0.2} />
                ))}
              </g>
            ))}

            {/* ═══ KEY ANNOTATION — the editorial insight ═══ */}
            <g transform="translate(80, 420)">
              <line x1="0" y1="0" x2="0" y2="25" stroke="var(--color-accent)" strokeWidth="2" opacity={0.4} />
              <text x="12" y="8" fontSize="13" fontFamily="var(--font-sans)" fontWeight="600" fontStyle="italic" fill="var(--color-accent)" opacity={0.7}>
                Iranian missile batteries are 4-6 minutes from the outbound lane.
              </text>
              <text x="12" y="24" fontSize="12" fontFamily="var(--font-sans)" fontStyle="italic" fill="var(--color-accent)" opacity={0.5}>
                Fast boats can reach shipping lanes in under 3 minutes.
              </text>
            </g>

            {/* ═══ WIDTH ANNOTATIONS ═══ */}
            {/* Total width — left side */}
            <line x1="42" y1="135" x2="42" y2="468" stroke="var(--color-ink)" strokeWidth="1" opacity={0.2} />
            <line x1="35" y1="135" x2="49" y2="135" stroke="var(--color-ink)" strokeWidth="1" opacity={0.2} />
            <line x1="35" y1="468" x2="49" y2="468" stroke="var(--color-ink)" strokeWidth="1" opacity={0.2} />
            <text x="32" y="305" textAnchor="middle" fontSize="12" fontFamily="var(--font-sans)" fontWeight="500" fill="var(--color-ink)" opacity={0.35} transform="rotate(-90, 32, 305)">39 km coast to coast</text>

            {/* Navigable width — right side */}
            <line x1="920" y1="235" x2="920" y2="392" stroke="var(--color-accent)" strokeWidth="2" opacity={0.4} />
            <line x1="912" y1="235" x2="928" y2="235" stroke="var(--color-accent)" strokeWidth="2" opacity={0.4} />
            <line x1="912" y1="392" x2="928" y2="392" stroke="var(--color-accent)" strokeWidth="2" opacity={0.4} />
            <text x="935" y="318" textAnchor="start" fontSize="14" fontFamily="var(--font-sans)" fontWeight="700" fill="var(--color-accent)" opacity={0.65} transform="rotate(-90, 935, 318)">~10 km navigable</text>

            {/* ═══ LEGEND ═══ */}
            <g transform="translate(680, 438)">
              <rect x="0" y="0" width="240" height="105" rx="6" fill="var(--color-paper)" opacity={0.96} stroke="var(--color-rule)" strokeWidth="1" />
              <text x="14" y="20" fontSize="11" fontFamily="var(--font-sans)" fontWeight="700" fill="var(--color-ink)" opacity={0.55} letterSpacing="0.5">IRANIAN POSITIONS</text>

              {/* Missile */}
              <rect x="14" y="32" width="14" height="6" rx="2" fill="var(--color-viz-red)" opacity={0.5} />
              <line x1="21" y1="32" x2="25" y2="24" stroke="var(--color-viz-red)" strokeWidth="1.5" opacity={0.5} />
              <text x="40" y="39" fontSize="12" fontFamily="var(--font-sans)" fontWeight="500" fill="var(--color-ink-secondary)">Coastal missile battery</text>

              {/* Fast boat */}
              <rect x="14" y="52" width="14" height="6" rx="3" fill="var(--color-viz-amber)" opacity={0.5} />
              <text x="40" y="59" fontSize="12" fontFamily="var(--font-sans)" fontWeight="500" fill="var(--color-ink-secondary)">IRGC fast-boat berth</text>

              {/* Island */}
              <ellipse cx="21" cy="75" rx="8" ry="5" fill="var(--color-ink)" opacity={0.1} stroke="var(--color-ink)" strokeWidth="1" strokeOpacity={0.18} />
              <text x="40" y="79" fontSize="12" fontFamily="var(--font-sans)" fontWeight="500" fill="var(--color-ink-secondary)">Iranian island</text>

              <text x="14" y="97" fontSize="11" fontFamily="var(--font-sans)" fontStyle="italic" fill="var(--color-ink-faint)">7 of 8 major strait islands are Iranian</text>
            </g>
          </svg>
        );
      }}
    </Chart>
  );
}
