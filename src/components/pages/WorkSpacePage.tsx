/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Clock,
  ArrowUpRight,
  Lock,
  CreditCard,
  AlertCircle,
  TrendingUp,
  X,
  Zap,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import { getUserActivities } from "@/db/operations/GetActivities";
import { Activity } from "@/types/activity";
import Loading from "@/app/loading";
import { useSearchParams } from "next/navigation";
import PaymentSuccessOverlay from "../parts/workspace/PaymentOverlay";

const CreateActivityModal = ({ isOpen, onClose, onSubmit }: any) => {
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
        >
          <X size={24} />
        </button>

        <div className="mb-8">
          <div className="bg-amber-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
            <Zap className="text-amber-600 fill-amber-600" size={24} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">New Roadmap</h2>
          <p className="text-slate-500 text-sm">
            Define your next 10-year ascent.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ title, goal });
          }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">
              Roadmap Name
            </label>
            <input
              required
              placeholder="e.g. Fintech Founder Path"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-amber-500 outline-none font-bold"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">
              The North Star Goal
            </label>
            <input
              required
              placeholder="e.g. CTO at a Tier-1 Startup"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-amber-500 outline-none font-bold"
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>

          <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-amber-600 transition-all">
            Generate Intelligence <ChevronRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

const Workspace = () => {
  const { user, profile } = useAuth();
  const searchParams = useSearchParams();
  const payment = searchParams.get("payment");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalCredits =
    (profile?.baseCredits ?? 0) + (profile?.purchasedCredits ?? 0);
  const isLimitReached =
    profile?.accountType === "free" && profile?.totalUsed >= 2;

  useEffect(() => {
    if (user) {
      getUserActivities(user.uid).then((data) => {
        setActivities(data);
        setLoading(false);
      });
    }
  }, [user]);

  const handleCreateActivity = async (data: never) => {
    console.log("Creating new roadmap with data:", data);

    setIsModalOpen(false);
  };

  if (loading) return <Loading />;

  if (payment && payment === "success") return <PaymentSuccessOverlay />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <CreateActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateActivity}
      />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="mb-10">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="bg-amber-50 p-4 rounded-2xl">
                <TrendingUp className="text-amber-600" size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900">
                  Welcome back, {user?.displayName?.split(" ")[0]}!
                </h1>
                <p className="text-slate-500 text-sm">
                  You’ve explored {profile?.totalUsed} potential career paths.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8 bg-slate-50 px-6 py-4 flex-wrap rounded-2xl border border-slate-100">
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <span>Usage</span>
                  <span className={isLimitReached ? "text-orange-500" : ""}>
                    {profile?.totalUsed}/{totalCredits}
                  </span>
                </div>
                <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      isLimitReached ? "bg-orange-500" : "bg-amber-600"
                    }`}
                    style={{
                      width: `${Math.min(
                        (profile?.totalUsed ?? 0 / totalCredits) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
              <Link href="/upgrade">
                <button className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-lg shadow-amber-100 flex items-center gap-2 transition-all">
                  <CreditCard size={16} /> Upgrade
                </button>
              </Link>
            </div>
          </div>
        </section>

        {isLimitReached && (
          <div className="mb-8 bg-orange-50 border border-orange-100 p-5 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-orange-500 p-2 rounded-lg text-white">
              <AlertCircle size={20} />
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-orange-900">Trial Limit Reached</h3>
              <p className="text-orange-700 text-sm">
                You have used your 2 free analyses. Upgrade to continue.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => !isLimitReached && setIsModalOpen(true)}
            className={`group relative flex flex-col items-center justify-center h-[280px] rounded-[2rem] border-2 border-dashed transition-all
              ${
                isLimitReached
                  ? "bg-slate-50 border-slate-200 cursor-not-allowed opacity-60"
                  : "bg-white border-slate-200 hover:border-amber-500 hover:bg-amber-50/30 active:scale-[0.98]"
              }`}
          >
            {isLimitReached && (
              <div className="absolute top-4 right-4 text-slate-400">
                <Lock size={16} />
              </div>
            )}
            <div
              className={`p-5 rounded-2xl mb-4 transition-all ${
                isLimitReached
                  ? "bg-slate-200 text-slate-400"
                  : "bg-amber-50 text-amber-600 group-hover:scale-110"
              }`}
            >
              <Plus size={32} strokeWidth={3} />
            </div>
            <span
              className={`font-bold text-lg ${
                isLimitReached ? "text-slate-400" : "text-slate-900"
              }`}
            >
              Create New Activity
            </span>
          </button>

          {activities.map((activity) => (
            <div
              key={activity.id}
              className="group bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 group-hover:text-amber-600 transition-colors">
                    <Clock size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-50 px-3 py-1 rounded-full">
                    {activity.status || "Active"}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                  {activity.title}
                </h3>
                <p className="text-slate-400 text-sm">
                  Created on {new Date(activity.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Link
                href={`/workspace/${activity.id}`}
                className="mt-8 w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-amber-600 transition-all"
              >
                Open Activity <ArrowUpRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Workspace;
