"use client";

import React, { useState, useEffect, useRef } from 'react';
import { BusFront, User, MapPin, ChevronRight, ChevronLeft, Briefcase, GraduationCap, Plane, Heart, Home, Bus, Train, CarFront, Ticket, Key, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

const HYDERABAD_LOCATIONS = [
  "Ameerpet", "Attapur", "Banjara Hills", "Begumpet", "Bolarum", "Charminar", 
  "Dilsukhnagar", "Gachibowli", "Habsiguda", "HITEC City", "Jubilee Hills", 
  "Kondapur", "KPHB Colony", "Kukatpally", "L.B. Nagar", "Madhapur", 
  "Malakpet", "Manikonda", "Mehdipatnam", "Miyapur", "Nampally", 
  "Panjagutta", "Secunderabad", "Somajiguda", "Tarnaka", "Tolichowki", "Uppal"
];

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Common State
  const [accountType, setAccountType] = useState<'Passenger' | 'Operator' | ''>('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');

  // Passenger Specific State
  const [passengerType, setPassengerType] = useState('');
  const [passengerRoutes, setPassengerRoutes] = useState([
    { from: '', to: '' },
    { from: '', to: '' },
    { from: '', to: '' }
  ]);

  // Operator Specific State
  const [operatorTransport, setOperatorTransport] = useState('');
  const [operatorRole, setOperatorRole] = useState('');
  const [operatorVehicle, setOperatorVehicle] = useState('');

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 2 && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [step]);

  const PASSENGER_TYPES = [
    { name: "Employee", icon: <Briefcase size={20} /> },
    { name: "Student", icon: <GraduationCap size={20} /> },
    { name: "Local Resident", icon: <Home size={20} /> },
    { name: "Tourist", icon: <Plane size={20} /> },
    { name: "Senior Citizen", icon: <Heart size={20} /> }
  ];

  const OPERATOR_TRANSPORTS = [
    { name: "City Bus", icon: <Bus size={20} /> },
    { name: "Metro Rail", icon: <Train size={20} /> },
    { name: "Local Train (MMTS)", icon: <Train size={20} /> },
    { name: "Auto/Cab Fleet", icon: <CarFront size={20} /> },
  ];

  const OPERATOR_ROLES = [
    { name: "Driver / Pilot", icon: <CarFront size={20} /> },
    { name: "Conductor", icon: <Ticket size={20} /> },
    { name: "Dispatcher / Supervisor", icon: <Key size={20} /> },
  ];

  const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

  const nextStep = () => {
    const maxSteps = accountType === 'Passenger' ? 4 : 3;
    if (step < maxSteps) {
      setDirection('forward');
      setStep(prev => prev + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection('backward');
      setStep(prev => prev - 1);
    }
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    // Simulate authentication processing
    setTimeout(() => {
      router.push(`/?role=${accountType}`);
    }, 1500);
  };

  const isNextDisabled = () => {
    if (isSubmitting) return true;
    if (step === 1 && !accountType) return true;
    if (step === 2 && (!name.trim() || !gender)) return true;
    
    if (accountType === 'Passenger') {
      if (step === 3 && !passengerType) return true;
      if (step === 4) {
        // Must fill out at least Route 1 correctly to proceed
        const r1 = passengerRoutes[0];
        if (!r1.from || !r1.to || r1.from === r1.to) return true;
      }
    } else if (accountType === 'Operator') {
      if (step === 3 && (!operatorTransport || !operatorRole || !operatorVehicle.trim())) return true;
    }
    return false;
  };

  const updateRoute = (index: number, field: 'from' | 'to', value: string) => {
    const newRoutes = [...passengerRoutes];
    newRoutes[index][field] = value;
    setPassengerRoutes(newRoutes);
  };

  const animationClass = direction === 'forward' 
    ? 'animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both' 
    : 'animate-in fade-in slide-in-from-left-8 duration-500 fill-mode-both';

  const CustomSelect = ({ value, options, onChange, placeholder, icon }: any) => (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-600/60 z-10 pointer-events-none">
        {icon}
      </div>
      <select 
        value={value} 
        onChange={e => onChange(e.target.value)}
        className={`w-full bg-white/70 border-2 appearance-none text-[#1e3a8a] text-sm font-semibold rounded-2xl pl-11 pr-10 py-3 focus:outline-none focus:ring-4 focus:ring-sky-200 transition-all cursor-pointer ${value ? 'border-[#3b82f6]' : 'border-white/80 focus:border-[#87CEEB]'}`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-sky-800/40">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#f4ebd0] bg-gradient-to-br from-[#f4ebd0] via-[#e8e0c5] to-[#87CEEB] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-5%] left-[-10%] w-[30rem] h-[30rem] bg-white rounded-full blur-[120px] pointer-events-none opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-[#87CEEB] rounded-full blur-[150px] pointer-events-none opacity-50" />

      <div className="w-full max-w-xl bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden relative z-10 flex flex-col transition-all duration-500">
        
        {/* Header Section */}
        <div className="pt-8 pb-4 px-8 flex flex-col items-center">
          <div className="w-14 h-14 bg-gradient-to-tr from-[#87CEEB] to-white rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20 mb-3 transform transition-transform hover:scale-105 border border-white/80">
            <BusFront size={28} className="text-[#3b82f6]" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e3a8a] tracking-tight">Travel<span className="text-[#3b82f6]">EASE</span></h1>
          
          {/* Progress Indicators */}
          <div className="flex space-x-2 mt-5">
            {[...Array(accountType === 'Operator' ? 3 : 4)].map((_, idx) => {
              const i = idx + 1;
              return (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === step ? 'w-8 bg-[#3b82f6]' : i < step ? 'w-4 bg-[#87CEEB]' : 'w-4 bg-white/60'
                  }`}
                />
              )
            })}
          </div>
        </div>

        {/* Dynamic Form Area */}
        <div className="p-8 pt-2 min-h-[420px] flex flex-col justify-between">
          
          {/* STEP 1: ACCOUNT TYPE */}
          {step === 1 && (
            <div key="step1" className={`space-y-6 flex-grow flex flex-col justify-center ${animationClass}`}>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#1e3a8a]">Join TravelEASE</h2>
                <p className="text-[#475569] mt-2">How will you be using the platform?</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => { setAccountType('Passenger'); setTimeout(() => nextStep(), 300); }}
                  className={`flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300 border-2 ${
                    accountType === 'Passenger' 
                      ? 'bg-white border-[#87CEEB] text-[#1e3a8a] shadow-md shadow-sky-200/50 scale-[1.03]' 
                      : 'bg-white/40 border-white/60 text-[#475569] hover:bg-white/70 hover:scale-[1.01]'
                  }`}
                >
                  <div className={`p-4 rounded-2xl mb-3 ${accountType === 'Passenger' ? 'bg-sky-100 text-[#3b82f6]' : 'bg-slate-100 text-slate-500'}`}>
                    <Users size={32} />
                  </div>
                  <span className="font-bold text-lg">Passenger</span>
                  <span className="text-xs text-center mt-2 opacity-80">Commute smartly across the city</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setAccountType('Operator'); setTimeout(() => nextStep(), 300); }}
                  className={`flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300 border-2 ${
                    accountType === 'Operator' 
                      ? 'bg-white border-[#87CEEB] text-[#1e3a8a] shadow-md shadow-sky-200/50 scale-[1.03]' 
                      : 'bg-white/40 border-white/60 text-[#475569] hover:bg-white/70 hover:scale-[1.01]'
                  }`}
                >
                  <div className={`p-4 rounded-2xl mb-3 ${accountType === 'Operator' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                    <CarFront size={32} />
                  </div>
                  <span className="font-bold text-lg">Operator</span>
                  <span className="text-xs text-center mt-2 opacity-80">Manage public transit operations</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: BASIC INFO (Both) */}
          {step === 2 && (
            <div key="step2" className={`space-y-6 flex-grow flex flex-col justify-center ${animationClass}`}>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#1e3a8a]">Personal Details</h2>
                <p className="text-[#475569] mt-2">Let's get to know you better.</p>
              </div>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1e3a8a] uppercase tracking-wider flex items-center ml-1">
                    <User size={14} className="mr-1.5 text-[#3b82f6]" /> Legal Name
                  </label>
                  <input 
                    ref={nameInputRef}
                    required
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Johnson" 
                    className="w-full bg-white/70 border-2 border-white/80 text-[#1e3a8a] placeholder-slate-400 font-semibold rounded-2xl px-5 py-3 focus:outline-none focus:ring-4 focus:ring-sky-200 focus:border-[#87CEEB] transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1e3a8a] uppercase tracking-wider flex items-center ml-1">
                    <Users size={14} className="mr-1.5 text-indigo-500" /> Gender
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {GENDERS.map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border-2 ${
                          gender === g 
                            ? 'bg-[#3b82f6] border-[#3b82f6] text-white shadow-md' 
                            : 'bg-white/50 border-white/80 text-[#475569] hover:bg-white'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ROLE DETAILS (Passenger vs Operator) */}
          {step === 3 && accountType === 'Passenger' && (
            <div key="step3-p" className={`space-y-5 flex-grow flex flex-col justify-center ${animationClass}`}>
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-[#1e3a8a]">Your Profile</h2>
                <p className="text-[#475569] mt-2">Which category fits you best?</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {PASSENGER_TYPES.map(ptype => (
                  <button
                    type="button"
                    key={ptype.name}
                    onClick={() => { setPassengerType(ptype.name); setTimeout(() => nextStep(), 350); }}
                    className={`flex items-center p-4 rounded-2xl text-sm font-bold transition-all duration-300 border-2 text-left ${
                      passengerType === ptype.name 
                        ? 'bg-white border-[#87CEEB] text-[#1e3a8a] shadow-md shadow-sky-200/50 scale-[1.02]' 
                        : 'bg-white/40 border-white/60 text-[#475569] hover:bg-white/60 hover:border-white shadow-sm'
                    }`}
                  >
                    <div className={`mr-3 p-2 rounded-xl ${passengerType === ptype.name ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-500'}`}>
                      {ptype.icon}
                    </div>
                    {ptype.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && accountType === 'Operator' && (
            <div key="step3-o" className={`space-y-5 flex-grow flex flex-col justify-center ${animationClass}`}>
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-[#1e3a8a]">Operational Details</h2>
                <p className="text-[#475569] mt-2">Tell us about your transit assignment.</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1e3a8a] uppercase tracking-wider ml-1">Transport Type</label>
                  <CustomSelect 
                    icon={<BusFront size={18} />}
                    value={operatorTransport} 
                    onChange={setOperatorTransport} 
                    options={OPERATOR_TRANSPORTS.map(t => t.name)} 
                    placeholder="Select Transport Category"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1e3a8a] uppercase tracking-wider ml-1">Your Role</label>
                  <CustomSelect 
                    icon={<Briefcase size={18} />}
                    value={operatorRole} 
                    onChange={setOperatorRole} 
                    options={OPERATOR_ROLES.map(r => r.name)} 
                    placeholder="Select Operational Role"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1e3a8a] uppercase tracking-wider ml-1">Vehicle/Fleet Number</label>
                  <div className="relative">
                    <Bus size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-600/60 z-10 pointer-events-none" />
                    <input 
                      type="text" 
                      value={operatorVehicle}
                      onChange={e => setOperatorVehicle(e.target.value)}
                      placeholder="AP-09-XX-9999"
                      className="w-full bg-white/70 border-2 border-white/80 text-[#1e3a8a] placeholder-slate-400 font-semibold rounded-2xl pl-11 pr-5 py-3 focus:outline-none focus:ring-4 focus:ring-sky-200 transition-all shadow-sm focus:border-[#87CEEB]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PASSENGER ROUTES (Passenger ONLY) */}
          {step === 4 && accountType === 'Passenger' && (
            <div key="step4" className={`space-y-4 flex-grow flex flex-col ${animationClass}`}>
              <div className="text-center mb-2">
                <h2 className="text-2xl font-bold text-[#1e3a8a]">Top 3 Routes</h2>
                <p className="text-[#475569] mt-2 text-sm">Where do you commute most frequently?</p>
              </div>
              
              <div className="space-y-5 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar">
                {[1, 2, 3].map((routeNum, index) => (
                  <div key={routeNum} className="bg-white/30 backdrop-blur-sm p-4 rounded-2xl border border-white/50 relative shadow-sm">
                    <div className="absolute -left-2 -top-2 w-6 h-6 bg-[#3b82f6] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md shadow-sky-400/30">
                      {routeNum}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block">Origin (From)</label>
                        <select 
                          value={passengerRoutes[index].from}
                          onChange={e => updateRoute(index, 'from', e.target.value)}
                          className={`w-full bg-white/80 border text-[#1e3a8a] text-sm font-semibold rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-200 focus:outline-none appearance-none cursor-pointer ${passengerRoutes[index].from ? 'border-sky-300' : 'border-transparent'}`}
                        >
                          <option value="" disabled>Select Starting Point...</option>
                          {HYDERABAD_LOCATIONS.map(loc => <option key={loc} value={loc} disabled={loc === passengerRoutes[index].to}>{loc}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block">Destination (To)</label>
                        <select 
                          value={passengerRoutes[index].to}
                          onChange={e => updateRoute(index, 'to', e.target.value)}
                          className={`w-full bg-white/80 border text-[#1e3a8a] text-sm font-semibold rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-200 focus:outline-none appearance-none cursor-pointer ${passengerRoutes[index].to ? 'border-sky-300' : 'border-transparent'}`}
                        >
                          <option value="" disabled>Select Destination...</option>
                          {HYDERABAD_LOCATIONS.map(loc => <option key={loc} value={loc} disabled={loc === passengerRoutes[index].from}>{loc}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-sky-700/80 italic text-center">* You must completely fill out Route 1 to continue.</p>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-6 flex items-center justify-between gap-4 pt-2 border-t border-white/30">
            {step > 1 ? (
              <button 
                type="button"
                onClick={prevStep}
                disabled={isSubmitting}
                className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/50 border border-white text-[#1e3a8a] hover:bg-white hover:shadow-md transition-all duration-300 shadow-sm disabled:opacity-50 flex-shrink-0"
              >
                <ChevronLeft size={24} />
              </button>
            ) : (
              <div className="w-14 h-14" />
            )}
            
            <button 
              type="button"
              onClick={nextStep}
              disabled={isNextDisabled()}
              className={`flex-grow h-14 rounded-2xl font-bold tracking-wide flex items-center justify-center transition-all duration-300 shadow-md border-b-4 ${
                isNextDisabled()
                  ? 'bg-slate-100/40 text-slate-400 border-slate-200/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#3b82f6] to-[#0ea5e9] text-white border-[#1d4ed8] hover:translate-y-0.5 hover:border-b-2 hover:shadow-sky-500/30'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (step === 4 && accountType === 'Passenger') || (step === 3 && accountType === 'Operator') ? (
                <span className="flex items-center w-full justify-center text-lg">
                  Get Started <MapPin size={18} className="ml-2" />
                </span>
              ) : (
                <span className="flex items-center w-full justify-center text-lg">
                  Continue <ChevronRight size={20} className="ml-1" />
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(135, 206, 235, 0.8); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.8); }
      `}} />
    </div>
  );
}
