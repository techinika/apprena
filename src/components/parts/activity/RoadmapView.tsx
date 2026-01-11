import { CheckCircle2, Layers, List } from "lucide-react";
import { FlowchartView } from "./FlowchartView";
import { RoadmapStep } from "@/types/activity";

export const RoadmapSection = ({
  view,
  setView,
  roadmap,
  chart,
}: {
  view: string;
  setView: (v: string) => void;
  roadmap: RoadmapStep[] | undefined;
  chart: string | undefined;
}) => {
  const steps = roadmap || [];

  return (
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
          {steps.length > 0 ? (
            steps.map((step, i) => (
              <div key={i + 1} className="relative">
                <div className="absolute -left-13.25 top-0 w-6 h-6 bg-white border-4 border-amber-600 rounded-full z-10" />

                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-black text-amber-500 uppercase tracking-wider">
                    {step.tag}
                  </span>
                  <h3 className="text-xl font-bold mt-1 text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 mt-2 leading-relaxed">
                    {step.desc}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <CheckCircle2 size={16} />
                    <span>Expected: {step.result}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-slate-400 italic">
              No roadmap steps generated. Try a more detailed assessment.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <FlowchartView chartData={chart} />
        </div>
      )}
    </section>
  );
};
