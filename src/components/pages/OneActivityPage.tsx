/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, lazy, Suspense } from "react";
import { Map, BookOpen, Repeat, Users, Trophy, FileText, Eye, ExternalLink, TrendingUp, Share2, Link, Globe, Lock, Loader2, Copy, Check, Trash2 } from "lucide-react";
import { RoadmapSection } from "../parts/activity/RoadmapView";
import { RoadmapProgress } from "../parts/activity/RoadmapProgress";
import { fetchActivityById } from "@/db/operations/GetActivities";
import Loading from "@/app/loading";
import { useAuth } from "@/lib/AuthContext";
import { Activity } from "@/types/activity";
import { useRouter } from "next/navigation";
import { LearningSection } from "../parts/activity/LearningView";
import { HabitsSection } from "../parts/activity/Habitview";
import { NetworkSection } from "../parts/activity/NetworkView";
import { AchievementsSection } from "../parts/activity/AchievementSection";
import { toast } from "sonner";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/db/firebase";
import { ConfirmModal } from "../parts/ConfirmModal";

const FlowchartView = lazy(() =>
  import("../parts/activity/FlowchartView").then((mod) => ({ default: mod.FlowchartView }))
);

const QUESTIONS = [
  { id: "current", label: "Current Reality", key: "What is your current role and biggest professional frustration?" },
  { id: "goal", label: "The North Star", key: "Where do you want to be in 5-10 years?" },
  { id: "skills", label: "Inventory", key: "What are your top 3 'Superpowers' and 3 biggest gaps?" },
  { id: "blocks", label: "Obstacles", key: "What is the #1 thing stopping you from reaching your goal?" },
  { id: "ecosystem", label: "Social Circle", key: "Do you have mentors? Who do you spend time with professionally?" },
];

