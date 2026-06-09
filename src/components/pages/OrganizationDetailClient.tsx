"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { 
  ArrowLeft, Users, Layout, Map, Plus, Loader2, Crown, Sparkles,
  UserPlus, Trash2, CheckCircle 
} from "lucide-react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/db/firebase";
import { toast } from "sonner";

interface OrgDetail {
  id: string;
  name: string;
  ownerId: string;
  memberCount: number;
  maxMembers: number;
  subscription: {
    tierId: string;
    status: string;
    billingCycle: string;
  };
  settings: {
    allowMemberRoadmaps: boolean;
    requireApproval: boolean;
  };
  isActive?: boolean;
  pendingInvoiceId?: string;
}

interface Member {
  id: string;
  userId: string;
  role: string;
  status: string;
  displayName?: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  createdAt: string;
}

interface Roadmap {
  id: string;
  title: string;
  userId: string;
  organizationId: string;
  isOrganizationRoadmap: boolean;
  createdAt: string;
  userInput?: {
    goal?: string;
  };
}

export default function OrganizationDetailClient() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [org, setOrg] = useState<OrgDetail | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "members" | "templates" | "roadmaps">("overview");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"member" | "mentor">("member");
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    if (!authLoading && user && params.orgId) {
      loadOrganization();
    }
  }, [user, authLoading, params.orgId]);

  const loadOrganization = async () => {
    if (!params.orgId) return;
    setLoading(true);

    try {
      const orgDoc = await getDoc(doc(db, "organizations", params.orgId as string));
      if (!orgDoc.exists()) {
        router.push("/organization");
        return;
      }

      const orgData = orgDoc.data();
      setOrg({ id: orgDoc.id, ...orgData } as OrgDetail);

      if (!orgData.isActive && orgData.pendingInvoiceId) {
        router.push(`/organization/${params.orgId}/payment?invoice=${orgData.pendingInvoiceId}`);
        return;
      }

      const membersQuery = query(
        collection(db, "organizationMembers"),
        where("organizationId", "==", params.orgId as string)
      );
      const membersSnap = await getDocs(membersQuery);
      
      const membersWithNames: Member[] = [];
      for (const docSnap of membersSnap.docs) {
        const memberData = docSnap.data();
        let displayName = memberData.userId.slice(0, 8);
        
        try {
          const profileDoc = await getDoc(doc(db, "profiles", memberData.userId));
          if (profileDoc.exists()) {
            displayName = profileDoc.data().displayName || profileDoc.data().email?.split("@")[0] || displayName;
          }
        } catch {
        }
        
        membersWithNames.push({
          id: docSnap.id,
          userId: memberData.userId,
          role: memberData.role,
          status: memberData.status,
          displayName,
        });
      }
      setMembers(membersWithNames);

      const templatesQuery = query(
        collection(db, "organizationTemplates"),
        where("organizationId", "==", params.orgId as string)
      );
      const templatesSnap = await getDocs(templatesQuery);
      setTemplates(templatesSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Template[]);

      const roadmapsQuery = query(
        collection(db, "activities"),
        where("organizationId", "==", params.orgId as string),
        where("isOrganizationRoadmap", "==", true)
      );
      const roadmapsSnap = await getDocs(roadmapsQuery);
      
      const roadmapsWithMemberNames: Roadmap[] = [];
      for (const docSnap of roadmapsSnap.docs) {
        const data = docSnap.data();
        let memberName = data.userId?.slice(0, 8) || "Unknown";
        
        try {
          const profileDoc = await getDoc(doc(db, "profiles", data.userId));
          if (profileDoc.exists()) {
            memberName = profileDoc.data().displayName || profileDoc.data().email?.split("@")[0] || memberName;
          }
        } catch {}
        
        roadmapsWithMemberNames.push({
          id: docSnap.id,
          title: data.title || "Untitled Roadmap",
          userId: data.userId,
          organizationId: data.organizationId,
          isOrganizationRoadmap: data.isOrganizationRoadmap,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
          userInput: data.userInput,
        });
      }
      
      setRoadmaps(roadmapsWithMemberNames);

    } catch (error) {
      console.error("Error loading organization:", error);
    } finally {
      setLoading(false);
    }
  };

  const inviteMember = async () => {
    if (!user || !inviteEmail.trim() || !params.orgId) return;
    setInviting(true);

    try {
      const res = await fetch("/api/organization-members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: params.orgId,
          email: inviteEmail.trim(),
          role: inviteRole,
          invitedBy: user.uid,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Invitation sent!");
        setShowInvite(false);
        setInviteEmail("");
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send invitation");
    } finally {
      setInviting(false);
    }
  };

  const isOwner = org?.ownerId === user?.uid;
  const isAdmin = isOwner || members.find(m => m.userId === user?.uid && m.role === "admin");

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-600" size={32} />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Organization not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => router.push("/organization")}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-4"
          >
            <ArrowLeft size={18} /> Back to Organizations
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-amber-100 rounded-3xl flex items-center justify-center">
                <Crown size={32} className="text-amber-600" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900">{org.name}</h1>
                <p className="text-slate-500">
                  {org.memberCount} / {org.maxMembers} members • {org.subscription.tierId}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowInvite(true)}
                className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700"
              >
                <UserPlus size={18} />
                Invite Member
              </button>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            {[
              { id: "overview", label: "Overview", icon: Users },
              { id: "members", label: "Members", icon: Users },
              { id: "templates", label: "Templates", icon: Layout },
              { id: "roadmaps", label: "Roadmaps", icon: Map },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-amber-100 text-amber-700"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="text-amber-600" size={24} />
                <h3 className="font-bold text-slate-900">Team Members</h3>
              </div>
              <p className="text-4xl font-black text-slate-900">{org.memberCount}</p>
              <p className="text-sm text-slate-500 mt-1">of {org.maxMembers} seats used</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Layout className="text-amber-600" size={24} />
                <h3 className="font-bold text-slate-900">Templates</h3>
              </div>
              <p className="text-4xl font-black text-slate-900">{templates.length}</p>
              <p className="text-sm text-slate-500 mt-1">roadmap templates</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Map className="text-amber-600" size={24} />
                <h3 className="font-bold text-slate-900">Team Roadmaps</h3>
              </div>
              <p className="text-4xl font-black text-slate-900">{roadmaps.length}</p>
              <p className="text-sm text-slate-500 mt-1">active roadmaps</p>
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-4 font-bold text-slate-500 text-sm">Member</th>
                  <th className="text-left p-4 font-bold text-slate-500 text-sm">Role</th>
                  <th className="text-left p-4 font-bold text-slate-500 text-sm">Status</th>
                  <th className="text-left p-4 font-bold text-slate-500 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-t border-slate-100">
                    <td className="p-4 font-bold text-slate-900">{member.displayName || member.userId}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        member.role === "owner" ? "bg-amber-100 text-amber-700" :
                        member.role === "admin" ? "bg-blue-100 text-blue-700" :
                        member.role === "mentor" ? "bg-purple-100 text-purple-700" :
                        "bg-slate-100 text-slate-700"
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-emerald-600 font-bold text-sm flex items-center gap-1">
                        <CheckCircle size={14} /> {member.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {member.role !== "owner" && isAdmin && (
                        <button className="text-red-500 hover:text-red-700">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "templates" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900">Organization Templates</h3>
              <button
                onClick={() => router.push(`/organization/${params.orgId}/create-template`)}
                className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700"
              >
                <Plus size={18} />
                Create Template
              </button>
            </div>

            {templates.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                <Layout size={48} className="text-slate-300 mx-auto mb-4" />
                <h4 className="font-bold text-slate-900 mb-2">No Templates Yet</h4>
                <p className="text-slate-500 mb-4">Create reusable roadmap templates for your team</p>
                <button
                  onClick={() => router.push(`/organization/${params.orgId}/create-template`)}
                  className="px-6 py-3 bg-amber-600 text-white rounded-2xl font-bold"
                >
                  Create First Template
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 hover:border-amber-500 transition-all"
                  >
                    <h4 className="font-bold text-slate-900 mb-2">{template.name}</h4>
                    <p className="text-sm text-slate-500 mb-4">{template.description}</p>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                      {template.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "roadmaps" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900">Team Roadmaps</h3>
              <button
                onClick={() => router.push(`/organization/${params.orgId}/create-roadmap`)}
                className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700"
              >
                <Sparkles size={18} />
                Create AI Roadmap
              </button>
            </div>

            {roadmaps.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                <Map size={48} className="text-slate-300 mx-auto mb-4" />
                <h4 className="font-bold text-slate-900 mb-2">No Roadmaps Yet</h4>
                <p className="text-slate-500 mb-4">Create AI-powered roadmaps for your team members</p>
                <button
                  onClick={() => router.push(`/organization/${params.orgId}/create-roadmap`)}
                  className="px-6 py-3 bg-amber-600 text-white rounded-2xl font-bold"
                >
                  Create First Roadmap
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roadmaps.map((roadmap) => (
                  <div
                    key={roadmap.id}
                    onClick={() => router.push(`/workspace/${roadmap.id}`)}
                    className="bg-white rounded-3xl border border-slate-200 p-6 hover:border-amber-500 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                        <Map size={24} className="text-amber-600" />
                      </div>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">
                        Active
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2 line-clamp-2">{roadmap.title}</h4>
                    <p className="text-sm text-slate-500 mb-4">
                      Target: {roadmap.userInput?.goal || "Not specified"}
                    </p>
                    <p className="text-xs text-slate-400">
                      Created {roadmap.createdAt ? new Date(roadmap.createdAt).toLocaleDateString() : "recently"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showInvite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-xl font-black text-slate-900 mb-6">Invite Team Member</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Role</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setInviteRole("member")}
                  className={`flex-1 p-3 rounded-xl border-2 font-bold text-sm ${
                    inviteRole === "member" ? "border-amber-600 bg-amber-50" : "border-slate-100"
                  }`}
                >
                  Member
                </button>
                <button
                  onClick={() => setInviteRole("mentor")}
                  className={`flex-1 p-3 rounded-xl border-2 font-bold text-sm ${
                    inviteRole === "mentor" ? "border-amber-600 bg-amber-50" : "border-slate-100"
                  }`}
                >
                  Mentor
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowInvite(false)}
                className="flex-1 py-3 border-2 border-slate-200 rounded-xl font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={inviteMember}
                disabled={inviting || !inviteEmail.trim()}
                className="flex-1 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {inviting ? <Loader2 className="animate-spin" size={18} /> : "Send Invite"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
