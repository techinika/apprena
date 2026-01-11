import { Fingerprint, TrendingUp, Users } from "lucide-react";

export const Features = () => (
  <section className="py-32 px-8 max-w-7xl mx-auto">
    <div className="grid md:grid-cols-3 gap-16">
      {[
        {
          title: "Skill Gap Analysis",
          icon: <Fingerprint />,
          color: "bg-amber-50 text-amber-600",
          desc: "Identify exactly what technical and soft skills you're missing for your goal.",
        },
        {
          title: "Social Tribes",
          icon: <Users />,
          color: "bg-purple-50 text-purple-600",
          desc: "Get a curated list of communities and mentor profiles you need to join.",
        },
        {
          title: "10-Year Projections",
          icon: <TrendingUp />,
          color: "bg-emerald-50 text-emerald-600",
          desc: "See where you'll be in a decade if you follow the execution plan today.",
        },
      ].map((f, i) => (
        <div key={i} className="group">
          <div
            className={`${f.color} w-16 h-16 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-current/10`}
          >
            {f.icon}
          </div>
          <h3 className="text-2xl font-black mb-4 text-slate-900">{f.title}</h3>
          <p className="text-slate-500 leading-relaxed font-medium">{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);
