import { Shapes } from 'lucide-react';

import type { MarkerType } from '@/types/map';
import GeometryPanel from './GeometryPanel';

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
  return (
    <aside className="absolute left-6 top-36 z-10 hidden w-80 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl backdrop-blur-md md:block">
      <div className="border-b border-slate-700 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-center gap-2">
          <Shapes className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Geometry</h2>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8">
        <GeometryPanel
          markers={markers}
          polygonArea={polygonArea}
          onClear={onClear}
          collapsibleMarkers
        />
      </div>
    </aside>
  );
}
