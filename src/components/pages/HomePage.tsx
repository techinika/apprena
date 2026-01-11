"use client";

import React from "react";
import { Zap } from "lucide-react";
import { APP } from "@/variables/globals";
import MainNav from "../parts/MainNav";
import { AssessmentForm } from "../parts/home/AssessmentForm";
import Link from "next/link";
import { Pricing } from "../parts/home/Pricing";
import { Features } from "../parts/home/Features";
import { Hero } from "../parts/home/Hero";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white selection:bg-amber-100">
      <div className="bg-slate-900 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950 via-slate-950 to-black pointer-events-none" />
        <div className="relative z-50 border-b border-white/5">
          <MainNav />
        </div>
        <Hero />
      </div>

      <AssessmentForm />

      <main>
        <Features />

        <div className="bg-slate-50 border-y border-slate-100">
          <Pricing />
        </div>

        <footer className="bg-white py-24 px-8 text-center border-t border-slate-100">
          <div className="text-2xl font-black text-slate-900 mb-8 tracking-tighter flex items-center justify-center gap-2">
            <div className="bg-amber-600 p-1.5 rounded-lg">
              <Zap className="text-white fill-white" size={18} />
            </div>
            {APP?.NAME || "PathAI"}
          </div>
          <div className="flex justify-center gap-10 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-12">
            <Link href="/terms" className="hover:text-amber-600 transition">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-amber-600 transition">
              Privacy
            </Link>
            <Link href="#" className="hover:text-amber-600 transition">
              Contact
            </Link>
          </div>
          <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.4em]">
            {`© 2026. Built for the world's most ambitious architects.`}
          </p>
        </footer>
      </main>
    </div>
  );
}
