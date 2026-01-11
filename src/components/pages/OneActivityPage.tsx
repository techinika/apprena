"use client";

import React, { useEffect, useState } from "react";
import {
  Map,
  BookOpen,
  Repeat,
  Users,
  Trophy,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Info,
  Layers,
  List,
} from "lucide-react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: true,
  theme: "base",
  themeVariables: {
    primaryColor: "#4f46e5", // Your Indigo color
    primaryTextColor: "#fff",
    lineColor: "#e2e8f0",
    fontSize: "14px",
  },
});

const FlowchartView = ({ chartCode }: { chartCode: string }) => {
  useEffect(() => {
    mermaid.contentLoaded();
  }, [chartCode]);

  return (
    <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-inner flex justify-center overflow-x-auto">
      <div className="mermaid">
        {chartCode ||
          `graph TD
          A[Current Status] --> B{Skill Gap}
          B -->|Learned| C[Immediate Milestone]
          B -->|Missing| D[Learning Path]
          D --> C
          C --> E[Goal Reached]`}
      </div>
    </div>
  );
};

const AnalysisDetail = () => {
  const [activeTab, setActiveTab] = useState("roadmap");
  const [roadmapView, setRoadmapView] = useState("timeline");

  const navItems = [
    { id: "roadmap", label: "Roadmap", icon: Map },
    { id: "learning", label: "Learning Path", icon: BookOpen },
    { id: "habits", label: "Action & Habits", icon: Repeat },
    { id: "network", label: "Social Circle", icon: Users },
    { id: "achievements", label: "Achievements", icon: Trophy },
  ];

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-[#FDFDFF] text-slate-900 flex">
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-[90vh]">
        <div className="p-8">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === item.id
                    ? "bg-amber-50 text-amber-600 shadow-sm"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-50">
          <button className="w-full bg-slate-900 text-white p-4 rounded-2xl text-sm font-bold hover:bg-amber-600 transition-colors">
            Share Analysis
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-12 max-w-5xl mx-auto overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-amber-600 font-bold text-sm uppercase tracking-widest mb-2">
              Analysis Results
            </p>
            <h1 className="text-4xl font-black text-slate-900">
              Fintech Founder Path
            </h1>
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-sm font-medium">
              Confidence Score
            </span>
            <div className="text-2xl font-black text-emerald-500">94%</div>
          </div>
        </div>

        {/* SECTION RENDERING */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {activeTab === "roadmap" && (
            <RoadmapSection view={roadmapView} setView={setRoadmapView} />
          )}
          {activeTab === "learning" && <LearningSection />}
          {activeTab === "habits" && <HabitsSection />}
          {activeTab === "network" && <NetworkSection />}
          {activeTab === "achievements" && <AchievementsSection />}
        </div>
      </main>
    </div>
  );
};

const RoadmapSection = ({ view, setView }: any) => (
  <section className="space-y-8">
    <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
      {[
        { id: "timeline", icon: List, label: "Timeline" },
        { id: "flow", icon: Layers, label: "Flowchart" },
      ].map((t) => (
        <button
          key={t.id}
          onClick={() => setView(t.id)}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            view === t.id
              ? "bg-white shadow-sm text-amber-600"
              : "text-slate-500"
          }`}
        >
          <t.icon size={14} /> {t.label}
        </button>
      ))}
    </div>

    {view === "timeline" ? (
      <div className="relative border-l-2 border-amber-100 ml-4 pl-10 space-y-12 py-4">
        {[
          {
            title: "The Foundation",
            desc: "Master Financial Compliance & API Architecture",
            tag: "Month 1-3",
            result: "MVP Logic Ready",
          },
          {
            title: "Market Entry",
            desc: "Beta launch with 100 trusted users & feedback loop",
            tag: "Month 4-7",
            result: "Product-Market Fit",
          },
          {
            title: "Growth Engine",
            desc: "Implement viral loops and Series A preparation",
            tag: "Month 8-12",
            result: "Scale-Ready Entity",
          },
        ].map((step, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-[53px] top-0 w-6 h-6 bg-white border-4 border-amber-600 rounded-full" />
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <span className="text-xs font-black text-amber-500 uppercase">
                {step.tag}
              </span>
              <h3 className="text-xl font-bold mt-1">{step.title}</h3>
              <p className="text-slate-500 mt-2">{step.desc}</p>
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <CheckCircle2 size={16} /> Expected: {step.result}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="bg-slate-50 rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
        <p className="text-slate-400 font-medium italic">
          Flowchart Diagram Visualization Engine Loading...
        </p>
        <FlowchartView chartCode="flowchart" />
      </div>
    )}
  </section>
);

const LearningSection = () => (
  <div className="space-y-10">
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white border border-slate-100 p-8 rounded-3xl">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <div className="w-2 h-6 bg-amber-600 rounded-full" /> Technical Gaps
        </h3>
        <ul className="space-y-6">
          {[
            "Node.js Backend Architecture",
            "Smart Contract Development",
            "Financial Regulation (SEC)",
          ].map((skill) => (
            <li key={skill}>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>{skill}</span>
                <span className="text-amber-600">High Priority</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full w-1/3" />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white border border-slate-100 p-8 rounded-3xl">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <div className="w-2 h-6 bg-purple-600 rounded-full" /> Soft Skill Gaps
        </h3>
        <ul className="space-y-4">
          {[
            "Venture Capital Pitching",
            "Rapid Team Delegation",
            "Crisis Decision Making",
          ].map((skill) => (
            <li
              key={skill}
              className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl text-purple-700 text-sm font-bold"
            >
              <ArrowRight size={16} /> {skill}
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
      <h3 className="text-xl font-bold mb-4">Recommended Curriculum</h3>
      <div className="space-y-4">
        <div className="bg-white/10 p-4 rounded-xl flex items-center justify-between border border-white/10">
          <div>
            <p className="font-bold">Fintech 101: Global Regulations</p>
            <p className="text-sm opacity-60">Wharton Online via Coursera</p>
          </div>
          <ExternalLink size={18} className="opacity-40" />
        </div>
      </div>
    </div>
  </div>
);

const HabitsSection = () => (
  <div className="grid md:grid-cols-2 gap-6">
    {[
      {
        title: "The 80/20 Audit",
        desc: "Every Sunday at 6 PM, review which 20% of your tasks created 80% of your progress.",
        icon: "📊",
      },
      {
        title: "Deep Work Blocks",
        desc: "Minimum of 4 hours daily for high-level architecture/coding without pings.",
        icon: "🧠",
      },
      {
        title: "Founder Journaling",
        desc: "Document daily failures to accelerate the learning loop.",
        icon: "✍️",
      },
    ].map((habit) => (
      <div
        key={habit.title}
        className="bg-white border border-slate-100 p-8 rounded-3xl hover:border-amber-200 transition-all"
      >
        <span className="text-4xl mb-4 block">{habit.icon}</span>
        <h3 className="text-xl font-black mb-2">{habit.title}</h3>
        <p className="text-slate-500 leading-relaxed text-sm">{habit.desc}</p>
      </div>
    ))}
  </div>
);

const NetworkSection = () => (
  <div className="space-y-8">
    <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex items-center gap-4">
      <Info className="text-amber-600" />
      <p className="text-sm font-medium text-amber-900">
        Your current social circle is <strong>technical-heavy</strong>. To reach
        your goal, you must shift 30% of your focus toward{" "}
        <strong>Regulators and VCs</strong>.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      {[
        {
          name: "The Institutional Insider",
          role: "VP at a Global Bank",
          reason: "Can provide 'sandboxes' for your fintech product.",
          type: "Gatekeeper",
        },
        {
          name: "The Exit Founder",
          role: "Sold a company for $50M+",
          reason: "Knows the psychological toll of scaling.",
          type: "Mentor",
        },
      ].map((person) => (
        <div
          key={person.name}
          className="bg-white border border-slate-100 p-8 rounded-3xl flex items-start gap-6"
        >
          <div className="w-16 h-16 rounded-full bg-slate-200 flex-shrink-0" />
          <div>
            <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest">
              {person.type}
            </span>
            <h4 className="text-lg font-bold">{person.name}</h4>
            <p className="text-sm text-slate-400 mb-3">{person.role}</p>
            <p className="text-sm text-slate-600 italic">" {person.reason} "</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AchievementsSection = () => (
  <div className="space-y-12">
    <div className="relative">
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-slate-100" />
      {[
        {
          time: "12 Months",
          title: "Series A Readiness",
          achievement:
            "Secured first 10k users, $500k ARR, 5-person core team.",
        },
        {
          time: "5 Years",
          title: "Industry Challenger",
          achievement:
            "Licensed in 3 continents, competing with top-tier banks.",
        },
        {
          time: "10 Years",
          title: "C-Suite / Visionary",
          achievement:
            "Board Member for Fintech coalitions, potential IPO or major exit.",
        },
      ].map((level, i) => (
        <div
          key={i}
          className={`relative flex items-center justify-between mb-12 ${
            i % 2 === 0 ? "flex-row-reverse" : ""
          }`}
        >
          <div className="w-[45%] bg-white border border-slate-100 p-8 rounded-3xl shadow-sm">
            <h4 className="text-amber-600 font-black text-2xl mb-1">
              {level.time}
            </h4>
            <p className="font-bold text-slate-900 mb-2">{level.title}</p>
            <p className="text-sm text-slate-500 leading-relaxed">
              {level.achievement}
            </p>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-600 rounded-full border-4 border-white shadow-md z-10" />
          <div className="w-[45%]" />
        </div>
      ))}
    </div>
  </div>
);

export default AnalysisDetail;
