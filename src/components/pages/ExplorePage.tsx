"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/db/firebase";
import { Activity } from "@/types/activity";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { Search, Map, Users, Trophy, Loader2, Copy } from "lucide-react";

export default function ExplorePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [forkingId, setForkingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicRoadmaps = async () => {
      try {
        const q = query(
          collection(db, "activities"),
          where("isPublic", "==", true),
          orderBy("createdAt", "desc"),
          limit(20)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Activity[];
        setRoadmaps(data);
      } catch (error) {
        console.error("Error fetching roadmaps:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicRoadmaps();
  }, []);

  const filteredRoadmaps = roadmaps.filter((r) =>
    r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.userInput?.goal?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleForkRoadmap = async (e: React.MouseEvent, roadmapId: string) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please sign in to make this roadmap yours");
      router.push("/login");
      return;
    }

    setForkingId(roadmapId);
    try {
      const res = await fetch("/api/fork-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          originalRoadmapId: roadmapId,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Roadmap duplicated! You can now customize it.");
        router.push(`/workspace/${result.newRoadmapId}`);
      } else {
        toast.error(result.error || "Failed to duplicate roadmap");
      }
    } catch (error) {
      console.error("Fork error:", error);
      toast.error("Something went wrong");
    } finally {
      setForkingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4">Explore</h1>
          <p className="text-slate-500 text-lg">
            Discover career roadmaps shared by professionals in your field.
          </p>
        </header>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search roadmaps by title or goal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-amber-500" size={40} />
          </div>
        ) : filteredRoadmaps.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoadmaps.map((roadmap) => (
              <div
                key={roadmap.id}
                className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:border-amber-200 transition-all group"
              >
                <button
                  onClick={() => router.push(`/share/${roadmap.id}`)}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-2 text-amber-500 text-xs font-bold mb-4">
                    <Map size={14} />
                    PUBLIC ROADMAP
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                    {roadmap.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-6 line-clamp-2">
                    Goal: {roadmap.userInput?.goal || "Professional growth"}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Trophy size={14} />
                      {roadmap.roadmap?.length || 0} steps
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      {roadmap.confidenceScore}% confidence
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={(e) => handleForkRoadmap(e, roadmap.id)}
                  disabled={forkingId === roadmap.id}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-slate-900 font-bold rounded-xl hover:bg-amber-400 transition disabled:opacity-50"
                >
                  {forkingId === roadmap.id ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Make it my own
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <Map size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No public roadmaps found</h3>
            <p className="text-slate-500">
              {searchTerm ? "Try a different search term" : "Be the first to share your roadmap!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}