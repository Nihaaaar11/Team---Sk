'use client';

import { useState } from 'react';
import { Activity, Search, X, Bus, Train, Zap, Bike, Navigation } from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const transportModes = [
  { id: 'bus',   label: 'Bus',    icon: Bus,        color: 'text-amber-400',  bg: 'bg-amber-400/10 hover:bg-amber-400/20 border-amber-400/30' },
  { id: 'metro', label: 'Metro',  icon: Train,      color: 'text-blue-400',   bg: 'bg-blue-400/10 hover:bg-blue-400/20 border-blue-400/30' },
  { id: 'auto',  label: 'Auto',   icon: Zap,        color: 'text-yellow-400', bg: 'bg-yellow-400/10 hover:bg-yellow-400/20 border-yellow-400/30' },
  { id: 'cycle', label: 'Cycle',  icon: Bike,       color: 'text-green-400',  bg: 'bg-green-400/10 hover:bg-green-400/20 border-green-400/30' },
];

const suggestions = [
  { from: 'Hitech City',   to: 'Charminar',    time: '32 min', mode: 'metro', crowding: 'Low' },
  { from: 'Banjara Hills', to: 'Secunderabad', time: '18 min', mode: 'bus',   crowding: 'High' },
  { from: 'Gachibowli',   to: 'Jubilee Hills', time: '12 min', mode: 'auto',  crowding: 'Med' },
];

const crowdColor: Record<string, string> = {
  Low:  'text-green-400',
  Med:  'text-amber-400',
  High: 'text-red-400',
};

export default function Sidebar({ className = '' }: SidebarProps) {
  const [searchOpen, setSearchOpen]     = useState(false);
  const [query, setQuery]               = useState('');
  const [activeMode, setActiveMode]     = useState<string | null>(null);

  const filteredSuggestions = suggestions.filter(s => {
    const matchesMode  = activeMode ? s.mode === activeMode : true;
    const matchesQuery = query
      ? s.from.toLowerCase().includes(query.toLowerCase()) ||
        s.to.toLowerCase().includes(query.toLowerCase())
      : true;
    return matchesMode && matchesQuery;
  });

  return (
    <aside className={`bg-sidebar px-4 py-6 flex flex-col overflow-y-auto ${className}`}>

      {/* ── Logo ── */}
      <div className="mb-6">
        <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Activity size={20} className="text-white" />
          </div>
          <span>
            <span className="text-slate-800">Travel</span><span className="text-primary font-bold">Ease</span>
          </span>
        </div>
      </div>

      {/* ── Search toggle ── */}
      <div className="mb-5">
        {!searchOpen ? (
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/50 border border-slate-300 text-slate-500 text-sm hover:border-primary/60 hover:text-slate-800 transition-all shadow-sm"
          >
            <Search size={15} />
            <span>Search routes…</span>
          </button>
        ) : (
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="From or to…"
              className="w-full pl-8 pr-8 py-2 rounded-lg bg-white border border-primary/50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
            />
            <button
              onClick={() => { setSearchOpen(false); setQuery(''); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* ── Transport modes ── */}
      <div className="mb-5">
        <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3 px-1">
          Mode of Transport
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {transportModes.map(({ id, label, icon: Icon, color, bg }) => (
            <button
              key={id}
              onClick={() => setActiveMode(prev => prev === id ? null : id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${bg} ${
                activeMode === id ? 'ring-1 ring-white/20 scale-95' : ''
              }`}
            >
              <Icon size={13} className={color} />
              <span className="text-slate-700 font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Suggestions ── */}
      <div className="flex-1">
        <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3 px-1">
          Route Suggestions
        </h3>
        <div className="flex flex-col gap-2">
          {filteredSuggestions.length === 0 ? (
            <p className="text-xs text-slate-500 px-1">No routes match your filters.</p>
          ) : (
            filteredSuggestions.map((s, i) => (
              <div
                key={i}
                className="bg-white/60 border border-slate-200 rounded-lg p-3 hover:border-primary/50 hover:bg-white transition-colors cursor-pointer group shadow-sm"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="text-xs text-slate-800 font-bold leading-tight">
                    {s.from} <span className="text-slate-400 font-normal">→</span> {s.to}
                  </div>
                  <Navigation size={11} className="text-slate-400 mt-0.5 flex-shrink-0 group-hover:text-primary transition-colors" />
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-primary font-bold">{s.time}</span>
                  <span className={`font-bold ${crowdColor[s.crowding]}`}>
                    {s.crowding} crowd
                  </span>
                  <span className="text-slate-500 font-medium capitalize">{s.mode}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="mt-6 pt-5 border-t border-border">
        <div className="bg-white/50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500 shadow-sm">
          Last deploy: 5m ago<br />
          Env: Production
        </div>
      </div>
    </aside>
  );
}
