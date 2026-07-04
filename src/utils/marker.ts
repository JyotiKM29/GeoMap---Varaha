import mapboxgl from 'mapbox-gl';
import type { MarkerType } from '@/types/map';

export type MarkerRegistry = Map<string, mapboxgl.Marker>;

function buildPopupContent(marker: MarkerType): HTMLElement {
  const container = document.createElement('div');

  const title = document.createElement('strong');
  title.textContent = 'Marker';

  const coords = document.createElement('div');
  coords.textContent = `Lng: ${marker.lng.toFixed(6)}, Lat: ${marker.lat.toFixed(6)}`;

  container.append(title, coords);

  return container;
}

// Reconcile the map's markers with state instead of tearing them all down.
export function syncMarkers(
  map: mapboxgl.Map,
  markers: MarkerType[],
  registry: MarkerRegistry,
) {
  const nextIds = new Set(markers.map((marker) => marker.id));

  registry.forEach((mapMarker, id) => {
    if (!nextIds.has(id)) {
      mapMarker.remove();
      registry.delete(id);
    }
  });

  markers.forEach((marker) => {
    const existing = registry.get(marker.id);

    if (existing) {
      existing.setLngLat([marker.lng, marker.lat]);
      return;
    }

    const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(
      buildPopupContent(marker),
    );

    const mapMarker = new mapboxgl.Marker()
      .setLngLat([marker.lng, marker.lat])
      .setPopup(popup)
      .addTo(map);

    registry.set(marker.id, mapMarker);
  });
}
