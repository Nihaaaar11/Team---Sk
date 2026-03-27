'use client';

import { useState } from 'react';
import { Bus, Train, Zap, Bike, Navigation, Search, X } from 'lucide-react';

interface SidebarProps {
  className?: string;
  startPoint?: string;
  destPoint?: string;
  onStartChange?: (v: string) => void;
  onDestChange?: (v: string) => void;
  showSearchToggle?: boolean;
  isLoaded?: boolean;
}

const transportModes = [
  { id: 'bus',   label: 'RTC Bus', icon: Bus,        color: 'text-amber-500',  bg: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30' },
  { id: 'metro', label: 'Metro',   icon: Train,      color: 'text-blue-500',   bg: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30' },
  { id: 'train', label: 'Local Train (MMTS)', icon: Train, color: 'text-emerald-500', bg: 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30' },
];

const suggestions = [
  { from: 'Hitech City',   to: 'Charminar',    time: '32 min', mode: 'metro', crowding: 'Low' },
  { from: 'Banjara Hills', to: 'Secunderabad', time: '18 min', mode: 'bus',   crowding: 'High' },
  { from: 'Gachibowli',   to: 'Jubilee Hills', time: '12 min', mode: 'auto',  crowding: 'Med' }
];

const crowdColor: Record<string, string> = {
  Low:  'text-green-500',
  Med:  'text-amber-500',
  High: 'text-red-500',
};

export default function Sidebar({ className = '', startPoint = '', destPoint = '', onStartChange, onDestChange, showSearchToggle = false, isLoaded = false }: SidebarProps) {
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const filteredSuggestions = suggestions.filter(s => {
    const matchesMode  = activeMode ? s.mode === activeMode : true;
    const matchesFrom = startPoint
      ? s.from.toLowerCase().includes(startPoint.toLowerCase())
      : true;
    const matchesTo = destPoint
      ? s.to.toLowerCase().includes(destPoint.toLowerCase())
      : true;
    return matchesMode && matchesFrom && matchesTo;
  });

  return (
    <aside className={`px-4 py-6 flex flex-col overflow-y-auto ${className}`}>
      
      {/* ── Optional Search Toggle for PC ── */}
      {showSearchToggle && (
        <div className="mb-6">
          {!searchOpen && !startPoint && !destPoint ? (
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-500 text-sm hover:border-primary/60 hover:text-primary transition-all shadow-sm group"
            >
              <Search size={16} className="text-slate-400 group-hover:text-primary" />
              <span className="font-bold">Start journey</span>
            </button>
          ) : (
            <div className="flex flex-col gap-3 relative bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-200">
              <button
                onClick={() => {
                  setSearchOpen(false);
                  if(onStartChange) onStartChange('');
                  if(onDestChange) onDestChange('');
                }}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 z-10 bg-slate-100 p-1.5 rounded-full"
              >
                <X size={14} />
              </button>
              
              <div className="mb-1 pr-8">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Route Search</h4>
              </div>

              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  value={startPoint}
                  onChange={e => onStartChange && onStartChange(e.target.value)}
                  placeholder="Enter Starting point"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm transition-all"
                />
              </div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  value={destPoint}
                  onChange={e => onDestChange && onDestChange(e.target.value)}
                  placeholder="Enter destination"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm transition-all"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Transport modes ── */}
      {(startPoint || destPoint) && (
        <div className="mb-6 animate-in slide-in-from-top-2 fade-in duration-300">
          <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3 px-1">
            Select Mode of Transport
          </h3>
          <div className="flex flex-col gap-2">
            {transportModes.map(({ id, label, icon: Icon, color, bg }) => (
              <button
                key={id}
                onClick={() => setActiveMode(prev => prev === id ? null : id)}
                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl border-2 text-sm font-bold transition-all ${bg} ${
                  activeMode === id ? 'border-primary ring-2 ring-primary/20 scale-[0.98]' : 'border-transparent'
                }`}
              >
                <Icon size={16} className={color} />
                <span className="text-slate-800">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Suggestions & Directions ── */}
      <div className="flex-1">
        <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3 px-1">
          Frequent routes
        </h3>
        <div className="flex flex-col gap-3">
          {filteredSuggestions.length === 0 ? (
            <div className="bg-white/60 p-5 rounded-2xl border border-dashed border-slate-300 text-center shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                No direct routes found between these locations. Try adjusting your search or selecting a different mode of transport.
              </p>
            </div>
          ) : (
            filteredSuggestions.map((s, i) => (
              <div
                key={i}
                className="bg-white border-2 border-slate-100 rounded-2xl p-4 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group shadow-sm relative overflow-hidden"
              >
                {/* Decorative side accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/60 to-primary/20 rounded-l-2xl"></div>
                
                <div className="flex items-start justify-between gap-2 mb-3 pl-2">
                  <div className="text-base text-slate-800 font-extrabold leading-tight">
                    {s.from} <span className="text-slate-300 font-normal mx-1">→</span> {s.to}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white text-primary transition-colors">
                    <Navigation size={14} className="ml-0.5" />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pl-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-md shadow-primary/20">
                      {s.time}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-bold bg-white border shadow-sm ${
                      s.crowding === 'Low' ? 'border-green-200 text-green-600' :
                      s.crowding === 'Med' ? 'border-amber-200 text-amber-600' :
                      'border-red-200 text-red-600'
                    }`}>
                      {s.crowding} Crowd
                    </span>
                  </div>
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    {s.mode}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="mt-8 pt-5 border-t border-slate-200">
        <div className="bg-white/80 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-500 shadow-sm text-center flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          Real-time AI Routing Active
        </div>
      </div>
    </aside>
  );
}
