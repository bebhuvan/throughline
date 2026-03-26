/**
 * VLCC Supertanker — Scale & Anatomy
 * Editorial illustration comparing a Very Large Crude Carrier to familiar landmarks.
 * 330m long, 60m wide, 22m draft, 2 million barrels of crude.
 */

import { Chart } from './Chart';

export function VLCCScaleIllustration() {
  return (
    <Chart
      title="A supertanker as long as the Eiffel Tower is tall"
      subtitle="VLCC (Very Large Crude Carrier) — the ships that carry 60% of the world's seaborne oil"
      source="Maritime industry data"
    >
      {({ width }) => {
        const h = Math.min(width * 0.42, 400);
        return (
          <svg viewBox="0 0 960 400" width={width} height={h} className="select-none">
            {/* Water background */}
            <rect x="0" y="240" width="960" height="160" fill="var(--color-viz-cyan)" opacity={0.06} />
            <path d="M0,256 Q30,252 60,256 Q90,260 120,256 Q150,252 180,256 Q210,260 240,256 Q270,252 300,256 Q330,260 360,256 Q390,252 420,256 Q450,260 480,256 Q510,252 540,256 Q570,260 600,256 Q630,252 660,256 Q690,260 720,256 Q750,252 780,256 Q810,260 840,256 Q870,252 900,256 Q930,260 960,256" stroke="var(--color-viz-cyan)" strokeWidth="1.5" opacity={0.18} fill="none" />
            <path d="M0,264 Q40,260 80,264 Q120,268 160,264 Q200,260 240,264 Q280,268 320,264 Q360,260 400,264 Q440,268 480,264 Q520,260 560,264 Q600,268 640,264 Q680,260 720,264 Q760,268 800,264 Q840,260 880,264 Q920,268 960,264" stroke="var(--color-viz-cyan)" strokeWidth="1" opacity={0.1} fill="none" />

            {/* ── Eiffel Tower silhouette (left) ── */}
            <g transform="translate(52, 32)" opacity={0.6}>
              {/* Tower structure */}
              <path d="
                M20,0 L20,15 L18,50 L15,90 L13,120 L8,180 L0,218
                M20,0 L20,15 L22,50 L25,90 L27,120 L32,180 L40,218
              " stroke="var(--color-ink)" strokeWidth="1.5" fill="none" opacity={0.35} />
              {/* Cross beams */}
              <line x1="16" y1="55" x2="24" y2="55" stroke="var(--color-ink)" strokeWidth="1" opacity={0.25} />
              <line x1="13" y1="92" x2="27" y2="92" stroke="var(--color-ink)" strokeWidth="1" opacity={0.25} />
              <line x1="10" y1="135" x2="30" y2="135" stroke="var(--color-ink)" strokeWidth="1.5" opacity={0.3} />
              <line x1="6" y1="185" x2="34" y2="185" stroke="var(--color-ink)" strokeWidth="1.5" opacity={0.3} />
              {/* Base arch */}
              <path d="M0,218 Q20,200 40,218" stroke="var(--color-ink)" strokeWidth="1" fill="none" opacity={0.2} />
              {/* Antenna */}
              <line x1="20" y1="0" x2="20" y2="-10" stroke="var(--color-ink)" strokeWidth="1" opacity={0.3} />

              <text x="20" y="238" textAnchor="middle" fontSize="13" fontFamily="var(--font-sans)" fontWeight="600" fill="var(--color-ink)" opacity={0.55}>Eiffel Tower</text>
              <text x="20" y="253" textAnchor="middle" fontSize="12" fontFamily="var(--font-mono)" fill="var(--color-ink)" opacity={0.45}>330m</text>
            </g>

            {/* ── VLCC Tanker (center) ── */}
            <g transform="translate(130, 120)">
              {/* Underwater hull — more visible */}
              <path d="M0,80 Q0,125 35,138 L665,138 Q700,125 700,80 Z" fill="var(--color-viz-red)" opacity={0.1} />
              {/* Hull above waterline */}
              <path d="M8,80 Q2,52 25,40 L675,40 Q698,52 692,80 Z" fill="var(--color-ink)" opacity={0.14} />
              {/* Waterline — bold red */}
              <line x1="4" y1="80" x2="696" y2="80" stroke="var(--color-viz-red)" strokeWidth="3" opacity={0.45} />
              {/* Deck */}
              <rect x="30" y="33" width="640" height="10" rx="2" fill="var(--color-ink)" opacity={0.2} />

              {/* Deck pipes (characteristic of tankers) */}
              <line x1="65" y1="30" x2="65" y2="20" stroke="var(--color-ink)" strokeWidth="2" opacity={0.18} />
              <line x1="65" y1="20" x2="545" y2="20" stroke="var(--color-ink)" strokeWidth="2" opacity={0.18} />
              <line x1="545" y1="20" x2="545" y2="30" stroke="var(--color-ink)" strokeWidth="2" opacity={0.18} />

              {/* Cargo tank domes */}
              {[105, 175, 245, 315, 385, 455, 525].map(x => (
                <g key={x}>
                  <circle cx={x} cy="27" r="6" fill="var(--color-ink)" opacity={0.1} stroke="var(--color-ink)" strokeWidth="0.75" strokeOpacity={0.15} />
                  <line x1={x} y1="20" x2={x} y2="33" stroke="var(--color-ink)" strokeWidth="1" opacity={0.12} />
                </g>
              ))}

              {/* Bridge/superstructure — at stern */}
              <rect x="585" y="-12" width="75" height="48" rx="3" fill="var(--color-ink)" opacity={0.2} />
              <rect x="590" y="-6" width="18" height="11" rx="1" fill="var(--color-ink)" opacity={0.1} />
              <rect x="614" y="-6" width="18" height="11" rx="1" fill="var(--color-ink)" opacity={0.1} />
              <rect x="590" y="10" width="18" height="11" rx="1" fill="var(--color-ink)" opacity={0.1} />
              <rect x="614" y="10" width="18" height="11" rx="1" fill="var(--color-ink)" opacity={0.1} />
              <rect x="638" y="-6" width="16" height="27" rx="1" fill="var(--color-ink)" opacity={0.1} />
              {/* Funnel */}
              <rect x="608" y="-32" width="26" height="22" rx="2" fill="var(--color-ink)" opacity={0.25} />
              <rect x="612" y="-42" width="18" height="12" rx="1" fill="var(--color-ink)" opacity={0.18} />

              {/* Bow shape */}
              <path d="M30,40 L8,56 L4,72" stroke="var(--color-ink)" strokeWidth="2" fill="none" opacity={0.2} />

              {/* Draft annotation — right side */}
              <line x1="712" y1="40" x2="712" y2="138" stroke="var(--color-ink)" strokeWidth="1" opacity={0.3} strokeDasharray="3 3" />
              <line x1="706" y1="40" x2="718" y2="40" stroke="var(--color-ink)" strokeWidth="1" opacity={0.3} />
              <line x1="706" y1="80" x2="718" y2="80" stroke="var(--color-ink)" strokeWidth="1" opacity={0.3} />
              <line x1="706" y1="138" x2="718" y2="138" stroke="var(--color-ink)" strokeWidth="1" opacity={0.3} />
              <text x="726" y="56" fontSize="13" fontFamily="var(--font-sans)" fontWeight="500" fill="var(--color-ink)" opacity={0.55}>18m above</text>
              <text x="726" y="116" fontSize="13" fontFamily="var(--font-sans)" fontWeight="500" fill="var(--color-viz-red)" opacity={0.6}>22m below</text>
              <text x="726" y="132" fontSize="11" fontFamily="var(--font-sans)" fill="var(--color-ink-tertiary)">waterline</text>
            </g>

            {/* ── Length annotation ── */}
            <line x1="130" y1="278" x2="830" y2="278" stroke="var(--color-accent)" strokeWidth="1.5" opacity={0.45} />
            <line x1="130" y1="272" x2="130" y2="284" stroke="var(--color-accent)" strokeWidth="1.5" opacity={0.45} />
            <line x1="830" y1="272" x2="830" y2="284" stroke="var(--color-accent)" strokeWidth="1.5" opacity={0.45} />
            <text x="480" y="298" textAnchor="middle" fontSize="16" fontFamily="var(--font-sans)" fontWeight="700" fill="var(--color-accent)" opacity={0.7}>330 metres</text>

            {/* ── Football pitch comparison ── */}
            <g transform="translate(130, 316)">
              {[0, 232, 464].map((x, i) => (
                <g key={i}>
                  <rect x={x} y="0" width="222" height="12" rx="3" fill="var(--color-viz-green)" opacity={0.2} stroke="var(--color-viz-green)" strokeWidth="1" strokeOpacity={0.3} />
                  <line x1={x + 111} y1="0" x2={x + 111} y2="12" stroke="var(--color-viz-green)" strokeWidth="0.75" opacity={0.25} />
                </g>
              ))}
              <text x="111" y="28" textAnchor="middle" fontSize="12" fontFamily="var(--font-sans)" fontWeight="500" fill="var(--color-viz-green)" opacity={0.6}>1 football pitch (105m)</text>
              <text x="480" y="28" textAnchor="middle" fontSize="12" fontFamily="var(--font-sans)" fontWeight="500" fill="var(--color-viz-green)" opacity={0.6}>3 pitches end to end ≈ 1 VLCC</text>
            </g>

            {/* ── Key specs row ── */}
            <g transform="translate(0, 365)">
              <text x="180" y="0" textAnchor="middle" fontSize="20" fontFamily="var(--font-display)" fontWeight="400" fill="var(--color-accent)" opacity={0.7}>2M</text>
              <text x="180" y="16" textAnchor="middle" fontSize="11" fontFamily="var(--font-sans)" fill="var(--color-ink-tertiary)">barrels of crude</text>

              <text x="480" y="0" textAnchor="middle" fontSize="20" fontFamily="var(--font-display)" fontWeight="400" fill="var(--color-ink)" opacity={0.55}>60m</text>
              <text x="480" y="16" textAnchor="middle" fontSize="11" fontFamily="var(--font-sans)" fill="var(--color-ink-tertiary)">width (wider than 747 wingspan)</text>

              <text x="780" y="0" textAnchor="middle" fontSize="20" fontFamily="var(--font-display)" fontWeight="400" fill="var(--color-viz-red)" opacity={0.6}>22m</text>
              <text x="780" y="16" textAnchor="middle" fontSize="11" fontFamily="var(--font-sans)" fill="var(--color-ink-tertiary)">draft below the surface</text>
            </g>
          </svg>
        );
      }}
    </Chart>
  );
}
