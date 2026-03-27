'use client';

import { useRef, useEffect } from 'react';
import { Navigation } from 'lucide-react';

interface Props {
  center: [number, number];
  userLocation: [number, number] | null;
  apiKey: string;
  onLocate: (loc: [number, number]) => void;
}

export default function LeafletMap({ center, userLocation, apiKey, onLocate }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Initialize map once on mount
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let L: any;

    import('leaflet').then((mod) => {
      L = mod.default ?? mod;

      const map = L.map(containerRef.current, {
        center: center,
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer(
        `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`,
        {
          attribution: '&copy; <a href="https://www.geoapify.com/">Geoapify</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
          maxZoom: 20,
        }
      ).addTo(map);

      mapRef.current = map;
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update user location marker whenever it changes
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    import('leaflet').then((mod) => {
      const L = mod.default ?? mod;
      const map = mapRef.current;
      if (!map) return;

      // Remove old marker
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Add new circle marker
      markerRef.current = L.circleMarker(userLocation, {
        radius: 10,
        fillColor: '#3b82f6',
        fillOpacity: 1,
        color: '#ffffff',
        weight: 3,
      })
        .addTo(map)
        .bindTooltip('You are here', { direction: 'top' });

      map.panTo(userLocation);
    });
  }, [userLocation]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        onLocate(loc);
        mapRef.current?.panTo(loc);
        mapRef.current?.setZoom(15);
      },
      undefined,
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating Locate-Me Button */}
      <button
        title="Find My Location"
        onClick={handleLocateMe}
        style={{ position: 'absolute', bottom: '6rem', right: '1.25rem', zIndex: 1000 }}
        className="bg-white p-3 rounded-full shadow-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors border border-slate-200"
      >
        <Navigation size={22} className="text-primary fill-primary/20" />
      </button>
    </div>
  );
}
