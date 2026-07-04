import { MapPin } from "lucide-react";
import type { MarkerType } from "@/types/map";

interface Props {
    marker: MarkerType;
    index: number;
}

export default function MarkerCard({
    marker,
    index,
}: Props) {
    return (
        <div
            className="
        rounded-xl
        border
        border-slate-700
        bg-slate-800
        p-4
      "
        >
            <div className="mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-400" />

                <span className="font-medium text-white">
                    Marker #{index + 1}
                </span>
            </div>

            <div className="space-y-1 font-mono text-sm text-slate-300">
                <div>{marker.lng.toFixed(6)}</div>
                <div>{marker.lat.toFixed(6)}</div>
            </div>
        </div>
    );
}