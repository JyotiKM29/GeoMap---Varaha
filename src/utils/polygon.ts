import type { Map } from 'mapbox-gl';
import * as turf from '@turf/turf';
import type { Feature, Polygon } from 'geojson';
import type { Point } from '@/types/map';

const POLYGON_SOURCE = 'polygon-source';
const POLYGON_LAYER = 'polygon-layer';

export function buildPolygonGeoJSON(points: Point[]) {
  if (points.length < 3) return null;

  const coordinates = points.map((point) => [point.lng, point.lat]);

  // Close the polygon
  coordinates.push(coordinates[0]);

  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [coordinates],
    },
    properties: {},
  } as Feature<Polygon>;
}

export function removePolygon(map: Map) {
  if (map.getLayer(POLYGON_LAYER)) {
    map.removeLayer(POLYGON_LAYER);
  }

  if (map.getSource(POLYGON_SOURCE)) {
    map.removeSource(POLYGON_SOURCE);
  }
}

export function drawPolygon(map: Map, points: Point[]): number {
  if (!map.isStyleLoaded()) {
    return 0;
  }

  removePolygon(map);

  const polygon = buildPolygonGeoJSON(points);

  if (!polygon) return 0;

  map.addSource(POLYGON_SOURCE, {
    type: 'geojson',
    data: polygon,
  });

  map.addLayer({
    id: POLYGON_LAYER,
    type: 'fill',
    source: POLYGON_SOURCE,
    paint: {
      'fill-color': '#2563eb',
      'fill-opacity': 0.4,
    },
  });

  return turf.area(polygon);
}
