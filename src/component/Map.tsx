import { useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import type { MarkerType, Point } from '@/types/map';
import { syncMarkers } from '@/utils/marker';
import type { MarkerRegistry } from '@/utils/marker';
import { initPolygonLayers, updatePolygon } from '@/utils/polygon';
import {
  MAPBOX_TOKEN,
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  MAP_STYLE,
} from '@/constants/map';

interface MapProps {
  markers: MarkerType[];
  setMarkers: Dispatch<SetStateAction<MarkerType[]>>;

  polygonPoints: Point[];
  setPolygonPoints: Dispatch<SetStateAction<Point[]>>;

  mode: 'marker' | 'polygon';
}

export default function MapView({
  markers,
  setMarkers,
  polygonPoints,
  setPolygonPoints,
  mode,
}: MapProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markerRegistryRef = useRef<MarkerRegistry>(new Map());
  const modeRef = useRef(mode);

  const [mapLoaded, setMapLoaded] = useState(false);

  // Keep latest mode without recreating the map
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // Create map once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!MAPBOX_TOKEN) return;

    const map = new mapboxgl.Map({
      accessToken: MAPBOX_TOKEN,
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    map.on('load', () => {
      mapRef.current = map;
      initPolygonLayers(map);
      setMapLoaded(true);
    });

    map.on('click', (e) => {
      if (modeRef.current === 'marker') {
        setMarkers((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            lng: e.lngLat.lng,
            lat: e.lngLat.lat,
          },
        ]);
      } else {
        setPolygonPoints((prev) => [
          ...prev,
          {
            lng: e.lngLat.lng,
            lat: e.lngLat.lat,
          },
        ]);
      }
    });

    const registry = markerRegistryRef.current;

    return () => {
      registry.clear();
      map.remove();
      mapRef.current = null;
    };
  }, [setMarkers, setPolygonPoints]);

  // Sync markers
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    syncMarkers(mapRef.current, markers, markerRegistryRef.current);
  }, [markers, mapLoaded]);

  // Sync polygon
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    updatePolygon(mapRef.current, polygonPoints);
  }, [polygonPoints, mapLoaded]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-950 p-6 text-center">
        <p className="max-w-sm text-sm text-slate-300">
          Mapbox access token is missing. Set{' '}
          <code className="text-blue-400">VITE_MAPBOX_TOKEN</code> in your
          environment to load the map.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full" />

      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60">
          <span className="text-sm text-slate-300">Loading map...</span>
        </div>
      )}
    </div>
  );
}
