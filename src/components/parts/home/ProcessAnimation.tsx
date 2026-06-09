"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle2,
  ArrowRight,
  Zap,
  Layout,
  Cpu,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

const MOCK_STEPS = [
  { id: 1, title: "Analyzing Skill Gap", provider: "AI Engine" },
  { id: 2, title: "Curating Top Resources", provider: "Udemy & Coursera" },
  { id: 3, title: "Sequencing Career Milestones", provider: "Market Trends" },
];

const TYPED_TEXTS = [
  "Become a Senior AI Engineer",
  "Master Full-Stack SaaS Development",
  "Path to Product Management",
];

export const ProcessAnimation = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [phase, setPhase] = useState<"typing" | "analyzing" | "complete">(
    "typing"
  );
  const [textIndex, setTextIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (phase === "typing") {
      const textTimer = setInterval(() => {
        setTextIndex((prev) => (prev + 1) % TYPED_TEXTS.length);
      }, 3000);
      const phaseTimer = setTimeout(() => {
        clearInterval(textTimer);
        setPhase("analyzing");
      }, 10000);
      return () => {
        clearInterval(textTimer);
        clearTimeout(phaseTimer);
      };
    }
    if (phase === "analyzing") {
      const timer = setTimeout(() => setPhase("complete"), 3000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleCTA = () => {
    if (user) {
      router.push("/workspace/create");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="relative -mt-40 z-20 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-slate-100 p-8 md:p-16 min-h-125 flex flex-col justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {phase === "typing" && (
            <motion.div
              key="typing"
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: reducedMotion ? 0 : 0.3 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <span className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                  Live AI Engine
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                  What is your{" "}
                  <span className="text-amber-600">North Star?</span>
                </h2>
              </div>

              <div className="relative max-w-2xl mx-auto">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={24} />
                </div>
                <div className="w-full bg-slate-50 border-2 border-slate-100 rounded-4xl px-16 py-8 text-2xl font-bold text-slate-800 shadow-inner overflow-hidden flex items-center">
                  {!reducedMotion && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="inline-block w-1 h-8 bg-amber-500 mr-1"
                    />
                  )}
                  {reducedMotion && (
                    <span className="inline-block w-1 h-8 bg-amber-500 mr-1" />
                  )}
                  {TYPED_TEXTS[textIndex]}
                </div>
              </div>
            </motion.div>
          )}

          {phase === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: reducedMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: reducedMotion ? 1 : 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.3 }}
              className="flex flex-col items-center justify-center space-y-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-amber-400 rounded-full blur-3xl"
                />
                <div className="relative bg-white p-10 rounded-full border border-slate-100 shadow-xl">
                  <Cpu size={64} className="text-amber-600 animate-spin-slow" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-black text-slate-900">
                  Calculating Career Trajectory...
                </h3>
                <p className="text-slate-500 font-medium">
                  Matching your goals with 50,000+ data points.
                </p>
              </div>
            </motion.div>
          )}

          {/* Phase 3: Result Reveal */}
          {phase === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: reducedMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reducedMotion ? 0 : 0.3 }}
              className="space-y-10"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-3xl font-black text-slate-900">
                    Roadmap Ready.
                  </h3>
                  <p className="text-slate-500 font-medium">
                    We found the 3-step sequence to your goal.
                  </p>
                </div>
                <button
                  onClick={handleCTA}
                  className="bg-amber-600 text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center gap-3 hover:bg-slate-900 transition-all shadow-xl shadow-amber-200"
                >
                  Generate Yours <ArrowRight size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MOCK_STEPS.map((step, i) => (
                  <motion.div
                    key={step.id}
                    initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reducedMotion ? 0 : i * 0.2, duration: reducedMotion ? 0 : 0.3 }}
                    className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col gap-4 relative overflow-hidden group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                        <CheckCircle2 size={24} />
                      </div>
                      <span className="text-[10px] font-black text-slate-300 uppercase">
                        Step 0{step.id}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-600 mb-1">
                        {step.provider}
                      </p>
                      <h4 className="font-bold text-slate-900 leading-tight">
                        {step.title}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 pt-8 border-t border-slate-50 flex flex-wrap justify-center gap-8 opacity-40 grayscale">
          <div className="flex items-center gap-2 font-black text-slate-400 uppercase tracking-tighter text-sm">
            <Zap size={18} /> Instant Results
          </div>
          <div className="flex items-center gap-2 font-black text-slate-400 uppercase tracking-tighter text-sm">
            <Layout size={18} /> Personalized Paths
          </div>
          <div className="flex items-center gap-2 font-black text-slate-400 uppercase tracking-tighter text-sm">
            <ShieldCheck size={18} /> High Confidence
          </div>
        </div>
      </div>
    </div>
  );
};
