/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Map, BookOpen, Repeat, Users, Trophy } from "lucide-react";
import mermaid from "mermaid";
import { RoadmapSection } from "../parts/activity/RoadmapView";
import { fetchActivityById } from "@/db/operations/GetActivities";
import Loading from "@/app/loading";
import { useAuth } from "@/lib/AuthContext";
import { Activity } from "@/types/activity";
import { useRouter } from "next/navigation";
import { LearningSection } from "../parts/activity/LearningView";
import { HabitsSection } from "../parts/activity/Habitview";
import { NetworkSection } from "../parts/activity/NetworkView";
import { AchievementsSection } from "../parts/activity/AchievementSection";

mermaid.initialize({
  startOnLoad: true,
  theme: "base",
  themeVariables: {
    primaryColor: "#FFBF00",
    primaryTextColor: "#fff",
    lineColor: "#e2e8f0",
    fontSize: "14px",
  },
});

const AnalysisDetail = ({ activityId }: { activityId: string }) => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("roadmap");
  const [roadmapView, setRoadmapView] = useState("timeline");
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [error, setError] = useState(false);

  const navItems = [
    { id: "roadmap", label: "Roadmap", icon: Map },
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
        const data = await fetchActivityById(activityId);

        if (data) {
          if (user && data?.userId !== user.uid) {
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

        <div className="mt-auto p-6 border-t border-slate-50">
          <button className="w-full bg-slate-900 text-white p-4 rounded-2xl text-sm font-bold hover:bg-amber-600 transition-colors">
            Share Analysis
          </button>
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
            />
          )}
          {activeTab === "learning" && activity && (
            <LearningSection
              learningGaps={activity?.learningGaps}
              curriculum={activity?.curriculum || []}
            />
          )}
          {activeTab === "habits" && (
            <HabitsSection habits={activity?.habits} />
          )}
          {activeTab === "network" && (
            <NetworkSection
              network={activity?.network}
              reason={activity?.networkReason}
            />
          )}
          {activeTab === "achievements" && <AchievementsSection achievements={activity?.achievements} />}
        </div>
      </main>
    </div>
  );
};

export default AnalysisDetail;
