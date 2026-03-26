'use client';

import { TrendingUp, AlertTriangle, Zap, ArrowRight, Activity, MapPin } from 'lucide-react';

export default function AIInsightsPanel() {
  return (
    <div className="w-80 flex flex-col gap-4 pointer-events-auto max-h-[calc(100vh-100px)] overflow-y-auto pr-2 pb-4 pt-1">
      
      {/* Primary Insight Alert */}
      <div className="bg-gradient-to-br from-sky-100 to-white/90 backdrop-blur-xl border border-sky-300 rounded-2xl p-5 shadow-[0_10px_40px_rgba(56,189,248,0.2)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-400/20 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" />
        
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-200/50 rounded-md">
              <Zap size={16} className="text-sky-600" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700">Live AI Routing</span>
          </div>
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2 relative z-10">
          Surge via Metro Line Blue
        </h3>
        <p className="text-sm text-slate-600 mb-4 font-medium leading-relaxed relative z-10">
          Deploying additional bus feeder units to Ameerpet station to handle incoming weekend spike.
        </p>

        <button className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all relative z-10 shadow-lg shadow-sky-500/20">
          Approve Dispatch <ArrowRight size={16} />
        </button>
      </div>

      {/* Secondary Warning */}
      {/* Secondary Warning */}
      <div className="bg-white/80 backdrop-blur-md border border-red-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle size={18} className="text-red-500" />
          <h4 className="font-bold text-slate-800 text-sm">Congestion Alert</h4>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-slate-500 font-bold tracking-wide mb-1">HITEC City Corridor</p>
            <p className="text-red-500 font-bold text-lg">Heavy (+45m)</p>
          </div>
          <div className="h-8 w-16 bg-red-100 rounded overflow-hidden flex items-end">
            <div className="w-full bg-red-500/70 rounded-t-sm animate-[pulse_1.5s_ease-in-out_infinite]" style={{ height: '80%' }} />
          </div>
        </div>
      </div>

      {/* Trend Analysis */}
      {/* Trend Analysis */}
      <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp size={18} className="text-emerald-500" />
          <h4 className="font-bold text-slate-800 text-sm">Predictive Flow</h4>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 font-bold">Evening Commute</span>
            <span className="text-emerald-500 font-bold leading-none">+12% smoother</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 hidden sm:block">
            <div className="bg-gradient-to-r from-emerald-400 to-sky-400 h-1.5 rounded-full" style={{ width: '78%' }}></div>
          </div>
        </div>
      </div>

    </div>
  );
}
