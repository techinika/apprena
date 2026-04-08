"use client";

import React, { useState } from "react";
import { MessageSquare, Send, X, Check, Loader2, Lock } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";

interface SectionFeedbackProps {
  activityId: string;
  sectionType: "learning" | "network" | "habits" | "achievements" | "milestone";
  sectionTitle: string;
  itemId?: string;
  itemTitle?: string;
  isLocked?: boolean;
  onFeedbackProcessed?: () => void;
}

export const SectionFeedback = ({
  activityId,
  sectionType,
  sectionTitle,
  itemId,
  itemTitle,
  isLocked = false,
  onFeedbackProcessed,
}: SectionFeedbackProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleSubmit = async () => {
    if (!user || !feedback.trim() || isLocked) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/section-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          activityId,
          sectionType,
          sectionTitle,
          itemId,
          itemTitle,
          feedback: feedback.trim(),
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setAnalysis(result.analysis);
        toast.success("Feedback submitted!");
        onFeedbackProcessed?.();
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
      {isLocked ? (
        <div className="flex items-center gap-1 text-xs text-slate-300 cursor-not-allowed" title="Cannot provide feedback on completed items">
          <Lock size={14} />
          <span>Completed</span>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-500 transition-colors"
          title="Provide feedback"
        >
          <MessageSquare size={14} />
          <span>Feedback</span>
        </button>
      )}

      {isOpen && !isLocked && (
        <div className="absolute right-0 top-8 z-30 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3 border-b border-slate-100 flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase">Feedback on {sectionTitle}</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          </div>

          <div className="p-3">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={`What would you improve about this ${sectionType}?`}
              className="w-full p-2 bg-slate-50 rounded-xl border border-slate-100 text-xs outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              rows={3}
              autoFocus
            />
          </div>

          <div className="p-3 pt-0">
            <button
              onClick={handleSubmit}
              disabled={submitting || !feedback.trim()}
              className="w-full py-2 bg-amber-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-amber-600 disabled:opacity-50 transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send size={14} />
                  Submit
                </>
              )}
            </button>
          </div>

          {analysis && (
            <div className="p-3 border-t border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2 mb-1">
                {analysis.needsModification ? (
                  <>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-[10px] font-bold text-emerald-600">Changes Applied</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    <span className="text-[10px] font-bold text-amber-600">Feedback Received</span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{analysis.reason}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};