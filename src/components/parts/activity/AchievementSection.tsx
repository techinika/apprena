import { AchievementItem } from "@/types/activity";
import { Trophy } from "lucide-react";
import { SectionFeedback } from "./SectionFeedback";

interface AchievementsSectionProps {
  achievements: AchievementItem[] | undefined;
  activityId?: string;
}

export const AchievementsSection = ({
  achievements,
  activityId,
}: AchievementsSectionProps) => {
  if (!achievements || achievements.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
        <Trophy className="mx-auto text-slate-300 mb-4" size={48} />
        <p className="text-slate-500 font-bold">
          Visionary milestones will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-10">
      <div className="relative">
        <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-slate-100" />

        {achievements.map((level, i) => (
          <div
            key={i}
            className={`relative flex flex-col md:flex-row items-start md:items-center justify-between mb-16 last:mb-0 ${
              i % 2 === 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="ml-12 md:ml-0 w-[85%] md:w-[45%] bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-500 group">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-baseline gap-2">
                  <h4 className="text-amber-600 font-black text-3xl">
                    {level.time}
                  </h4>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Horizon
                  </span>
                </div>
                {activityId && (
                  <SectionFeedback
                    activityId={activityId}
                    sectionType="achievements"
                    sectionTitle="Achievements"
                    itemId={`achievement-${i}`}
                    itemTitle={level.title}
                  />
                )}
              </div>

              <h5 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                {level.title}
              </h5>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  &ldquo;{level.achievement}&rdquo;
                </p>
              </div>
            </div>

            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-white border-4 border-amber-600 rounded-full shadow-[0_0_15px_rgba(217,119,6,0.3)] z-10 transition-transform group-hover:scale-150" />

            <div className="hidden md:block w-[45%]" />
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
          End of Strategic Projection
        </p>
      </div>
    </div>
  );
};
