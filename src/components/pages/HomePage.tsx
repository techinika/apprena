"use client";

import React from "react";
import {
  ChevronRight,
  Upload,
  Users,
  Target,
  Zap,
  Check,
  Star,
  Sparkles,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { APP } from "@/variables/globals";

const Navbar = () => (
  <nav className="flex justify-between items-center py-6 px-8 max-w-7xl mx-auto w-full text-white">
    <div className="text-2xl font-bold flex items-center gap-2">
      <div className="bg-white p-1 rounded-lg">
        <Zap className="text-blue-600 fill-blue-600" size={20} />
      </div>
      <span>{APP?.NAME || "PathAI"}</span>
    </div>
    <div className="space-x-8 font-medium hidden md:flex opacity-90">
      <a
        href="#how-it-works"
        className="hover:underline underline-offset-4 decoration-2"
      >
        How it Works
      </a>
      <a
        href="#pricing"
        className="hover:underline underline-offset-4 decoration-2"
      >
        Pricing
      </a>
    </div>
    <button className="bg-blue-500/20 border border-white/30 backdrop-blur-md text-white px-6 py-2 rounded-full font-medium hover:bg-white hover:text-blue-600 transition-all">
      Login
    </button>
  </nav>
);

const Hero = () => (
  <div className="text-center pt-16 pb-32 px-4 relative overflow-hidden">
    <Sparkles
      className="absolute top-10 left-1/4 text-blue-300 opacity-20 animate-pulse"
      size={48}
    />
    <Globe
      className="absolute bottom-20 right-1/4 text-blue-200 opacity-10 animate-spin-slow"
      size={120}
    />

    <div className="relative z-10">
      <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-white">
        Stop Wandering. <br />
        <span className="text-blue-200">Build Your Roadmap.</span>
      </h1>
      <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 opacity-90 leading-relaxed">
        The AI-powered architect that turns your skills and documents into a
        step-by-step execution plan for your dream career.
      </p>
    </div>
  </div>
);

const AssessmentForm = () => {
  return (
    <div className="relative -mt-40 z-20 px-4 ">
      <div className="max-w-4xl mx-auto border-gray-200 bg-gray-50 p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Current Status
            </label>
            <input
              type="text"
              placeholder="e.g. 3rd Year CS Student"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-900"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              The North Star (Goal)
            </label>
            <input
              type="text"
              placeholder="e.g. Fintech Founder"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-900"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Social Ecosystem
            </label>
            <input
              type="text"
              placeholder="Who are you currently surrounded by?"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-900"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Ambition Level
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Steady Growth", "High Impact", "Disruptor"].map((level) => (
                <button
                  key={level}
                  className="py-3 px-4 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-gray-600 font-medium"
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group bg-gray-50/50">
              <Upload className="mx-auto mb-3 text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                Drop your Resume or Certifications
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PDF or Word files accepted
              </p>
            </div>
          </div>
        </div>
        <button className="w-full mt-10 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-200 active:scale-[0.98]">
          Generate My Roadmap <ChevronRight size={24} strokeWidth={3} />
        </button>
        <p className="text-center text-gray-400 text-xs mt-6 flex items-center justify-center gap-2">
          <ShieldCheck size={14} /> 2 Free analyses remaining for your IP.
        </p>
      </div>
    </div>
  );
};

const Pricing = () => (
  <section id="pricing" className="py-24 px-8 max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-black text-gray-900 mb-4">
        Simple, Fair Pricing
      </h2>
      <p className="text-gray-500">Invest in your career roadmap today.</p>
    </div>
    <div className="grid md:grid-cols-3 gap-8">
      {/* Free */}
      <div className="p-8 rounded-3xl bg-gray-50 border border-gray-200 flex flex-col">
        <h3 className="text-xl font-bold mb-2">Curious</h3>
        <div className="text-4xl font-black mb-6 text-gray-900">$0</div>
        <ul className="space-y-4 mb-8 flex-grow">
          {["2 Career Analyses", "Basic Roadmaps", "Community Access"].map(
            (item) => (
              <li key={item} className="flex items-center gap-2 text-gray-600">
                <Check className="text-blue-500" size={18} /> {item}
              </li>
            )
          )}
        </ul>
        <button className="w-full py-3 rounded-xl font-bold border-2 border-gray-200 hover:bg-gray-100 transition">
          Get Started
        </button>
      </div>
      <div className="p-8 rounded-3xl bg-white border-2 border-blue-100 shadow-xl relative flex flex-col">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold">
          MOST POPULAR
        </div>
        <h3 className="text-xl font-bold mb-2">Single Sprint</h3>
        <div className="text-4xl font-black mb-6 text-gray-900">
          $0.99<span className="text-sm text-gray-400 font-normal">/test</span>
        </div>
        <ul className="space-y-4 mb-8 flex-grow">
          {[
            "Detailed Strategy",
            "Social Connection Playbook",
            "PDF Export",
            "One-time Payment",
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-gray-600 font-medium"
            >
              <Check className="text-blue-500" size={18} strokeWidth={3} />{" "}
              {item}
            </li>
          ))}
        </ul>
        <button className="w-full py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg shadow-blue-100">
          Unlock Analysis
        </button>
      </div>
      <div className="p-8 rounded-3xl bg-gray-900 text-white flex flex-col">
        <h3 className="text-xl font-bold mb-2">Architect</h3>
        <div className="text-4xl font-black mb-6">
          $10<span className="text-sm text-gray-400 font-normal">/mo</span>
        </div>
        <ul className="space-y-4 mb-8 flex-grow">
          {[
            "Unlimited Analyses",
            "Living Roadmap Tracker",
            "Monthly Market Updates",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 opacity-90">
              <Star className="text-yellow-400 fill-yellow-400" size={18} />{" "}
              {item}
            </li>
          ))}
        </ul>
        <button className="w-full py-3 rounded-xl font-bold bg-white text-gray-900 hover:bg-gray-100 transition">
          Subscribe Now
        </button>
      </div>
    </div>
  </section>
);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-100">
      <div className="bg-blue-600 bg-gradient-to-br from-blue-700 via-blue-600 to-purple-600 pb-20">
        <Navbar />
        <Hero />
      </div>
      <AssessmentForm />

      <main className="bg-white -m-10">
        <div className="max-w-6xl mx-auto py-24 px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="group">
              <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                <Target className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Gap Analysis
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Precisely identify the skills standing between you and your
                $100k+ goal.
              </p>
            </div>
            <div className="group">
              <div className="bg-purple-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                <Users className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Social Playbook
              </h3>
              <p className="text-gray-500 leading-relaxed">
                No more generic networking. Get a list of the exact tribes you
                need to join.
              </p>
            </div>
            <div className="group">
              <div className="bg-pink-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                <Zap className="text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Dynamic Updates
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Market trends change. Your roadmap adapts to keep you relevant
                in 2026.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 border border-gray-300">
          <Pricing />
        </div>

        <footer className="bg-gray-50 border-t border-gray-100 py-16 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 {APP?.NAME || "Apprena"}. Built for the ambitious.
          </p>
        </footer>
      </main>
    </div>
  );
}
