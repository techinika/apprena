"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Star,
  MessageSquare,
  Calendar,
  ArrowUpRight,
  Briefcase,
  Zap,
} from "lucide-react";

// --- Mock Data ---
const ACTIVE_MENTORS = [
  {
    id: 1,
    name: "Sarah Drasner",
    role: "VP of Engineering",
    company: "Google",
    image: "SD",
  },
];

const BROWSE_MENTORS = [
  {
    id: 2,
    name: "Marcus Aurelius",
    role: "Startup Founder",
    company: "FintechX",
    tags: ["Strategy", "Financing"],
    rate: "$40/hr",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Product Designer",
    company: "Meta",
    tags: ["Portfolio", "UX"],
    rate: "$35/hr",
    rating: 5.0,
  },
  {
    id: 4,
    name: "James Chen",
    role: "Data Scientist",
    company: "Netflix",
    tags: ["Python", "AI"],
    rate: "$50/hr",
    rating: 4.8,
  },
];

const MentorsPage = () => {
  const [filter, setFilter] = useState("All");

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <section className="mb-16">
          <h2 className="text-sm font-black uppercase tracking-widest text-amber-600 mb-6 flex items-center gap-2">
            <Zap size={16} fill="currentColor" /> Currently Working With
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {ACTIVE_MENTORS.map((m) => (
              <div
                key={m.id}
                className="bg-white border-2 border-amber-100 rounded-[2.5rem] p-8 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-amber-600 flex items-center justify-center text-white text-2xl font-bold">
                    {m.image}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {m.name}
                    </h3>
                    <p className="text-slate-500 text-sm">
                      {m.role} @ {m.company}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-md tracking-tighter uppercase">
                        Next Session: Tomorrow
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="bg-amber-600 text-white p-3 rounded-2xl hover:bg-amber-700 transition">
                    <MessageSquare size={20} />
                  </button>
                  <button className="bg-slate-100 text-slate-600 p-3 rounded-2xl hover:bg-slate-200 transition">
                    <Calendar size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. SECTION: EXPLORE MENTORS */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900">
                Explore Experts
              </h2>
              <p className="text-slate-500">
                Find a mentor who has already walked the path you want to take.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by company or skill..."
                  className="bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 w-full md:w-64 transition-all"
                />
              </div>
              <button className="bg-white border border-slate-200 p-3 rounded-2xl hover:bg-slate-50 transition">
                <Filter size={20} className="text-slate-600" />
              </button>
            </div>
          </div>

          {/* Filters Chips */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
            {["All", "Founders", "Engineering", "Design", "Marketing"].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                    filter === cat
                      ? "bg-slate-900 text-white shadow-lg"
                      : "bg-white border border-slate-200 text-slate-500 hover:border-amber-500"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Mentor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BROWSE_MENTORS.map((mentor) => (
              <div
                key={mentor.id}
                className="group bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                    {mentor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-black text-orange-500">
                    <Star size={14} fill="currentColor" /> {mentor.rating}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                    {mentor.name}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium">
                    {mentor.role}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-bold">
                    <Briefcase size={12} /> {mentor.company}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {mentor.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-slate-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Rate
                    </p>
                    <p className="text-lg font-black text-slate-900">
                      {mentor.rate}
                    </p>
                  </div>
                  <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-amber-600 transition-all flex items-center gap-2">
                    View Profile <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MentorsPage;
