'use client';

import { useState } from 'react';
import { ClipboardList, Bus, Train, PlusCircle, CheckCircle2, IndianRupee, Sparkles } from 'lucide-react';
import AIInsightsPanel from '@/components/AIInsightsPanel';
import { supabase } from '@/lib/supabase';

export default function OperatorDashboard() {
  const [transportMode, setTransportMode] = useState('bus');
  const [logType, setLogType] = useState('trip');
  const [tripId, setTripId] = useState('');
  const [ticketsSold, setTicketsSold] = useState('');
  const [revenue, setRevenue] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Connect to Supabase 'ticketing_logs' table
      const { error } = await supabase
        .from('ticketing_logs')
        .insert([
          {
            transport_mode: transportMode,
            log_type: logType,
            trip_id: tripId,
            tickets_sold: parseInt(ticketsSold),
            revenue: parseFloat(revenue)
          }
        ]);

      if (error) {
        console.error("Supabase Error:", error);
        alert(`Supabase Error: ${error.message}\nMake sure that the 'ticketing_logs' table actually exists in your Supabase database!`);
      } else {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setTripId('');
          setTicketsSold('');
          setRevenue('');
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-12 w-full animate-in fade-in duration-300">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Form Panel */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <ClipboardList size={28} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight text-balance">Ticketing Log Dashboard</h2>
              <p className="text-slate-500 font-medium text-sm mt-0.5">Submit your daily ridership and revenue data to the central network.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            {/* Mode Select */}
            <div>
              <label className="text-xs font-black text-slate-600 uppercase tracking-widest mb-3 block">Transport Mode</label>
              <div className="grid grid-cols-3 gap-3">
                <button type="button" onClick={() => setTransportMode('bus')} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 font-bold transition-all ${transportMode === 'bus' ? 'border-amber-500 bg-amber-500/10 text-amber-600 shadow-sm' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-300'}`}>
                  <Bus size={24} /> <span className="text-xs md:text-sm">RTC Bus</span>
                </button>
                <button type="button" onClick={() => setTransportMode('metro')} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 font-bold transition-all ${transportMode === 'metro' ? 'border-primary bg-primary/10 text-primary shadow-sm' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-300'}`}>
                  <Train size={24} /> <span className="text-xs md:text-sm">Metro</span>
                </button>
                <button type="button" onClick={() => setTransportMode('train')} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 font-bold transition-all ${transportMode === 'train' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 shadow-sm' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-300'}`}>
                  <Train size={24} /> <span className="text-xs md:text-sm">MMTS</span>
                </button>
              </div>
            </div>

            {/* Log Type */}
            <div>
              <label className="text-xs font-black text-slate-600 uppercase tracking-widest mb-3 block">Reporting Period</label>
              <div className="flex bg-slate-100 rounded-xl p-1.5 shadow-inner">
                <button type="button" onClick={() => setLogType('trip')} className={`flex-1 py-2.5 font-bold rounded-lg text-sm transition-all ${logType === 'trip' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>Per Trip</button>
                <button type="button" onClick={() => setLogType('day')} className={`flex-1 py-2.5 font-bold rounded-lg text-sm transition-all ${logType === 'day' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>Per Day (Full Shift)</button>
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-600 uppercase tracking-widest">Vehicle / Trip Line ID</label>
                <input required value={tripId} onChange={e => setTripId(e.target.value)} placeholder={transportMode === 'bus' ? "e.g. Bus 47L" : "e.g. Blue Line"} className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary/40 focus:bg-white transition-all font-semibold shadow-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-slate-600 uppercase tracking-widest">Tickets Sold</label>
                  <input required type="number" min="0" value={ticketsSold} onChange={e => setTicketsSold(e.target.value)} placeholder="0" className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary/40 focus:bg-white transition-all font-semibold text-xl shadow-sm text-center" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-slate-600 uppercase tracking-widest">Total Revenue</label>
                  <div className="relative">
                    <IndianRupee size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input required type="number" min="0" value={revenue} onChange={e => setRevenue(e.target.value)} placeholder="0" className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary/40 focus:bg-white transition-all font-semibold text-xl shadow-sm" />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="mt-2 w-full py-4 rounded-xl bg-slate-800 text-white font-extrabold flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] disabled:opacity-70 disabled:cursor-not-allowed">
              {isSubmitting ? (
                <div className="w-6 h-6 border-4 border-slate-300 border-t-white rounded-full animate-spin"></div>
              ) : showSuccess ? (
                <><CheckCircle2 className="text-green-400" /> System Updated Successfully</>
              ) : (
                <><PlusCircle /> Log Trip Data into System</>
              )}
            </button>
          </form>
        </div>

        {/* Info Panel / History */}
        <div className="w-full md:w-[380px] flex flex-col gap-6">
          <div className="bg-gradient-to-br from-primary to-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <h3 className="font-extrabold text-xl mb-1 relative z-10">Shift Summary</h3>
            <p className="text-blue-100 text-sm font-medium mb-6 relative z-10">Data transmitted today</p>
            
            <div className="flex flex-col gap-4 relative z-10">
              <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/20">
                <p className="text-xs uppercase tracking-widest text-blue-100 font-bold mb-1">Total Passports</p>
                <p className="text-3xl font-black">1,204</p>
              </div>
              <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/20">
                <p className="text-xs uppercase tracking-widest text-blue-100 font-bold mb-1">Revenue Pool</p>
                <p className="text-3xl font-black flex items-center gap-1"><IndianRupee size={24} /> 24,080</p>
              </div>
            </div>
          </div>

          {/* AI Insights Integration */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-md flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-3 px-1">
              <h4 className="font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                <Sparkles size={18} className="text-primary"/> Network AI Insights
              </h4>
            </div>
            <div className="flex-1 -mx-2 -mt-2">
              <AIInsightsPanel />
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md">
            <h4 className="font-bold text-slate-800 mb-4 tracking-tight">Recent Synchronizations</h4>
            <div className="space-y-4">
              <div className="flex w-full items-center justify-between pb-3 border-b border-slate-50">
                <div>
                  <p className="text-sm font-bold text-slate-700">Trip 47L - Bus</p>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">Today, 10:45 AM</p>
                </div>
                <p className="text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded">+42 Tix</p>
              </div>
              <div className="flex w-full items-center justify-between pb-3 border-b border-slate-50">
                <div>
                  <p className="text-sm font-bold text-slate-700">Trip 47L - Bus</p>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">Today, 09:12 AM</p>
                </div>
                <p className="text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded">+68 Tix</p>
              </div>
              <div className="flex w-full items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-700">Trip 12A - Bus</p>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">Yesterday, 06:30 PM</p>
                </div>
                <p className="text-sm font-bold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded">+121 Tix</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
