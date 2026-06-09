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
  Trash2,
  Loader2,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import { getUserActivities } from "@/db/operations/GetActivities";
import { Activity } from "@/types/activity";
import Loading from "@/app/loading";
import { useRouter, useSearchParams } from "next/navigation";
import PaymentSuccessOverlay from "../parts/workspace/PaymentOverlay";
import { formatDate } from "../../lib/functions";
import SuccessPage from "../parts/workspace/SuccessfulAnalysis";
import { toast } from "sonner";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/db/firebase";
import { ConfirmModal } from "../parts/ConfirmModal";

const Workspace = () => {
  const router = useRouter();

  const { user, profile } = useAuth();
  const searchParams = useSearchParams();
  const payment = searchParams.get("payment");
  const analysis = searchParams.get("analysis");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);

  const handleDeleteRoadmap = async () => {
    if (!deleteConfirm?.id) return;
    setDeletingId(deleteConfirm.id);
    try {
      await deleteDoc(doc(db, "activities", deleteConfirm.id));
      setActivities(prev => prev.filter(a => a.id !== deleteConfirm.id));
      toast.success("Roadmap deleted");
    } catch (error) {
      toast.error("Failed to delete roadmap");
    } finally {
      setDeletingId(null);
      setDeleteConfirm(null);
    }
  };

  const remainingCredits =
    (profile?.baseCredits ?? 0) + (profile?.purchasedCredits ?? 0);
  const totalAllocatedCredits = remainingCredits + (profile?.totalUsed ?? 0);

  const isLimitReached =
    profile?.accountType === "free" && remainingCredits <= 0;

  const usagePercentage =
    totalAllocatedCredits > 0
      ? Math.min(((profile?.totalUsed ?? 0) / totalAllocatedCredits) * 100, 100)
      : 0;

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getUserActivities(user.uid).then((data) => {
      if (!cancelled) {
        setActivities(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [user]);

  if (loading) return <Loading />;
  if (payment === "success") return <PaymentSuccessOverlay />;
  if (analysis === "success") return <SuccessPage />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="mb-10">
          <div className="bg-white border border-slate-200 rounded-4xl p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
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
                  <span>Usage Capacity</span>
                  <span
                    className={
                      isLimitReached ? "text-orange-500" : "text-slate-700"
                    }
                  >
                    {profile?.totalUsed} / {totalAllocatedCredits}
                  </span>
                </div>
                <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${
                      isLimitReached ? "bg-orange-500" : "bg-amber-600"
                    }`}
                    style={{ width: `${usagePercentage}%` }}
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
            <div className="grow">
              <h3 className="font-bold text-orange-900">Credits Depleted</h3>
              <p className="text-orange-700 text-sm">
                You have used all available credits. Upgrade your plan to
                generate more intelligence.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => router.push("/workspace/create")}
            disabled={isLimitReached}
            className={`group relative flex flex-col items-center justify-center py-12 rounded-4xl border-2 border-dashed transition-all
              ${
                isLimitReached
                  ? "bg-slate-50 border-slate-200 cursor-not-allowed opacity-60"
                  : "bg-white border-slate-200 hover:border-amber-500 hover:bg-amber-50/30 active:scale-[0.98]"
              }`}
          >
            {isLimitReached && (
              <div className="absolute top-6 right-6 text-slate-400">
                <Lock size={20} />
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
              Create New Roadmap
            </span>
          </button>

          {activities.map((activity) => (
            <div
              key={activity.id}
              className="group bg-white border border-slate-200 rounded-4xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between relative"
            >
              <button
                onClick={() => setDeleteConfirm({ id: activity.id, title: activity.title })}
                disabled={deletingId === activity.id}
                className="absolute top-4 right-4 p-2 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all z-10"
                title="Delete roadmap"
              >
                {deletingId === activity.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 group-hover:text-amber-600 transition-colors">
                    <Clock size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-50 px-3 py-1 rounded-full">
                    {activity.status || "Claimed"}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                  {activity.title}
                </h3>
                <p className="text-slate-400 text-sm">
                  Created {formatDate(activity?.createdAt)}
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

      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteRoadmap}
        title="Delete Roadmap"
        message={`Are you sure you want to delete "${deleteConfirm?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default Workspace;
