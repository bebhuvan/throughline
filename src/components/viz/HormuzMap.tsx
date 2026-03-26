import { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';

// ── Shipping lanes through the strait ──
const SHIPPING_LANE_OUTBOUND: GeoJSON.Feature = {
  type: 'Feature',
  properties: { direction: 'outbound' },
  geometry: {
    type: 'LineString',
    coordinates: [
      [49.5, 26.8], [51.5, 26.6], [53.0, 26.3], [54.5, 26.0],
      [55.5, 26.1], [56.2, 26.25], [56.5, 26.4], [56.8, 26.65],
      [57.5, 27.0], [58.5, 27.2],
    ],
  },
};

const SHIPPING_LANE_INBOUND: GeoJSON.Feature = {
  type: 'Feature',
  properties: { direction: 'inbound' },
  geometry: {
    type: 'LineString',
    coordinates: [
      [58.5, 26.8], [57.5, 26.7], [56.8, 26.45], [56.5, 26.2],
      [56.2, 26.05], [55.5, 25.85], [54.5, 25.75], [53.0, 26.0],
      [51.5, 26.3], [49.5, 26.5],
    ],
  },
};

// ── Pipeline bypasses ──
const PIPELINES: GeoJSON.Feature = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'MultiLineString',
    coordinates: [
      // Saudi East-West (Abqaiq → Yanbu)
      [[49.68, 25.94], [48.5, 25.5], [46.5, 24.8], [44.0, 24.2], [41.0, 23.8], [38.06, 24.09]],
      // UAE ADCOP (Habshan → Fujairah)
      [[54.0, 23.8], [55.0, 24.5], [56.0, 25.0], [56.35, 25.12]],
    ],
  },
};

const STRAIT_WIDTH: GeoJSON.Feature = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: [[56.25, 26.65], [56.45, 26.08]],
  },
};

// ── Energy infrastructure ──
interface InfraPoint {
  name: string;
  coords: [number, number];
  type: 'oil-field' | 'refinery' | 'lng-plant' | 'terminal' | 'port';
  detail?: string;
}

const INFRASTRUCTURE: InfraPoint[] = [
  // Key oil fields — only the most significant
  { name: 'Ghawar', coords: [49.2, 25.4], type: 'oil-field', detail: 'World\'s largest oil field' },
  { name: 'Safaniyah', coords: [49.8, 28.3], type: 'oil-field', detail: 'Largest offshore' },
  { name: 'Rumaila', coords: [47.3, 30.8], type: 'oil-field', detail: 'Iraq\'s largest' },

  // Key processing & terminals
  { name: 'Abqaiq', coords: [49.68, 25.94], type: 'refinery', detail: 'Attacked 2019' },
  { name: 'Ras Tanura', coords: [50.17, 26.65], type: 'terminal', detail: 'Largest Saudi terminal' },
  { name: 'Ras Laffan', coords: [51.55, 25.93], type: 'lng-plant', detail: 'World\'s largest LNG' },
  { name: 'Kharg Island', coords: [50.33, 29.23], type: 'terminal', detail: 'Iran\'s main export' },

  // Strait area
  { name: 'Bandar Abbas', coords: [56.28, 27.19], type: 'port' },
  { name: 'Fujairah', coords: [56.35, 25.12], type: 'port', detail: 'Bypasses strait' },

  // Pipeline terminus
  { name: 'Yanbu', coords: [38.06, 24.09], type: 'terminal', detail: 'Pipeline terminus' },
];

