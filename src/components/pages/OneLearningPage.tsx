"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Circle,
  Trophy,
  Clock,
  Lock,
} from "lucide-react";
import {
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { LearningPlan } from "@/types/learning";
import { db } from "@/db/firebase";
import Link from "next/link";
import Loading from "@/app/loading";
import confetti from "canvas-confetti";
import { SuccessModal } from "../parts/learning/SuccessOverlay";

export default function SingleLearningPlan({ id }: { id: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!user || !id) return;

    const unsubscribe = onSnapshot(doc(db, "learningPlans", id), (doc) => {
      if (doc.exists()) {
        setPlan({ id: doc.id, ...doc.data() } as LearningPlan);
      } else {
        toast.error("Plan not found");
        router.push("/learning");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id, user]);

  const triggerFireworks = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const toggleModuleStatus = async (index: number, currentStatus: string) => {
    if (!plan || !id || !user) return;

    const isNextModuleCompleted =
      plan.modules[index + 1]?.status === "completed";
    if (currentStatus === "completed" && isNextModuleCompleted) {
      toast.error("You cannot undo this step while the next one is finished.");
      return;
    }

    const newStatus =
      currentStatus === "completed" ? "not_started" : "completed";
    const updatedModules = [...plan.modules];
    updatedModules[index].status = newStatus;

    const allFinished = updatedModules.every((m) => m.status === "completed");

    try {
      const planRef = doc(db, "learningPlans", id);
      const userRef = doc(db, "profiles", user.uid);

      await updateDoc(planRef, {
        modules: updatedModules,
        lastUpdated: serverTimestamp(),
        isActive: !allFinished,
      });

      if (newStatus === "completed") {
        triggerFireworks();
        toast.success("Step Mastered!");

        if (allFinished) {
          await updateDoc(userRef, {
            badges: arrayUnion({
              id: `badge-${id}`,
              title: plan.title,
              type: "path_completion",
              unlockedAt: new Date().toISOString(),
            }),
          });
          setShowSuccess(true);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update progress");
    }
  };

  if (loading) return <Loading />;
  if (!plan) return null;

  const completedCount = plan.modules.filter(
    (m) => m.status === "completed"
  ).length;
  const progress = (completedCount / plan.modules.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {showSuccess && (
        <SuccessModal
          planTitle={plan.title}
          onClose={() => setShowSuccess(false)}
        />
      )}

      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push("/learning")}
            className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} /> Back to Learning Hub
          </button>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black uppercase text-slate-400">
                Progress
              </p>
              <p className="text-sm font-bold text-slate-900">
                {completedCount} / {plan.modules.length}
              </p>
            </div>
            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-12 px-6">
        <header className="mb-12">
          <div className="flex items-center gap-3 text-amber-600 font-bold text-sm mb-4">
            <Trophy size={18} /> MISSION CRITICAL
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-6 leading-tight">
            {plan.title}
          </h1>
          <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row md:items-center gap-8">
            <div className="grow">
              <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">
                Target Outcome
              </p>
              <p className="text-slate-700 font-medium leading-relaxed">
                {plan.target}
              </p>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-amber-600 shadow-sm">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">
                  Duration
                </p>
                <p className="text-sm font-bold text-slate-900">
                  ~{plan.modules.length * 2} Weeks
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-4">
          <h3 className="text-xl font-black text-slate-900 mb-6">
            Execution Steps
          </h3>
          {plan.modules.map((module, index) => {
            const isLocked =
              module.status === "completed" &&
              plan.modules[index + 1]?.status === "completed";

            return (
              <div
                key={index}
                className={`group flex items-center gap-6 p-6 rounded-[2.5rem] border transition-all ${
                  module.status === "completed"
                    ? "bg-slate-50 border-emerald-200/50 opacity-90"
                    : "bg-white border-slate-200 hover:border-amber-500 shadow-sm"
                }`}
              >
                <button
                  onClick={() => toggleModuleStatus(index, module.status)}
                  className={`shrink-0 transition-transform active:scale-90 ${
                    isLocked
                      ? "text-emerald-300 cursor-not-allowed"
                      : module.status === "completed"
                      ? "text-emerald-500"
                      : "text-slate-200 hover:text-amber-500"
                  }`}
                >
                  {isLocked ? (
                    <Lock size={32} />
                  ) : module.status === "completed" ? (
                    <CheckCircle2 size={32} />
                  ) : (
                    <Circle size={32} strokeWidth={1.5} />
                  )}
                </button>

                <div className="grow">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    Module {index + 1}
                  </p>
                  <h4
                    className={`text-xl font-bold ${
                      module.status === "completed"
                        ? "text-slate-400 line-through"
                        : "text-slate-900"
                    }`}
                  >
                    {module.course}
                  </h4>
                  <p className="text-sm text-slate-500 font-medium">
                    {module.provider}
                  </p>
                </div>

                <Link
                  href={module.url}
                  target="_blank"
                  className={`p-4 rounded-2xl flex items-center gap-2 font-bold transition-all ${
                    module.status === "completed"
                      ? "bg-slate-200 text-slate-500"
                      : "bg-amber-500 text-slate-900 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <span className="hidden md:inline">Go to Course</span>
                  <ExternalLink size={18} />
                </Link>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
