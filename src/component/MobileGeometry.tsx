import { useState } from "react";
import {
    Shapes,
    ChevronUp,
    MapPin,

} from "lucide-react";

import type { MarkerType } from "@/types/map";
import MarkerCard from "./MarkerCard";
import PolygonCard from "./PolygonCard";

interface MobileGeometryProps {
    markers: MarkerType[];
    polygonArea: number;
    onClear: () => void;
}

export default function MobileGeometry({
    markers,
    polygonArea,
}: MobileGeometryProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="absolute bottom-0 left-0 right-0 z-30 md:hidden">

            <div className="rounded-t-3xl border-t border-slate-700 bg-slate-900 shadow-2xl">

                {/* Header */}
                <button
                    onClick={() => setOpen(!open)}
                    className="flex w-full items-center justify-between px-5 py-4"
                >
                    <div className="flex items-center gap-2">
                        <Shapes className="h-5 w-5 text-blue-400" />

                        <span className="text-lg font-semibold text-white">
                            Geometry
                        </span>
                    </div>

                    <ChevronUp
                        className={`h-5 w-5 text-white transition-transform duration-300 ${open ? "rotate-180" : ""
                            }`}
                    />
                </button>

                {/* Body */}
                <div
                    className={`
                        overflow-hidden
                        transition-all
                        duration-300 ease-in-out
                        ${open
                            ? "max-h-[70vh]"
                            : "max-h-0"
                        }
                    `}
                >
                    <div className="space-y-5 border-t border-slate-700 p-5">

                        {/* Markers */}
                        <section>

                            <div className="mb-3 flex items-center gap-2">

                                <MapPin className="h-4 w-4 text-blue-400" />

                                <h3 className="font-medium text-white">
                                    Markers ({markers.length})
                                </h3>

                            </div>

                            <div className="max-h-48 space-y-3 overflow-y-auto">

                                {markers.length === 0 ? (
                                    <p className="text-sm text-slate-400">
                                        No markers added.
                                    </p>
                                ) : (
                                    markers.map((marker, index) => (
                                        <MarkerCard
                                            key={marker.id}
                                            marker={marker}
                                            index={index}
                                        />
                                    ))
                                )}

                            </div>

                        </section>

                        <hr className="border-slate-700" />

                        {/* Polygon */}

                        <PolygonCard area={polygonArea} />

                        <hr className="border-slate-700" />

                    </div>
                </div>

            </div>

        </div>
    );
}