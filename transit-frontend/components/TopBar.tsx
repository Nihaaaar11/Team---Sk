'use client';

import { useState, useEffect } from 'react';
import { Mountain, Search, Menu, User, Bell } from 'lucide-react';
import Image from 'next/image';

interface TopBarProps {
  viewMode?: 'Passenger' | 'Operator';
  onViewModeChange?: (mode: 'Passenger' | 'Operator') => void;
}

export default function TopBar({ viewMode = 'Passenger', onViewModeChange }: TopBarProps) {
  const [time, setTime] = useState<Date | null>(null);

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

        {/* Logout Button */}
        <div className="flex shrink-0">
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-5 py-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl text-sm font-bold transition-all border border-red-100 shadow-sm"
          >
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}
