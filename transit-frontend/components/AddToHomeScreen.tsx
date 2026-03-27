'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function AddToHomeScreen() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent Chrome <= 67 from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setIsReady(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Register simple Service Worker which is required to trigger the event
    if ('serviceWorker' in navigator && typeof window !== 'undefined') {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the prompt natively
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // Either 'accepted' or 'dismissed'
    if (outcome === 'accepted') {
      setIsReady(false);
    }
    
    setDeferredPrompt(null);
  };

  if (!isReady) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 md:bottom-8 md:right-8 md:left-auto md:translate-x-0 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="bg-[#FAF6EE] text-slate-800 px-5 py-4 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col items-center gap-3 w-72 border-2 border-sky-200">
        <div className="flex justify-between w-full items-start">
          <div className="flex flex-col pr-4">
            <h4 className="font-extrabold text-sm uppercase tracking-wide text-sky-600">Get the App</h4>
            <p className="text-xs font-semibold leading-relaxed mt-1 text-slate-600">Install TravelEase directly to your home screen for rapid access.</p>
          </div>
          <button onClick={() => setIsReady(false)} className="text-slate-400 hover:text-slate-600 shrink-0 -mt-1 -mr-2 p-1 transition-colors">
            <X size={18} />
          </button>
        </div>
        <button 
          onClick={handleInstallClick}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 rounded-xl flex justify-center items-center gap-2 shadow-md hover:shadow-lg transition-all border border-sky-400 active:scale-[0.98]"
        >
          <Download size={18} /> Add to Home Screen
        </button>
      </div>
    </div>
  );
}
