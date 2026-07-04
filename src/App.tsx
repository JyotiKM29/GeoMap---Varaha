import { Suspense, lazy, useCallback, useMemo, useState } from 'react';
import { Toaster, toast } from 'sonner';

import Header from '@/component/Header';
import Toolbar from '@/component/Toolbar';
import Sidebar from '@/component/Sidebar';
import MobileGeometry from '@/component/MobileGeometry';
import { useGeoJSON } from '@/hooks/useGeoJSON';
import { loadStoredState, useMapPersistence } from '@/hooks/useMapPersistence';
import { computeArea } from '@/utils/polygon';
import type { MarkerType, Point } from '@/types/map';

const GeoMap = lazy(() => import('@/component/Map'));

const initialState = loadStoredState();

export default function App() {
  const [markers, setMarkers] = useState<MarkerType[]>(
    () => initialState?.markers ?? [],
  );
  const [polygonPoints, setPolygonPoints] = useState<Point[]>(
    () => initialState?.polygonPoints ?? [],
  );
  const [mode, setMode] = useState<'marker' | 'polygon'>('marker');

  const polygonArea = useMemo(
    () => computeArea(polygonPoints),
    [polygonPoints],
  );

  const { save, load, clear } = useMapPersistence({ markers, polygonPoints });

  const { exportGeoJSON, importGeoJSON } = useGeoJSON({
    markers,
    polygonPoints,
    setMarkers,
    setPolygonPoints,
  });

  const handleClear = useCallback(() => {
    if (!window.confirm('Clear all markers and the polygon?')) return;

    setMarkers([]);
    setPolygonPoints([]);
    clear();
  }, [clear]);

  const handleSave = useCallback(() => {
    save();
    toast.success('Map saved successfully.');
  }, [save]);

  const handleLoad = useCallback(() => {
    const saved = load();

    if (!saved) {
      toast.error('No saved map found.');
      return;
    }

    setMarkers(saved.markers);
    setPolygonPoints(saved.polygonPoints);
    toast.success('Map loaded successfully.');
  }, [load]);

  return (
    <main className="flex h-screen flex-col">
      <Header
        onSave={handleSave}
        onLoad={handleLoad}
        onExport={exportGeoJSON}
        onImport={importGeoJSON}
      />

      <Toolbar mode={mode} setMode={setMode} onClear={handleClear} />

      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar
          markers={markers}
          polygonArea={polygonArea}
          onClear={handleClear}
        />

        <MobileGeometry
          markers={markers}
          polygonArea={polygonArea}
          onClear={handleClear}
        />

        <div className="flex-1">
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center bg-slate-950">
                <span className="text-sm text-slate-300">Loading map...</span>
              </div>
            }
          >
            <GeoMap
              markers={markers}
              setMarkers={setMarkers}
              polygonPoints={polygonPoints}
              setPolygonPoints={setPolygonPoints}
              mode={mode}
            />
          </Suspense>
        </div>
      </div>

      <Toaster position="top-right" theme="dark" richColors />
    </main>
  );
}
