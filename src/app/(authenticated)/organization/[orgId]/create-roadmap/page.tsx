"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { ArrowLeft, Loader2, Sparkles, User, Calendar, ArrowRight } from "lucide-react";
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/db/firebase";
import { toast } from "sonner";

interface TeamMember {
  id: string;
  userId: string;
  role: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
}

export default function CreateOrgRoadmapPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState<"select" | "details" | "review">("select");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [roadmapDetails, setRoadmapDetails] = useState({
    memberName: "",
    currentRole: "",
    targetRole: "",
    skills: "",
    timeline: "6",
  });

  useEffect(() => {
    if (user && params.orgId) {
      loadData();
    }
  }, [user, params.orgId]);

  const loadData = async () => {
    if (!params.orgId) return;
    setLoading(true);

    try {
      const membersQuery = query(
        collection(db, "organizationMembers"),
        where("organizationId", "==", params.orgId as string)
      );
      const membersSnap = await getDocs(membersQuery);
      setMembers(membersSnap.docs.map(d => ({ id: d.id, ...d.data() })) as TeamMember[]);

      const templatesQuery = query(
        collection(db, "organizationTemplates"),
        where("organizationId", "==", params.orgId as string)
      );
      const templatesSnap = await getDocs(templatesQuery);
      setTemplates(templatesSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Template[]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateRoadmap = async () => {
    if (!selectedMember || !roadmapDetails.targetRole) {
      toast.error("Please select a team member and target role");
      return;
    }

    setGenerating(true);
    try {
      const member = members.find(m => m.id === selectedMember);
      const template = templates.find(t => t.id === selectedTemplate);

      const prompt = `
Create a personalized career roadmap for a team member.

## USER DETAILS
- Name: ${roadmapDetails.memberName || "Team Member"}
- Current Role: ${roadmapDetails.currentRole || "Not specified"}
- Target Role: ${roadmapDetails.targetRole}
- Key Skills: ${roadmapDetails.skills || "Not specified"}
- Timeline: ${roadmapDetails.timeline} months
- Using Template: ${template?.name || "No template"}

## TASK
Create a comprehensive roadmap that helps this team member transition to their target role.

## OUTPUT FORMAT (JSON ONLY)
{
  "title": "Clear title like 'Software Engineer to Senior Engineer in 12 Months' or 'Frontend to Full-Stack Developer'",
  "confidenceScore": number (0-100),
  "roadmap": [
    { "tag": "Month 1-2", "title": "Phase name", "desc": "Actionable steps", "result": "Measurable outcome" }
  ],
  "mermaidChart": "Valid Mermaid.js flowchart",
  "learningGaps": {
    "technical": [{ "skill": "Skill name", "priority": "High|Medium", "progress": number }],
    "soft": ["Soft skill to develop"]
  },
  "curriculum": [{ "course": "Course name", "provider": "Platform", "url": "Link" }],
  "habits": [{ "title": "Habit", "desc": "Why it matters", "icon": "Emoji" }],
  "milestones": [{ "id": "m1", "type": "learning", "title": "Milestone", "description": "What to achieve", "status": "pending" }]
}

Output ONLY valid JSON.
`;

      const res = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          memberId: selectedMember,
          memberName: roadmapDetails.memberName,
          targetRole: roadmapDetails.targetRole,
          organizationId: params.orgId,
        }),
      });

      const result = await res.json();

      if (result.roadmap) {
        toast.success("Roadmap created!");
        router.push(`/organization/${params.orgId}?tab=roadmaps`);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to generate roadmap");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-6"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
              <Sparkles size={24} className="text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Create Team Roadmap</h1>
              <p className="text-slate-500 text-sm">Generate an AI-powered roadmap for a team member</p>
            </div>
          </div>

          {step === "select" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Select Team Member
                </label>
                <select
                  value={selectedMember}
                  onChange={(e) => {
                    setSelectedMember(e.target.value);
                    const member = members.find(m => m.id === e.target.value);
                    if (member) {
                      setRoadmapDetails(prev => ({ ...prev, memberName: member.userId.slice(0, 8) }));
                    }
                  }}
                  className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Choose a team member...</option>
                  {members.filter(m => m.role !== "owner").map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.userId.slice(0, 8)}... ({member.role})
                    </option>
                  ))}
                </select>
              </div>

              {templates.length > 0 && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Use Template (Optional)
                  </label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Start from scratch</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={() => setStep("details")}
                disabled={!selectedMember}
                className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                Continue <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step === "details" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Member Name
                  </label>
                  <input
                    type="text"
                    value={roadmapDetails.memberName}
                    onChange={(e) => setRoadmapDetails(prev => ({ ...prev, memberName: e.target.value }))}
                    placeholder="Team member's name"
                    className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Current Role
                  </label>
                  <input
                    type="text"
                    value={roadmapDetails.currentRole}
                    onChange={(e) => setRoadmapDetails(prev => ({ ...prev, currentRole: e.target.value }))}
                    placeholder="e.g., Junior Developer"
                    className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Target Role (Required)
                </label>
                <input
                  type="text"
                  value={roadmapDetails.targetRole}
                  onChange={(e) => setRoadmapDetails(prev => ({ ...prev, targetRole: e.target.value }))}
                  placeholder="e.g., Senior Software Engineer"
                  className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Key Skills
                </label>
                <textarea
                  value={roadmapDetails.skills}
                  onChange={(e) => setRoadmapDetails(prev => ({ ...prev, skills: e.target.value }))}
                  placeholder="What skills does this person already have?"
                  className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 min-h-[80px]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Timeline
                </label>
                <select
                  value={roadmapDetails.timeline}
                  onChange={(e) => setRoadmapDetails(prev => ({ ...prev, timeline: e.target.value }))}
                  className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="3">3 months</option>
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="18">18 months</option>
                  <option value="24">24 months</option>
                </select>
              </div>

              <button
                onClick={generateRoadmap}
                disabled={generating || !roadmapDetails.targetRole}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
              >
                {generating ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                Generate AI Roadmap
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}