'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import TelemetryDashboard from '@/components/TelemetryDashboard';
import AIInsightsPanel from '@/components/AIInsightsPanel';
import { Search, MapPin, Sparkles, X, Map } from 'lucide-react';

export default function DashboardPage() {
  const [startingPoint, setStartingPoint] = useState('');
  const [destination, setDestination]     = useState('');
  const [hasSearched, setHasSearched]     = useState(false);
  const [aiAgentOpen, setAiAgentOpen]     = useState(false);

  const handleSearch = () => {
    if (startingPoint && destination) {
      setHasSearched(true);
      // We don't auto-open AI insights, let them click the icon
      setAiAgentOpen(false);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-50">
      <TopBar />
      
      {!hasSearched ? (
        // Search First View (Scrollable on mobile)
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center justify-start md:justify-center">
          
          <div className="w-full max-w-xl bg-white p-6 md:p-10 rounded-3xl shadow-xl shadow-primary/5 border border-slate-100 mt-4 md:mt-0">
            <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mx-auto mb-6">
               <MapPin className="text-primary w-8 h-8" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2 text-center tracking-tight">Where to next?</h2>
            <p className="text-slate-500 text-center mb-8 font-medium">Enter your starting point and destination to find the best routes and view the map.</p>
            
            <div className="flex flex-col gap-4 mb-8">
              <div className="relative group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  value={startingPoint}
                  onChange={e => setStartingPoint(e.target.value)}
                  placeholder="Enter Starting point"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white transition-all font-semibold text-lg"
                />
              </div>
              <div className="relative group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  placeholder="Enter destination"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white transition-all font-semibold text-lg"
                />
              </div>
            </div>

            <button 
              onClick={handleSearch}
              disabled={!startingPoint || !destination}
              className="w-full py-4 rounded-xl bg-primary text-white font-extrabold text-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(14,165,233,0.3)] active:scale-[0.98]"
            >
              Find Routes
            </button>
          </div>
          
        </div>
      ) : (
        // Map & Directions View (Adaptive)
        <div className="flex flex-1 h-full w-full overflow-hidden relative flex-col md:flex-row">
          
          {/* Main Map Area */}
          <main className="flex-1 relative h-[50vh] md:h-full w-full shrink-0 bg-slate-100">
            <TelemetryDashboard />
            
            {/* AI Agent Floating Button */}
            {!aiAgentOpen && (
              <button 
                onClick={() => setAiAgentOpen(true)}
                className="absolute bottom-6 left-6 z-20 w-16 h-16 bg-white text-primary rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 transition-all outline outline-4 outline-white cursor-pointer group"
              >
                <div className="absolute inset-0 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors"></div>
                <Sparkles size={28} className="animate-pulse relative z-10" />
              </button>
            )}

            {/* Expanded AI Insights Overlay */}
            {aiAgentOpen && (
              <div className="absolute bottom-6 left-6 z-30 max-h-[85vh] md:w-auto animate-in slide-in-from-bottom-8 duration-300 ease-out flex flex-col gap-2 pointer-events-none">
                 <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] pointer-events-auto flex flex-col overflow-hidden max-w-[calc(100vw-3rem)]">
                   <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white">
                     <h3 className="font-extrabold text-slate-800 flex items-center gap-2">
                       <Sparkles size={18} className="text-primary"/> AI Insights
                     </h3>
                     <button onClick={() => setAiAgentOpen(false)} className="text-slate-500 bg-slate-100 p-2 rounded-xl hover:bg-slate-200 transition-colors">
                       <X size={16} />
                     </button>
                   </div>
                   <div className="p-2 overflow-y-auto">
                     <AIInsightsPanel />
                   </div>
                 </div>
              </div>
            )}
          </main>
          
          {/* Bottom Sheet on Mobile / Sidebar on Desktop */}
          <div className="z-20 h-[50vh] md:h-full bg-slate-50 flex flex-col shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-3xl md:relative md:w-96 md:rounded-none md:shadow-none md:border-l border-border transition-all">
             
             {/* Header */}
             <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-white shrink-0 rounded-t-3xl md:rounded-none">
               <div className="flex-1 min-w-0 pr-4">
                 <h3 className="font-extrabold text-slate-800 text-lg mb-0.5 truncate capitalize flex items-center gap-2">
                   <Map className="text-primary w-5 h-5"/> Route Details
                 </h3>
                 <div className="text-sm font-semibold text-slate-500 flex items-center gap-1.5 truncate">
                   <span className="truncate max-w-[120px]">{startingPoint}</span> 
                   <span className="text-primary shrink-0">→</span> 
                   <span className="truncate max-w-[120px]">{destination}</span>
                 </div>
               </div>
               <button 
                onClick={() => setHasSearched(false)} 
                className="text-primary text-sm font-bold bg-primary/10 px-4 py-2 rounded-xl hover:bg-primary/20 transition-colors shrink-0 whitespace-nowrap shadow-sm"
               >
                Edit Search
               </button>
             </div>
             
             {/* Dynamic Transport Listing */}
             <Sidebar 
               className="flex-1 w-full bg-slate-50/50" 
               startPoint={startingPoint} 
               destPoint={destination} 
             />
          </div>

        </div>
      )}
    </div>
  );
}
