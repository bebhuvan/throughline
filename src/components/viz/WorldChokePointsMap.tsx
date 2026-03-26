import { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';

interface Chokepoint {
  name: string;
  coords: [number, number];
  flow: number;
  highlight?: boolean;
}

const CHOKEPOINTS: Chokepoint[] = [
  { name: 'Strait of Malacca', coords: [101.2, 2.5], flow: 23.7 },
  { name: 'Strait of Hormuz', coords: [56.5, 26.5], flow: 20.9, highlight: true },
  { name: 'Cape of Good Hope', coords: [18.5, -34.4], flow: 6.0 },
  { name: 'Suez Canal', coords: [32.3, 30.5], flow: 4.9 },
  { name: 'Danish Straits', coords: [11.0, 55.5], flow: 4.9 },
  { name: 'Turkish Straits', coords: [29.0, 41.0], flow: 3.7 },
  { name: 'Bab el-Mandeb', coords: [43.3, 12.6], flow: 3.5 },
  { name: 'Panama Canal', coords: [-79.9, 9.0], flow: 2.3 },
];

export function WorldChokePointsMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://tiles.stadiamaps.com/styles/alidade_smooth.json',
      center: [40, 20],
      zoom: 1.5,
      bearing: 0,
      pitch: 0,
      interactive: false,
      attributionControl: false,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    map.on('load', () => {
      CHOKEPOINTS.forEach((cp) => {
        // Circle marker
        const size = Math.max(12, Math.sqrt(cp.flow) * 8);
        const el = document.createElement('div');
        el.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: ${cp.highlight ? 'rgba(193,39,45,0.2)' : 'rgba(29,78,137,0.15)'};
          border: 2px solid ${cp.highlight ? '#c1272d' : '#1d4e89'};
          cursor: default;
        `;

        if (cp.highlight) {
          el.style.boxShadow = '0 0 0 4px rgba(193,39,45,0.08)';
        }

        new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat(cp.coords)
          .addTo(map);

        // Label
        const label = document.createElement('div');
        const span = document.createElement('span');
        span.textContent = `${cp.name} · ${cp.flow} mb/d`;
        const isBold = cp.highlight;
        span.style.cssText = `
          font-family: Inter, sans-serif;
          font-size: 0.6875rem;
          font-weight: ${isBold ? '700' : '500'};
          color: ${isBold ? '#c1272d' : '#3d3d3d'};
          background: rgba(250,249,246,0.9);
          padding: 2px 6px;
          border-radius: 2px;
          white-space: nowrap;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        `;
        label.appendChild(span);

        new maplibregl.Marker({ element: label, anchor: 'top', offset: [0, size / 2 + 4] })
          .setLngLat(cp.coords)
          .addTo(map);
      });
    });

    return () => map.remove();
  }, []);

  return (
    <div className="chart-container container-wide">
      <div className="chart-title">Global maritime chokepoints</div>
      <div className="chart-subtitle">
        Circle size proportional to oil flow volume. Disruption at any one reverberates through energy, shipping, and food markets worldwide.
      </div>
      <div ref={containerRef} className="w-full map-container" style={{ aspectRatio: '2 / 1' }} />
      <div className="chart-source">Source: U.S. Energy Information Administration, 2025</div>
    </div>
  );
}
