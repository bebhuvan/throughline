/**
 * SVG illustrations for tangible storytelling.
 * Each is a clean, editorial-style silhouette.
 */

interface IllustrationProps {
  className?: string;
  color?: string;
  size?: number;
}

export function OilTanker({ className = '', color = 'currentColor', size = 240 }: IllustrationProps) {
  return (
    <svg viewBox="0 0 400 160" width={size} className={className} fill="none" aria-label="Crude oil tanker illustration">
      {/* Hull */}
      <path d="M30,120 Q30,140 50,140 L350,140 Q370,140 370,120 L365,95 Q360,85 350,85 L50,85 Q40,85 35,95 Z" fill={color} opacity={0.12} />
      {/* Waterline */}
      <path d="M35,120 L365,120" stroke={color} strokeWidth="1.5" opacity={0.3} />
      {/* Deck */}
      <rect x="45" y="78" width="310" height="10" rx="2" fill={color} opacity={0.2} />
      {/* Bridge/superstructure — at stern */}
      <rect x="300" y="38" width="45" height="42" rx="3" fill={color} opacity={0.18} />
      <rect x="305" y="43" width="12" height="8" rx="1" fill={color} opacity={0.1} />
      <rect x="322" y="43" width="12" height="8" rx="1" fill={color} opacity={0.1} />
      <rect x="305" y="56" width="12" height="8" rx="1" fill={color} opacity={0.1} />
      <rect x="322" y="56" width="12" height="8" rx="1" fill={color} opacity={0.1} />
      {/* Funnel */}
      <rect x="315" y="22" width="18" height="18" rx="2" fill={color} opacity={0.25} />
      <rect x="318" y="16" width="12" height="8" rx="1" fill={color} opacity={0.15} />
      {/* Mast */}
      <line x1="324" y1="16" x2="324" y2="6" stroke={color} strokeWidth="1.5" opacity={0.3} />
      {/* Deck pipes — the tanker's characteristic look */}
      <line x1="60" y1="76" x2="60" y2="68" stroke={color} strokeWidth="2" opacity={0.15} />
      <line x1="60" y1="68" x2="290" y2="68" stroke={color} strokeWidth="2" opacity={0.15} />
      <line x1="290" y1="68" x2="290" y2="76" stroke={color} strokeWidth="2" opacity={0.15} />
      {/* Deck machinery */}
      {[90, 130, 170, 210, 250].map(x => (
        <g key={x}>
          <circle cx={x} cy="73" r="4" fill={color} opacity={0.12} />
          <line x1={x} y1="68" x2={x} y2="76" stroke={color} strokeWidth="1" opacity={0.15} />
        </g>
      ))}
      {/* Bow */}
      <path d="M50,85 L30,95 L28,105" stroke={color} strokeWidth="1.5" fill="none" opacity={0.2} />
      {/* Water */}
      <path d="M15,135 Q30,130 50,135 Q70,140 90,135 Q110,130 130,135 Q150,140 170,135 Q190,130 210,135 Q230,140 250,135 Q270,130 290,135 Q310,140 330,135 Q350,130 370,135 Q390,140 400,135" stroke={color} strokeWidth="1" opacity={0.08} fill="none" />
      {/* Scale annotation */}
      <line x1="45" y1="152" x2="355" y2="152" stroke={color} strokeWidth="0.75" opacity={0.2} />
      <line x1="45" y1="149" x2="45" y2="155" stroke={color} strokeWidth="0.75" opacity={0.2} />
      <line x1="355" y1="149" x2="355" y2="155" stroke={color} strokeWidth="0.75" opacity={0.2} />
      <text x="200" y="159" textAnchor="middle" fontSize="10" fontFamily="var(--font-sans)" fill={color} opacity={0.25}>~330 m (VLCC)</text>
    </svg>
  );
}

export function LPGCylinder({ className = '', color = 'currentColor', size = 80 }: IllustrationProps) {
  return (
    <svg viewBox="0 0 60 100" width={size} className={className} fill="none" aria-label="LPG gas cylinder illustration">
      {/* Body */}
      <rect x="10" y="20" width="40" height="65" rx="8" fill={color} opacity={0.12} />
      {/* Top dome */}
      <path d="M10,28 Q10,12 30,12 Q50,12 50,28" fill={color} opacity={0.15} />
      {/* Valve */}
      <rect x="25" y="4" width="10" height="10" rx="3" fill={color} opacity={0.2} />
      <line x1="30" y1="0" x2="30" y2="4" stroke={color} strokeWidth="2" opacity={0.25} />
      {/* Handle */}
      <path d="M22,7 Q22,2 30,2 Q38,2 38,7" stroke={color} strokeWidth="1.5" fill="none" opacity={0.2} />
      {/* Ring */}
      <ellipse cx="30" cy="88" rx="12" ry="3" fill={color} opacity={0.08} />
      {/* Base */}
      <path d="M12,85 L12,90 Q12,93 18,93 L42,93 Q48,93 48,90 L48,85" fill={color} opacity={0.1} />
      {/* Label stripe */}
      <rect x="14" y="40" width="32" height="18" rx="2" fill={color} opacity={0.06} />
    </svg>
  );
}

