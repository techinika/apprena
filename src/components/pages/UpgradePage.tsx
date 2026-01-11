"use client";

import React, { useState } from "react";
import { Check, Star, Rocket, ShieldCheck, Loader2 } from "lucide-react";
import { createOrGetOrder } from "@/db/operations/HandleOrders";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { PLANS } from "@/types/plan";

const UpgradePage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("sprint");
  const { user } = useAuth();
  const router = useRouter();

  const handleCheckout = async () => {
    if (!user) return;

    setLoading(true);
    const amount = selectedPlan === PLANS?.sprint ? 0.99 : 10;

    try {
      await createOrGetOrder(user.uid, selectedPlan, amount);
      router.push(`/upgrade/checkout`);
    } catch (error) {
      console.error("Order creation failed", error);
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

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div
            onClick={() => setSelectedPlan(PLANS?.sprint)}
            className={`relative p-10 rounded-[2.5rem] bg-white border-2 transition-all cursor-pointer ${
              selectedPlan === "sprint"
                ? "border-amber-600 shadow-2xl scale-[1.02]"
                : "border-slate-100 hover:border-slate-200"
            }`}
          >
            <div className="flex justify-between items-start mb-8">
              <div className="bg-slate-50 p-3 rounded-2xl text-slate-600">
                <Rocket size={24} />
              </div>
              {selectedPlan === "sprint" && (
                <div className="bg-amber-600 text-white p-1 rounded-full">
                  <Check size={14} />
                </div>
              )}
            </div>
            <h3 className="text-2xl font-black mb-2 text-slate-900">
              Single Sprint
            </h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Perfect for a quick pivot or a specific career check-in.
            </p>
            <div className="text-4xl font-black text-slate-900 mb-8">
              $0.99
              <span className="text-sm text-slate-400 font-normal">
                /analysis
              </span>
            </div>
            <ul className="space-y-4 mb-10">
              {[
                "Full AI Roadmap",
                "Social Circle Playbook",
                "Habit Strategy",
                "12-Month Projection",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm font-medium text-slate-600"
                >
                  <Check size={16} className="text-amber-600" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            onClick={() => setSelectedPlan(PLANS?.architect)}
            className={`relative p-10 rounded-[2.5rem] bg-slate-900 text-white border-2 transition-all cursor-pointer ${
              selectedPlan === "architect"
                ? "border-amber-500 shadow-2xl scale-[1.02]"
                : "border-transparent"
            }`}
          >
            <div className="absolute -top-4 right-10 bg-amber-600 text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
              Best Value
            </div>
            <div className="flex justify-between items-start mb-8">
              <div className="bg-white/10 p-3 rounded-2xl text-amber-400">
                <Star size={24} fill="currentColor" />
              </div>
              {selectedPlan === "architect" && (
                <div className="bg-amber-500 text-white p-1 rounded-full">
                  <Check size={14} />
                </div>
              )}
            </div>
            <h3 className="text-2xl font-black mb-2">The Architect</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              For students and pros actively building their future.
            </p>
            <div className="text-4xl font-black mb-8">
              $10
              <span className="text-sm text-slate-500 font-normal">
                {" "}
                /month
              </span>
            </div>

            <ul className="space-y-4 mb-10">
              {[
                "Unlimited Analyses",
                "Dynamic Roadmap Tracking",
                "Monthly Market Updates",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm font-medium text-slate-300"
                >
                  <Check size={16} className="text-amber-400" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3. CHECKOUT SUMMARY */}
        <div className="mt-16 max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" /> Secure Checkout
          </h4>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-slate-500">
              Plan:{" "}
              {selectedPlan === "sprint"
                ? "Single Sprint"
                : "Architect Subscription"}
            </span>
            <span className="font-bold text-slate-900">
              {selectedPlan === "sprint" ? "$0.99" : "$10.00"}
            </span>
          </div>
          <div className="border-t border-slate-50 pt-4 mb-8 flex justify-between items-center">
            <span className="font-bold">Total Due</span>
            <span className="text-2xl font-black text-amber-600">
              {selectedPlan === "sprint" ? "$0.99" : "$10.00"}
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
