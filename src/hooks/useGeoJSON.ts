import { useCallback } from 'react';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';
import type { FeatureCollection, Position } from 'geojson';

import { buildGeoJSON } from '@/utils/geojson';
import type { MarkerType, Point } from '@/types/map';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

interface Props {
  markers: MarkerType[];
  polygonPoints: Point[];
  setMarkers: Dispatch<SetStateAction<MarkerType[]>>;
  setPolygonPoints: Dispatch<SetStateAction<Point[]>>;
}

function isFeatureCollection(value: unknown): value is FeatureCollection {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as FeatureCollection).type === 'FeatureCollection' &&
    Array.isArray((value as FeatureCollection).features)
  );
}

function toPoint([lng, lat]: Position): Point {
  return { lng, lat };
}

function parseGeoJSON(geojson: FeatureCollection) {
  const markers: MarkerType[] = [];
  const polygonPoints: Point[] = [];

  geojson.features.forEach((feature) => {
    const geometry = feature.geometry;

    if (geometry.type === 'Point') {
      const { lng, lat } = toPoint(geometry.coordinates);
      markers.push({ id: crypto.randomUUID(), lng, lat });
      return;
    }

    if (geometry.type === 'Polygon' && geometry.coordinates.length > 0) {
      // Drop the closing coordinate that mirrors the first vertex.
      geometry.coordinates[0].slice(0, -1).forEach((position) => {
        polygonPoints.push(toPoint(position));
      });
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

      if (file.size > MAX_FILE_SIZE) {
        toast.error('File is too large (max 5 MB).');
        e.target.value = '';
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        try {
          const parsed: unknown = JSON.parse(reader.result as string);

          if (!isFeatureCollection(parsed)) {
            throw new Error('Invalid GeoJSON');
          }

          const { markers, polygonPoints } = parseGeoJSON(parsed);

          setMarkers(markers);
          setPolygonPoints(polygonPoints);
          toast.success('GeoJSON imported successfully.');
        } catch (error) {
          console.error(error);
          toast.error('Invalid GeoJSON file.');
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
