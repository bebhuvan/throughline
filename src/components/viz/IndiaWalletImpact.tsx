/**
 * How It Reaches Your Wallet — India household impact
 * Shows the transmission from Hormuz to specific Indian household expenses.
 * Each item shows what changed and why.
 */

import { Chart } from './Chart';

interface WalletItem {
  item: string;
  before: string;
  after: string;
  change: string;
  why: string;
  color: string;
}

const ITEMS: WalletItem[] = [
  { item: 'LPG cylinder (14.2 kg)', before: 'Rs 853', after: 'Rs 913', change: '+Rs 60', why: '90% of LPG imports via Hormuz', color: 'var(--color-accent)' },
  { item: 'Petrol (per litre, Delhi)', before: 'Rs 94.72', after: 'Rs 94.72*', change: 'Held', why: 'OMCs absorbing losses — for now', color: 'var(--color-viz-amber)' },
  { item: 'Diesel (per litre, Delhi)', before: 'Rs 87.62', after: 'Rs 87.62*', change: 'Held', why: 'Passthrough begins above $90/bbl', color: 'var(--color-viz-amber)' },
  { item: 'Urea (per bag, 45 kg)', before: 'Rs 267', after: 'Rs 267**', change: 'Subsidised', why: 'Govt absorbs via Rs 1.9T subsidy', color: 'var(--color-viz-green)' },
  { item: 'Auto/taxi fare', before: '—', after: '+10-15%', change: '+10-15%', why: 'CNG prices up, passed to riders', color: 'var(--color-viz-blue)' },
  { item: 'Edible oil (per litre)', before: 'Rs 120-160', after: '+8-12%', change: '+8-12%', why: 'Shipping costs, fuel surcharges', color: 'var(--color-viz-violet)' },
];

export function IndiaWalletImpact() {
  return (
    <Chart
      title="How it reaches your wallet"
      subtitle="What the Strait of Hormuz crisis means for a household in India — prices as of late March 2026"
      source="Ministry of Petroleum & Natural Gas, IOCL, CareEdge Ratings. *Held by OMC losses. **Subsidised retail price; govt cost rising."
      aspectRatio={0.5}
    >
      {({ width }) => {
        const vw = 960;
        const vh = 480;
        const h = Math.min(width * 0.5, vh);
        const rowH = 62;
        const startY = 50;
        const col1 = 30; // Item
        const col2 = 320; // Before
        const col3 = 450; // After
        const col4 = 560; // Change
        const col5 = 660; // Why

        return (
          <svg viewBox={`0 0 ${vw} ${vh}`} width={width} height={h} className="select-none overflow-visible">
            {/* Column headers */}
            <text x={col1} y="30" fontSize="11" fontFamily="var(--font-sans)" fontWeight="700" fill="var(--color-ink)" opacity={0.5} letterSpacing="0.5">ITEM</text>
            <text x={col2} y="30" fontSize="11" fontFamily="var(--font-sans)" fontWeight="700" fill="var(--color-ink)" opacity={0.5} letterSpacing="0.5">BEFORE</text>
            <text x={col3} y="30" fontSize="11" fontFamily="var(--font-sans)" fontWeight="700" fill="var(--color-ink)" opacity={0.5} letterSpacing="0.5">NOW</text>
            <text x={col4} y="30" fontSize="11" fontFamily="var(--font-sans)" fontWeight="700" fill="var(--color-accent)" opacity={0.6} letterSpacing="0.5">CHANGE</text>
            <text x={col5} y="30" fontSize="11" fontFamily="var(--font-sans)" fontWeight="700" fill="var(--color-ink)" opacity={0.5} letterSpacing="0.5">WHY</text>

            <line x1="20" y1="40" x2={vw - 20} y2="40" stroke="var(--color-ink)" strokeWidth="2" opacity={0.12} />

            {ITEMS.map((item, i) => {
              const y = startY + i * rowH;
              const isPrice = item.change.startsWith('+Rs') || item.change.startsWith('+1');

              return (
                <g key={item.item}>
                  {/* Alternating row background */}
                  {i % 2 === 0 && (
                    <rect x="20" y={y - 4} width={vw - 40} height={rowH - 4} rx="3" fill="var(--color-paper-warm)" opacity={0.5} />
                  )}

                  {/* Item name */}
                  <text x={col1} y={y + 18} fontSize="14" fontFamily="var(--font-sans)" fontWeight="600" fill="var(--color-ink)" opacity={0.75}>
                    {item.item}
                  </text>

                  {/* Before */}
                  <text x={col2} y={y + 18} fontSize="14" fontFamily="var(--font-mono)" fill="var(--color-ink-tertiary)">
                    {item.before}
                  </text>

                  {/* After */}
                  <text x={col3} y={y + 18} fontSize="14" fontFamily="var(--font-mono)" fontWeight="600" fill="var(--color-ink-secondary)">
                    {item.after}
                  </text>

                  {/* Change — colored */}
                  <text x={col4} y={y + 18} fontSize="15" fontFamily="var(--font-mono)" fontWeight="700" fill={item.color}>
                    {item.change}
                  </text>

                  {/* Why — lighter, smaller */}
                  <text x={col5} y={y + 12} fontSize="11" fontFamily="var(--font-sans)" fill="var(--color-ink-tertiary)">
                    {item.why.length > 38 ? item.why.slice(0, 38) : item.why}
                  </text>
                  {item.why.length > 38 && (
                    <text x={col5} y={y + 26} fontSize="11" fontFamily="var(--font-sans)" fill="var(--color-ink-tertiary)">
                      {item.why.slice(38)}
                    </text>
                  )}

                  {/* Row separator */}
                  <line x1="20" y1={y + rowH - 8} x2={vw - 20} y2={y + rowH - 8} stroke="var(--color-rule-light)" strokeWidth="1" />
                </g>
              );
            })}

            {/* Bottom annotation */}
            <text x={vw / 2} y={vh - 20} textAnchor="middle" fontSize="12" fontFamily="var(--font-sans)" fontStyle="italic" fill="var(--color-accent)" opacity={0.6}>
              A poor Indian household spends ~50% of income on food and fuel. These are not marginal costs — they are survival costs.
            </text>
          </svg>
        );
      }}
    </Chart>
  );
}
