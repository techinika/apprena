"use client";

import React from "react";
import { FileText, Eye, ExternalLink } from "lucide-react";
import type { Activity } from "@/types/activity";

interface YourInputSectionProps {
  activity: Activity | null;
}

const QUESTIONS = [
  { id: "current", label: "Current Reality", key: "What is your current role and biggest professional frustration?" },
  { id: "goal", label: "The North Star", key: "Where do you want to be in 5-10 years?" },
  { id: "skills", label: "Inventory", key: "What are your top 3 'Superpowers' and 3 biggest gaps?" },
  { id: "blocks", label: "Obstacles", key: "What is the #1 thing stopping you from reaching your goal?" },
  { id: "ecosystem", label: "Social Circle", key: "Do you have mentors? Who do you spend time with professionally?" },
];

export function YourInputSection({ activity }: YourInputSectionProps) {
  return (
    <div className="space-y-8">
      <div className="bg-white border border-slate-100 rounded-3xl p-8">
        <h3 className="text-xl font-black mb-6 flex items-center gap-3">
          <FileText className="text-amber-500" size={24} />
          Your Answers
        </h3>
        <div className="space-y-6">
          {QUESTIONS.map((q) => (
            <div key={q.id} className="border-b border-slate-100 pb-4 last:border-0">
              <p className="text-xs font-black text-amber-500 uppercase tracking-wider mb-2">
                {q.label}
              </p>
              <p className="text-slate-700 font-medium">
                {activity?.userInput?.[q.id as keyof typeof activity.userInput] || "Not provided"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {activity?.uploadedDocuments && activity.uploadedDocuments.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-3xl p-8">
          <h3 className="text-xl font-black mb-6 flex items-center gap-3">
            <Eye className="text-amber-500" size={24} />
            Uploaded Documents
          </h3>
          <div className="grid gap-4">
            {activity.uploadedDocuments.map((doc, i) => (
              <a
                key={i}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-amber-50 transition-colors group"
              >
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center">
                  <FileText className="text-slate-400 group-hover:text-amber-600" size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 group-hover:text-amber-700">
                    {doc.name}
                  </p>
                  <p className="text-xs text-slate-400">Click to view PDF</p>
                </div>
                <ExternalLink className="text-slate-300 group-hover:text-amber-500" size={18} />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
