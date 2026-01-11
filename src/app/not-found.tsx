"use client";

import React from "react";
import { MoveLeft, Map, Compass, Home } from "lucide-react";
import Link from "next/link";
import { APP } from "@/variables/globals";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      {/* 1. VISUAL ELEMENT */}
      <div className="relative mb-12">
        {/* Decorative soft gradient glow */}
        <div className="absolute inset-0 bg-amber-100 blur-[100px] rounded-full opacity-50 scale-150" />

        <div className="relative">
          {/* Main 404 Text with Gradient */}
          <h1 className="text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-600 to-amber-50/0 select-none">
            404
          </h1>

          {/* Floating Icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100 animate-bounce-slow">
            <Compass className="text-amber-600" size={64} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <div className="max-w-md relative z-10">
        <h2 className="text-3xl font-black text-slate-900 mb-4">
          You have drifted off the roadmap.
        </h2>
        <p className="text-slate-500 mb-10 leading-relaxed font-medium">
          Even the best architects lose their way sometimes. This page does not
          exist, but your dream career still does.
        </p>

        {/* 3. ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/workspace"
            className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-100"
          >
            <Home size={18} /> Go to Workspace
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto bg-white border border-slate-200 text-slate-600 font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
          >
            <MoveLeft size={18} /> Go Back
          </button>
        </div>
      </div>

      <div className="mt-24 flex items-center gap-2 text-slate-300 font-bold uppercase tracking-widest text-[10px]">
        <Map size={14} />
        <span>Lost? Let {APP?.NAME || "PathAI"} guide you back.</span>
      </div>
    </div>
  );
};

export default NotFound;
