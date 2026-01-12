"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  ShieldCheck,
  Database,
  Trash2,
  Mail,
} from "lucide-react";
import MainNav from "../parts/MainNav";
import { APP } from "@/variables/globals";
import Footer from "../parts/Footer";

const PrivacyPolicy = () => {
  const lastUpdated = "January 12, 2026";

  const sections = [
    { id: "collection", title: "Information We Collect" },
    { id: "usage", title: "How We Use Data" },
    { id: "sharing", title: "Data Sharing & Third Parties" },
    { id: "retention", title: "Data Retention" },
    { id: "rights", title: "Your Rights & Control" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 pb-20">
      <div className="bg-slate-900 relative">
        <div className="absolute inset-0 bg-linear-to-br from-amber-950 via-slate-950 to-black pointer-events-none" />
        <div className="relative z-50 border-b border-white/5">
          <MainNav />
        </div>
      </div>
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-amber-600 transition-colors font-bold text-sm"
          >
            <ArrowLeft size={18} /> Back to Home
          </Link>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Privacy & Trust
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-16 mb-4">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <ShieldCheck size={12} /> Privacy Verified
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
            We value your trust. This policy outlines how we handle your data
            with transparency, focusing on security and user control.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <nav className="sticky top-32 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Sections
              </p>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block text-sm font-bold text-slate-500 hover:text-amber-600 transition-colors"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-16 text-slate-700 leading-relaxed">
            <section id="collection" className="scroll-mt-32">
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                  <Eye size={18} />
                </div>
                1. Information We Collect
              </h2>
              <p className="mb-4">
                We collect information to provide a personalized roadmap
                experience:
              </p>
              <ul className="list-disc pl-5 space-y-2 marker:text-emerald-500">
                <li>
                  <strong>Identity Data:</strong> Name, email, and profile
                  picture provided via Google Auth.
                </li>
                <li>
                  <strong>Usage Data:</strong> Your career goals, skills
                  entered, and generated roadmaps.
                </li>
                <li>
                  <strong>Financial Data:</strong> Transaction IDs and
                  subscription status (we do not store raw card numbers; these
                  are handled by our payment providers).
                </li>
              </ul>
            </section>

            <section id="usage" className="scroll-mt-32">
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                  <Database size={18} />
                </div>
                2. How We Use Data
              </h2>
              <p>
                Your data is used solely to generate your career analysis,
                manage your subscription credits, and improve the accuracy of
                our AI-driven roadmaps. We do not sell your personal information
                to third parties.
              </p>
            </section>

            <section id="sharing" className="scroll-mt-32">
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                3. Data Sharing & Third Parties
              </h2>
              <p className="mb-4">
                We share limited data with the following service providers:
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <p className="font-bold text-slate-900 text-sm">
                    Firebase (Google Cloud)
                  </p>
                  <p className="text-xs text-slate-500">
                    Used for secure database storage and user authentication.
                  </p>
                </div>
                <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <p className="font-bold text-slate-900 text-sm">
                    AI Infrastructure Providers
                  </p>
                  <p className="text-xs text-slate-500">
                    Used to process your career inputs and generate analysis
                    results. Your identity is masked during this process.
                  </p>
                </div>
              </div>
            </section>

            <section id="retention" className="scroll-mt-32">
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                  <Trash2 size={18} />
                </div>
                4. Data Retention
              </h2>
              <p>
                We retain your roadmap data as long as your account is active.
                If you choose to <strong>delete your account</strong>, we
                immediately wipe your profile and activities. As per legal
                requirements, transaction logs and subscription histories are
                archived for 7 years to comply with tax and financial
                regulations.
              </p>
            </section>

            <section id="rights" className="scroll-mt-32">
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                  <Mail size={18} />
                </div>
                5. Your Rights & Control
              </h2>
              <p>
                You have the right to access, export, or delete your data at any
                time through your Profile dashboard. You may also revoke Google
                Account access through your{" "}
                <Link
                  href="https://myaccount.google.com/permissions"
                  className="text-emerald-600 font-bold hover:underline"
                  target="_blank"
                >
                  Google Security Settings
                </Link>
                .
              </p>
            </section>

            <div className="pt-12 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">
                Last Updated: {lastUpdated} • {new Date().getFullYear()} ©
                {APP?.NAME} Platform
              </p>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
