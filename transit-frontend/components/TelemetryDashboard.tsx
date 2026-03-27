'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Navigation } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

const defaultCenter = { lat: 17.3850, lng: 78.4867 }; // Default: Hyderabad

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

export default function TelemetryDashboard({ isLoaded, loadError }: { isLoaded: boolean, loadError?: Error }) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    map.setTilt(45);
    
    // Apply immediate pan if location already resolved before map load
    if (currentLocation) {
        map.panTo(currentLocation);
        map.setZoom(15);
    }
  }, [currentLocation]);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const updateSupabaseLocation = async (latitude: number, longitude: number) => {
    try {
      await supabase.from('live_locations').insert([
        { latitude, longitude, updated_at: new Date().toISOString() }
      ]);
    } catch (err) {
      console.error('Error updating location to Supabase:', err);
    }
  };

  // Real-time location tracking
  useEffect(() => {
    let watchId: number;

    const trackLocation = () => {
      if (typeof window !== "undefined" && "geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const loc = { lat: latitude, lng: longitude };
            
            // Update local map state
            setCurrentLocation(loc);
            
            // Push real-time coordinates to Supabase
            updateSupabaseLocation(latitude, longitude);
          },
          (error) => console.error("Error tracking location:", error),
          // @ts-ignore - distanceFilter is standard in React Native
          { enableHighAccuracy: true, distanceFilter: 10, maximumAge: 0, timeout: 10000 }
        );
      }
    };

    trackLocation();

    // Apply immediate map center pan (since watchPosition might wait for movement)
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
        setCurrentLocation(loc);
        if (mapRef.current) {
          mapRef.current.panTo(loc);
          mapRef.current.setZoom(15);
        }
      });
    }

    return () => {
      if (watchId !== undefined && typeof window !== "undefined" && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
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
      <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-500 font-medium text-sm">Loading telemetry grid…</div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-slate-100 border-t border-border">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={defaultCenter}
        zoom={13}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Render actual User Location */}
        {currentLocation && (
          <Marker
            position={currentLocation}
            title="You are here"
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#3b82f6', /* Deep blue dot for user */
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            }}
          />
        )}
      </GoogleMap>

      {/* Floating Locate-Me Button */}
      <button
        title="Find My Location"
        onClick={() => {
          if (currentLocation && mapRef.current) {
            mapRef.current.panTo(currentLocation);
            mapRef.current.setZoom(15);
          } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
              setCurrentLocation(loc);
              if (mapRef.current) {
                  mapRef.current.panTo(loc);
                  mapRef.current.setZoom(15);
              }
            }, undefined, { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 });
          }
        }}
        className="absolute bottom-24 right-5 z-20 bg-white p-3 rounded-full shadow-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors border border-slate-200"
      >
        <Navigation size={22} className="text-primary fill-primary/20" />
      </button>

    </div>
  );
}
