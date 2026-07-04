import { useState } from 'react';
import { ChevronUp, Shapes } from 'lucide-react';

import type { MarkerType } from '@/types/map';
import GeometryPanel from './GeometryPanel';

interface MobileGeometryProps {
  markers: MarkerType[];
  polygonArea: number;
  onClear: () => void;
}

export default function MobileGeometry({
  markers,
  polygonArea,
  onClear,
}: MobileGeometryProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 md:hidden">
      <div className="rounded-t-3xl border-t border-slate-700 bg-slate-900 shadow-2xl">
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          className="flex w-full items-center justify-between px-5 py-4"
        >
          <div className="flex items-center gap-2">
            <Shapes className="h-5 w-5 text-blue-400" />
            <span className="text-lg font-semibold text-white">Geometry</span>
          </div>

          <ChevronUp
            className={`h-5 w-5 text-white transition-transform duration-300 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            open ? 'max-h-[70vh]' : 'max-h-0'
          }`}
        >
          <div className="border-t border-slate-700 p-5">
            <GeometryPanel
              markers={markers}
              polygonArea={polygonArea}
              onClear={onClear}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
