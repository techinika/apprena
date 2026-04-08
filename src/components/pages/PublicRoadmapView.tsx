"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/db/firebase";
import { Activity, RoadmapStep } from "@/types/activity";
import Loading from "@/app/loading";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, BookOpen, Users, Trophy, Target, Download, Loader2, Menu, X, Copy } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const FlowchartView = dynamic(
  () => import("@/components/parts/activity/FlowchartView").then((mod) => ({ default: mod.FlowchartView })),
  { ssr: false, loading: () => <div className="h-64 animate-pulse bg-slate-100 rounded-3xl" /> }
);

export default function PublicRoadmapView({ slug }: { slug: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [view, setView] = useState("timeline");
  const [downloading, setDownloading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [forking, setForking] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const docRef = doc(db, "activities", slug);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as Activity;
          if (data.isPublic) {
            setActivity({ ...data, id: docSnap.id });
          } else {
            setError(true);
          }
        } else {
          const q = await getDoc(doc(db, "activities", slug));
          if (q.exists()) {
            const data = q.data() as Activity;
            if (data.isPublic && data.publicSlug === slug) {
              setActivity({ ...data, id: q.id });
            } else {
              setError(true);
            }
          } else {
            setError(true);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [slug]);

  const handleDownload = async () => {
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
      }
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setDownloading(false);
    }
  };

  const handleForkRoadmap = async () => {
    if (!user) {
      toast.error("Please sign in to make this roadmap yours");
      router.push("/login");
      return;
    }

    if (!activity) return;
    setForking(true);
    try {
      const res = await fetch("/api/fork-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          originalRoadmapId: activity.id,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Roadmap duplicated! You can now customize it.");
        router.push(`/activity/${result.newRoadmapId}`);
      } else {
        toast.error(result.error || "Failed to duplicate roadmap");
      }
    } catch (error) {
      console.error("Fork error:", error);
      toast.error("Something went wrong");
    } finally {
      setForking(false);
    }
  };

  if (loading) return <Loading />;
  
  if (error || !activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-black text-slate-900 mb-4">Not Found</h1>
          <p className="text-slate-500">This roadmap is private or doesn't exist.</p>
        </div>
      </div>
    );
  }

  const roadmapSteps = activity.roadmap || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-slate-900 text-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black text-amber-500">
            APPRENA
          </Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-bold">
            <Link href="/" className="hover:text-amber-400 transition">Home</Link>
            {user ? (
              <Link href="/workspace" className="hover:text-amber-400 transition">My Workspace</Link>
            ) : (
              <Link href="/login" className="hover:text-amber-400 transition">Get Started</Link>
            )}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 bg-amber-500 text-slate-900 px-4 py-2 rounded-full font-bold hover:bg-amber-400 transition disabled:opacity-50"
            >
              {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              Download PDF
            </button>
          </div>

          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800 px-4 py-4 space-y-4">
            <Link href="/" className="block py-2 hover:text-amber-400">Home</Link>
            {user ? (
              <Link href="/workspace" className="block py-2 hover:text-amber-400">My Workspace</Link>
            ) : (
              <Link href="/login" className="block py-2 hover:text-amber-400">Get Started</Link>
            )}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 bg-amber-500 text-slate-900 px-4 py-2 rounded-full font-bold w-full justify-center"
            >
              {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              Download PDF
            </button>
          </div>
        )}
      </nav>

      <header className="bg-slate-900 text-white py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-amber-500 text-sm font-bold mb-4">
            <Target size={16} />
            PUBLIC ROADMAP
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">{activity.title}</h1>
          <p className="text-xl text-slate-300 mb-8">Goal: {activity.userInput?.goal}</p>
          <div className="flex items-center gap-6">
            <div className="bg-amber-500/20 px-4 py-2 rounded-full">
              <span className="text-amber-400 font-bold">{activity.confidenceScore}%</span>
              <span className="text-slate-400 text-sm ml-2">Confidence</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <CheckCircle2 size={16} className="text-emerald-500" />
              {roadmapSteps.length} Steps
            </div>
          </div>
          
          <div className="mt-8">
            <button
              onClick={handleForkRoadmap}
              disabled={forking}
              className="flex items-center gap-2 bg-amber-500 text-slate-900 px-6 py-3 rounded-xl font-black hover:bg-amber-400 transition disabled:opacity-50"
            >
              {forking ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating your copy...
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Make it my own
                </>
              )}
            </button>
            <p className="text-slate-400 text-sm mt-2">
              Duplicates this roadmap to your account so you can customize it
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-12">
        <section className="mb-12">
          <div className="flex gap-2 bg-slate-200 p-1 rounded-xl w-fit mb-8">
            <button
              onClick={() => setView("timeline")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === "timeline" ? "bg-white text-amber-600 shadow-sm" : "text-slate-500"}`}
            >
              Timeline
            </button>
            <button
              onClick={() => setView("flow")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === "flow" ? "bg-white text-amber-600 shadow-sm" : "text-slate-500"}`}
            >
              Flowchart
            </button>
          </div>

          {view === "timeline" ? (
            <div className="relative border-l-2 border-amber-200 ml-4 pl-10 space-y-8">
              {roadmapSteps.map((step, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[41px] top-0 w-5 h-5 bg-amber-500 rounded-full border-4 border-white" />
                  <div className="bg-white border border-slate-200 p-6 rounded-2xl">
                    <span className="text-xs font-black text-amber-500 uppercase">{step.tag}</span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">{step.title}</h3>
                    <p className="text-slate-600 mt-2">{step.desc}</p>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-emerald-600 text-sm font-medium">
                      <CheckCircle2 size={14} />
                      {step.result}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8">
              <FlowchartView chartData={activity.mermaidChart} />
            </div>
          )}
        </section>

        {activity.curriculum && activity.curriculum.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <BookOpen className="text-amber-500" />
              Learning Path
            </h2>
            <div className="grid gap-4">
              {activity.curriculum.map((item, i) => (
                <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{item.course}</p>
                    <p className="text-sm text-slate-500">{item.provider}</p>
                  </div>
                  <a href={item.url} target="_blank" className="text-amber-600 font-bold text-sm hover:underline">
                    View →
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {activity.habits && activity.habits.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Trophy className="text-amber-500" />
              Key Habits
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {activity.habits.map((habit, i) => (
                <div key={i} className="bg-amber-50 border border-amber-100 p-5 rounded-2xl">
                  <p className="text-2xl mb-2">{habit.icon}</p>
                  <p className="font-bold text-slate-900">{habit.title}</p>
                  <p className="text-sm text-slate-600">{habit.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activity.network && activity.network.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Users className="text-amber-500" />
              Network Recommendations
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {activity.network.map((person, i) => (
                <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">
                      {person.type}
                    </span>
                  </div>
                  <p className="font-bold text-slate-900">{person.name}</p>
                  <p className="text-sm text-slate-500">{person.role}</p>
                  <p className="text-sm text-slate-600 mt-2">{person.reason}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer className="text-center py-12 border-t border-slate-200">
          <p className="text-slate-500 mb-4">Created with</p>
          <p className="text-2xl font-black text-amber-600">APPRENA</p>
          <p className="text-sm text-slate-400 mt-2">AI-Powered Career Roadmaps</p>
        </footer>
      </main>
    </div>
  );
}