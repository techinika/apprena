"use client";

import React from "react";
import { Zap } from "lucide-react";
import { APP } from "@/variables/globals";
import MainNav from "../parts/MainNav";
import Link from "next/link";
import { Pricing } from "../parts/home/Pricing";
import { Features } from "../parts/home/Features";
import { Hero } from "../parts/home/Hero";
import { ProcessAnimation } from "../parts/home/ProcessAnimation";
import Footer from "../parts/Footer";
import { FAQSection } from "../parts/home/FAQ";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white selection:bg-amber-100">
      <div className="bg-slate-900 relative">
        <div className="absolute inset-0 bg-linear-to-br from-amber-950 via-slate-950 to-black pointer-events-none" />
        <div className="relative z-50 border-b border-white/5">
          <MainNav />
        </div>
        <Hero />
      </div>

      <ProcessAnimation />

      <main>
        <FAQSection />
        <Features />

        <div className="bg-slate-50 border-y border-slate-100">
          <Pricing />
        </div>
      </main>
      <Footer />
    </div>
  );
}
