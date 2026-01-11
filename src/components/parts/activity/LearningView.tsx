import { LearningSectionProps } from "@/types/activity";
import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

export const LearningSection = ({
  learningGaps,
  curriculum,
}: LearningSectionProps) => {
  return (
    <div className="space-y-10">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-amber-600 rounded-full" /> Technical Gaps
          </h3>
          <ul className="space-y-6">
            {learningGaps?.technical?.map((item, index) => (
              <li key={index+1}>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-slate-700">{item.skill}</span>
                  <span
                    className={`${
                      item.priority === "High"
                        ? "text-amber-600"
                        : "text-slate-400"
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-full transition-all duration-1000"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-amber-600 rounded-full" /> Mindset & Soft
            Skills
          </h3>
          <ul className="space-y-4">
            {learningGaps?.soft?.map((skill, index) => (
              <li
                key={index+1}
                className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl text-amber-700 text-sm font-bold border border-amber-100/50"
              >
                <ArrowRight size={16} className="text-amber-400" /> {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
        <h3 className="text-xl font-bold mb-6">Recommended Curriculum</h3>
        <div className="grid gap-4">
          {curriculum?.map((item, index) => (
            <Link
              key={index+1}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 p-5 rounded-2xl flex items-center justify-between border border-white/10 hover:bg-white/15 transition-all group"
            >
              <div>
                <p className="font-bold text-lg group-hover:text-amber-400 transition-colors">
                  {item.course}
                </p>
                <p className="text-sm opacity-60">{item.provider}</p>
              </div>
              <ExternalLink
                size={20}
                className="opacity-40 group-hover:opacity-100 transition-opacity"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
