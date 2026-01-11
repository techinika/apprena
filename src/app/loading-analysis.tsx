import React, { useState, useEffect } from "react";
import { Zap, Sparkles, Cpu, Globe, Search } from "lucide-react";

const LoadingAnalysis = () => {
  const [step, setStep] = useState(0);

  const loadingSteps = [
    {
      icon: <Search size={18} />,
      text: "Scanning certificates and documents...",
    },
    {
      icon: <Cpu size={18} />,
      text: "Analyzing skill gaps and market trends...",
    },
    {
      icon: <Globe size={18} />,
      text: "Mapping social capital and expert tribes...",
    },
    {
      icon: <Sparkles size={18} />,
      text: "Finalizing your 10-year achievement path...",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % loadingSteps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      {/* 1. CENTRAL ANIMATED LOGO */}
      <div className="relative mb-12">
        {/* Pulsing Aura */}
        <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-3xl animate-pulse scale-150" />

        {/* Rotating Ring */}
        <div className="absolute -inset-4 border-2 border-dashed border-amber-200 rounded-full animate-spin-slow" />

        <div className="relative bg-amber-600 p-8 rounded-[2rem] shadow-2xl shadow-amber-200">
          <Zap className="text-white fill-white animate-bounce" size={48} />
        </div>
      </div>

      {/* 2. PROGRESS TEXT */}
      <div className="text-center max-w-sm w-full">
        <h2 className="text-2xl font-black text-slate-900 mb-2 italic">
          Building your roadmap...
        </h2>

        {/* Dynamic Step Text */}
        <div
          className="h-8 flex items-center justify-center gap-2 text-amber-600 font-bold text-sm animate-in fade-in slide-in-from-bottom-2 duration-500"
          key={step}
        >
          {loadingSteps[step].icon}
          {loadingSteps[step].text}
        </div>

        {/* 3. PROGRESS BAR */}
        <div className="mt-8 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-600 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(79,70,229,0.5)]"
            style={{ width: `${((step + 1) / loadingSteps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-20 w-full max-w-4xl opacity-20 pointer-events-none filter blur-[2px]">
        <div className="grid grid-cols-3 gap-6">
          <div className="h-40 bg-slate-200 rounded-3xl animate-pulse" />
          <div className="h-40 bg-slate-200 rounded-3xl animate-pulse" />
          <div className="h-40 bg-slate-200 rounded-3xl animate-pulse" />
        </div>
        <div className="mt-6 h-64 bg-slate-100 rounded-[2.5rem] animate-pulse w-full" />
      </div>
    </div>
  );
};

export default LoadingAnalysis;
