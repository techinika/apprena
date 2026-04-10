"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
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
  Mail,
  MessageCircle,
  BookOpen,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import Footer from "../parts/Footer";
import Link from "next/link";

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

const CONTACT_METHODS = [
  {
    icon: Mail,
    label: "Email Support",
    description: "products@techinika.com",
    href: "mailto:products@techinika.com",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: MessageCircle,
    label: "Live Chat",
    description: "Click to chat with us",
    href: "#",
    color: "bg-emerald-50 text-emerald-600 cursor-pointer hover:scale-105",
    onClick: () => {
      if (typeof window !== "undefined" && (window as any).Tawk_API) {
        (window as any).Tawk_API.maximize();
      }
    },
  },
];

const CATEGORIES = [
  {
    value: "Technical Issue",
    label: "Technical Issue",
    desc: "Bug reports, errors, or app glitches",
  },
  {
    value: "Billing",
    label: "Billing & Payments",
    desc: "Subscription, invoices, or refund questions",
  },
  {
    value: "Roadmap Feedback",
    label: "Roadmap Feedback",
    desc: "Suggestions to improve your roadmap",
  },
  {
    value: "Account",
    label: "Account Help",
    desc: "Login, profile, or security concerns",
  },
  {
    value: "Feature Request",
    label: "Feature Request",
    desc: "Suggest new features or improvements",
  },
];

export default function SupportPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "supportTickets"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
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
        status: "pending",
        createdAt: serverTimestamp(),
      });
      form.reset();
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
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

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const recentTickets = tickets.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-6">
      <Script
        id="tawk-script"
        strategy="lazyOnload"
        src="https://embed.tawk.to/67e0a9fa4d96ff1912ebc675/1k5c9d3s8"
      />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-200">
            <LifeBuoy size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
            How can we help?
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-md mx-auto">
            Search our knowledge base or submit a ticket. We typically respond
            within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
              <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-amber-500" /> Quick Help
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CONTACT_METHODS.map((method) => (
                  method.onClick ? (
                    <button
                      key={method.label}
                      onClick={method.onClick}
                      className={`${method.color} p-5 rounded-2xl flex items-center gap-4 hover:scale-105 transition-transform text-left`}
                    >
                      <method.icon size={24} />
                      <div>
                        <p className="font-bold text-sm">{method.label}</p>
                        <p className="text-xs opacity-70">{method.description}</p>
                      </div>
                    </button>
                  ) : (
                    <a
                      key={method.label}
                      href={method.href}
                      className={`${method.color} p-5 rounded-2xl flex items-center gap-4 hover:scale-105 transition-transform`}
                    >
                      <method.icon size={24} />
                      <div>
                        <p className="font-bold text-sm">{method.label}</p>
                        <p className="text-xs opacity-70">{method.description}</p>
                      </div>
                    </a>
                  )
                ))}
              </div>
            </section>

            {user && recentTickets.length > 0 && (
              <section className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Clock size={18} /> Your Recent Tickets
                </h2>
                <div className="space-y-3">
                  {recentTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-slate-50 p-5 rounded-2xl flex items-center justify-between hover:bg-slate-100 transition-colors"
                    >
                      <div>
                        <p className="font-bold text-slate-800">
                          {ticket.subject}
                        </p>
                        <p className="text-xs text-slate-400 font-medium mt-1">
                          {ticket.category} ·{" "}
                          {ticket.createdAt?.toDate?.().toLocaleDateString() ||
                            "Recent"}
                        </p>
                      </div>
                      <div
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${getStatusStyle(
                          ticket.status,
                        )}`}
                      >
                        {ticket.status}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="mb-6">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FileQuestion size={18} /> Knowledge Base
                </h2>
                <input
                  type="text"
                  placeholder="Search frequently asked questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 font-medium text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {filteredFaqs.length === 0 ? (
                  <div className="p-8 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
                    <p className="text-slate-400 font-medium">
                      No FAQs match your search.
                    </p>
                  </div>
                ) : (
                  filteredFaqs.map((faq, i) => (
                    <div
                      key={i}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full p-5 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-bold text-slate-700 text-sm pr-4">
                          {faq.q}
                        </span>
                        <ChevronDown
                          size={18}
                          className={`shrink-0 transition-transform ${
                            openFaq === i ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openFaq === i && (
                        <div className="px-5 pb-5 text-slate-500 text-sm font-medium leading-relaxed bg-slate-50/50">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
              <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
                <MessageSquare size={22} className="text-amber-500" /> Submit a
                Ticket
              </h3>
              <p className="text-slate-400 text-xs font-medium mb-6">
                We respond within 24 hours on business days.
              </p>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="font-black text-slate-900 mb-2">
                    Ticket Submitted!
                  </h4>
                  <p className="text-slate-500 text-sm">
                    We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                      Category
                    </label>
                    <select
                      name="category"
                      required
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none font-bold text-sm focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Select a category...</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                      Subject
                    </label>
                    <input
                      name="subject"
                      required
                      placeholder="Brief description of your issue"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none font-bold text-sm focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                      Description
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      placeholder="Please describe your issue in detail..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none font-bold text-sm resize-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}{" "}
                    Send Request
                  </button>
                </form>
              )}

              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs text-slate-400 font-medium text-center">
                  Need urgent help? Email us directly at{" "}
                  <a
                    href="mailto:products@techinika.com"
                    className="text-amber-600 font-bold hover:underline"
                  >
                    products@techinika.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
