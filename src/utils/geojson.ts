import type {
    Feature,
    FeatureCollection,
    Point as GeoJSONPoint,
    Polygon,
} from "geojson";

import type { MarkerType, Point } from "@/types/map";

export function buildGeoJSON(
    markers: MarkerType[],
    polygonPoints: Point[]
): FeatureCollection {
    const features: Feature[] = [];

    // Markers
    markers.forEach((marker) => {
        features.push({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [marker.lng, marker.lat],
            } as GeoJSONPoint,
            properties: {
                id: marker.id,
            },
        });
    });

    // Polygon
    if (polygonPoints.length >= 3) {
        const coordinates = polygonPoints.map(({ lng, lat }) => [
            lng,
            lat,
        ]);

        coordinates.push(coordinates[0]);

        features.push({
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [coordinates],
            } as Polygon,
            properties: {},
        });
    }

    return {
        type: "FeatureCollection",
        features,
    };
}