/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { formatDate } from "../../lib/functions";
import {
  User,
  ShieldCheck,
  CreditCard,
  Zap,
  ChevronRight,
  ExternalLink,
  Trash2,
  Loader2,
  ShieldAlert,
  Award,
  Medal,
} from "lucide-react";
import Link from "next/link";
import { getTransactionHistory } from "@/db/operations/Transactions";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/db/firebase";
import { deleteUserAccountPermanently } from "@/db/operations/Profile";
import { useRouter } from "next/navigation";
import { SuccessModal } from "../parts/learning/SuccessOverlay";

const ProfilePage = () => {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [badgeTitle, setBadgeTitle] = useState("");

  const fetchTransactions = async (isLoadMore = false) => {
    if (!user?.uid) return;
    setLoading(true);

    try {
      const result = await getTransactionHistory(
        user.uid,
        5,
        isLoadMore ? lastDoc : null
      );
      setTransactions((prev) =>
        isLoadMore ? [...prev, ...result.transactions] : result.transactions
      );
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "billing") fetchTransactions();
    const fetchSubscription = async () => {
      if (!user?.uid) return;
      const q = query(
        collection(db, "subscriptions"),
        where("userId", "==", user?.uid),
        where("status", "==", "active"),
        orderBy("endDate", "desc"),
        limit(1)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        setExpiryDate(snap.docs[0].data().endDate.toDate());
      }
    };
    if (activeTab === "general") fetchSubscription();
  }, [activeTab, user?.uid]);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteUserAccountPermanently();
      router.push("/");
    } catch (error: any) {
      console.error("Deletion failed:", error);
      alert(error.message || "Failed to delete account. Please try again.");
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {showSuccess && (
        <SuccessModal
          planTitle={badgeTitle}
          onClose={() => setShowSuccess(false)}
        />
      )}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert size={32} />
            </div>
            <h3 className="text-2xl font-black text-center text-slate-900 mb-2">
              Final Confirmation
            </h3>
            <p className="text-slate-500 text-center mb-8">
              To proceed, we will ask you to sign in with Google one last time
              to verify ownership. This action cannot be undone.
            </p>

            <div className="flex flex-col gap-3">
              <button
                disabled={isDeleting}
                onClick={handleDeleteAccount}
                className="w-full bg-red-600 text-white font-black py-4 rounded-2xl hover:bg-red-700 transition-all flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Verify & Delete"
                )}
              </button>
              <button
                disabled={isDeleting}
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-2">
            {[
              { id: "general", label: "General", icon: <User size={18} /> },
              {
                id: "billing",
                label: "Billing & Plans",
                icon: <CreditCard size={18} />,
              },
              {
                id: "security",
                label: "Security",
                icon: <ShieldCheck size={18} />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-amber-600 shadow-sm border border-slate-100"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
              {activeTab === "general" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-6">
                    <img
                      src={user?.photoURL || ""}
                      className="w-24 h-24 rounded-4xl border-4 border-slate-50 shadow-sm"
                      alt="Profile"
                    />
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">
                        {user?.displayName}
                      </h2>
                      <p className="text-slate-500 font-medium">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                        Account Type
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {profile?.accountType.toUpperCase()} TIER
                        </span>
                        <Zap
                          size={16}
                          className="text-amber-500 fill-amber-500"
                        />
                      </div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                        Member Since
                      </p>
                      <span className="font-bold text-slate-900">
                        {formatDate(profile?.joinedAt)}
                      </span>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                        Subscription Ends
                      </p>
                      <span className="font-bold text-slate-900">
                        {expiryDate ? formatDate(expiryDate) : "No active sub"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <Award className="text-amber-500" size={24} />
                        Unlocked Milestones
                      </h3>
                    </div>

                    {profile?.badges && profile.badges.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {profile.badges.map((badge: any, index: number) => (
                          <button
                            key={index + 1}
                            onClick={() => {
                              setBadgeTitle(badge?.title);
                              setShowSuccess(true);
                            }}
                            className="group flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-amber-500 hover:shadow-md transition-all cursor-pointer"
                          >
                            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                              <Medal size={24} />
                            </div>
                            <div className="overflow-hidden">
                              <h4 className="font-black text-slate-900 text-sm truncate uppercase tracking-tight">
                                {badge.title}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">
                                {badge.unlockedAt
                                  ? formatDate(new Date(badge.unlockedAt))
                                  : "Recently"}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-slate-50 rounded-4xl border border-dashed border-slate-200">
                        <Award
                          className="mx-auto text-slate-200 mb-3"
                          size={40}
                        />
                        <p className="text-slate-400 font-bold text-sm">
                          No badges yet. Finish a learning path to earn one!
                        </p>
                        <Link
                          href="/learning"
                          className="text-amber-600 text-xs font-black uppercase tracking-widest mt-2 inline-block hover:underline"
                        >
                          Start Learning
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "billing" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-4">
                      Payment History
                    </h3>
                    <div className="overflow-hidden border border-slate-100 rounded-2xl bg-white">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-400 font-black uppercase tracking-widest text-[10px]">
                          <tr>
                            <th className="px-6 py-4">Transaction</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {transactions.map((tx) => (
                            <tr
                              key={tx.id}
                              className="hover:bg-slate-50/50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <p className="font-bold text-slate-900 capitalize">
                                  {tx.planId?.replace("_", " ") || "Purchase"}
                                </p>
                                <p className="text-[10px] text-slate-400 font-mono uppercase">
                                  ID: {tx.id.slice(0, 8)}
                                </p>
                              </td>
                              <td className="px-6 py-4 text-slate-500">
                                {tx.timestamp
                                  ? formatDate(tx.timestamp.toDate())
                                  : "---"}
                              </td>
                              <td className="px-6 py-4 font-bold text-slate-900">
                                {new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                }).format(tx.amount)}
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                    tx.status === "success"
                                      ? "bg-emerald-50 text-emerald-600"
                                      : "bg-red-50 text-red-600"
                                  }`}
                                >
                                  {tx.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {loading && transactions.length === 0 && (
                        <div className="p-12 flex justify-center">
                          <Loader2 className="animate-spin text-amber-600" />
                        </div>
                      )}
                      {!loading && transactions.length === 0 && (
                        <p className="w-full text-center py-12 text-slate-400 font-medium">
                          No transactions yet.
                        </p>
                      )}

                      {hasMore && (
                        <div className="p-4 border-t border-slate-50 bg-slate-50/30 flex justify-center">
                          <button
                            onClick={() => fetchTransactions(true)}
                            disabled={loading}
                            className="text-xs font-black uppercase tracking-widest text-amber-600 hover:text-amber-700 flex items-center gap-2 disabled:opacity-50"
                          >
                            {loading ? "Loading..." : "Load More Activity"}
                            {!loading && <ChevronRight size={14} />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {profile?.accountType === "free" && (
                    <div className="p-8 bg-amber-600 rounded-[2rem] text-white flex justify-between items-center">
                      <div>
                        <h4 className="font-black text-xl mb-1">
                          Upgrade to Pro
                        </h4>
                        <p className="text-amber-100 text-sm">
                          Get unlimited roadmaps and AI mentorship.
                        </p>
                      </div>
                      <Link href="/upgrade">
                        <button className="bg-white text-amber-600 px-6 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-amber-50 transition-all">
                          View Plans <ChevronRight size={18} />
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-start gap-6 p-6 bg-slate-50 rounded-3xl">
                    <div className="bg-white p-3 rounded-2xl shadow-sm">
                      <ShieldCheck className="text-amber-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">
                        Authentication
                      </h4>
                      <p className="text-sm text-slate-500 mb-4">
                        You are currently authenticated via Google.
                      </p>
                      <Link
                        href="https://myaccount.google.com/permissions"
                        target="_blank"
                      >
                        <button className="text-xs font-black uppercase tracking-widest text-amber-600 hover:text-amber-700">
                          Manage Google Settings{" "}
                          <ExternalLink size={12} className="inline ml-1" />
                        </button>
                      </Link>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-100">
                    <h4 className="font-bold text-red-600 mb-2">Danger Zone</h4>
                    <p className="text-sm text-slate-500 mb-6">
                      Once you delete your account, all your roadmaps and AI
                      training data will be permanently removed.
                    </p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all"
                    >
                      <Trash2 size={18} />
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
