import { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';

interface MapLayer {
  id: string;
  type: 'fill' | 'line' | 'circle' | 'symbol';
  source: {
    type: 'geojson';
    data: GeoJSON.GeoJSON;
  };
  paint?: Record<string, unknown>;
  layout?: Record<string, unknown>;
}

interface MapAnnotation {
  coordinates: [number, number];
  text: string;
  className?: string;
  anchor?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  bearing?: number;
  pitch?: number;
  styleUrl?: string;
  layers?: MapLayer[];
  annotations?: MapAnnotation[];
  interactive?: boolean;
  aspectRatio?: number;
  title?: string;
  subtitle?: string;
  source?: string;
  sourceUrl?: string;
  onMapLoad?: (map: maplibregl.Map) => void;
}

const FREE_TILE_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    'osm-raster': {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm-raster-layer',
      type: 'raster',
      source: 'osm-raster',
      paint: {
        'raster-saturation': -0.3,
        'raster-brightness-min': 0.1,
        'raster-contrast': -0.1,
      },
    },
  ],
};

export function MapView({
  center = [54, 26.5],
  zoom = 5,
  bearing = 0,
  pitch = 0,
  styleUrl,
  layers = [],
  annotations = [],
  interactive = false,
  aspectRatio = 0.56,
  title,
  subtitle,
  source,
  sourceUrl,
  onMapLoad,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
        container: containerRef.current,
        style: styleUrl || FREE_TILE_STYLE,
        center,
        zoom,
        bearing,
        pitch,
        interactive,
        attributionControl: false,
      });
    } catch (e) {
      console.error('[MapView] Failed to initialize map:', e);
      return;
    }

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    map.on('load', () => {
      layers.forEach((layer) => {
        map.addSource(layer.id, layer.source);
        map.addLayer({
          id: layer.id,
          type: layer.type as any,
          source: layer.id,
          paint: layer.paint as any,
          layout: layer.layout as any,
        });
      });

      annotations.forEach((ann) => {
        const el = document.createElement('div');
        el.className = ann.className || '';

        const span = document.createElement('span');
        span.textContent = ann.text;
        span.style.cssText = 'font-family: Inter, sans-serif; font-size: 0.6875rem; font-weight: 600; background: rgba(250,249,246,0.92); backdrop-filter: blur(4px); padding: 2px 8px; border-radius: 3px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); white-space: nowrap;';
        el.appendChild(span);

        new maplibregl.Marker({ element: el, anchor: ann.anchor || 'bottom' })
          .setLngLat(ann.coordinates)
          .addTo(map);
      });

      onMapLoad?.(map);
    });

    mapRef.current = map;
    return () => map.remove();
  }, []);

  return (
    <div className="chart-container container-wide" role="figure" aria-label={title || 'Map'}>
      {title && <div className="chart-title">{title}</div>}
      {subtitle && <div className="chart-subtitle">{subtitle}</div>}
      <div
        ref={containerRef}
        className="w-full map-container"
        role="img"
        aria-label={subtitle || title || 'Interactive map'}
        style={{ aspectRatio: `1 / ${aspectRatio}` }}
      />
      {source && (
        <div className="chart-source">
          Source:{' '}
          {sourceUrl ? (
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">{source}</a>
          ) : source}
        </div>
      )}
    </div>
  );
}
