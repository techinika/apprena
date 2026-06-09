"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Check, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { PRICING_TIERS, BILLING_CYCLE } from "@/types/pricing";

export const Pricing = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(BILLING_CYCLE.MONTHLY);

  const individualTiers = PRICING_TIERS.filter(t => t.type === "individual");

  return (
    <section id="pricing" className="py-32 px-8 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
          Simple, Fair Pricing
        </h2>
        <p className="text-slate-500 text-xl font-medium">
          Invest in a roadmap, not a guess.
        </p>
        
        <div className="flex items-center justify-center gap-4 mt-8">
          <span className={`font-bold ${billingCycle === "monthly" ? "text-slate-900" : "text-slate-400"}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(prev => prev === "monthly" ? "annual" : "monthly")}
            className="relative w-16 h-8 bg-slate-200 rounded-full p-1 transition-colors"
          >
            <div className={`w-6 h-6 bg-amber-500 rounded-full transition-transform ${billingCycle === "annual" ? "translate-x-8" : "translate-x-0"}`} />
          </button>
          <span className={`font-bold ${billingCycle === "annual" ? "text-slate-900" : "text-slate-400"}`}>
            Annual
          </span>
          {billingCycle === "annual" && (
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full ml-2">
              Save 17%
            </span>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {individualTiers.map((tier) => {
          const price = billingCycle === "annual" ? tier.annualPrice : tier.monthlyPrice;
          const isPopular = tier.id === "architect";
          
          return (
            <div 
              key={tier.id}
              className={`p-10 rounded-[3rem] flex flex-col relative ${
                isPopular 
                  ? "bg-white border-2 border-amber-600 shadow-2xl scale-105 z-10" 
                  : tier.id === "free"
                    ? "bg-slate-50 border border-slate-200"
                    : "bg-slate-900 text-white"
              }`}
            >
              {isPopular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-600 text-white px-6 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase">
                  Recommended
                </div>
              )}
              
              <h3 className={`text-xl font-black mb-2 uppercase tracking-widest ${isPopular ? "text-amber-600" : tier.id === "free" ? "text-slate-400" : "text-slate-500"}`}>
                {tier.name}
              </h3>
              
              <div className="text-5xl font-black mb-8">
                {price === 0 ? "Free" : `${price.toLocaleString()} RWF`}
                {price > 0 && (
                  <span className="text-sm font-normal opacity-60">
                    {billingCycle === "annual" ? "/year" : tier.id === "sprint" ? "/analysis" : "/mo"}
                  </span>
                )}
              </div>
              
              <ul className="space-y-4 mb-10 flex-grow">
                {tier.features.map((item) => (
                  <li
                    key={item}
                    className={`flex items-center gap-3 text-sm font-bold ${isPopular ? "text-slate-700" : tier.id === "free" ? "text-slate-600" : "text-slate-300"}`}
                  >
                    <Check className={isPopular ? "text-amber-600" : "text-emerald-500"} size={18} strokeWidth={3} />
                    {item}
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => router.push(user ? "/upgrade" : "/login")}
                className={`w-full py-4 rounded-2xl font-black border-2 transition-all uppercase text-xs tracking-widest ${
                  isPopular
                    ? "bg-amber-600 text-white hover:bg-amber-700 border-amber-600 shadow-xl shadow-amber-200"
                    : tier.id === "free"
                      ? "border-slate-200 hover:bg-white"
                      : "bg-white text-slate-900 hover:bg-amber-50"
                }`}>
                  {tier.id === "free" ? "Start Free" : "Get Started"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};