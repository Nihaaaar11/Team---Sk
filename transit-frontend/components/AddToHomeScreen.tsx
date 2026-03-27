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
      <div className="bg-[#1e3a8a] text-white px-5 py-4 rounded-2xl shadow-2xl flex flex-col items-center gap-3 w-72 border-2 border-sky-400">
        <div className="flex justify-between w-full items-start">
          <div className="flex flex-col pr-4">
            <h4 className="font-extrabold text-sm uppercase tracking-wide text-sky-200">Get the App</h4>
            <p className="text-xs font-semibold leading-relaxed mt-1 text-slate-100">Install TravelEase directly to your home screen for rapid access.</p>
          </div>
          <button onClick={() => setIsReady(false)} className="text-white/50 hover:text-white shrink-0 -mt-1 -mr-2 p-1">
            <X size={18} />
          </button>
        </div>
        <button 
          onClick={handleInstallClick}
          className="w-full bg-[#3b82f6] hover:bg-sky-400 text-white font-bold py-2.5 rounded-xl flex justify-center items-center gap-2 shadow-lg transition-colors border border-sky-300"
        >
          <Download size={18} /> Add to Home Screen
        </button>
      </div>
    </div>
  );
}
