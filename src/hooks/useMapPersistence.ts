import { useCallback, useEffect, useRef } from 'react';

import type { MarkerType, Point } from '@/types/map';

const STORAGE_KEY = 'geomap-data';
const AUTOSAVE_DELAY = 500;

export interface MapState {
  markers: MarkerType[];
  polygonPoints: Point[];
}

function isPoint(value: unknown): value is Point {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Point).lng === 'number' &&
    typeof (value as Point).lat === 'number'
  );
}

function isMarker(value: unknown): value is MarkerType {
  return isPoint(value) && typeof (value as MarkerType).id === 'string';
}

// Reads and validates persisted state; returns null when absent or malformed.
export function loadStoredState(): MapState | null {
  if (typeof window === 'undefined') return null;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const data = JSON.parse(saved);
    const markers = Array.isArray(data?.markers)
      ? data.markers.filter(isMarker)
      : [];
    const polygonPoints = Array.isArray(data?.polygonPoints)
      ? data.polygonPoints.filter(isPoint)
      : [];

    return { markers, polygonPoints };
  } catch {
    return null;
  }
}

interface Options {
  markers: MarkerType[];
  polygonPoints: Point[];
  autoSave?: boolean;
}

export function useMapPersistence({
  markers,
  polygonPoints,
  autoSave = true,
}: Options) {
  const save = useCallback(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ markers, polygonPoints }),
    );
  }, [markers, polygonPoints]);

  const load = useCallback((): MapState | null => loadStoredState(), []);

  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Debounced auto-save so rapid edits don't thrash localStorage.
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (!autoSave) return;

    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const timer = setTimeout(save, AUTOSAVE_DELAY);

    return () => clearTimeout(timer);
  }, [autoSave, save]);

  return { save, load, clear };
}
