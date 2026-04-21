"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Plus, Users, Settings, Loader2, Crown, Trash2, UserPlus } from "lucide-react";
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/db/firebase";
import { toast } from "sonner";

interface Organization {
  id: string;
  name: string;
  memberCount: number;
  maxMembers: number;
  subscription: {
    tierId: string;
    status: string;
  };
}

export default function OrganizationPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [selectedTier, setSelectedTier] = useState("team-starter");

  useEffect(() => {
    if (!authLoading && user) {
      loadOrganizations();
    }
  }, [user, authLoading]);

  const loadOrganizations = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const memberQuery = query(
        collection(db, "organizationMembers"),
        where("userId", "==", user.uid),
        where("status", "==", "active")
      );

      const memberSnapshot = await getDocs(memberQuery);
      const orgs: Organization[] = [];

      for (const memDoc of memberSnapshot.docs) {
        const memData = memDoc.data();
        const orgDoc = await getDoc(doc(db, "organizations", memData.organizationId));
        if (orgDoc.exists()) {
          orgs.push({ id: orgDoc.id, ...orgDoc.data() } as Organization);
        }
      }

      setOrganizations(orgs);
    } catch (error) {
      console.error("Error loading organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  const createOrganization = async () => {
    if (!user || !orgName.trim()) return;
    setCreating(true);

    try {
      const res = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          name: orgName.trim(),
          tierId: selectedTier,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Organization created!");
        router.push(`/organization/${result.organizationId}`);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create organization");
    } finally {
      setCreating(false);
      setShowCreate(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900">Organizations</h1>
            <p className="text-slate-500 mt-2">Manage teams and create organization roadmaps</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-6 py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all"
          >
            <Plus size={20} />
            Create Organization
          </button>
        </div>

        {organizations.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users size={40} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No Organizations Yet</h3>
            <p className="text-slate-500 mb-6">
              Create an organization to collaborate with your team members
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-8 py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700"
            >
              Create Your First Organization
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org) => (
              <div
                key={org.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 hover:border-amber-500 transition-all cursor-pointer"
                onClick={() => router.push(`/organization/${org.id}`)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                    <Crown size={24} className="text-amber-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                    {org.subscription.tierId}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{org.name}</h3>
                <p className="text-sm text-slate-500">
                  {org.memberCount} / {org.maxMembers} members
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full">
            <h3 className="text-2xl font-black text-slate-900 mb-6">Create Organization</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Organization Name
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Enter organization name"
                className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Select Plan
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: "team-starter", name: "Starter", members: 5, price: "24,000" },
                  { id: "team-growth", name: "Growth", members: 15, price: "40,000" },
                  { id: "team-enterprise", name: "Enterprise", members: "Unlimited", price: "80,000" },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      selectedTier === tier.id
                        ? "border-amber-600 bg-amber-50"
                        : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <p className="font-bold text-sm text-slate-900">{tier.name}</p>
                    <p className="text-xs text-slate-500">{tier.members} members</p>
                    <p className="text-xs font-bold text-amber-600 mt-1">{tier.price} RWF/mo</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 py-4 border-2 border-slate-200 rounded-2xl font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={createOrganization}
                disabled={creating || !orgName.trim()}
                className="flex-1 py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {creating ? <Loader2 className="animate-spin" /> : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}