'use client';

import { AlertTriangle, Zap, Activity, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchTransportEvents } from '@/lib/base44Client';

export default function AIInsightsPanel() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await fetchTransportEvents();
        // Dynamically unpack standardized remote list containers
        const items = Array.isArray(data) ? data : data.items || data.data || [];
        setEvents(items);
      } catch (err: any) {
        console.error(err);
        setError('Failed to query remote AI Agent events.');
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  if (loading) {
    return (
      <div className="w-80 flex flex-col gap-4 p-4 text-center">
        <div className="w-8 h-8 mx-auto border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mb-2" />
        <p className="text-sm text-sky-700 font-bold animate-pulse">Syncing with Base 44 Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="w-80 flex flex-col gap-4 pointer-events-auto max-h-[calc(100vh-100px)] overflow-y-auto pr-2 pb-4 pt-1">
      
      {events.length === 0 && !error && (
         <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-sm text-center border border-slate-100">
            <Activity className="mx-auto text-slate-400 mb-2"/>
            <p className="text-sm font-bold text-slate-600">No active transport events detected by the agent.</p>
         </div>
      )}

      {error && (
         <div className="bg-red-50/90 backdrop-blur-md rounded-2xl p-5 shadow-sm text-center border-l-4 border-red-500">
            <AlertTriangle className="mx-auto text-red-500 mb-2"/>
            <p className="text-xs font-bold text-red-600">{error}</p>
            <p className="text-[10px] font-bold text-slate-500 mt-2 tracking-wide uppercase">Requires .env Base URL Configuration</p>
         </div>
      )}

      {events.map((evt, idx) => (
        <div key={evt.id || idx} className={`backdrop-blur-xl border rounded-2xl p-5 relative overflow-hidden group transition-all duration-500 ${
          evt.impact_level === 'High' ? 'bg-gradient-to-br from-red-50 to-white/90 border-red-200 shadow-[0_10px_40px_rgba(239,68,68,0.1)]' : 
          'bg-gradient-to-br from-sky-50 to-white/90 border-sky-200 shadow-[0_10px_40px_rgba(56,189,248,0.1)]'
        }`}>
          <div className="flex items-start justify-between mb-3 relative z-10">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-md ${evt.impact_level === 'High' ? 'bg-red-100' : 'bg-sky-100'}`}>
                {evt.impact_level === 'High' ? <AlertTriangle size={16} className="text-red-500" /> : <Zap size={16} className="text-sky-500" />}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${evt.impact_level === 'High' ? 'text-red-600' : 'text-sky-600'}`}>
                {evt.event_type || 'Event Log'}
              </span>
            </div>
            <span className="flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75 ${evt.impact_level === 'High' ? 'bg-red-400' : 'bg-sky-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${evt.impact_level === 'High' ? 'bg-red-500' : 'bg-sky-500'}`}></span>
            </span>
          </div>

          <h3 className="text-base font-extrabold text-slate-800 leading-tight mb-1 flex items-center relative z-10 w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {evt.event_name || 'System Broadcast'}
          </h3>
          
          {(evt.location || evt.event_date) && (
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
              <MapPin size={10} /> {evt.location || 'Citywide'} {evt.event_date && `| ${evt.event_date}`}
            </p>
          )}

          <p className="text-xs text-slate-600 mb-4 font-medium leading-relaxed relative z-10 line-clamp-3">
            {evt.description || 'Live telemetry dictates abnormal flow variables in this sector. Proceed with caution.'}
          </p>

          <div className="flex items-center justify-between text-xs font-bold text-slate-500 bg-white/50 p-2 rounded-lg border border-slate-100">
             <span className="uppercase text-[9px] tracking-wider">Estimated Impact</span>
             <span className={evt.impact_level === 'High' ? 'text-red-600 font-black' : 'text-sky-600 font-black'}>{evt.impact_level || 'Moderate'}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
