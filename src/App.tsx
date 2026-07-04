import { useState, useCallback } from 'react'; // 👈 useEffect removed!

import Header from '@/component/Header';
import Toolbar from '@/component/Toolbar';
import Sidebar from '@/component/Sidebar';
import MobileGeometry from '@/component/MobileGeometry';
import GeoMap from '@/component/Map';
import { useGeoJSON } from '@/hooks/useGeoJSON';
import type { MarkerType, Point } from '@/types/map';

const STORAGE_KEY = 'geomap-data';

const getInitialState = (key: 'markers' | 'polygonPoints') => {
  if (typeof window === 'undefined') return [];

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      return data[key] ?? [];
    }
  } catch {
    console.error('Failed to parse map data from local storage');
  }

  return [];
};

export default function App() {
  const [markers, setMarkers] = useState<MarkerType[]>(() =>
    getInitialState('markers'),
  );
  const [polygonPoints, setPolygonPoints] = useState<Point[]>(() =>
    getInitialState('polygonPoints'),
  );

  const [polygonArea, setPolygonArea] = useState(0);
  const [mode, setMode] = useState<'marker' | 'polygon'>('marker');

  const { exportGeoJSON, importGeoJSON } = useGeoJSON({
    markers,
    polygonPoints,
    setMarkers,
    setPolygonPoints,
  });

  const handleClear = () => {
    setMarkers([]);
    setPolygonPoints([]);
    setPolygonArea(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleSave = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        markers,
        polygonPoints,
      }),
    );
    alert('Map saved successfully.');
  };

  const handleLoad = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      alert('No saved map found.');
      return;
    }

    try {
      const data = JSON.parse(saved);
      setMarkers(data.markers ?? []);
      setPolygonPoints(data.polygonPoints ?? []);
      alert('Map loaded successfully.');
    } catch {
      alert('Unable to load saved map.');
    }
  }, []);

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
          <GeoMap
            markers={markers}
            setMarkers={setMarkers}
            polygonPoints={polygonPoints}
            setPolygonPoints={setPolygonPoints}
            mode={mode}
            setPolygonArea={setPolygonArea}
          />
        </div>
      </div>
    </main>
  );
}
