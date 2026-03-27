'use client';

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Navigation } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const GEOAPIFY_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY ?? '';
const defaultCenter: [number, number] = [17.3850, 78.4867]; // Hyderabad

// Dynamically import the entire map to avoid SSR issues with Leaflet
const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false });

export default function TelemetryDashboard({ isLoaded, loadError }: { isLoaded?: boolean; loadError?: Error }) {
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);

  const updateSupabaseLocation = async (latitude: number, longitude: number) => {
    try {
      await supabase.from('live_locations').insert([
        { latitude, longitude, updated_at: new Date().toISOString() }
      ]);
    } catch (err) {
      console.error('Error updating location to Supabase:', err);
    }
  };

  useEffect(() => {
    let watchId: number;
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setCurrentLocation(loc);
          updateSupabaseLocation(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => console.error('Geolocation error:', err),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setCurrentLocation(loc);
          updateSupabaseLocation(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => console.error('Watch error:', err),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    }
    return () => {
      if (watchId !== undefined && typeof window !== 'undefined') {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  if (!GEOAPIFY_KEY || GEOAPIFY_KEY.length < 10) {
    return (
      <div className="absolute inset-0 bg-slate-950 flex items-center justify-center px-4">
        <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 shadow-xl max-w-md text-center">
          <h2 className="text-xl font-bold text-white mb-2">Geoapify API Key Required</h2>
          <p className="text-slate-400 text-sm mb-4">
            Add your Geoapify API Key to <code className="text-primary">.env.local</code> and restart.
          </p>
          <div className="bg-black/50 p-2 rounded text-xs text-primary font-mono text-left">
            NEXT_PUBLIC_GEOAPIFY_API_KEY=your_key_here
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-slate-100 border-t border-border">
      <LeafletMap
        center={currentLocation ?? defaultCenter}
        userLocation={currentLocation}
        apiKey={GEOAPIFY_KEY}
        onLocate={(loc) => setCurrentLocation(loc)}
      />
    </div>
  );
}