// ── Country labels ──
const LABELS: { text: string; coords: [number, number]; style: string }[] = [
  // Countries — all legible
  { text: 'IRAN', coords: [54.0, 31.5], style: 'font-weight:700;letter-spacing:0.35em;font-size:1rem;color:#7a6e62;' },
  { text: 'SAUDI ARABIA', coords: [44.5, 24.0], style: 'font-weight:700;letter-spacing:0.35em;font-size:0.875rem;color:#7a6e62;' },
  { text: 'IRAQ', coords: [44.0, 33.0], style: 'font-weight:700;letter-spacing:0.3em;font-size:0.8125rem;color:#7a6e62;' },
  { text: 'KUWAIT', coords: [47.8, 29.8], style: 'font-weight:700;letter-spacing:0.2em;font-size:0.6875rem;color:#8a7e72;' },
  { text: 'OMAN', coords: [57.5, 22.0], style: 'font-weight:700;letter-spacing:0.3em;font-size:0.75rem;color:#7a6e62;' },
  { text: 'U.A.E.', coords: [54.5, 23.3], style: 'font-weight:700;letter-spacing:0.25em;font-size:0.6875rem;color:#8a7e72;' },
  { text: 'QATAR', coords: [51.1, 24.8], style: 'font-weight:700;letter-spacing:0.2em;font-size:0.6875rem;color:#8a7e72;' },
  // Water bodies — prominent italic serif
  { text: 'Persian Gulf', coords: [51.0, 27.5], style: 'font-weight:300;font-style:italic;font-size:1.0625rem;color:#7ba3bd;letter-spacing:0.15em;font-family:Source Serif 4,serif;' },
  { text: 'Gulf of Oman', coords: [59.0, 24.5], style: 'font-weight:300;font-style:italic;font-size:0.875rem;color:#7ba3bd;letter-spacing:0.1em;font-family:Source Serif 4,serif;' },
  { text: 'Arabian Sea', coords: [62.0, 20.5], style: 'font-weight:300;font-style:italic;font-size:0.8125rem;color:#7ba3bd;letter-spacing:0.1em;font-family:Source Serif 4,serif;' },
  { text: 'Red Sea', coords: [37.5, 21.0], style: 'font-weight:300;font-style:italic;font-size:0.75rem;color:#7ba3bd;letter-spacing:0.1em;font-family:Source Serif 4,serif;' },
];

const TYPE_STYLES: Record<string, { color: string; size: number; shape: string }> = {
  'oil-field':  { color: '#1a1a1a', size: 10, shape: 'diamond' },
  'refinery':   { color: '#b8232a', size: 9, shape: 'square' },
  'lng-plant':  { color: '#1b7a8a', size: 10, shape: 'circle' },
  'terminal':   { color: '#a05518', size: 8, shape: 'circle' },
  'port':       { color: '#636363', size: 8, shape: 'circle' },
};

function createTextMarker(text: string, style: string, map: maplibregl.Map, coords: [number, number], anchor: string = 'center', offset?: [number, number]) {
  const el = document.createElement('div');
  const span = document.createElement('span');
  span.textContent = text;
  span.style.cssText = `font-family:Inter,sans-serif;${style}white-space:nowrap;pointer-events:none;`;
  el.appendChild(span);
  new maplibregl.Marker({ element: el, anchor: anchor as any, offset: offset || undefined })
    .setLngLat(coords)
    .addTo(map);
}

function createInfraMarker(point: InfraPoint, map: maplibregl.Map) {
  const s = TYPE_STYLES[point.type];
  const el = document.createElement('div');

  if (s.shape === 'diamond') {
    el.style.cssText = `width:${s.size}px;height:${s.size}px;background:${s.color};transform:rotate(45deg);border:1.5px solid rgba(255,255,255,0.85);box-shadow:0 1px 4px rgba(0,0,0,0.2);`;
  } else if (s.shape === 'square') {
    el.style.cssText = `width:${s.size}px;height:${s.size}px;background:${s.color};border-radius:1px;border:1.5px solid rgba(255,255,255,0.85);box-shadow:0 1px 4px rgba(0,0,0,0.2);`;
  } else {
    el.style.cssText = `width:${s.size}px;height:${s.size}px;background:${s.color};border-radius:50%;border:1.5px solid rgba(255,255,255,0.85);box-shadow:0 1px 4px rgba(0,0,0,0.2);`;
  }

  new maplibregl.Marker({ element: el, anchor: 'center' })
    .setLngLat(point.coords)
    .addTo(map);

  // Label
  const isKey = point.type === 'oil-field' || point.type === 'lng-plant' || point.type === 'refinery';
  const fontWeight = isKey ? '700' : '600';
  const fontSize = isKey ? '0.6875rem' : '0.625rem';
  const labelColor = s.color === '#1a1a1a' ? '#3d3d3d' : s.color;
  const labelContent = point.detail ? `${point.name}` : point.name;

  createTextMarker(
    labelContent,
    `font-size:${fontSize};font-weight:${fontWeight};color:${labelColor};background:rgba(250,249,246,0.92);padding:2px 6px;border-radius:3px;box-shadow:0 1px 4px rgba(0,0,0,0.06);`,
    map,
    point.coords,
    'left',
    [s.size / 2 + 5, 0]
  );
}

// Stadia Alidade Smooth — warm, elegant, free
const STADIA_STYLE = 'https://tiles.stadiamaps.com/styles/alidade_smooth.json';

