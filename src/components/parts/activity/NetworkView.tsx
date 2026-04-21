"use client";

import { useState } from "react";
import { NetworkPerson } from "@/types/activity";
import { Info, Users, Sparkles, Loader2 } from "lucide-react";
import { SectionFeedback } from "./SectionFeedback";
import { toast } from "sonner";

interface NetworkSectionProps {
  network: NetworkPerson[] | undefined;
  reason: string | undefined;
  activityId?: string;
}

export const NetworkSection = ({
  network,
  reason,
  activityId,
}: NetworkSectionProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateNetwork = async () => {
    if (!activityId) return;
    
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId, section: "network" }),
      });
      
      const result = await res.json();
      
      if (res.ok) {
        toast.success("Network recommendations generated!");
        window.location.reload();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to generate network");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {reason && (
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-4xl flex items-start md:items-center gap-4">
          <div className="bg-amber-100 p-2 rounded-xl">
            <Info className="text-amber-600" size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-900 leading-relaxed">
              {reason}
            </p>
          </div>
          {activityId && (
            <SectionFeedback
              activityId={activityId}
              sectionType="network"
              sectionTitle="Social Circle"
            />
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {network && network.length > 0 ? (
          <>
            {activityId && (
              <div className="col-span-2 flex justify-end">
                <button
                  onClick={handleGenerateNetwork}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl font-bold hover:bg-amber-200 disabled:opacity-50 text-sm"
                >
                  {isGenerating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Sparkles size={16} />
                  )}
                  Regenerate
                </button>
              </div>
            )}
            {network.map((person, index) => (
              <div
                key={index + 1}
                className="bg-white border border-slate-100 p-8 rounded-[2.5rem] flex flex-col sm:flex-row items-start gap-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-amber-50 group-hover:border-amber-100 transition-colors">
                  <Users
                    className="text-slate-300 group-hover:text-amber-500 transition-colors"
                    size={24}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-600 tracking-[0.2em] mb-1 block">
                        {person.type}
                      </span>
                      <h4 className="text-xl font-bold text-slate-900">
                        {person.name}
                      </h4>
                      <p className="text-sm font-semibold text-slate-400 mb-4">
                        {person.role}
                      </p>
                    </div>
                    {activityId && (
                      <SectionFeedback
                        activityId={activityId}
                        sectionType="network"
                        sectionTitle="Social Circle"
                        itemId={`network-${index}`}
                        itemTitle={person.name}
                      />
                    )}
                  </div>

                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-100 rounded-full" />
                    <p className="text-sm text-slate-600 pl-4 leading-relaxed">
                      <span className="font-bold text-slate-900 block text-[10px] uppercase mb-1">
                        Strategic Value:
                      </span>
                      {person.reason}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="col-span-2 py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium mb-4">
              No networking archetypes generated for this path.
            </p>
            {activityId && (
              <button
                onClick={handleGenerateNetwork}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 disabled:opacity-50 mx-auto"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate Network
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
