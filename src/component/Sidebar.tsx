import type { MarkerType } from '@/types/map';
import {
  Shapes,
  MapPin,
  Trash2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import MarkerCard from './MarkerCard';
import PolygonCard from './PolygonCard';
import { useState } from 'react';

interface SidebarProps {
  markers: MarkerType[];
  polygonArea: number;
  onClear: () => void;
}

export default function Sidebar({
  markers,
  polygonArea,
  onClear,
}: SidebarProps) {
  const [markerOpen, setMarkerOpen] = useState(false);

  return (
    <aside
      className="
            hidden md:block
        absolute
        left-6
        top-36
        z-10
        w-80
        rounded-2xl
        border
        border-slate-700
        bg-slate-900/95
        backdrop-blur-md
        shadow-2xl
        overflow-hidden
      "
    >
      {/* Header */}
      <div className="border-b border-slate-700 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-center gap-2">
          <Shapes className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Geometry</h2>
        </div>
      </div>

      <div className="space-y-5 p-4 md:p-6 lg:p-8">
        {/* Markers */}
        <section>
          <button
            onClick={() => setMarkerOpen(!markerOpen)}
            className="
            mb-3
            flex
            w-full
            items-center
            justify-between
            rounded-lg
            px-1
            py-2
            transition
            hover:bg-slate-800
        "
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-400" />

              <h3 className="font-medium text-white">
                Markers ({markers.length})
              </h3>
            </div>

            {markerOpen ? (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-slate-400" />
            )}
          </button>

          {markerOpen && (
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
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

        {/* Polygon */}
        <PolygonCard area={polygonArea} />
        <hr className="border-slate-700" />

        {/* Danger */}
        <button
          onClick={onClear}
          className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-red-500/30
                    bg-red-500/10
                    px-4
                    py-3
            
                    text-sm
                    md:text-base
            
                    text-red-400
                    transition
                    hover:bg-red-500/20
                "
        >
          <Trash2 className="h-4 w-4" />
          Clear All
        </button>
      </div>
    </aside>
  );
}
