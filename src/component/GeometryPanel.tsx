import { useState } from 'react';
import { ChevronDown, ChevronRight, MapPin, Trash2 } from 'lucide-react';

import type { MarkerType } from '@/types/map';
import MarkerCard from './MarkerCard';
import PolygonCard from './PolygonCard';

interface GeometryPanelProps {
  markers: MarkerType[];
  polygonArea: number;
  onClear: () => void;
  // Sidebar collapses the marker list; the mobile sheet keeps it expanded.
  collapsibleMarkers?: boolean;
}

export default function GeometryPanel({
  markers,
  polygonArea,
  onClear,
  collapsibleMarkers = false,
}: GeometryPanelProps) {
  const [markersOpen, setMarkersOpen] = useState(!collapsibleMarkers);

  const markersVisible = collapsibleMarkers ? markersOpen : true;

  const markersHeading = (
    <div className="flex items-center gap-2">
      <MapPin className="h-4 w-4 text-blue-400" />
      <h3 className="font-medium text-white">Markers ({markers.length})</h3>
    </div>
  );

  return (
    <div className="space-y-5">
      <section>
        {collapsibleMarkers ? (
          <button
            onClick={() => setMarkersOpen((open) => !open)}
            aria-expanded={markersOpen}
            className="mb-3 flex w-full items-center justify-between rounded-lg px-1 py-2 transition hover:bg-slate-800"
          >
            {markersHeading}
            {markersOpen ? (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-slate-400" />
            )}
          </button>
        ) : (
          <div className="mb-3">{markersHeading}</div>
        )}

        {markersVisible && (
          <div className="max-h-60 space-y-3 overflow-y-auto pr-1">
            {markers.length === 0 ? (
              <p className="text-sm text-slate-400">No markers added.</p>
            ) : (
              markers.map((marker, index) => (
                <MarkerCard key={marker.id} marker={marker} index={index} />
              ))
            )}
          </div>
        )}
      </section>

      <hr className="border-slate-700" />

      <PolygonCard area={polygonArea} />

      <hr className="border-slate-700" />

      <button
        onClick={onClear}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/20 md:text-base"
      >
        <Trash2 className="h-4 w-4" />
        Clear All
      </button>
    </div>
  );
}
