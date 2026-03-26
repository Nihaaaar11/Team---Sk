'use client';

import { useState, useEffect } from 'react';

export default function TopBar() {
  const [time, setTime] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'Operator' | 'Passenger'>('Operator');

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6 shrink-0 z-20 relative shadow-sm">
      <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
        <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
          <img src="/logo.png" alt="TravelEase Logo" className="w-full h-full object-contain" />
        </div>
        <span>
          <span className="text-slate-800">Travel</span><span className="text-primary font-bold">Ease</span>
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Live Clock Component */}
        <div className="hidden sm:flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded text-sm text-slate-600 font-bold border border-slate-200 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
          {time ? formatTime(time) : '00:00:00'} IST
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-white/80 p-1 rounded-lg border border-slate-200 shadow-sm">
          <button 
            onClick={() => setViewMode('Operator')}
            className={`px-3 py-1 text-sm font-bold rounded-md transition-all ${
              viewMode === 'Operator' ? 'bg-primary text-white shadow' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Operator
          </button>
          <button 
            onClick={() => setViewMode('Passenger')}
            className={`px-3 py-1 text-sm font-bold rounded-md transition-all ${
              viewMode === 'Passenger' ? 'bg-primary text-white shadow' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Passenger
          </button>
        </div>
      </div>
    </header>
  );
}
