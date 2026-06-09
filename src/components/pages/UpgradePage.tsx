"use client";

import React, { useState } from "react";
import { Check, Star, Rocket, ShieldCheck, Loader2 } from "lucide-react";
import { createOrGetOrder } from "@/db/operations/HandleOrders";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { PRICING_TIERS, BILLING_CYCLE, getPriceByBilling } from "@/types/pricing";

const UpgradePage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("architect");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(BILLING_CYCLE.MONTHLY);
  const { user } = useAuth();
  const router = useRouter();

  const individualTiers = PRICING_TIERS.filter(t => t.type === "individual");

  const handleCheckout = async () => {
    if (!user) return;

    setLoading(true);
    const tier = individualTiers.find(t => t.id === selectedPlan);
    const amount = tier ? getPriceByBilling(tier.id, billingCycle === BILLING_CYCLE.ANNUAL) : 0;

    try {
      await createOrGetOrder(user.uid, selectedPlan, amount);
      router.push(`/upgrade/checkout`);
    } catch (error) {
      console.error("Order creation failed", error);
      toast.error("Failed to create an order.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Choose Your Growth Speed
          </h1>
          <p className="text-slate-500 text-lg">
            Unlock high-precision AI roadmaps and career strategy.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-12">
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
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
              Save 17%
            </span>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {individualTiers.filter(t => t.id !== "free").map((tier) => {
            const price = billingCycle === "annual" ? tier.annualPrice : tier.monthlyPrice;
            const isSelected = selectedPlan === tier.id;
            
            return (
              <div
                key={tier.id}
                onClick={() => setSelectedPlan(tier.id)}
                className={`relative p-10 rounded-[2.5rem] border-2 transition-all cursor-pointer ${
                  isSelected
                    ? tier.id === "sprint"
                      ? "border-amber-600 shadow-2xl scale-[1.02] bg-white"
                      : "border-amber-500 shadow-2xl scale-[1.02] bg-slate-900 text-white"
                    : tier.id === "sprint"
                      ? "border-slate-100 hover:border-slate-200 bg-white"
                      : "border-transparent bg-slate-900 text-white"
                }`}
              >
                {tier.popular && !isSelected && (
                  <div className="absolute -top-4 right-10 bg-amber-600 text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                    Best Value
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-8">
                  <div className={`p-3 rounded-2xl ${isSelected && tier.id === "architect" ? "bg-white/10 text-amber-400" : "bg-slate-50 text-slate-600"}`}>
                    <Star size={24} fill={isSelected && tier.id === "architect" ? "currentColor" : "none"} />
                  </div>
                  {isSelected && (
                    <div className={`p-1 rounded-full ${tier.id === "architect" ? "bg-amber-500 text-white" : "bg-amber-600 text-white"}`}>
                      <Check size={14} />
                    </div>
                  )}
                </div>
                
                <h3 className="text-2xl font-black mb-2">
                  {tier.name}
                </h3>
                <p className={`text-sm mb-6 leading-relaxed ${isSelected && tier.id === "architect" ? "text-slate-400" : "text-slate-500"}`}>
                  {tier.description}
                </p>
                
                <div className="text-4xl font-black mb-8">
                  {price.toLocaleString()} RWF
                  <span className="text-sm font-normal opacity-60">
                    {billingCycle === "annual" ? "/year" : tier.id === "sprint" ? "/analysis" : "/month"}
                  </span>
                </div>

                <ul className="space-y-4 mb-10">
                  {tier.features.map((item) => (
                    <li
                      key={item}
                      className={`flex items-center gap-3 text-sm font-medium ${isSelected && tier.id === "architect" ? "text-slate-300" : "text-slate-600"}`}
                    >
                      <Check size={16} className={isSelected && tier.id === "architect" ? "text-amber-400" : "text-amber-600"} /> 
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-16 max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" /> Secure Checkout
          </h4>
          
          <div className="flex justify-between text-sm mb-4">
            <span className="text-slate-500">
              Plan: {individualTiers.find(t => t.id === selectedPlan)?.name}
            </span>
            <span className="font-bold text-slate-900">
              {getPriceByBilling(selectedPlan, billingCycle === BILLING_CYCLE.ANNUAL).toLocaleString()} RWF
            </span>
          </div>
          
          <div className="border-t border-slate-50 pt-4 mb-8 flex justify-between items-center">
            <span className="font-bold">Total Due ({billingCycle})</span>
            <span className="text-2xl font-black text-amber-600">
              {getPriceByBilling(selectedPlan, billingCycle === BILLING_CYCLE.ANNUAL).toLocaleString()} RWF
            </span>
          </div>

          <button
            onClick={() => handleCheckout()}
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-100 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Complete Purchase"
            )}
          </button>

          <p className="text-[10px] text-center text-slate-400 mt-4 uppercase tracking-widest font-bold">
            Encrypted
          </p>
        </div>
      </main>
    </div>
  );
};

export default UpgradePage;