export function HormuzMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
        container: containerRef.current,
        style: STADIA_STYLE,
        center: [52.0, 27.0],
        zoom: 4.8,
        bearing: 0,
        pitch: 0,
        interactive: false,
        attributionControl: false,
      });
    } catch (e) {
      console.error('[HormuzMap] Failed to initialize map:', e);
      return;
    }

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    map.on('load', () => {
      // Shipping lanes
      map.addSource('outbound', { type: 'geojson', data: SHIPPING_LANE_OUTBOUND });
      map.addSource('inbound', { type: 'geojson', data: SHIPPING_LANE_INBOUND });
      map.addSource('pipelines', { type: 'geojson', data: PIPELINES });
      map.addSource('strait-width', { type: 'geojson', data: STRAIT_WIDTH });

      map.addLayer({ id: 'outbound-glow', type: 'line', source: 'outbound', paint: { 'line-color': '#1b7a8a', 'line-width': 10, 'line-opacity': 0.06, 'line-blur': 3 } });
      map.addLayer({ id: 'outbound-lane', type: 'line', source: 'outbound', paint: { 'line-color': '#1b7a8a', 'line-width': 2.5, 'line-opacity': 0.65 } });
      map.addLayer({ id: 'inbound-lane', type: 'line', source: 'inbound', paint: { 'line-color': '#1b7a8a', 'line-width': 2, 'line-opacity': 0.35, 'line-dasharray': [4, 3] } });
      map.addLayer({ id: 'pipeline-line', type: 'line', source: 'pipelines', paint: { 'line-color': '#c1272d', 'line-width': 1.5, 'line-opacity': 0.4, 'line-dasharray': [6, 4] } });
      map.addLayer({ id: 'strait-width-line', type: 'line', source: 'strait-width', paint: { 'line-color': '#c1272d', 'line-width': 1, 'line-opacity': 0.35, 'line-dasharray': [3, 2] } });

      // Infrastructure markers
      INFRASTRUCTURE.forEach((pt) => createInfraMarker(pt, map));

      // Country & water body labels
      LABELS.forEach((lbl) => createTextMarker(lbl.text, lbl.style, map, lbl.coords));

      // Strait width annotation
      createTextMarker('39 km', 'font-size:0.75rem;font-weight:700;color:#c1272d;background:rgba(250,249,246,0.94);padding:3px 8px;border-radius:3px;box-shadow:0 1px 4px rgba(0,0,0,0.08);', map, [56.36, 26.36], 'left', [8, 0]);

      // Strait label
      createTextMarker('STRAIT OF HORMUZ', 'font-size:0.6875rem;font-weight:700;letter-spacing:0.25em;color:#c1272d;', map, [56.5, 26.55]);
    });

    return () => map.remove();
  }, []);

  return (
    <div className="chart-container container-wide">
      <div className="chart-title">The Persian Gulf and the Strait of Hormuz</div>
      <div className="chart-subtitle">
        Oil fields, refineries, LNG plants, and export terminals that depend on a 10-kilometre shipping corridor. Pipeline bypasses exist — but carry a fraction of total flow.
      </div>
      <div ref={containerRef} className="w-full map-container" role="img" aria-label="Map of the Persian Gulf showing oil fields, refineries, LNG plants, export terminals, shipping lanes through the Strait of Hormuz, and pipeline bypasses" style={{ aspectRatio: '16 / 9' }} />
      <div className="chart-source mt-4 flex flex-wrap gap-x-5 gap-y-2 items-center">
        <span className="flex items-center gap-1.5"><span className="block w-[7px] h-[7px] bg-ink rotate-45" style={{transform:'rotate(45deg)'}}></span><span>Oil fields</span></span>
        <span className="flex items-center gap-1.5"><span className="block w-[6px] h-[6px] bg-accent rounded-[1px]"></span><span>Refineries</span></span>
        <span className="flex items-center gap-1.5"><span className="block w-[7px] h-[7px] bg-viz-cyan rounded-full"></span><span>LNG plants</span></span>
        <span className="flex items-center gap-1.5"><span className="block w-[5px] h-[5px] bg-viz-amber rounded-full"></span><span>Terminals</span></span>
        <span className="flex items-center gap-1.5"><span className="block w-4 h-[2px] bg-viz-cyan rounded"></span><span>Shipping lanes</span></span>
        <span className="flex items-center gap-1.5"><span className="block w-4 h-[2px] border-t-[1.5px] border-dashed border-accent"></span><span>Pipeline bypass</span></span>
      </div>
    </div>
  );
}
