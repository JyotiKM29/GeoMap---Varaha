import { MapPin, Pentagon, Trash2 } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

type Mode = 'marker' | 'polygon';

interface ToolbarProps {
  mode: Mode;
  setMode: Dispatch<SetStateAction<Mode>>;
  onClear: () => void;
}

const MODES: { id: Mode; label: string; icon: typeof MapPin }[] = [
  { id: 'marker', label: 'Marker', icon: MapPin },
  { id: 'polygon', label: 'Polygon', icon: Pentagon },
];

export default function Toolbar({ mode, setMode, onClear }: ToolbarProps) {
  return (
    <div className="border-b border-slate-700 bg-slate-900">
      <div className="flex items-center gap-3 px-6 py-3">
        <div role="group" aria-label="Drawing mode" className="flex gap-3">
          {MODES.map(({ id, label, icon: Icon }) => {
            const active = mode === id;

            return (
              <button
                key={id}
                onClick={() => setMode(id)}
                aria-pressed={active}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>

        <div className="h-6 w-px bg-slate-700" />

        <button
          onClick={onClear}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </button>
      </div>
    </div>
  );
}
