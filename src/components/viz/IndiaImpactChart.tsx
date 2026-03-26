/**
 * India Impact Scenarios — What different oil prices mean for India
 * Four scenarios showing GDP growth, inflation, CAD, rupee, and bond yields.
 * Source: CareEdge Ratings, March 2026
 */

import { Chart } from './Chart';

interface Scenario {
  price: string;
  gdp: string;
  inflation: string;
  cad: string;
  rupee: string;
  gsec: string;
  severity: 'base' | 'moderate' | 'severe' | 'crisis';
}

const SCENARIOS: Scenario[] = [
  { price: '$60–70', gdp: '7.2%', inflation: '4.3%', cad: '1.0%', rupee: '89–90', gsec: '6.6–6.8%', severity: 'base' },
  { price: '$85', gdp: '7.0–7.2%', inflation: '4.4–4.6%', cad: '1.5–1.7%', rupee: '90–91', gsec: '6.8–6.9%', severity: 'moderate' },
  { price: '$100', gdp: '6.6–7.0%', inflation: '5.1–5.3%', cad: '2.2–2.4%', rupee: '91–93', gsec: '7.0–7.2%', severity: 'severe' },
  { price: '$100–120', gdp: '<6.5%', inflation: '5.8–6.0%', cad: '2.6–2.8%', rupee: '93–95', gsec: '>7.2%', severity: 'crisis' },
];

const SEVERITY_COLORS = {
  base: 'var(--color-viz-blue)',
  moderate: 'var(--color-viz-amber)',
  severe: 'var(--color-accent)',
  crisis: 'var(--color-viz-red)',
};

export function IndiaImpactChart() {
  return (
    <Chart
      title="What oil prices mean for India"
      subtitle="Estimated impact on key macroeconomic indicators for FY2026-27 at different average crude oil prices"
      source="CareEdge Ratings, March 2026"
      aspectRatio={0.42}
    >
      {({ width }) => {
        const vw = 960;
        const vh = 400;
        const h = Math.min(width * 0.42, vh);
        const cols = ['Avg. crude', 'GDP growth', 'Inflation', 'CAD (% GDP)', 'USD/INR', '10Y yield'];
        const colW = (vw - 40) / cols.length;
        const rowH = 52;
        const headerY = 40;

        return (
          <svg viewBox={`0 0 ${vw} ${vh}`} width={width} height={h} className="select-none overflow-visible">
            {/* Column headers */}
            {cols.map((col, i) => (
              <text
                key={col}
                x={20 + i * colW + colW / 2}
                y={headerY}
                textAnchor="middle"
                fontSize="12"
                fontFamily="var(--font-sans)"
                fontWeight="700"
                fill="var(--color-ink)"
                opacity={0.5}
                letterSpacing="0.5"
              >
                {col}
              </text>
            ))}

            {/* Header underline */}
            <line x1="20" y1={headerY + 12} x2={vw - 20} y2={headerY + 12} stroke="var(--color-ink)" strokeWidth="2" opacity={0.15} />

            {/* Data rows */}
            {SCENARIOS.map((s, ri) => {
              const y = headerY + 28 + ri * rowH;
              const color = SEVERITY_COLORS[s.severity];
              const values = [s.price, s.gdp, s.inflation, s.cad, s.rupee, s.gsec];
              const isCrisis = s.severity === 'crisis';
              const isSevere = s.severity === 'severe' || isCrisis;

              return (
                <g key={s.price}>
                  {/* Row background for severe scenarios */}
                  {isSevere && (
                    <rect
                      x="10" y={y - 8}
                      width={vw - 20} height={rowH - 4}
                      rx="4"
                      fill={color} opacity={0.05}
                      stroke={color} strokeWidth="1" strokeOpacity={0.1}
                    />
                  )}

                  {values.map((val, ci) => (
                    <text
                      key={ci}
                      x={20 + ci * colW + colW / 2}
                      y={y + 16}
                      textAnchor="middle"
                      fontSize={ci === 0 ? "15" : "14"}
                      fontFamily={ci === 0 ? "var(--font-mono)" : "var(--font-sans)"}
                      fontWeight={ci === 0 ? "700" : isSevere ? "600" : "400"}
                      fill={ci === 0 ? color : isSevere ? color : "var(--color-ink-secondary)"}
                    >
                      {val}
                    </text>
                  ))}

                  {/* Row separator */}
                  <line
                    x1="20" y1={y + rowH - 12}
                    x2={vw - 20} y2={y + rowH - 12}
                    stroke="var(--color-rule-light)" strokeWidth="1"
                  />
                </g>
              );
            })}

            {/* Current price marker */}
            <g transform={`translate(${20 + colW / 2}, ${headerY + 28 + 2 * rowH - 2})`}>
              <line x1="-40" y1="0" x2="40" y2="0" stroke={SEVERITY_COLORS.severe} strokeWidth="2" opacity={0.4} />
              <text x="50" y="4" fontSize="11" fontFamily="var(--font-sans)" fontWeight="600" fill={SEVERITY_COLORS.severe} opacity={0.7}>
                ← current (~$100)
              </text>
            </g>

            {/* Bottom annotation */}
            <text x={vw / 2} y={vh - 16} textAnchor="middle" fontSize="12" fontFamily="var(--font-sans)" fontStyle="italic" fill="var(--color-accent)" opacity={0.6}>
              OMCs can absorb oil up to $90/bbl. Above that, costs pass through to consumers.
            </text>
          </svg>
        );
      }}
    </Chart>
  );
}
