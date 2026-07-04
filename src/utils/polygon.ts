import type { GeoJSONSource, Map } from 'mapbox-gl';
import area from '@turf/area';
import type { Feature, FeatureCollection, Polygon } from 'geojson';
import type { Point } from '@/types/map';

const POLYGON_SOURCE = 'polygon-source';
const FILL_LAYER = 'polygon-fill';
const LINE_LAYER = 'polygon-line';

const EMPTY: FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

export function buildPolygonFeature(points: Point[]): Feature<Polygon> | null {
  if (points.length < 3) return null;

  const ring = points.map((point) => [point.lng, point.lat]);

  // Close the ring
  ring.push(ring[0]);

  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [ring],
    },
    properties: {},
  };
}

// Renders a closed polygon once there are 3+ points, otherwise a preview line.
function buildGeometry(points: Point[]): FeatureCollection {
  const polygon = buildPolygonFeature(points);

  if (polygon) {
    return { type: 'FeatureCollection', features: [polygon] };
  }

  if (points.length >= 2) {
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: points.map((point) => [point.lng, point.lat]),
          },
          properties: {},
        },
      ],
    };
  }

  return EMPTY;
}

// Create the source and layers a single time, right after the style loads.
export function initPolygonLayers(map: Map) {
  if (map.getSource(POLYGON_SOURCE)) return;

  map.addSource(POLYGON_SOURCE, { type: 'geojson', data: EMPTY });

  map.addLayer({
    id: FILL_LAYER,
    type: 'fill',
    source: POLYGON_SOURCE,
    filter: ['==', '$type', 'Polygon'],
    paint: {
      'fill-color': '#2563eb',
      'fill-opacity': 0.4,
    },
  });

  map.addLayer({
    id: LINE_LAYER,
    type: 'line',
    source: POLYGON_SOURCE,
    paint: {
      'line-color': '#2563eb',
      'line-width': 2,
    },
  });
}

// Cheap update: push new coordinates into the existing source.
export function updatePolygon(map: Map, points: Point[]) {
  const source = map.getSource(POLYGON_SOURCE) as GeoJSONSource | undefined;

  if (!source) return;

  source.setData(buildGeometry(points));
}

export function computeArea(points: Point[]): number {
  const polygon = buildPolygonFeature(points);

  return polygon ? area(polygon) : 0;
}
