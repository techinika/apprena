"use client";

import React, { useState } from "react";
import { MessageSquare, Send, X, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";

interface StepFeedbackProps {
  activityId: string;
  roadmapStepId: string;
  stepTitle: string;
  stepDescription: string;
  currentRoadmap: any;
}

export const StepFeedback = ({
  activityId,
  roadmapStepId,
  stepTitle,
  stepDescription,
  currentRoadmap,
}: StepFeedbackProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSubmit = async () => {
    if (!user || !feedback.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/roadmap-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          activityId,
          roadmapStepId,
          stepTitle,
          stepDescription,
          feedback: feedback.trim(),
          currentRoadmap,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setAnalysis(result.analysis);
        setShowFeedback(true);
        toast.success("Feedback submitted! AI is processing your suggestions.");
        setFeedback("");
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Feedback error:", error);
      toast.error(error.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-500 transition-colors"
        title="Add feedback on this step"
      >
        <MessageSquare size={14} />
        <span>Feedback</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 z-30 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <span className="text-xs font-black text-slate-400 uppercase">Feedback</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-4">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What would you improve about this step?"
              className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              rows={3}
              autoFocus
            />
            <p className="text-[10px] text-slate-400 mt-2">
              AI will review your feedback and update the roadmap if needed
            </p>
          </div>

          <div className="p-4 pt-0">
            <button
              onClick={handleSubmit}
              disabled={submitting || !feedback.trim()}
              className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-amber-600 disabled:opacity-50 transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit Feedback
                </>
              )}
            </button>
          </div>

          {showFeedback && analysis && (
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2 mb-2">
                {analysis.needsModification ? (
                  <>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-xs font-bold text-emerald-600">Changes Applied</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    <span className="text-xs font-bold text-amber-600">Feedback Received</span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-600">{analysis.reason}</p>
              {analysis.suggestions?.length > 0 && (
                <div className="mt-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Suggestions</p>
                  <ul className="text-xs text-slate-500 mt-1">
                    {analysis.suggestions.map((s: string, i: number) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};