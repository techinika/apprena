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
  Sparkles,
  Wand2,
  Plus,
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
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { db } from "@/db/firebase";
import { useRouter } from "next/navigation";
import { SectionFeedback } from "./SectionFeedback";

export const LearningSection = ({
  learningGaps,
  curriculum,
  activityId,
  title,
  goal,
  userInput,
}: LearningSectionProps & { activityId?: string; title?: string; userInput?: any }) => {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingGaps, setIsGeneratingGaps] = useState(false);
  const [isGeneratingCurriculum, setIsGeneratingCurriculum] = useState(false);
  const [existingPlanId, setExistingPlanId] = useState<string | null>(null);
  const [generatedPlanId, setGeneratedPlanId] = useState<string | null>(null);

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
        const data = querySnapshot.docs[0].data();
        if (data.isGenerated) {
          setGeneratedPlanId(querySnapshot.docs[0].id);
        }
      }
    };

    checkExistingPlan();
  }, [user, activityId]);

  const handleAddToLearning = async () => {
    if (!user) return toast.error("Please login to save plans");
    if (isSaved) return;

    setIsSyncing(true);
    try {
      const modules = curriculum.map((item, idx) => ({
        id: `module-${Date.now()}-${idx}`,
        course: item.course,
        provider: item.provider,
        url: item.url,
        status: "not_started" as const,
      }));

      const docRef = await addDoc(collection(db, "learningPlans"), {
        userId: user.uid,
        parentActivityId: activityId,
        parentRoadmapId: activityId,
        title: title || "New Learning Path",
        modules: modules,
        isActive: true,
        target: goal,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
      });

      if (activityId) {
        const activityRef = doc(db, "activities", activityId);
        const activitySnap = await getDoc(activityRef);
        const currentLinks = activitySnap.exists()
          ? activitySnap.data().linkedLearningPlanIds || []
          : [];
        if (!currentLinks.includes(docRef.id)) {
          await updateDoc(activityRef, {
            linkedLearningPlanIds: [...currentLinks, docRef.id],
          });
        }
      }

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

  const handleGenerateCurriculum = async () => {
    if (!user) return toast.error("Please login first");
    
    const remaining = (profile?.baseCredits ?? 0) + (profile?.purchasedCredits ?? 0);
    if (remaining <= 0 && profile?.accountType === "free") {
      toast.error("Insufficient credits. Upgrade to generate custom curriculum.");
      router.push("/upgrade");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-curriculum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          planId: generatedPlanId || undefined,
          activityId: activityId,
          roadmapData: {
            title: title || "",
            goal: goal || userInput?.goal || "",
            skills: userInput?.skills || "",
            blocks: userInput?.blocks || "",
            ecosystem: userInput?.ecosystem || "",
            learningGaps,
          },
          targetSkill: learningGaps?.technical?.[0]?.skill || "Professional Skills",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setGeneratedPlanId(result.planId);
        
        if (activityId) {
          const activityRef = doc(db, "activities", activityId);
          const currentLinks = [];
          const activitySnap = await getDoc(activityRef);
          if (activitySnap.exists()) {
            const data = activitySnap.data();
            if (data.linkedLearningPlanIds) {
              currentLinks.push(...data.linkedLearningPlanIds);
            }
          }
          if (!currentLinks.includes(result.planId)) {
            await updateDoc(activityRef, {
              linkedLearningPlanIds: [...currentLinks, result.planId],
            });
          }
        }
        
        toast.success("Custom curriculum generated!");
        router.push(`/learning/${result.planId}`);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to generate curriculum");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateLearningGaps = async () => {
    if (!activityId) return;
    
    setIsGeneratingGaps(true);
    try {
      const res = await fetch("/api/generate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId, section: "learningGaps" }),
      });
      
      const result = await res.json();
      
      if (res.ok) {
        toast.success("Learning gaps analyzed!");
        window.location.reload();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to analyze learning gaps");
    } finally {
      setIsGeneratingGaps(false);
    }
  };

  const handleGenerateCurriculumDirect = async () => {
    if (!activityId) return;
    
    setIsGeneratingCurriculum(true);
    try {
      const res = await fetch("/api/generate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId, section: "curriculum" }),
      });
      
      const result = await res.json();
      
      if (res.ok) {
        toast.success("Curriculum generated!");
        window.location.reload();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to generate curriculum");
    } finally {
      setIsGeneratingCurriculum(false);
    }
  };

  return (
    <div className="space-y-10">
      {!learningGaps?.technical?.length && !learningGaps?.soft?.length && activityId && (
        <div className="p-8 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500 font-medium mb-4">No learning gaps analyzed yet.</p>
          <button
            onClick={handleGenerateLearningGaps}
            disabled={isGeneratingGaps}
            className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 disabled:opacity-50 mx-auto"
          >
            {isGeneratingGaps ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Analyze Learning Gaps
              </>
            )}
          </button>
        </div>
      )}

      {learningGaps?.technical?.length || learningGaps?.soft?.length ? (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Technical Gaps Card */}
          <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <div className="w-2 h-6 bg-amber-600 rounded-full" /> Technical Gaps
              </h3>
              {activityId && (
                <button
                  onClick={handleGenerateLearningGaps}
                  disabled={isGeneratingGaps}
                  className="p-2 text-slate-400 hover:text-amber-600 disabled:opacity-50"
                  title="Regenerate"
                >
                  {isGeneratingGaps ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                </button>
              )}
            </div>
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
      ) : null}

      {!curriculum?.length && activityId && (
        <div className="p-8 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500 font-medium mb-4">No curriculum generated yet.</p>
          <button
            onClick={handleGenerateCurriculumDirect}
            disabled={isGeneratingCurriculum}
            className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 disabled:opacity-50 mx-auto"
          >
            {isGeneratingCurriculum ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Curriculum
              </>
            )}
          </button>
        </div>
      )}

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
            <div key={index + 1} className="bg-white/10 p-5 rounded-2xl flex items-center justify-between border border-white/10 hover:bg-white/15 transition-all group">
              <div className="flex-1">
                <p className="font-bold text-lg group-hover:text-amber-400 transition-colors">
                  {item.course}
                </p>
                <p className="text-sm opacity-60">{item.provider}</p>
              </div>
              <div className="flex items-center gap-3">
                <SectionFeedback
                  activityId={activityId || ""}
                  sectionType="learning"
                  sectionTitle="Recommended Curriculum"
                  itemId={`course-${index}`}
                  itemTitle={item.course}
                />
                <ExternalLink
                  size={20}
                  className="opacity-40 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
      </div>

      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
            <div>
              <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
                <Wand2 size={28} /> AI-Generated Curriculum
              </h3>
              <p className="text-white/80 text-sm">
                Get a personalized learning path generated just for you based on your goals and roadmap.
              </p>
            </div>
            <button
              onClick={handleGenerateCurriculum}
              disabled={isGenerating}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-sm bg-white text-amber-600 hover:bg-slate-100 active:scale-95 shadow-lg transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  {generatedPlanId ? "Regenerate" : "Generate My Path"}
                </>
              )}
            </button>
          </div>
          {generatedPlanId && (
            <Link
              href={`/learning/${generatedPlanId}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-white/90 hover:text-white underline"
            >
              View your generated curriculum <ArrowUpRight size={16} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
