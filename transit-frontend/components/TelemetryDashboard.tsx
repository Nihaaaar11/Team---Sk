'use client';

import { useCallback, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

const mapCenter = { lat: 17.3850, lng: 78.4867 }; // Hyderabad

const mockVehicles = [
  { id: 1, lat: 17.3880, lng: 78.4850, type: 'bus' },
  { id: 2, lat: 17.3820, lng: 78.4780, type: 'auto' },
  { id: 3, lat: 17.3910, lng: 78.4920, type: 'train' },
];

const mapOptions: google.maps.MapOptions = {
  mapTypeId: 'roadmap',
  disableDefaultUI: false,
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
  zoomControl: true,
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#f5f5f0' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f0' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e2e8f0' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#475569' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#e2e8f0' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#bae6fd' }] }, /* sky blue water */
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#f1f5f9' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#dcfce3' }] },
    { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#cbd5e1' }] },
  ],
};

export default function TelemetryDashboard() {
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_KEY,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    map.setTilt(45);
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  if (!GOOGLE_MAPS_KEY || GOOGLE_MAPS_KEY.length < 10) {
    return (
      <div className="absolute inset-0 bg-slate-950 flex items-center justify-center px-4">
        <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 shadow-xl max-w-md text-center">
          <h2 className="text-xl font-bold text-white mb-2">Google Maps API Key Required</h2>
          <p className="text-slate-400 text-sm mb-4">
            Add your Google Maps API Key to <code className="text-primary">.env.local</code> and restart the dev server.
          </p>
          <div className="bg-black/50 p-2 rounded text-xs text-primary font-mono text-left overflow-x-auto">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
        <p className="text-red-400 text-sm">Failed to load Google Maps. Check your API key and network.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="absolute inset-0 bg-background flex items-center justify-center">
        <div className="animate-pulse text-slate-500 font-medium text-sm">Loading map…</div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-slate-900 border-t border-border">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={mapCenter}
        zoom={13}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {mockVehicles.map((v) => (
          <Marker
            key={v.id}
            position={{ lat: v.lat, lng: v.lng }}
            title={v.type}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#38bdf8', /* Sky blue markers */
              fillOpacity: 0.9,
              strokeColor: '#0ea5e9',
              strokeWeight: 2,
            }}
          />
        ))}
      </GoogleMap>


    </div>
  );
}
