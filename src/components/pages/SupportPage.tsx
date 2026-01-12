"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/db/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import {
  LifeBuoy,
  Send,
  MessageSquare,
  FileQuestion,
  ChevronDown,
  Clock,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import Footer from "../parts/Footer";

const FAQS = [
  {
    q: "What is the 'North Star' in the roadmap?",
    a: "It's your ultimate career goal. Our AI uses this to reverse-engineer the skills you need today.",
  },
  {
    q: "Are the roadmaps updated automatically?",
    a: "Yes, we refresh data points weekly to ensure we aren't suggesting outdated technologies.",
  },
  {
    q: "How do I download my achievement flier?",
    a: "Complete all modules in a roadmap, and a 'Claim Badge' button will appear in your Workspace.",
  },
  {
    q: "Can I share my workspace with others?",
    a: "Currently, workspaces are private. Collaborative team workspaces are coming in a future Pro update.",
  },
  {
    q: "What does 'Ambition Level' change?",
    a: "Steady focuses on core skills; Disruptor adds high-risk, high-reward skills and networking milestones.",
  },
  {
    q: "Why is my icon missing on the flier?",
    a: "This usually happens due to browser cache. Try downloading again or check your internet connection.",
  },
  {
    q: "Is the QR code on the flier permanent?",
    a: "Yes. It links to a unique verification URL on our domain that never expires.",
  },
  {
    q: "How do I add documents to my assessment?",
    a: "You can upload PDFs or Word docs (resumes/certs) during the initial goal-setting phase.",
  },
  {
    q: "What if the AI makes a mistake in the roadmap?",
    a: "You can 'Edit' any module or delete steps that you have already mastered.",
  },
  {
    q: "Can I have multiple active roadmaps?",
    a: "Free users can have 1 active path; Pro users get unlimited active workspaces.",
  },
  {
    q: "How does the 'Verify' page work?",
    a: "It's a public link that checks our database to confirm the user actually earned that specific badge.",
  },
  {
    q: "Does the app work on mobile?",
    a: "Yes, the platform is fully responsive. You can track progress on the go.",
  },
  {
    q: "What happens if I delete my account?",
    a: "All your data, including earned badges and workspaces, will be permanently removed.",
  },
  {
    q: "Are there real mentors available?",
    a: "Currently, we offer AI Mentors. Real-world mentor matching is in our long-term roadmap.",
  },
  {
    q: "How do I change my profile name?",
    a: "Navigate to Settings in your profile dashboard to update your public display name.",
  },
  {
    q: "Why is the flier aspect ratio 4:5?",
    a: "We optimized it for professional sharing on LinkedIn and Instagram stories.",
  },
  {
    q: "Do you offer refunds for Pro plans?",
    a: "Yes, we have a 14-day 'no questions asked' refund policy if you aren't satisfied.",
  },
  {
    q: "Can I export my workspace data?",
    a: "You can export your progress as a CSV or JSON file from the workspace settings.",
  },
  {
    q: "What technologies does the AI focus on?",
    a: "Everything from Software Engineering and AI to Product Management and Creative Arts.",
  },
  {
    q: "How do I report a bug?",
    a: "Use the 'Technical Issue' category in the support ticket form below!",
  },
];

export default function SupportPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "supportTickets"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTickets(ticketData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await addDoc(collection(db, "supportTickets"), {
        userId: user?.uid || "guest",
        email: user?.email || formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
        category: formData.get("category"),
        status: "pending", // Default status
        createdAt: serverTimestamp(),
      });
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "solved":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "working":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-amber-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-200">
            <LifeBuoy size={32} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">
            Support Portal
          </h1>
          <p className="text-slate-500 font-medium">
            Manage your tickets and find answers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-6">
          <div className="lg:col-span-2 space-y-12">
            {user && (
              <section>
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Clock size={18} /> Your Recent Tickets
                </h2>
                <div className="space-y-3">
                  {tickets.length === 0 ? (
                    <div className="p-8 bg-white rounded-3xl border border-dashed border-slate-200 text-center text-slate-400 font-medium">
                      No active tickets found.
                    </div>
                  ) : (
                    tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between"
                      >
                        <div>
                          <p className="font-black text-slate-800">
                            {ticket.subject}
                          </p>
                          <p className="text-xs text-slate-400 font-bold uppercase mt-1">
                            {ticket.category}
                          </p>
                        </div>
                        <div
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${getStatusStyle(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <FileQuestion size={18} /> Knowledge Base
              </h2>
              <div className="space-y-3 min-h-150 overflow-y-auto pr-2 scrollbar-hide">
                {FAQS.map((faq, i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full p-5 text-left flex justify-between items-center"
                    >
                      <span className="font-bold text-slate-700 text-sm">
                        {faq.q}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          openFaq === i ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openFaq === i && (
                      <div className="p-5 pt-0 text-slate-500 text-sm font-medium leading-relaxed bg-slate-50/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <MessageSquare size={20} className="text-amber-500" /> New
                Ticket
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                    Category
                  </label>
                  <select
                    name="category"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none font-bold text-sm"
                  >
                    <option>Technical Issue</option>
                    <option>Billing</option>
                    <option>Roadmap Feedback</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                    Subject
                  </label>
                  <input
                    name="subject"
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none font-bold text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                    Description
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none font-bold text-sm resize-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-amber-600 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}{" "}
                  Send Request
                </button>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
