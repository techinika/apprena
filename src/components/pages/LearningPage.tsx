"use client";

import React, { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Trophy,
  Layout,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import { LearningPlan } from "@/types/learning";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/db/firebase";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmModal } from "../parts/ConfirmModal";

interface DeleteConfirmState {
  planId: string;
  planTitle: string;
}

const LearningPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState | null>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "learningPlans"),
      where("userId", "==", user.uid),
      orderBy("lastUpdated", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const plansData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as LearningPlan[];

        setPlans(plansData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching plans:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const activePlans = plans.filter((p) => p.isActive);
  const completedPlans = plans.filter((p) => !p.isActive);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteDoc(doc(db, "learningPlans", deleteConfirm.planId));
      toast.success("Learning plan deleted");
    } catch (error) {
      toast.error("Failed to delete plan");
    }
    setDeleteConfirm(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">
              Learning Hub
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              Track your journey from theory to mastery.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white p-3 rounded-4xl border border-slate-200 shadow-sm px-6">
            <div className="px-4 text-center border-r border-slate-100">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Active
              </p>
              <p className="text-2xl font-black text-amber-600">
                {activePlans.length}
              </p>
            </div>
            <div className="px-4 text-center">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Mastered
              </p>
              <p className="text-2xl font-black text-emerald-600">
                {completedPlans.length}
              </p>
            </div>
          </div>
        </header>

        {activePlans.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {activePlans.map((plan) => (
              <ActivePlanCard
                key={plan.id}
                plan={plan}
                onDelete={() => setDeleteConfirm({ planId: plan.id, planTitle: plan.title })}
              />
            ))}
          </div>
        ) : (
          <EmptyLearningState />
        )}

        {completedPlans.length > 0 && (
          <section className="mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-slate-200 grow" />
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                <Trophy size={16} /> Completed Milestones
              </h3>
              <div className="h-px bg-slate-200 grow" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {completedPlans.map((plan) => (
                <div key={plan.id} className="relative">
                  <button
                    onClick={() => router.push(`/learning/${plan.id}`)}
                    className="w-full text-left bg-white border border-slate-100 p-6 rounded-3xl opacity-70 hover:opacity-100 transition-opacity group"
                  >
                    <CheckCircle2 className="text-emerald-500 mb-3" />
                    <h4 className="font-bold text-slate-900">{plan.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">Goal Achieved</p>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm({ planId: plan.id, planTitle: plan.title });
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all z-10"
                    title="Delete learning plan"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Learning Plan"
        message={`Are you sure you want to delete "${deleteConfirm?.planTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

interface ActivePlanCardProps {
  plan: LearningPlan;
  onDelete: () => void;
}

const ActivePlanCard = ({ plan, onDelete }: ActivePlanCardProps) => {
  const router = useRouter();
  const completedCount =
    plan.modules?.filter((m) => m.status === "completed").length || 0;
  const totalCount = plan.modules?.length || 1;
  const progress = (completedCount / totalCount) * 100;

  return (
    <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative">
      <button
        onClick={onDelete}
        className="absolute top-6 right-6 p-3 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all"
        title="Delete learning plan"
      >
        <Trash2 size={18} />
      </button>
      <div className="flex justify-between items-start mb-8">
        <div className="bg-amber-50 p-4 rounded-2xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-500">
          <BookOpen size={32} />
        </div>
        <div className="flex flex-col items-end">
          <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest mb-2">
            In Progress
          </span>
          <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase">
            <Clock size={12} /> Last session: Recent
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
        {plan.title}
      </h2>
      <p className="text-slate-500 text-sm mb-10 line-clamp-2 leading-relaxed">
        Target: {plan.target ?? "Mastery"}
      </p>

      <div className="space-y-4 mb-10">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
              Course Velocity
            </p>
            <p className="text-sm font-bold text-slate-700">
              {completedCount} of {totalCount} Modules Finished
            </p>
          </div>
          <span className="text-3xl font-black text-amber-600 italic">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-1">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Link
        href={`/learning/${plan.id}`}
        className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black flex items-center justify-center gap-3 hover:bg-amber-600 transition-all group shadow-xl shadow-slate-900/10"
      >
        Continue Learning
        <ArrowRight
          size={20}
          className="group-hover:translate-x-2 transition-transform"
        />
      </Link>
    </div>
  );
};

const EmptyLearningState = () => (
  <div className="text-center py-32 bg-white border-2 border-dashed border-slate-200 rounded-[4rem]">
    <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
      <Layout className="text-slate-300" size={48} />
    </div>
    <h2 className="text-3xl font-black text-slate-900 mb-4">
      Your Learning Hub is Empty
    </h2>
    <p className="text-slate-500 mb-10 max-w-md mx-auto text-lg">
      To start tracking, visit a Roadmap in your workspace and click "Follow
      Plan" on the curriculum section.
    </p>
    <Link
      href="/workspace"
      className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-4xl font-black text-lg hover:bg-amber-600 hover:-translate-y-1 transition-all shadow-2xl shadow-slate-900/20"
    >
      Explore Roadmaps <ArrowRight size={20} />
    </Link>
  </div>
);

export default LearningPage;