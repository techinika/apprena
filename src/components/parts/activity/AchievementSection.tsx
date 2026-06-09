"use client";

import { useState } from "react";
import { AchievementItem } from "@/types/activity";
import { Trophy, Sparkles, Loader2 } from "lucide-react";
import { SectionFeedback } from "./SectionFeedback";
import { toast } from "sonner";

interface AchievementsSectionProps {
  achievements: AchievementItem[] | undefined;
  activityId?: string;
}

export const AchievementsSection = ({
  achievements,
  activityId,
}: AchievementsSectionProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAchievements = async () => {
    if (!activityId) return;
    
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId, section: "achievements" }),
      });
      
      const result = await res.json();
      
      if (res.ok) {
        toast.success("Achievements generated!");
        window.location.reload();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to generate achievements");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!achievements || achievements.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
        <Trophy className="mx-auto text-slate-300 mb-4" size={48} />
        <p className="text-slate-500 font-bold mb-4">
          Visionary milestones will appear here.
        </p>
        {activityId && (
          <button
            onClick={handleGenerateAchievements}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 disabled:opacity-50 mx-auto"
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Achievements
              </>
            )}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-12 py-10">
      {activityId && (
        <div className="flex justify-end">
          <button
            onClick={handleGenerateAchievements}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl font-bold hover:bg-amber-200 disabled:opacity-50 text-sm"
          >
            {isGenerating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
            Regenerate
          </button>
        </div>
      )}
      <div className="relative">
        <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-slate-100" />

        {achievements.map((level, i) => (
          <div
            key={i}
            className={`relative flex flex-col md:flex-row items-start md:items-center justify-between mb-16 last:mb-0 ${
              i % 2 === 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="ml-12 md:ml-0 w-[85%] md:w-[45%] bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-500 group">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-baseline gap-2">
                  <h4 className="text-amber-600 font-black text-3xl">
                    {level.time}
                  </h4>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Horizon
                  </span>
                </div>
                {activityId && (
                  <SectionFeedback
                    activityId={activityId}
                    sectionType="achievements"
                    sectionTitle="Achievements"
                    itemId={`achievement-${i}`}
                    itemTitle={level.title}
                  />
                )}
              </div>

              <h5 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                {level.title}
              </h5>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  &ldquo;{level.achievement}&rdquo;
                </p>
              </div>
            </div>

            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-white border-4 border-amber-600 rounded-full shadow-[0_0_15px_rgba(217,119,6,0.3)] z-10 transition-transform group-hover:scale-150" />

            <div className="hidden md:block w-[45%]" />
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
          End of Strategic Projection
        </p>
      </div>
    </div>
  );
};
