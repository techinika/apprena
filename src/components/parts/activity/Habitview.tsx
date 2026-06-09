"use client";

import { useState } from "react";
import { HabitItem } from "@/types/activity";
import { SectionFeedback } from "./SectionFeedback";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface HabitsSectionProps {
  habits: HabitItem[] | undefined;
  activityId?: string;
}

export const HabitsSection = ({
  habits,
  activityId,
}: HabitsSectionProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateHabits = async () => {
    if (!activityId) return;
    
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId, section: "habits" }),
      });
      
      const result = await res.json();
      
      if (res.ok) {
        toast.success("Habits generated!");
        window.location.reload();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to generate habits");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!habits || habits.length === 0) {
    return (
      <div className="p-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center">
        <p className="text-slate-400 font-medium mb-4">
          No specific habits generated for this path yet.
        </p>
        {activityId && (
          <button
            onClick={handleGenerateHabits}
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
                Generate Habits
              </>
            )}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activityId && (
        <div className="flex justify-end">
          <button
            onClick={handleGenerateHabits}
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
      <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {habits.map((habit, index) => (
          <div
            key={index + 1}
            className="bg-white border border-slate-100 p-8 rounded-3xl hover:border-amber-200 hover:shadow-xl hover:shadow-amber-500/5 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-4xl block group-hover:scale-110 transition-transform duration-300">
                {habit.icon || "✨"}
              </span>
              {activityId && (
                <SectionFeedback
                  activityId={activityId}
                  sectionType="habits"
                  sectionTitle="Action & Habits"
                  itemId={`habit-${index}`}
                  itemTitle={habit.title}
                />
              )}
            </div>
            <h3 className="text-xl font-black mb-2 text-slate-900">
              {habit.title}
            </h3>
            <p className="text-slate-500 leading-relaxed text-sm">{habit.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
