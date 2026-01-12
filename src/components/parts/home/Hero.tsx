import { Sparkles } from "lucide-react";

export const Hero = () => (
  <div className="text-center pt-24 pb-48 px-4 relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent -z-10" />

    <div className="relative z-10">
      <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-amber-200 text-xs font-black tracking-widest uppercase mb-8 backdrop-blur-md">
        <Sparkles size={14} className="text-amber-400" /> AI-Powered Career
        Architecture
      </div>
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-white leading-[0.9]">
        Stop Wandering.
        <br />
        <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 via-white to-amber-100">
          Follow the Map.
        </span>
      </h1>
      <p className="text-amber-100/70 text-lg md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
        The precision engine that turns your skills and background into a
        step-by-step roadmap that guides your learning.
      </p>
    </div>
  </div>
);
