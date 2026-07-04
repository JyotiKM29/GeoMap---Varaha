import { Pentagon } from 'lucide-react';

interface Props {
  area: number;
}

export default function PolygonCard({ area }: Props) {
  return (
    <section
      className="
        rounded-xl
        border
        border-slate-700
        bg-slate-800
        p-4
      "
    >
      <div className="mb-3 flex items-center gap-2">
        <Pentagon className="h-4 w-4 text-blue-400" />

        <span className="font-medium text-white">Polygon</span>
      </div>

      <div className="text-2xl font-semibold text-white">
        {area > 0 ? `${(area / 1_000_000).toFixed(2)} km²` : '--'}
      </div>

      <p className="mt-1 text-sm text-slate-400">Calculated Area</p>
    </section>
  );
}