export function GrainSack({ className = '', color = 'currentColor', size = 80 }: IllustrationProps) {
  return (
    <svg viewBox="0 0 70 90" width={size} className={className} fill="none" aria-label="Grain sack illustration">
      {/* Sack body */}
      <path d="M12,30 Q8,35 8,50 L10,80 Q12,88 35,88 Q58,88 60,80 L62,50 Q62,35 58,30 Z" fill={color} opacity={0.12} />
      {/* Tied top */}
      <path d="M18,30 Q18,22 35,20 Q52,22 52,30" fill={color} opacity={0.1} />
      <path d="M25,22 L35,15 L45,22" stroke={color} strokeWidth="1.5" fill="none" opacity={0.2} />
      {/* Tie */}
      <ellipse cx="35" cy="28" rx="8" ry="3" fill={color} opacity={0.08} />
      {/* Grain texture dots */}
      {[
        [25,45], [35,42], [45,47], [30,55], [40,53], [22,58],
        [48,60], [35,65], [25,70], [42,72], [32,78], [40,62],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2" fill={color} opacity={0.06} />
      ))}
      {/* Label */}
      <text x="35" y="56" textAnchor="middle" fontSize="7" fontFamily="var(--font-sans)" fontWeight="600" fill={color} opacity={0.12}>WHEAT</text>
    </svg>
  );
}

export function OilBarrel({ className = '', color = 'currentColor', size = 70 }: IllustrationProps) {
  return (
    <svg viewBox="0 0 60 80" width={size} className={className} fill="none" aria-label="Oil barrel illustration">
      {/* Barrel body */}
      <path d="M8,18 Q4,20 4,40 Q4,60 8,62 L8,62 Q12,68 30,68 Q48,68 52,62 L52,62 Q56,60 56,40 Q56,20 52,18 Q48,12 30,12 Q12,12 8,18 Z" fill={color} opacity={0.12} />
      {/* Top ellipse */}
      <ellipse cx="30" cy="15" rx="22" ry="6" fill={color} opacity={0.15} />
      {/* Bottom ellipse */}
      <ellipse cx="30" cy="65" rx="22" ry="6" fill={color} opacity={0.08} />
      {/* Hoops */}
      <ellipse cx="30" cy="28" rx="24" ry="5" stroke={color} strokeWidth="1" fill="none" opacity={0.1} />
      <ellipse cx="30" cy="52" rx="24" ry="5" stroke={color} strokeWidth="1" fill="none" opacity={0.1} />
      {/* Bung */}
      <circle cx="30" cy="14" r="3" fill={color} opacity={0.1} />
    </svg>
  );
}

export function ShippingLane({ className = '', size = 400 }: IllustrationProps) {
  return (
    <svg viewBox="0 0 800 80" width={size} className={className} fill="none" aria-label="Shipping lane width comparison">
      {/* Lane background */}
      <rect x="0" y="20" width="800" height="40" rx="4" fill="var(--color-viz-cyan)" opacity={0.06} />
      {/* Lane markers */}
      <line x1="0" y1="20" x2="800" y2="20" stroke="var(--color-viz-cyan)" strokeWidth="1" strokeDasharray="8 4" opacity={0.2} />
      <line x1="0" y1="60" x2="800" y2="60" stroke="var(--color-viz-cyan)" strokeWidth="1" strokeDasharray="8 4" opacity={0.2} />
      {/* Tiny tanker silhouettes */}
      {[80, 250, 420, 580, 720].map((x, i) => (
        <g key={i} transform={`translate(${x}, 32)`} opacity={0.15 + i * 0.03}>
          <rect x="-18" y="-5" width="36" height="10" rx="3" fill="var(--color-viz-cyan)" />
          <rect x="10" y="-9" width="6" height="6" rx="1" fill="var(--color-viz-cyan)" />
        </g>
      ))}
      {/* Width label */}
      <line x1="0" y1="72" x2="256" y2="72" stroke="var(--color-ink)" strokeWidth="0.75" opacity={0.2} />
      <text x="128" y="78" textAnchor="middle" fontSize="11" fontFamily="var(--font-sans)" fill="var(--color-ink)" opacity={0.35}>
        3.2 km — one shipping lane
      </text>
    </svg>
  );
}
