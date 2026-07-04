import { MapPin, Pentagon, Trash2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface ToolbarProps {
    mode: "marker" | "polygon";
    setMode: Dispatch<
        SetStateAction<"marker" | "polygon">
    >;
    onClear: () => void;
}

export default function Toolbar({
    mode,
    setMode,
    onClear,
}: ToolbarProps) {
    return (
        <div className="border-b border-slate-700 bg-slate-900">
            <div className="flex items-center gap-3 px-6 py-3">

                <button
                    onClick={() => setMode("marker")}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all
            ${mode === "marker"
                            ? "bg-blue-600 text-white shadow-md"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                >
                    <MapPin className="h-4 w-4" />
                    Marker
                </button>

                <button
                    onClick={() => setMode("polygon")}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all
            ${mode === "polygon"
                            ? "bg-blue-600 text-white shadow-md"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                >
                    <Pentagon className="h-4 w-4" />
                    Polygon
                </button>

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