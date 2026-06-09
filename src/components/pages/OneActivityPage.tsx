"use client";

import React, { useEffect, useState } from "react";
import { RoadmapSection } from "../parts/activity/RoadmapView";
import { RoadmapProgress } from "../parts/activity/RoadmapProgress";
import { fetchActivityById } from "@/db/operations/GetActivities";
import Loading from "@/app/loading";
import { useAuth } from "@/lib/AuthContext";
import type { Activity } from "@/types/activity";
import { useRouter } from "next/navigation";
import { LearningSection } from "../parts/activity/LearningView";
import { HabitsSection } from "../parts/activity/Habitview";
import { NetworkSection } from "../parts/activity/NetworkView";
import { AchievementsSection } from "../parts/activity/AchievementSection";
import { YourInputSection } from "../parts/activity/YourInputSection";
import { AnalysisSidebar } from "../parts/activity/AnalysisSidebar";
import { toast } from "sonner";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/db/firebase";
import { ConfirmModal } from "../parts/ConfirmModal";
import { ErrorBoundary } from "../error/ErrorBoundary";

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
  const [downloading, setDownloading] = useState(false);

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
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to update sharing settings");
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
    } catch {
      toast.error("Failed to delete roadmap");
    }
  };

  const handleDownloadPdf = async () => {
    if (!activity) return;
    setDownloading(true);
    try {
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roadmap: activity.roadmap,
          title: activity.title,
          goal: activity.userInput?.goal,
          confidenceScore: activity.confidenceScore,
          curriculum: activity.curriculum,
          habits: activity.habits,
          network: activity.network,
          createdAt: activity.createdAt,
        }),
      });
      const result = await res.json();
      if (result.pdf) {
        const link = document.createElement("a");
        link.href = result.pdf;
        link.download = `${activity.title.replace(/\s+/g, "-")}-roadmap.pdf`;
        link.click();
        toast.success("PDF downloaded!");
      }
    } catch {
      toast.error("Failed to download PDF");
    } finally {
      setDownloading(false);
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
    <ErrorBoundary>
      <div className="min-h-screen max-w-7xl mx-auto bg-[#FDFDFF] text-slate-900 flex">
        <AnalysisSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activity={activity}
          sharing={sharing}
          showShareMenu={showShareMenu}
          copied={copied}
          downloading={downloading}
          onShare={handleShare}
          onCopyLink={handleCopyLink}
          onDownloadPdf={handleDownloadPdf}
          onDelete={() => setShowDeleteConfirm(true)}
          onToggleShareMenu={() => setShowShareMenu(!showShareMenu)}
        />

        <main className="flex-1 p-12 max-w-5xl mx-auto overflow-y-auto">
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
              <YourInputSection activity={activity} />
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
    </ErrorBoundary>
  );
};

export default AnalysisDetail;
