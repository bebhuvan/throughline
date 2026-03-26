/**
 * Selective Closure Diagram
 * Shows who gets through the strait vs. who is blocked.
 * Stronger visual distinction, better ship icons, clearer categories.
 */

import { Chart } from './Chart';

function ShipRow({ y, flag, detail, status }: {
  y: number; flag: string; detail: string; status: 'allowed' | 'blocked' | 'waiting';
}) {
  const color = status === 'allowed' ? 'var(--color-viz-green)' : status === 'blocked' ? 'var(--color-viz-red)' : 'var(--color-viz-amber)';
  const icon = status === 'allowed' ? '\u2713' : status === 'blocked' ? '\u2717' : '\u2022\u2022\u2022';
  const iconSize = status === 'waiting' ? 10 : 14;

  return (
    <g transform={`translate(0, ${y})`}>
      {/* Ship silhouette */}
      <rect x="0" y="-7" width="52" height="14" rx="5" fill={color} opacity={0.2} stroke={color} strokeWidth="1.5" strokeOpacity={0.4} />
      <rect x="38" y="-12" width="10" height="7" rx="2" fill={color} opacity={0.25} />

      {/* Status badge */}
      <circle cx="72" cy="0" r="12" fill={color} opacity={0.18} stroke={color} strokeWidth="2" strokeOpacity={0.5} />
      <text x="72" y={status === 'waiting' ? 3 : 5} textAnchor="middle" fontSize={iconSize} fontFamily="var(--font-sans)" fontWeight="700" fill={color} opacity={0.8}>{icon}</text>

      {/* Country and detail */}
      <text x="94" y="-3" fontSize="14" fontFamily="var(--font-sans)" fontWeight="600" fill="var(--color-ink)" opacity={0.8}>{flag}</text>
      <text x="94" y="14" fontSize="12" fontFamily="var(--font-sans)" fill="var(--color-ink-tertiary)">{detail}</text>
    </g>
  );
}

export function SelectiveClosureIllustration() {
  return (
    <Chart
      title="Iran controls the strait — it hasn't closed it"
      subtitle="Who gets through and who doesn't, as of late March 2026"
      source="Lloyd's List, Al Jazeera, CSIS, Reuters, Defence News"
      aspectRatio={0.5}
    >
      {({ width }) => {
        const h = Math.min(width * 0.5, 480);
        const leftCol = 40;
        const rightCol = 560;

        return (
          <svg viewBox="0 0 960 480" width={width} height={h} className="select-none">
            <rect x="0" y="0" width="960" height="480" fill="var(--color-paper-warm)" rx="8" />

            {/* Central strait column */}
            <rect x="438" y="25" width="84" height="430" fill="var(--color-viz-cyan)" opacity={0.08} rx="4" />
            <line x1="438" y1="25" x2="438" y2="455" stroke="var(--color-viz-cyan)" strokeWidth="1.5" strokeOpacity={0.2} />
            <line x1="522" y1="25" x2="522" y2="455" stroke="var(--color-viz-cyan)" strokeWidth="1.5" strokeOpacity={0.2} />

            {/* Central stat */}
            <rect x="443" y="175" width="74" height="78" rx="6" fill="var(--color-paper)" stroke="var(--color-rule)" strokeWidth="1" />
            <text x="480" y="202" textAnchor="middle" fontSize="26" fontFamily="var(--font-display)" fontWeight="500" fill="var(--color-accent)">~5</text>
            <text x="480" y="222" textAnchor="middle" fontSize="11" fontFamily="var(--font-sans)" fontWeight="500" fill="var(--color-ink-secondary)">ships/day</text>
            <text x="480" y="240" textAnchor="middle" fontSize="11" fontFamily="var(--font-sans)" fill="var(--color-ink-faint)">vs 120+ normal</text>

            {/* ── LEFT: Allowed ── */}
            <text x={leftCol} y="50" fontSize="15" fontFamily="var(--font-sans)" fontWeight="700" fill="var(--color-viz-green)" opacity={0.8}>Allowed through</text>
            <g transform={`translate(${leftCol}, 0)`}>
              <ShipRow y={88} flag="China" detail="Shadow fleet tankers" status="allowed" />
              <ShipRow y={145} flag="Iran" detail="1.8M b/d from Kharg Island" status="allowed" />
              <ShipRow y={202} flag="India" detail="4 vessels (Jaishankar negotiated)" status="allowed" />
              <ShipRow y={259} flag="Pakistan" detail="Select cargoes" status="allowed" />
            </g>

            <text x={leftCol} y="318" fontSize="15" fontFamily="var(--font-sans)" fontWeight="700" fill="var(--color-viz-amber)" opacity={0.8}>Negotiating</text>
            <g transform={`translate(${leftCol}, 0)`}>
              <ShipRow y={352} flag="Japan" detail="Transit rights granted Mar 21" status="waiting" />
              <ShipRow y={409} flag="Turkey" detail="Case by case" status="waiting" />
            </g>

            {/* ── RIGHT: Blocked ── */}
            <text x={rightCol} y="50" fontSize="15" fontFamily="var(--font-sans)" fontWeight="700" fill="var(--color-viz-red)" opacity={0.8}>Blocked</text>
            <g transform={`translate(${rightCol}, 0)`}>
              <ShipRow y={88} flag="United States" detail="All US-flagged vessels" status="blocked" />
              <ShipRow y={145} flag="Israel" detail="All Israeli-linked" status="blocked" />
              <ShipRow y={202} flag="UK / EU" detail="Western-allied tankers" status="blocked" />
              <ShipRow y={259} flag="South Korea" detail="Most commercial" status="blocked" />
            </g>

            {/* Anchored fleet */}
            <text x={rightCol} y="318" fontSize="15" fontFamily="var(--font-sans)" fontWeight="700" fill="var(--color-ink)" opacity={0.5}>Anchored outside</text>
            <g transform={`translate(${rightCol}, 340)`}>
              {Array.from({ length: 48 }).map((_, i) => (
                <g key={i}>
                  <circle
                    cx={(i % 12) * 18 + 4}
                    cy={Math.floor(i / 12) * 18 + 4}
                    r="6"
                    fill="var(--color-ink)" opacity={0.12}
                    stroke="var(--color-ink)" strokeWidth="1" strokeOpacity={0.2}
                  />
                </g>
              ))}
              <text x="0" y="90" fontSize="14" fontFamily="var(--font-mono)" fontWeight="600" fill="var(--color-ink)" opacity={0.5}>200+ vessels waiting</text>
            </g>
          </svg>
        );
      }}
    </Chart>
  );
}
