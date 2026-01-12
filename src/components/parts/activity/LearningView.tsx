"use client";

import { useEffect, useState } from "react";
import { LearningSectionProps } from "@/types/activity";
import {
  ArrowRight,
  ExternalLink,
  BookmarkPlus,
  Loader2,
  Check,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { db } from "@/db/firebase";

export const LearningSection = ({
  learningGaps,
  curriculum,
  activityId,
  title,
  goal,
}: LearningSectionProps & { activityId?: string; title?: string }) => {
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [existingPlanId, setExistingPlanId] = useState<string | null>(null);

  useEffect(() => {
    const checkExistingPlan = async () => {
      if (!user || !activityId) return;

      const q = query(
        collection(db, "learningPlans"),
        where("userId", "==", user?.uid),
        where("parentActivityId", "==", activityId),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setIsSaved(true);
        setExistingPlanId(querySnapshot.docs[0].id);
      }
    };

    checkExistingPlan();
  }, [user, activityId]);

  const handleAddToLearning = async () => {
    if (!user) return toast.error("Please login to save plans");
    if (isSaved) return;

    setIsSyncing(true);
    try {
      const modules = curriculum.map((item) => ({
        course: item.course,
        provider: item.provider,
        url: item.url,
        status: "not_started",
        progress: 0,
      }));

      const docRef = await addDoc(collection(db, "learningPlans"), {
        userId: user.uid,
        parentActivityId: activityId,
        title: title || "New Learning Path",
        modules: modules,
        isActive: true,
        target: goal,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        overallProgress: 0,
      });

      setIsSaved(true);
      setExistingPlanId(docRef.id);
      toast.success("Added to your Learning Hub!");
    } catch (error) {
      console.error("Error saving learning plan:", error);
      toast.error("Failed to save plan.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Technical Gaps Card */}
        <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-amber-600 rounded-full" /> Technical Gaps
          </h3>
          <ul className="space-y-6">
            {learningGaps?.technical?.map((item, index) => (
              <li key={index + 1}>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-slate-700">{item.skill}</span>
                  <span
                    className={
                      item.priority === "High"
                        ? "text-amber-600"
                        : "text-slate-400"
                    }
                  >
                    {item.priority} Priority
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-full transition-all duration-1000"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-amber-600 rounded-full" /> Mindset & Soft
            Skills
          </h3>
          <ul className="space-y-4">
            {learningGaps?.soft?.map((skill, index) => (
              <li
                key={index + 1}
                className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl text-amber-700 text-sm font-bold border border-amber-100/50"
              >
                <ArrowRight size={16} className="text-amber-400" /> {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
          <div>
            <h3 className="text-2xl font-black mb-2">Recommended Curriculum</h3>
            <p className="text-slate-400 text-sm">
              Step-by-step tracks to bridge your identified gaps.
            </p>
          </div>

          {isSaved ? (
            <Link
              href={`/learning/${existingPlanId}`}
              className="flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-sm bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/20 transition-all"
            >
              <Check size={18} />
              Tracking Progress <ArrowUpRight size={18} />
            </Link>
          ) : (
            <button
              onClick={handleAddToLearning}
              disabled={isSyncing}
              className="flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-sm bg-amber-500 text-slate-900 hover:bg-amber-400 active:scale-95 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              {isSyncing ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <BookmarkPlus size={18} />
              )}
              Add to My Learning
            </button>
          )}
        </div>

        <div className="grid gap-4 relative z-10">
          {curriculum?.map((item, index) => (
            <Link
              key={index + 1}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 p-5 rounded-2xl flex items-center justify-between border border-white/10 hover:bg-white/15 transition-all group"
            >
              <div>
                <p className="font-bold text-lg group-hover:text-amber-400 transition-colors">
                  {item.course}
                </p>
                <p className="text-sm opacity-60">{item.provider}</p>
              </div>
              <ExternalLink
                size={20}
                className="opacity-40 group-hover:opacity-100 transition-opacity"
              />
            </Link>
          ))}
        </div>

        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
      </div>
    </div>
  );
};
