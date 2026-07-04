import { useCallback } from 'react';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';

import { buildGeoJSON } from '@/utils/geojson';
import type { MarkerType, Point } from '@/types/map';

interface Props {
  markers: MarkerType[];
  polygonPoints: Point[];
  setMarkers: Dispatch<SetStateAction<MarkerType[]>>;
  setPolygonPoints: Dispatch<SetStateAction<Point[]>>;
}

interface PointFeature {
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}

interface PolygonFeature {
  geometry: {
    type: 'Polygon';
    coordinates: [number, number][][];
  };
}

type GeoJSONFeature = PointFeature | PolygonFeature;

interface GeoJSON {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

function parseGeoJSON(geojson: GeoJSON) {
  const markers: MarkerType[] = [];
  const polygonPoints: Point[] = [];

  geojson.features.forEach((feature) => {
    switch (feature.geometry.type) {
      case 'Point': {
        const [lng, lat] = feature.geometry.coordinates;

        markers.push({
          id: crypto.randomUUID(),
          lng,
          lat,
        });

        break;
      }

      case 'Polygon': {
        feature.geometry.coordinates[0].slice(0, -1).forEach(([lng, lat]) => {
          polygonPoints.push({
            lng,
            lat,
          });
        });

        break;
      }
    }
  });

  return { markers, polygonPoints };
}

export function useGeoJSON({
  markers,
  polygonPoints,
  setMarkers,
  setPolygonPoints,
}: Props) {
  const exportGeoJSON = useCallback(() => {
    const geojson = buildGeoJSON(markers, polygonPoints);

    const blob = new Blob([JSON.stringify(geojson, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'geomap.geojson';
    link.click();

    setTimeout(() => URL.revokeObjectURL(url), 100);
  }, [markers, polygonPoints]);

  const importGeoJSON = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file) return;

      const reader = new FileReader();

      reader.onload = () => {
        try {
          const geojson = JSON.parse(reader.result as string) as GeoJSON;

          if (
            geojson.type !== 'FeatureCollection' ||
            !Array.isArray(geojson.features)
          ) {
            throw new Error('Invalid GeoJSON');
          }

          const { markers, polygonPoints } = parseGeoJSON(geojson);

          setMarkers(markers);
          setPolygonPoints(polygonPoints);
        } catch (error) {
          console.error(error);
          alert('Invalid GeoJSON file.');
        } finally {
          e.target.value = '';
        }
      };

      reader.readAsText(file);
    },
    [setMarkers, setPolygonPoints],
  );

  return {
    exportGeoJSON,
    importGeoJSON,
  };
}
