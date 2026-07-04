'use client';

import { useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import type { MarkerType, Point } from '@/types/map';
import { renderMarkers } from '@/utils/marker';
import { drawPolygon, removePolygon } from '@/utils/polygon';
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
  setPolygonArea: Dispatch<SetStateAction<number>>;
}

export default function Map({
  markers,
  setMarkers,
  polygonPoints,
  setPolygonPoints,
  mode,
  setPolygonArea,
}: MapProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markerRefs = useRef<mapboxgl.Marker[]>([]);
  const modeRef = useRef(mode);

  const [mapLoaded, setMapLoaded] = useState(false);

  // Keep latest mode without recreating the map
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // Create map once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      accessToken: MAPBOX_TOKEN,
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    map.on('load', () => {
      mapRef.current = map;
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

    return () => {
      markerRefs.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [setMarkers, setPolygonPoints]);

  // Sync markers
  useEffect(() => {
    if (!mapLoaded) return;
    if (!mapRef.current) return;

    renderMarkers(mapRef.current, markers, markerRefs);
  }, [markers, mapLoaded]);

  // Sync polygon
  useEffect(() => {
    if (!mapLoaded) return;
    if (!mapRef.current) return;

    if (polygonPoints.length === 0) {
      removePolygon(mapRef.current);
      setPolygonArea(0);
      return;
    }

    const area = drawPolygon(mapRef.current, polygonPoints);

    setPolygonArea(area);
  }, [polygonPoints, mapLoaded]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}
