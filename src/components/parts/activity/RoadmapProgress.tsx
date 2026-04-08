"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Camera,
  FileText,
  Image as ImageIcon,
  Loader2,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { Milestone, Evidence, AIFeedback } from "@/types/activity";
import { SectionFeedback } from "./SectionFeedback";

interface RoadmapProgressProps {
  activityId: string;
  milestones: Milestone[];
  roadmapTitle: string;
  roadmapGoal: string;
  onMilestoneUpdate?: () => void;
}

export const RoadmapProgress = ({
  activityId,
  milestones,
  roadmapTitle,
  roadmapGoal,
  onMilestoneUpdate,
}: RoadmapProgressProps) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [description, setDescription] = useState("");
  const [reviewing, setReviewing] = useState(false);

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case "learning": return "📚";
      case "network": return "👥";
      case "habit": return "⚡";
      case "achievement": return "🏆";
      default: return "📋";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-500";
      case "in_progress": return "bg-amber-500";
      case "needs_revision": return "bg-red-500";
      default: return "bg-slate-300";
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedMilestone || !user || !e.target.files?.length) return;

    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5MB.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload-evidence", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      const { url } = await uploadRes.json();

      setReviewing(true);
      const reviewRes = await fetch("/api/review-evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          activityId,
          milestoneId: selectedMilestone.id,
          evidenceUrl: url,
          evidenceType: file.type.startsWith("image/") ? "image" : "document",
          description,
          context: {
            milestoneTitle: selectedMilestone.title,
            milestoneDescription: selectedMilestone.description,
            roadmapGoal,
          },
        }),
      });

      const result = await reviewRes.json();

      if (reviewRes.ok) {
        toast.success(result.feedback.status === "approved" 
          ? "Great job! Evidence approved! 🎉" 
          : "Review complete. Check feedback for improvements.");
        setSelectedMilestone(null);
        setDescription("");
        onMilestoneUpdate?.();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to submit evidence");
    } finally {
      setUploading(false);
      setReviewing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const completedCount = milestones.filter(m => m.status === "completed").length;
  const progress = (completedCount / (milestones.length || 1)) * 100;

  return (
    <div className="space-y-8">
      <div className="bg-white border border-slate-200 rounded-3xl p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-black text-slate-900">Your Journey Progress</h3>
            <p className="text-slate-500">{roadmapTitle}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black text-amber-600">{Math.round(progress)}%</p>
            <p className="text-xs text-slate-400 font-bold uppercase">Complete</p>
          </div>
        </div>
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-4 text-sm">
          <span className="text-slate-500">{completedCount} of {milestones.length} milestones completed</span>
        </div>
      </div>

      <div className="grid gap-4">
        <h4 className="text-lg font-black text-slate-900">Milestones</h4>
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className={`bg-white border rounded-2xl p-6 transition-all ${
              selectedMilestone?.id === milestone.id ? "border-amber-500 shadow-lg" : "border-slate-200"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${getStatusColor(milestone.status)} bg-opacity-10`}>
                <span>{getCategoryIcon(milestone.type)}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="font-bold text-slate-900">{milestone.title}</h5>
                  {milestone.status === "completed" && (
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  )}
                  {milestone.status === "needs_revision" && (
                    <AlertCircle size={18} className="text-red-500" />
                  )}
                </div>
                <p className="text-sm text-slate-500 mb-3">{milestone.description}</p>

                {milestone.aiFeedback && (
                  <div className="bg-slate-50 rounded-xl p-4 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare size={16} className="text-amber-500" />
                      <span className="text-xs font-bold text-amber-600 uppercase">AI Feedback</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        milestone.aiFeedback.status === "approved" 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {milestone.aiFeedback.status === "approved" ? "Approved" : "Needs Work"}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 mb-2">{milestone.aiFeedback.feedback}</p>
                    {milestone.aiFeedback.suggestions?.length > 0 && (
                      <div className="text-xs text-slate-500">
                        <span className="font-bold">Suggestions:</span> {milestone.aiFeedback.suggestions.join(", ")}
                      </div>
                    )}
                  </div>
                )}

                {milestone.evidence?.length && (
                  <div className="flex gap-2 flex-wrap">
                    {milestone.evidence.map((ev) => (
                      <div key={ev.id} className="flex items-center gap-1 text-xs bg-slate-100 px-2 py-1 rounded-lg">
                        {ev.type === "image" ? <ImageIcon size={12} /> : <FileText size={12} />}
                        <span>Evidence uploaded</span>
                      </div>
                    ))}
                  </div>
                )}

                {milestone.status !== "completed" && (
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={() => setSelectedMilestone(milestone)}
                      className="px-4 py-2 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors"
                    >
                      Submit Evidence
                    </button>
                    <SectionFeedback
                      activityId={activityId}
                      sectionType="milestone"
                      sectionTitle="Progress Milestone"
                      itemId={milestone.id}
                      itemTitle={milestone.title}
                    />
                  </div>
                )}
                {milestone.status === "completed" && (
                  <div className="mt-3 text-xs text-slate-400 flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    Completed
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
          <div className="bg-white rounded-[3rem] p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">Submit Evidence</h3>
              <button onClick={() => setSelectedMilestone(null)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <p className="text-sm text-slate-500 mb-4">{selectedMilestone.title}</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Upload Evidence</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  disabled={uploading || reviewing}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || reviewing}
                  className="w-full p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center hover:border-amber-400 transition-colors disabled:opacity-50"
                >
                  {uploading || reviewing ? (
                    <Loader2 className="animate-spin mx-auto" size={32} />
                  ) : (
                    <>
                      <Camera className="mx-auto mb-2 text-slate-300" size={32} />
                      <p className="text-sm font-bold text-slate-600">Photo, Screenshot, or Document</p>
                      <p className="text-xs text-slate-400">Max 5MB</p>
                    </>
                  )}
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this evidence shows..."
                  className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-amber-500"
                  rows={3}
                />
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || reviewing}
                className="w-full py-4 bg-amber-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-amber-700 disabled:opacity-50"
              >
                {reviewing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    AI is reviewing...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Submit for Review
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};