/**
 * Mine & Missile Threat Diagram — Cross-section
 * The editorial point: a massive tanker is surrounded by threats from
 * EVERY direction — drones and missiles from above, fast boats at the surface,
 * mines below. The Iranian coast is high and imposing; the Omani coast is flat.
 *
 * The VLCC should feel vulnerable. The threats should feel close.
 */

import { Chart } from './Chart';

export function StraitCrossSectionIllustration() {
  return (
    <Chart
      title="How Iran threatens the strait — above, at, and below the waterline"
      subtitle="Cross-section at the narrowest point. Threats converge from every direction on ships that have no room to manoeuvre."
      source="Defense Intelligence Agency, Congressional Research Service, Naval Intelligence"
      aspectRatio={0.55}
    >
      {({ width }) => {
        const h = Math.min(width * 0.55, 520);
        const waterline = 185;

        return (
          <svg viewBox="0 0 960 520" width={width} height={h} className="select-none overflow-visible">
            <defs>
              {/* Sky gradient */}
              <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-paper-cream)" />
                <stop offset="100%" stopColor="var(--color-paper-warm)" />
              </linearGradient>
              {/* Water depth gradient */}
              <linearGradient id="water-depth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-viz-cyan)" stopOpacity={0.06} />
                <stop offset="40%" stopColor="var(--color-viz-cyan)" stopOpacity={0.1} />
                <stop offset="100%" stopColor="var(--color-viz-blue)" stopOpacity={0.08} />
              </linearGradient>
              {/* Iranian cliff gradient */}
              <linearGradient id="iran-cliff" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-ink)" stopOpacity={0.18} />
                <stop offset="50%" stopColor="var(--color-ink)" stopOpacity={0.12} />
                <stop offset="100%" stopColor="var(--color-ink)" stopOpacity={0.06} />
              </linearGradient>
            </defs>

            {/* ═══ SKY ═══ */}
            <rect x="0" y="0" width="960" height={waterline} fill="url(#sky)" />

            {/* ═══ WATER ═══ */}
            <rect x="0" y={waterline} width="960" height={520 - waterline} fill="url(#water-depth)" />
            {/* Waterline — bold, visible */}
            <line x1="0" y1={waterline} x2="960" y2={waterline} stroke="var(--color-viz-cyan)" strokeWidth="2.5" opacity={0.25} />
            {/* Water surface ripples */}
            {[0, 1].map(i => (
              <path key={i} d={`M${120 + i * 400},${waterline + 3} Q${150 + i * 400},${waterline + 1} ${180 + i * 400},${waterline + 3} Q${210 + i * 400},${waterline + 5} ${240 + i * 400},${waterline + 3}`} stroke="var(--color-viz-cyan)" strokeWidth="0.75" opacity={0.15} fill="none" />
            ))}

            {/* ═══ SEABED ═══ */}
            <path d="M0,440 Q100,425 200,435 Q350,445 450,420 Q550,395 650,405 Q800,425 960,415 L960,520 L0,520 Z" fill="var(--color-ink)" opacity={0.07} />
            <path d="M0,440 Q100,425 200,435 Q350,445 450,420 Q550,395 650,405 Q800,425 960,415" stroke="var(--color-ink)" strokeWidth="1.5" opacity={0.1} fill="none" />
            {/* Seabed texture — fine dots */}
            {[180, 300, 420, 540, 660, 780].map(x => (
              <circle key={x} cx={x} cy={435 + Math.sin(x * 0.02) * 10} r="1.5" fill="var(--color-ink)" opacity={0.05} />
            ))}

            {/* ═══ IRANIAN COAST — imposing cliff (left) ═══ */}
            <path d="M0,0 L0,520 L130,440 Q115,350 100,280 Q80,220 65,200 Q50,170 45,140 Q38,100 35,60 Q30,30 0,0 Z" fill="url(#iran-cliff)" />
            {/* Cliff face detail — rock strata lines */}
            <path d="M30,50 Q40,55 50,90 Q60,130 65,160" stroke="var(--color-ink)" strokeWidth="0.75" opacity={0.08} fill="none" />
            <path d="M20,80 Q35,85 48,120 Q58,160 62,180" stroke="var(--color-ink)" strokeWidth="0.5" opacity={0.06} fill="none" />
            {/* Cliff edge */}
            <path d="M35,60 Q38,100 45,140 Q50,170 65,200 Q80,220 100,280 Q115,350 130,440" stroke="var(--color-ink)" strokeWidth="2" opacity={0.18} fill="none" />

            {/* Iran labels */}
            <text x="18" y="50" fontSize="14" fontFamily="var(--font-sans)" fontWeight="700" fill="var(--color-ink)" opacity={0.5} transform="rotate(-80, 18, 50)">Iranian coast</text>
            <text x="28" y="280" fontSize="11" fontFamily="var(--font-sans)" fill="var(--color-ink)" opacity={0.25} transform="rotate(-80, 28, 280)">steep cliff face</text>

            {/* ═══ OMANI COAST — low, flat (right) ═══ */}
            <path d="M960,520 L960,400 Q940,395 920,398 Q900,402 880,415 L880,440 Q860,445 840,450 L960,520 Z" fill="var(--color-ink)" opacity={0.06} />
            <path d="M880,415 Q900,402 920,398 Q940,395 960,400" stroke="var(--color-ink)" strokeWidth="1" opacity={0.1} fill="none" />
            <text x="900" y="438" fontSize="13" fontFamily="var(--font-sans)" fontWeight="600" fill="var(--color-ink)" opacity={0.35}>Oman</text>

            {/* ═══ SHIPPING LANE MARKERS at surface ═══ */}
            <g opacity={0.65}>
              <rect x="175" y={waterline - 5} width="150" height="4" fill="var(--color-viz-blue)" opacity={0.3} rx="2" />
              <text x="250" y={waterline - 12} textAnchor="middle" fontSize="11" fontFamily="var(--font-sans)" fontWeight="700" fill="var(--color-viz-blue)" opacity={0.6}>Outbound 3.2 km</text>

              <rect x="335" y={waterline - 5} width="100" height="4" fill="var(--color-ink)" opacity={0.06} rx="2" />
              <text x="385" y={waterline - 12} textAnchor="middle" fontSize="11" fontFamily="var(--font-sans)" fill="var(--color-ink)" opacity={0.35}>Buffer</text>

              <rect x="445" y={waterline - 5} width="150" height="4" fill="var(--color-viz-cyan)" opacity={0.3} rx="2" />
              <text x="520" y={waterline - 12} textAnchor="middle" fontSize="11" fontFamily="var(--font-sans)" fontWeight="700" fill="var(--color-viz-cyan)" opacity={0.6}>Inbound 3.2 km</text>
            </g>

            {/* ═══ VLCC TANKER — the vulnerable target ═══ */}
            <g transform={`translate(505, ${waterline})`}>
              {/* Hull above waterline */}
              <path d="M-50,-6 Q-55,-14 -45,-18 L45,-18 Q55,-14 50,-6 Z" fill="var(--color-ink)" opacity={0.2} />
              {/* Deck */}
              <rect x="-42" y="-22" width="84" height="5" rx="1.5" fill="var(--color-ink)" opacity={0.18} />
              {/* Bridge/superstructure at stern */}
              <rect x="28" y="-38" width="16" height="18" rx="2" fill="var(--color-ink)" opacity={0.22} />
              <rect x="30" y="-34" width="5" height="5" rx="0.5" fill="var(--color-ink)" opacity={0.12} />
              <rect x="37" y="-34" width="5" height="5" rx="0.5" fill="var(--color-ink)" opacity={0.12} />
              {/* Funnel */}
              <rect x="32" y="-48" width="8" height="12" rx="1" fill="var(--color-ink)" opacity={0.25} />
              {/* Cargo tank domes */}
              {[-30, -15, 0, 15].map(x => (
                <circle key={x} cx={x} cy="-25" r="3" fill="var(--color-ink)" opacity={0.08} />
              ))}
              {/* Bow */}
              <path d="M-45,-18 L-52,-12 L-55,-6" stroke="var(--color-ink)" strokeWidth="1.5" fill="none" opacity={0.15} />

              {/* Hull below waterline — in the water */}
              <path d="M-50,0 Q-50,28 -35,38 L35,38 Q50,28 50,0 Z" fill="var(--color-ink)" opacity={0.08} />

              {/* Draft label */}
              <line x1="58" y1="0" x2="58" y2="38" stroke="var(--color-ink)" strokeWidth="0.75" strokeDasharray="2 2" opacity={0.3} />
              <text x="64" y="22" fontSize="11" fontFamily="var(--font-mono)" fill="var(--color-ink)" opacity={0.4}>22m</text>
              <text x="64" y="34" fontSize="11" fontFamily="var(--font-sans)" fill="var(--color-ink)" opacity={0.3}>draft</text>

              {/* Label */}
              <text x="0" y="54" textAnchor="middle" fontSize="11" fontFamily="var(--font-sans)" fontWeight="700" fill="var(--color-ink)" opacity={0.4} letterSpacing="0.5">VLCC — 2M barrels</text>
            </g>

            {/* ═══ THREAT LAYER 1: ABOVE — Drone ═══ */}
            <g transform="translate(250, 55)">
              {/* Drone body */}
              <ellipse cx="0" cy="0" rx="6" ry="3" fill="var(--color-viz-red)" opacity={0.5} />
              {/* Wings */}
              <line x1="-22" y1="-2" x2="22" y2="-2" stroke="var(--color-viz-red)" strokeWidth="2.5" opacity={0.5} strokeLinecap="round" />
              {/* Tail */}
              <line x1="-10" y1="2" x2="10" y2="2" stroke="var(--color-viz-red)" strokeWidth="1.5" opacity={0.4} strokeLinecap="round" />
            </g>
            {/* Flight path arc */}
            <path d={`M80,130 Q170,45 250,55 Q380,70 505,${waterline - 18}`} stroke="var(--color-viz-red)" strokeWidth="1.5" strokeDasharray="8 5" opacity={0.3} fill="none" />
            <text x="272" y="45" fontSize="13" fontFamily="var(--font-sans)" fontWeight="600" fill="var(--color-viz-red)" opacity={0.7}>Attack drone</text>
            <text x="272" y="60" fontSize="11" fontFamily="var(--font-sans)" fill="var(--color-viz-red)" opacity={0.4}>cheap, expendable</text>

            {/* ═══ THREAT LAYER 2: ABOVE — Anti-ship missile ═══ */}
            <path d={`M70,150 Q280,50 505,${waterline - 18}`} stroke="var(--color-viz-red)" strokeWidth="1.5" strokeDasharray="10 5" opacity={0.3} fill="none" />
            {/* Missile shape along arc */}
            <g transform="translate(300, 80) rotate(20)">
              <rect x="-8" y="-2" width="16" height="4" rx="2" fill="var(--color-viz-red)" opacity={0.5} />
              <path d="M8,0 L12,-2.5 L12,2.5 Z" fill="var(--color-viz-red)" opacity={0.5} />
              <line x1="-8" y1="-4" x2="-4" y2="-2" stroke="var(--color-viz-red)" strokeWidth="1" opacity={0.4} />
              <line x1="-8" y1="4" x2="-4" y2="2" stroke="var(--color-viz-red)" strokeWidth="1" opacity={0.4} />
            </g>
            <text x="340" y="95" fontSize="13" fontFamily="var(--font-sans)" fontWeight="600" fill="var(--color-viz-red)" opacity={0.7}>Anti-ship missile</text>
            <text x="340" y="110" fontSize="11" fontFamily="var(--font-sans)" fill="var(--color-viz-red)" opacity={0.4}>from coastal batteries</text>

            {/* ═══ THREAT LAYER 3: SURFACE — Fast attack boat ═══ */}
            <g transform={`translate(340, ${waterline})`}>
              {/* Small fast boat */}
              <path d="M-16,-2 L-20,0 L-16,2 L14,3 Q18,1 18,-1 L14,-3 Z" fill="var(--color-viz-red)" opacity={0.5} />
              {/* Wake spray */}
              <path d="M-20,0 L-28,3 M-20,0 L-28,-3 M-20,0 L-30,0" stroke="var(--color-viz-red)" strokeWidth="0.75" opacity={0.25} />
              {/* Bow */}
              <rect x="14" y="-5" width="4" height="3" rx="0.5" fill="var(--color-viz-red)" opacity={0.4} />
            </g>
            <text x="340" y={waterline - 16} textAnchor="middle" fontSize="13" fontFamily="var(--font-sans)" fontWeight="600" fill="var(--color-viz-red)" opacity={0.7}>IRGC fast boat</text>
            <text x="340" y={waterline - 3} textAnchor="middle" fontSize="11" fontFamily="var(--font-sans)" fill="var(--color-viz-red)" opacity={0.4}>&lt;3 min to shipping lanes</text>

            {/* ═══ THREAT LAYER 4: UNDERWATER — Moored mine ═══ */}
            <g transform="translate(420, 270)">
              {/* Mine sphere */}
              <circle cx="0" cy="0" r="14" fill="var(--color-viz-red)" opacity={0.2} stroke="var(--color-viz-red)" strokeWidth="2" strokeOpacity={0.45} />
              {/* Contact horns */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                <circle key={angle} cx={Math.cos(angle * Math.PI / 180) * 14} cy={Math.sin(angle * Math.PI / 180) * 14} r="2.5" fill="var(--color-viz-red)" opacity={0.35} />
              ))}
              {/* Mooring cable */}
              <line x1="0" y1="14" x2="0" y2="165" stroke="var(--color-viz-red)" strokeWidth="1" strokeDasharray="4 4" opacity={0.2} />
              {/* Anchor weight */}
              <rect x="-6" y="162" width="12" height="6" rx="1" fill="var(--color-viz-red)" opacity={0.15} />
            </g>
            <text x="448" y="258" fontSize="13" fontFamily="var(--font-sans)" fontWeight="600" fill="var(--color-viz-red)" opacity={0.7}>Moored mine</text>
            <text x="448" y="273" fontSize="11" fontFamily="var(--font-sans)" fill="var(--color-viz-red)" opacity={0.4}>tethered at ship depth</text>

            {/* ═══ THREAT LAYER 5: SEABED — Bottom mine ═══ */}
            <g transform="translate(660, 408)">
              {/* Mine casing */}
              <ellipse cx="0" cy="0" rx="16" ry="8" fill="var(--color-viz-red)" opacity={0.25} stroke="var(--color-viz-red)" strokeWidth="2" strokeOpacity={0.4} />
              {/* Sensor antenna */}
              <line x1="0" y1="-8" x2="0" y2="-22" stroke="var(--color-viz-red)" strokeWidth="1" opacity={0.25} />
              <circle cx="0" cy="-22" r="2" fill="var(--color-viz-red)" opacity={0.2} />
            </g>
            <text x="680" y="395" fontSize="13" fontFamily="var(--font-sans)" fontWeight="600" fill="var(--color-viz-red)" opacity={0.7}>Bottom mine</text>
            <text x="680" y="410" fontSize="11" fontFamily="var(--font-sans)" fill="var(--color-viz-red)" opacity={0.4}>magnetically triggered</text>

            {/* ═══ DEPTH MARKERS ═══ */}
            <g opacity={0.45}>
              <line x1="160" y1={waterline + 2} x2="160" y2="430" stroke="var(--color-ink)" strokeWidth="0.75" strokeDasharray="3 4" />
              <text x="170" y="310" fontSize="12" fontFamily="var(--font-mono)" fontWeight="500" fill="var(--color-ink)">25m</text>
              <text x="170" y="324" fontSize="11" fontFamily="var(--font-sans)" fill="var(--color-ink)" opacity={0.6}>shallow — mines effective</text>

              <line x1="600" y1={waterline + 2} x2="600" y2="450" stroke="var(--color-ink)" strokeWidth="0.75" strokeDasharray="3 4" />
              <text x="610" y="350" fontSize="12" fontFamily="var(--font-mono)" fontWeight="500" fill="var(--color-ink)">60–80m</text>
              <text x="610" y="364" fontSize="11" fontFamily="var(--font-sans)" fill="var(--color-ink)" opacity={0.6}>deep channel</text>
            </g>

            {/* ═══ MISSILE BATTERY on cliff ═══ */}
            <g transform="translate(58, 148)">
              <rect x="-14" y="-4" width="28" height="10" rx="3" fill="var(--color-viz-red)" opacity={0.5} />
              <line x1="2" y1="-4" x2="18" y2="-22" stroke="var(--color-viz-red)" strokeWidth="2.5" opacity={0.5} strokeLinecap="round" />
              <circle cx="18" cy="-22" r="3" fill="var(--color-viz-red)" opacity={0.45} />
            </g>

            {/* Radar dome */}
            <g transform="translate(40, 100)">
              <line x1="0" y1="0" x2="0" y2="-18" stroke="var(--color-ink)" strokeWidth="2" opacity={0.3} />
              <path d="M-12,-18 Q0,-30 12,-18" stroke="var(--color-ink)" strokeWidth="2" fill="none" opacity={0.3} />
              {/* Radar sweep arc */}
              <path d="M12,-18 Q30,-35 50,-22" stroke="var(--color-ink)" strokeWidth="0.75" strokeDasharray="3 3" opacity={0.12} fill="none" />
            </g>

            {/* ═══ EDITORIAL ANNOTATION ═══ */}
            <g transform="translate(630, 40)">
              <rect x="0" y="0" width="290" height="100" rx="4" fill="var(--color-paper)" opacity={0.96} stroke="var(--color-rule)" strokeWidth="1" />
              <text x="14" y="22" fontSize="13" fontFamily="var(--font-sans)" fontWeight="700" fill="var(--color-ink)" opacity={0.6}>Five layers of threat</text>
              <line x1="14" y1="30" x2="80" y2="30" stroke="var(--color-accent)" strokeWidth="1.5" opacity={0.3} />
              <text x="14" y="48" fontSize="12" fontFamily="var(--font-sans)" fill="var(--color-ink-secondary)">
                <tspan x="14" dy="0">Above: drones, cruise missiles</tspan>
                <tspan x="14" dy="17">Surface: IRGC fast boats</tspan>
                <tspan x="14" dy="17">Below: moored and bottom mines</tspan>
              </text>
              <text x="14" y="96" fontSize="11" fontFamily="var(--font-sans)" fontStyle="italic" fill="var(--color-accent)" opacity={0.6}>No single countermeasure defeats all five.</text>
            </g>
          </svg>
        );
      }}
    </Chart>
  );
}
