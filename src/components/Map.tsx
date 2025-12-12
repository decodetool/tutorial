import { useEffect, useRef, useMemo, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Place, Category } from '@/types';

interface MapProps {
  places: Place[];
  selectedPlaceId?: string;
  onPlaceClick?: (placeId: string) => void;
  categoryColors: Record<Category, string>;
  categoryEmoji: Record<Category, string>;
  flyToPlace?: boolean; // Whether to fly to the place when selected
}

export function Map({ places, selectedPlaceId, onPlaceClick, categoryColors, categoryEmoji, flyToPlace = false }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const hasFitBounds = useRef(false);
  const [mapReady, setMapReady] = useState(false);

  // Create a stable identifier for the places array
  const placeIds = useMemo(() => places.map(p => p.id).join(','), [places]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map with colorful English-only style
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [139.7, 35.68], // Tokyo center
      zoom: 11,
      attributionControl: true,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
      map.current = null;
      hasFitBounds.current = false;
    };
  }, []);

  // Fit bounds only once on initial load (or zoom to selected place if deep linking)
  useEffect(() => {
    if (!map.current || !places || places.length === 0 || hasFitBounds.current) return;

    const fitBoundsOnLoad = () => {
      if (!map.current || !places || places.length === 0 || hasFitBounds.current) return;

      // If there's a selected place on initial load (deep link), zoom to it instead of fitting all bounds
      if (selectedPlaceId) {
        const selectedPlace = places.find(p => p.id === selectedPlaceId);
        if (selectedPlace) {
          map.current.setCenter([selectedPlace.lng, selectedPlace.lat]);
          map.current.setZoom(15);
          hasFitBounds.current = true;
          setMapReady(true);
          return;
        }
      }

      const bounds = new maplibregl.LngLatBounds();
      places.forEach(place => {
        bounds.extend([place.lng, place.lat]);
      });

      if (!map.current || hasFitBounds.current) return;
      // Fit bounds immediately without animation
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 13, duration: 0 });
      hasFitBounds.current = true;

      // Wait a bit after fitting bounds before showing markers
      setTimeout(() => setMapReady(true), 100);
    };

    // Wait for map to be fully loaded before fitting bounds
    if (!map.current.loaded()) {
      map.current.once('load', fitBoundsOnLoad);
    } else {
      fitBoundsOnLoad();
    }
  }, []); // Empty deps - only run once

  // Create/update markers when places change
  useEffect(() => {
    if (!map.current || !places || !mapReady) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    places.forEach(place => {
      if (!map.current) return;

      // Create custom marker element (container - never transform this)
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.cursor = 'pointer';

      // Store place id on element for later reference
      el.dataset.placeId = place.id;

      // Create inner visual element (this gets transformed)
      const inner = document.createElement('div');
      inner.className = 'marker-inner';
      inner.style.width = '100%';
      inner.style.height = '100%';
      inner.style.borderRadius = '50%';
      inner.style.backgroundColor = categoryColors[place.category];
      inner.style.border = '2px solid white';
      inner.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      inner.style.display = 'flex';
      inner.style.alignItems = 'center';
      inner.style.justifyContent = 'center';
      inner.style.fontSize = '20px';
      inner.style.transition = 'transform 0.2s';
      inner.style.willChange = 'transform';
      inner.textContent = categoryEmoji[place.category];

      el.appendChild(inner);

      el.addEventListener('mouseenter', () => {
        if (selectedPlaceId !== place.id) {
          inner.style.transform = 'scale(1.2)';
        }
      });

      el.addEventListener('mouseleave', () => {
        if (selectedPlaceId !== place.id) {
          inner.style.transform = 'scale(1)';
        }
      });

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onPlaceClick?.(place.id);
      });

      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'center',
        pitchAlignment: 'map',
        rotationAlignment: 'map'
      })
        .setLngLat([place.lng, place.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(
            `<div style="font-family: system-ui; padding: 4px;">
              <strong style="color: #E8EDF7;">${place.name}</strong>
              <p style="color: #9AA5B4; font-size: 12px; margin-top: 2px;">${place.category}</p>
            </div>`
          )
        )
        .addTo(map.current);

      markers.current.push(marker);
    });
  }, [places, categoryColors, categoryEmoji, onPlaceClick, mapReady]);

  // Update marker styles when selection changes (without recreating them)
  useEffect(() => {
    markers.current.forEach(marker => {
      const el = marker.getElement();
      const inner = el.querySelector('.marker-inner') as HTMLElement;
      const placeId = el.dataset.placeId;

      if (inner) {
        if (placeId === selectedPlaceId) {
          inner.style.transform = 'scale(1.3)';
          el.style.zIndex = '1000';
        } else {
          inner.style.transform = 'scale(1)';
          el.style.zIndex = '1';
        }
      }
    });
  }, [selectedPlaceId]);

  // Fly to selected place when clicked from list (but not when deselected)
  useEffect(() => {
    if (!map.current || !selectedPlaceId || !flyToPlace || !mapReady) return;

    const selectedPlace = places.find(p => p.id === selectedPlaceId);
    if (!selectedPlace) return;

    // Only fly if the map is already initialized (not on initial load)
    if (hasFitBounds.current) {
      map.current.flyTo({
        center: [selectedPlace.lng, selectedPlace.lat],
        zoom: 15,
        duration: 1500,
        essential: true
      });
    }
  }, [selectedPlaceId, places, flyToPlace, mapReady]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
