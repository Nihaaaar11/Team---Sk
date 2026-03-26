'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import TelemetryDashboard from '@/components/TelemetryDashboard';
import AIInsightsPanel from '@/components/AIInsightsPanel';
import { Search, MapPin, Sparkles, X, Map, Navigation } from 'lucide-react';

export default function DashboardPage() {
  const [startingPoint, setStartingPoint] = useState('');
  const [destination, setDestination]     = useState('');
  const [hasSearched, setHasSearched]     = useState(false);
  const [aiAgentOpen, setAiAgentOpen]     = useState(false);

  const handleMobileSearch = () => {
    if (startingPoint && destination) {
      setHasSearched(true);
      setAiAgentOpen(false);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-50">
      <TopBar />
      
      {/* ========================================= */}
      {/* MOBILE FLOW (hidden on md)                */}
      {/* ========================================= */}
      <div className="md:hidden flex-1 h-full w-full relative flex flex-col">
        {!hasSearched ? (
          // Mobile Search First View
          <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-start">
            <div className="w-full bg-white p-6 rounded-3xl shadow-xl shadow-primary/5 border border-slate-100 mt-4">
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mx-auto mb-6">
                 <MapPin className="text-primary w-8 h-8" />
              </div>
              
              <h2 className="text-2xl font-extrabold text-slate-800 mb-2 text-center tracking-tight">Where to next?</h2>
              <p className="text-slate-500 text-center mb-8 font-medium">Enter your starting point and destination to find the best routes.</p>
              
              <div className="flex flex-col gap-4 mb-8">
                <div className="relative group">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input
                    value={startingPoint}
                    onChange={e => setStartingPoint(e.target.value)}
                    placeholder="Enter Starting point"
                    className="w-full pl-12 pr-12 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white transition-all font-semibold text-lg"
                  />
                  <button 
                  onClick={() => {
                    setStartingPoint('Locating...');
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          if (window.google && google.maps && google.maps.Geocoder) {
                            const geocoder = new google.maps.Geocoder();
                            geocoder.geocode({ location: { lat: pos.coords.latitude, lng: pos.coords.longitude } }, (results, status) => {
                               if (status === 'OK' && results && results[0]) {
                                 setStartingPoint(results[0].formatted_address);
                               } else {
                                 setStartingPoint(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
                               }
                            });
                          } else {
                            setStartingPoint(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
                          }
                        },
                        (err) => {
                          console.error(err);
                          setStartingPoint('Location access denied');
                        },
                        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
                      );
                    }
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors p-1"
                  title="Use Current Location"
                >
                  <Navigation size={18} />
                </button>
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
                onClick={handleMobileSearch}
                disabled={!startingPoint || !destination}
                className="w-full py-4 rounded-xl bg-primary text-white font-extrabold text-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20 active:scale-[0.98]"
              >
                Find Routes
              </button>
            </div>
          </div>
        ) : (
          // Mobile Map & Bottom Sheet View
          <div className="flex flex-1 h-full w-full overflow-hidden relative flex-col">
            <main className="flex-1 relative h-full w-full shrink-0 bg-slate-100">
              <TelemetryDashboard />
              
              {/* Mobile AI Agent Floating Button */}
              {!aiAgentOpen && (
                <button 
                  onClick={() => setAiAgentOpen(true)}
                  className="absolute bottom-[55vh] left-4 z-20 w-14 h-14 bg-white text-primary rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all outline outline-4 outline-white cursor-pointer group"
                >
                  <Sparkles size={24} className="animate-pulse" />
                </button>
              )}

              {/* Mobile AI Insights Overlay */}
              {aiAgentOpen && (
                <div className="absolute inset-x-0 bottom-[50vh] z-30 max-h-[45vh] animate-in slide-in-from-bottom-8 duration-300 flex flex-col pointer-events-none p-4">
                   <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl pointer-events-auto flex flex-col overflow-hidden w-full">
                     <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 bg-white">
                       <h3 className="font-extrabold text-slate-800 flex items-center gap-2">
                         <Sparkles size={16} className="text-primary"/> AI Insights
                       </h3>
                       <button onClick={() => setAiAgentOpen(false)} className="text-slate-500 bg-slate-100 p-2 rounded-xl">
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
            
            {/* Mobile Bottom Sheet Sidebar */}
            <div className="z-20 h-[50vh] bg-slate-50 flex flex-col shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-3xl border-t border-slate-200">
               <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-white rounded-t-3xl shrink-0">
                 <div className="flex-1 min-w-0 pr-4">
                   <h3 className="font-extrabold text-slate-800 text-lg mb-0.5 truncate flex items-center gap-2">
                     <Map className="text-primary w-5 h-5"/> Route Details
                   </h3>
                   <div className="text-sm font-semibold text-slate-500 flex items-center gap-1.5 truncate">
                     <span className="truncate max-w-[100px]">{startingPoint}</span> 
                     <span className="text-primary">→</span> 
                     <span className="truncate max-w-[100px]">{destination}</span>
                   </div>
                 </div>
                 <button 
                  onClick={() => setHasSearched(false)} 
                  className="text-primary text-sm font-bold bg-primary/10 px-4 py-2 rounded-xl"
                 >
                  Edit
                 </button>
               </div>
               
               <Sidebar 
                 className="flex-1 w-full bg-slate-50/50" 
                 startPoint={startingPoint} 
                 destPoint={destination} 
                 showSearchToggle={false}
               />
            </div>
          </div>
        )}
      </div>

      {/* ========================================= */}
      {/* PC DESKTOP FLOW (hidden on mobile)        */}
      {/* ========================================= */}
      <div className="hidden md:flex flex-1 h-full w-full overflow-hidden relative flex-row">
          
          {/* Main Map Area */}
          <main className="flex-1 relative h-full w-full shrink-0 bg-slate-100">
            <TelemetryDashboard />
            
            {/* AI Agent Floating Button (PC) */}
            {!aiAgentOpen && (
              <button 
                onClick={() => setAiAgentOpen(true)}
                className="absolute bottom-6 left-6 z-20 w-16 h-16 bg-white text-primary rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 transition-all outline outline-4 outline-white cursor-pointer group"
              >
                <div className="absolute inset-0 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors"></div>
                <Sparkles size={28} className="animate-pulse relative z-10" />
              </button>
            )}

            {/* Expanded AI Insights Overlay (PC) */}
            {aiAgentOpen && (
              <div className="absolute bottom-6 left-6 z-30 max-h-[85vh] animate-in slide-in-from-left-8 duration-300 ease-out flex flex-col gap-2 pointer-events-none">
                 <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] pointer-events-auto flex flex-col overflow-hidden max-w-[400px]">
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
          
          {/* Persistent Sidebar on PC */}
          <div className="z-20 h-full bg-slate-50 flex flex-col shrink-0 w-96 border-l border-border transition-all">

             
             <Sidebar 
               className="flex-1 w-full bg-slate-50/50" 
               startPoint={startingPoint} 
               destPoint={destination}
               onStartChange={setStartingPoint}
               onDestChange={setDestination}
               showSearchToggle={true}
             />
          </div>

      </div>
    </div>
  );
}
