"use client";

import React from "react";
import {
  Map,
  TrendingUp,
  FileText,
  BookOpen,
  Repeat,
  Users,
  Trophy,
  Share2,
  Link,
  Globe,
  Lock,
  Loader2,
  Copy,
  Check,
  Trash2,
  Download,
} from "lucide-react";
import type { Activity } from "@/types/activity";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: "roadmap", label: "Roadmap", icon: Map },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "input", label: "Your Input", icon: FileText },
  { id: "learning", label: "Learning Path", icon: BookOpen },
  { id: "habits", label: "Action & Habits", icon: Repeat },
  { id: "network", label: "Social Circle", icon: Users },
  { id: "achievements", label: "Achievements", icon: Trophy },
];

interface AnalysisSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activity: Activity | null;
  sharing: boolean;
  showShareMenu: boolean;
  copied: boolean;
  downloading: boolean;
  onShare: (makePublic: boolean) => void;
  onCopyLink: () => void;
  onDownloadPdf: () => void;
  onDelete: () => void;
  onToggleShareMenu: () => void;
}

export function AnalysisSidebar({
  activeTab,
  setActiveTab,
  activity,
  sharing,
  showShareMenu,
  copied,
  downloading,
  onShare,
  onCopyLink,
  onDownloadPdf,
  onDelete,
  onToggleShareMenu,
}: AnalysisSidebarProps) {
  return (
    <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-[90vh]">
      <div className="p-8">
        <nav className="space-y-2">
          {NAV_ITEMS.map((item) => (
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

      <div className="mt-auto p-6 border-t border-slate-50 relative">
        <button
          onClick={onDownloadPdf}
          disabled={downloading}
          className="w-full bg-amber-500 text-slate-900 p-4 rounded-2xl text-sm font-bold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
        >
          {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          Download PDF
        </button>
        <button
          onClick={onToggleShareMenu}
          className="w-full mt-2 bg-slate-900 text-white p-4 rounded-2xl text-sm font-bold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
        >
          <Share2 size={18} />
          {activity?.isPublic ? "Public" : "Share Analysis"}
        </button>
        <button
          onClick={onDelete}
          className="w-full mt-2 bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 size={18} />
          Delete Roadmap
        </button>

        {showShareMenu && (
          <div className="absolute bottom-full left-6 right-6 mb-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 animate-in fade-in slide-in-from-bottom-2">
            <p className="text-xs text-slate-400 mb-3 font-bold uppercase">
              {activity?.isPublic ? "Your roadmap is public" : "Make your roadmap visible to others"}
            </p>
            <div className="space-y-2">
              {activity?.isPublic && (
                <button
                  onClick={onCopyLink}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                >
                  {copied ? <Check size={18} className="text-emerald-500" /> : <Link size={18} className="text-slate-500" />}
                  <div>
                    <p className="font-bold text-sm text-slate-900">{copied ? "Copied!" : "Copy Link"}</p>
                    <p className="text-xs text-slate-500">Share public URL</p>
                  </div>
                </button>
              )}
              {activity?.isPublic ? (
                <button
                  onClick={() => onShare(false)}
                  disabled={sharing}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-red-50 transition-colors text-left"
                >
                  {sharing ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} className="text-red-500" />}
                  <div>
                    <p className="font-bold text-sm text-slate-900">Make Private</p>
                    <p className="text-xs text-slate-500">Hide from public</p>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => onShare(true)}
                  disabled={sharing}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors text-left"
                >
                  {sharing ? <Loader2 size={18} className="animate-spin" /> : <Globe size={18} className="text-amber-600" />}
                  <div>
                    <p className="font-bold text-sm text-slate-900">Make Public</p>
                    <p className="text-xs text-slate-500">Anyone can view</p>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
