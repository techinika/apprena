"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Scale, ScrollText, Globe } from "lucide-react";
import MainNav from "../parts/MainNav";

const TermsOfService = () => {
  const lastUpdated = "October 24, 2025";

  const sections = [
    { id: "acceptance", title: "Acceptance of Terms" },
    { id: "accounts", title: "User Accounts & Security" },
    { id: "subscriptions", title: "Subscriptions & Payments" },
    { id: "usage", title: "Acceptable Use Policy" },
    { id: "intellectual", title: "Intellectual Property" },
    { id: "termination", title: "Termination & Deletion" },
    { id: "disclaimers", title: "Disclaimers & Liability" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 pb-20">
      <div className="bg-slate-900 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950 via-slate-950 to-black pointer-events-none" />
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
            Legal Documentation
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-16">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <ScrollText size={12} /> Effective Date: {lastUpdated}
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
            Please read these terms carefully before using our platform. By
            accessing or using our services, you agree to be bound by these
            terms.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block lg:col-span-1">
            <nav className="sticky top-32 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Table of Contents
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
            <section id="acceptance" className="scroll-mt-32">
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                  <Globe size={18} />
                </div>
                1. Acceptance of Terms
              </h2>
              <p>
                By creating an account or using the platform, you represent that
                you are at least 18 years of age and have the legal capacity to
                enter into these Terms. If you are using the platform on behalf
                of an entity, you represent that you have the authority to bind
                that entity to these Terms.
              </p>
            </section>

            <section id="accounts" className="scroll-mt-32">
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                  <ShieldCheck size={18} />
                </div>
                2. User Accounts & Security
              </h2>
              <p className="mb-4">
                You are responsible for maintaining the confidentiality of your
                account credentials, including your Google Authentication
                details. You agree to:
              </p>
              <ul className="list-disc pl-5 space-y-2 marker:text-amber-500">
                <li>Provide accurate and complete registration information.</li>
                <li>
                  Notify us immediately of any unauthorized access to your
                  account.
                </li>
                <li>
                  Be solely responsible for all activities that occur under your
                  account.
                </li>
              </ul>
            </section>

            <section id="subscriptions" className="scroll-mt-32">
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                  <Scale size={18} />
                </div>
                3. Subscriptions & Payments
              </h2>
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-4">
                <p>
                  <strong>Sprints:</strong> One-time purchases that grant
                  specific analysis credits. These credits do not expire but are
                  non-refundable once the analysis is initiated.
                </p>
                <p>
                  <strong>Architect Plan:</strong> A subscription-based service
                  billed monthly. Subscriptions automatically renew unless
                  cancelled through your profile settings.
                </p>
                <p>
                  <strong>Refunds:</strong> We offer a 7-day money-back
                  guarantee for initial subscriptions, provided no more than two
                  analyses have been performed.
                </p>
              </div>
            </section>

            <section id="usage" className="scroll-mt-32">
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                4. Acceptable Use Policy
              </h2>
              <p>
                You agree not to misuse the platform for any illegal activities,
                including but not limited to: scraping data without
                authorization, attempting to breach our security systems, or
                using AI-generated roadmaps to facilitate academic dishonesty or
                illegal professional practices.
              </p>
            </section>

            <section id="termination" className="scroll-mt-32">
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                5. Termination & Deletion
              </h2>
              <p>
                As detailed in our Security documentation, you have the right to
                delete your account at any time. Upon deletion, your profile and
                personal activities will be wiped. However,{" "}
                <strong>transactional records and subscription IDs</strong> will
                be retained for business, legal, and auditing purposes.
              </p>
            </section>

            <div className="pt-12 border-t border-slate-100">
              <p className="text-xs text-slate-400 italic">
                Questions about our Terms? Contact our legal team at{" "}
                <strong>legal@yourapp.com</strong>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
