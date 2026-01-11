import { HabitItem } from "@/types/activity";

export const HabitsSection = ({
  habits,
}: {
  habits: HabitItem[] | undefined;
}) => {
  if (!habits || habits.length === 0) {
    return (
      <div className="p-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center">
        <p className="text-slate-400 font-medium">
          No specific habits generated for this path yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {habits.map((habit, index) => (
        <div
          key={index + 1}
          className="bg-white border border-slate-100 p-8 rounded-3xl hover:border-amber-200 hover:shadow-xl hover:shadow-amber-500/5 transition-all group"
        >
          <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform duration-300">
            {habit.icon || "✨"}
          </span>
          <h3 className="text-xl font-black mb-2 text-slate-900">
            {habit.title}
          </h3>
          <p className="text-slate-500 leading-relaxed text-sm">{habit.desc}</p>
        </div>
      ))}
    </div>
  );
};
