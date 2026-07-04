import mapboxgl from "mapbox-gl";
import type { MutableRefObject } from "react";
import type { MarkerType } from "@/types/map";

export function renderMarkers(
    map: mapboxgl.Map,
    markers: MarkerType[],
    markerRefs: MutableRefObject<mapboxgl.Marker[]>
) {
    markerRefs.current.forEach(marker => marker.remove());
    markerRefs.current = [];

    markers.forEach(marker => {
        const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
                <strong>Marker</strong><br/>
                Lng: ${marker.lng.toFixed(6)}<br/>
                Lat: ${marker.lat.toFixed(6)}
            `);

        const mapMarker = new mapboxgl.Marker()
            .setLngLat([marker.lng, marker.lat])
            .setPopup(popup)
            .addTo(map);

        markerRefs.current.push(mapMarker);
    });
}