const AnalysisDetail = ({ activityId }: { activityId: string }) => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("roadmap");
  const [roadmapView, setRoadmapView] = useState("timeline");
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [error, setError] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const navItems = [
    { id: "roadmap", label: "Roadmap", icon: Map },
    { id: "progress", label: "Progress", icon: TrendingUp },
    { id: "input", label: "Your Input", icon: FileText },
    { id: "learning", label: "Learning Path", icon: BookOpen },
    { id: "habits", label: "Action & Habits", icon: Repeat },
    { id: "network", label: "Social Circle", icon: Users },
    { id: "achievements", label: "Achievements", icon: Trophy },
  ];

  useEffect(() => {
    const getActivity = async () => {
      if (!activityId) return;

      try {
        setLoading(true);
        const data = await fetchActivityById(activityId, user?.uid);

        if (data) {
          if (user && data?.userId && data?.userId !== user.uid) {
            setError(true);
            return;
          }
          setActivity(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      getActivity();
    }
  }, [activityId, user, authLoading]);

  const handleShare = async (makePublic: boolean) => {
    if (!user || !activity) return;
    
    setSharing(true);
    try {
      const res = await fetch("/api/share-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId,
          userId: user.uid,
          makePublic,
        }),
      });
      
      const result = await res.json();
      
      if (res.ok) {
        setActivity({ ...activity, isPublic: result.isPublic, publicSlug: result.publicUrl });
        if (makePublic && result.publicUrl) {
          const shareUrl = `${window.location.origin}${result.publicUrl}`;
          navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          toast.success("Roadmap is now public! Link copied!");
        } else {
          toast.success(makePublic ? "Roadmap is now public!" : "Roadmap is now private");
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update sharing settings");
    } finally {
      setSharing(false);
      setShowShareMenu(false);
    }
  };

  const handleCopyLink = () => {
    if (activity?.isPublic && activity.id) {
      const shareUrl = `${window.location.origin}/share/${activity.id}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleDeleteRoadmap = async () => {
    if (!activity?.id) return;
    try {
      await deleteDoc(doc(db, "activities", activity.id));
      toast.success("Roadmap deleted");
      router.push("/workspace");
    } catch (error) {
      toast.error("Failed to delete roadmap");
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          Analysis Not Found
        </h2>
        <p className="text-slate-500 mb-6 text-sm">
          This roadmap doesn't exist or you don't have permission to view it.
        </p>
        <button
          onClick={() => router.push("/workspace")}
          className="bg-amber-900 text-white px-8 py-3 rounded-2xl font-bold"
        >
          Return to Workspace
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-[#FDFDFF] text-slate-900 flex">
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-[90vh]">
        <div className="p-8">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === item.id
                    ? "bg-amber-50 text-amber-600 shadow-sm"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-50 relative">
          <button 
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="w-full bg-slate-900 text-white p-4 rounded-2xl text-sm font-bold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            {activity?.isPublic ? "Public" : "Share Analysis"}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full mt-2 bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            Delete Roadmap
          </button>
          
          {showShareMenu && (
            <div className="absolute bottom-full left-6 right-6 mb-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 animate-in fade-in slide-in-from-bottom-2">
              <p className="text-xs text-slate-400 mb-3 font-bold uppercase">
                {activity?.isPublic ? "Your roadmap is public" : "Make your roadmap visible to others"}
              </p>
              <div className="space-y-2">
                {activity?.isPublic && (
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                  >
                    {copied ? <Check size={18} className="text-emerald-500" /> : <Link size={18} className="text-slate-500" />}
                    <div>
                      <p className="font-bold text-sm text-slate-900">{copied ? "Copied!" : "Copy Link"}</p>
                      <p className="text-xs text-slate-500">Share public URL</p>
                    </div>
                  </button>
                )}
                {activity?.isPublic ? (
                  <button
                    onClick={() => handleShare(false)}
                    disabled={sharing}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-red-50 transition-colors text-left"
                  >
                    {sharing ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} className="text-red-500" />}
                    <div>
                      <p className="font-bold text-sm text-slate-900">Make Private</p>
                      <p className="text-xs text-slate-500">Hide from public</p>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => handleShare(true)}
                    disabled={sharing}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors text-left"
                  >
                    {sharing ? <Loader2 size={18} className="animate-spin" /> : <Globe size={18} className="text-amber-600" />}
                    <div>
                      <p className="font-bold text-sm text-slate-900">Make Public</p>
                      <p className="text-xs text-slate-500">Anyone can view</p>
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 p-12 max-w-5xl mx-auto overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-amber-600 font-bold text-sm uppercase tracking-widest mb-2">
              Analysis Results
            </p>
            <h1 className="text-4xl font-black text-slate-900">
              {activity?.title}
            </h1>
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-sm font-medium">
              Confidence Score
            </span>
            <div className="text-2xl font-black text-emerald-500">
              {activity?.confidenceScore}%
            </div>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {activeTab === "roadmap" && (
            <RoadmapSection
              view={roadmapView}
              setView={setRoadmapView}
              roadmap={activity?.roadmap}
              chart={activity?.mermaidChart}
              activityId={activityId}
            />
          )}
          {activeTab === "progress" && activity && (
            <RoadmapProgress
              activityId={activityId}
              milestones={activity.milestones || []}
              roadmapTitle={activity.title || ""}
              roadmapGoal={activity.userInput?.goal || ""}
            />
          )}
          {activeTab === "input" && (
            <div className="space-y-8">
              <div className="bg-white border border-slate-100 rounded-3xl p-8">
                <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                  <FileText className="text-amber-500" size={24} />
                  Your Answers
                </h3>
                <div className="space-y-6">
                  {QUESTIONS.map((q) => (
                    <div key={q.id} className="border-b border-slate-100 pb-4 last:border-0">
                      <p className="text-xs font-black text-amber-500 uppercase tracking-wider mb-2">
                        {q.label}
                      </p>
                      <p className="text-slate-700 font-medium">
                        {activity?.userInput?.[q.id as keyof typeof activity.userInput] || "Not provided"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {activity?.uploadedDocuments && activity.uploadedDocuments.length > 0 && (
                <div className="bg-white border border-slate-100 rounded-3xl p-8">
                  <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                    <Eye className="text-amber-500" size={24} />
                    Uploaded Documents
                  </h3>
                  <div className="grid gap-4">
                    {activity.uploadedDocuments.map((doc, i) => (
                      <a
                        key={i}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-amber-50 transition-colors group"
                      >
                        <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center">
                          <FileText className="text-slate-400 group-hover:text-amber-600" size={24} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 group-hover:text-amber-700">
                            {doc.name}
                          </p>
                          <p className="text-xs text-slate-400">Click to view PDF</p>
                        </div>
                        <ExternalLink className="text-slate-300 group-hover:text-amber-500" size={18} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === "learning" && activity && (
            <LearningSection
              learningGaps={activity?.learningGaps}
              curriculum={activity?.curriculum || []}
              activityId={activityId}
              title={activity?.title}
              goal={activity?.userInput?.goal ?? ""}
              userInput={activity?.userInput}
            />
          )}
          {activeTab === "habits" && (
            <HabitsSection habits={activity?.habits} activityId={activityId} />
          )}
          {activeTab === "network" && (
            <NetworkSection
              network={activity?.network}
              reason={activity?.networkReason}
              activityId={activityId}
            />
          )}
          {activeTab === "achievements" && (
            <AchievementsSection achievements={activity?.achievements} activityId={activityId} />
          )}
        </div>
      </main>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteRoadmap}
        title="Delete Roadmap"
        message="Are you sure you want to delete this roadmap? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default AnalysisDetail;
