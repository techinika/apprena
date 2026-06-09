"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Circle,
  Trophy,
  Clock,
  Lock,
  BookOpen,
} from "lucide-react";
import {
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { LearningPlan } from "@/types/learning";
import { db } from "@/db/firebase";
import Link from "next/link";
import Loading from "@/app/loading";

import { SuccessModal } from "../parts/learning/SuccessOverlay";
import { Trash2, Sparkles, Loader2 } from "lucide-react";
import { ConfirmModal } from "../parts/ConfirmModal";
import { LearningMilestone } from "@/types/learning";
import { createNotification, NotificationMessages } from "@/lib/notificationUtils";

export default function SingleLearningPlan({ id }: { id: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [badgeData, setBadgeData] = useState<{ id: string; title: string }>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isGeneratingMilestones, setIsGeneratingMilestones] = useState(false);
  const fireworksRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (fireworksRef.current) clearInterval(fireworksRef.current);
    };
  }, []);

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

  const triggerFireworks = async () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const confettiModule = await import("canvas-confetti");
    const confetti = confettiModule.default;
    if (fireworksRef.current) clearInterval(fireworksRef.current);
    fireworksRef.current = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        if (fireworksRef.current) clearInterval(fireworksRef.current);
        fireworksRef.current = null;
        return;
      }

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

  const handleDeletePlan = async () => {
    try {
      await deleteDoc(doc(db, "learningPlans", id));
      toast.success("Learning plan deleted");
      router.push("/learning");
    } catch (error) {
      toast.error("Failed to delete learning plan");
    }
  };

  const handleGenerateMilestones = async () => {
    if (!plan || !id) return;
    setIsGeneratingMilestones(true);

    try {
      const modules = plan.modules || [];
      const totalModules = modules.length;
      
      if (totalModules === 0) {
        toast.error("No modules available to generate milestones");
        setIsGeneratingMilestones(false);
        return;
      }

      const newMilestones: LearningMilestone[] = [];
      
      const completedModules = modules.filter(m => m.status === "completed");
      const remainingModules = modules.filter(m => m.status !== "completed");

      if (completedModules.length > 0) {
        const learningMilestone: LearningMilestone = {
          id: `milestone-${Date.now()}-learning`,
          title: `Complete ${completedModules.length} Learning Modules`,
          description: `You've mastered ${completedModules.length} modules. Keep the momentum going!`,
          type: "learning",
          status: completedModules.length === totalModules ? "completed" : "in_progress",
          moduleIds: completedModules.map(m => m.id),
          completedAt: completedModules.length === totalModules ? new Date().toISOString() : undefined,
        };
        newMilestones.push(learningMilestone);
      }

      if (remainingModules.length > 0) {
        const upcomingMilestone: LearningMilestone = {
          id: `milestone-${Date.now()}-upcoming`,
          title: `Complete ${remainingModules.length} Remaining Modules`,
          description: `${remainingModules.length} more modules to go. You're on track!`,
          type: "learning",
          status: "pending",
          moduleIds: remainingModules.map(m => m.id),
        };
        newMilestones.push(upcomingMilestone);
      }

      const currentMilestoneCount = plan.milestones?.length || 0;
      const targetCompletion = Math.ceil(totalModules / 3);
      
      if (currentMilestoneCount < 3 && completedModules.length >= targetCompletion) {
        const achievementMilestone: LearningMilestone = {
          id: `milestone-${Date.now()}-achievement`,
          title: `${targetCompletion} Modules Milestone`,
          description: `Amazing! You've completed ${targetCompletion} modules. This is a significant achievement!`,
          type: "achievement",
          status: completedModules.length >= targetCompletion ? "completed" : "pending",
          moduleIds: modules.slice(0, targetCompletion).map(m => m.id),
          completedAt: completedModules.length >= targetCompletion ? new Date().toISOString() : undefined,
        };
        newMilestones.push(achievementMilestone);
      }

      if (completedModules.length > 0 && completedModules.length < totalModules) {
        const habitMilestone: LearningMilestone = {
          id: `milestone-${Date.now()}-habit`,
          title: "Build Your Learning Habit",
          description: "Consistent learning is key to success. You're building great habits!",
          type: "habit",
          status: "in_progress",
          moduleIds: completedModules.map(m => m.id),
        };
        newMilestones.push(habitMilestone);
      }

      const existingMilestones = plan.milestones || [];
      const allMilestones = [...existingMilestones, ...newMilestones];

      const planRef = doc(db, "learningPlans", id);
      await updateDoc(planRef, {
        milestones: allMilestones,
        lastUpdated: serverTimestamp(),
      });

      toast.success("Milestones generated!");
    } catch (error) {
      console.error("Error generating milestones:", error);
      toast.error("Failed to generate milestones");
    } finally {
      setIsGeneratingMilestones(false);
    }
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
          await createNotification({
            ...NotificationMessages.courseCompleted(plan.title, 100),
            userId: user.uid,
            link: `/learning/${id}`,
          });
          await createNotification({
            ...NotificationMessages.badgeEarned(plan.title),
            userId: user.uid,
            link: `/profile`,
          });
          setShowSuccess(true);
          setBadgeData({
            title: plan?.title,
            id: `badge-${id}`,
          });
        } else {
          await createNotification({
            ...NotificationMessages.moduleCompleted(plan.modules[index].course),
            userId: user.uid,
            link: `/learning/${id}`,
          });
        }
      }
    } catch (error) {
      console.error(error);
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
          badgeId={badgeData?.id ?? ""}
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
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 size={18} /> Delete
            </button>
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

        <div className="flex justify-end mb-8">
          <button
            onClick={handleGenerateMilestones}
            disabled={isGeneratingMilestones}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-slate-900 rounded-full font-bold hover:bg-slate-900 hover:text-white transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingMilestones ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} /> Generate More Milestones
              </>
            )}
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-black text-slate-900 mb-6">
            Execution Steps
          </h3>
          {plan.modules.map((module, index) => {
            const isModuleCompleted = module.isGenerated && module.content
              ? module.content.every((c: any) => c.completed)
              : module.status === "completed";
            const prevModule = plan.modules[index - 1];
            const prevModuleCompleted = index === 0 || (prevModule?.isGenerated && prevModule?.content
              ? prevModule.content.every((c: any) => c.completed)
              : prevModule?.status === "completed");
            const isLocked = !prevModuleCompleted;

            return (
              <div
                key={index}
                className={`group flex items-center gap-6 p-6 rounded-[2.5rem] border transition-all ${
                  isModuleCompleted
                    ? "bg-slate-50 border-emerald-200/50 opacity-90"
                    : isLocked
                    ? "bg-slate-50 border-slate-100 opacity-60"
                    : "bg-white border-slate-200 hover:border-amber-500 shadow-sm"
                }`}
              >
                <div
                  className={`shrink-0 ${
                    isLocked ? "text-slate-200 cursor-not-allowed" : ""
                  }`}
                >
                  {isLocked ? (
                    <Lock size={32} />
                  ) : isModuleCompleted ? (
                    <CheckCircle2 size={32} className="text-emerald-500" />
                  ) : (
                    <Circle size={32} strokeWidth={1.5} className="text-slate-200 hover:text-amber-500" />
                  )}
                </div>

                <div className="grow">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    Module {index + 1}
                  </p>
                  <h4
                    className={`text-xl font-bold ${
                      isModuleCompleted
                        ? "text-slate-400 line-through"
                        : "text-slate-900"
                    }`}
                  >
                    {module.course}
                  </h4>
                  <p className="text-sm text-slate-500 font-medium">
                    {module.provider}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    {module.isGenerated && (
                      <div className="flex items-center gap-1">
                        <BookOpen size={12} className="text-amber-500" />
                        <span className="text-[10px] font-bold text-amber-500">AI Generated</span>
                      </div>
                    )}
                    {module.content?.some(c => c.grade !== undefined) && (
                      <div className="flex items-center gap-1 text-xs">
                        <span className={`font-bold ${(plan.totalGrade || 0) >= 80 ? "text-emerald-600" : "text-amber-600"}`}>
                          {plan.totalGrade || 0}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {module.isGenerated && module.content ? (
                  <button
                    onClick={() => !isLocked && router.push(`/learning/${id}/course/${index}`)}
                    disabled={isLocked}
                    className={`p-4 rounded-2xl flex items-center gap-2 font-bold transition-all ${
                      isModuleCompleted
                        ? "bg-slate-200 text-slate-500"
                        : isLocked
                        ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                        : "bg-amber-500 text-slate-900 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    {isLocked ? <Lock size={18} /> : isModuleCompleted ? <CheckCircle2 size={18} /> : null}
                    <span className="hidden md:inline">{isModuleCompleted ? "Completed" : isLocked ? "Locked" : "Start Course"}</span>
                    {!isLocked && !isModuleCompleted && <ArrowRight size={18} />}
                  </button>
                ) : (
                  <Link
                    href={module.url}
                    target="_blank"
                    className={`p-4 rounded-2xl flex items-center gap-2 font-bold transition-all ${
                      isModuleCompleted
                        ? "bg-slate-200 text-slate-500"
                        : "bg-amber-500 text-slate-900 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <span className="hidden md:inline">Go to Course</span>
                    <ExternalLink size={18} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeletePlan}
        title="Delete Learning Plan"
        message="Are you sure you want to delete this learning plan? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
