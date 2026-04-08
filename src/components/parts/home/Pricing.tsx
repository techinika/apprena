import { useAuth } from "@/lib/AuthContext";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const EXCHANGE_RATE = 1200;

export const Pricing = () => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <section id="pricing" className="py-32 px-8 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
          Simple, Fair Pricing
        </h2>
        <p className="text-slate-500 text-xl font-medium">
          Invest in a roadmap, not a guess.
        </p>
        <p className="text-amber-600 text-sm font-bold mt-2">
          Prices in Rwandan Francs (RWF)
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="p-10 rounded-[3rem] bg-slate-50 border border-slate-200 flex flex-col">
          <h3 className="text-xl font-black mb-2 uppercase tracking-widest text-slate-400">
            Explorer
          </h3>
          <div className="text-5xl font-black mb-8 text-slate-900">Free</div>
          <ul className="space-y-4 mb-10 flex-grow">
            {["2 Career Analyses", "Basic Roadmap View", "Social Insights"].map(
              (item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-slate-600 font-bold text-sm"
                >
                  <Check className="text-amber-600" size={18} strokeWidth={3} />{" "}
                  {item}
                </li>
              )
            )}
          </ul>
          <Link href="/login">
            <button className="w-full py-4 rounded-2xl font-black border-2 border-slate-200 hover:bg-white transition-all uppercase text-xs tracking-widest">
              Start Free
            </button>
          </Link>
        </div>

        <div className="p-10 rounded-[3rem] bg-white border-2 border-amber-600 shadow-2xl relative flex flex-col scale-105 z-10">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-600 text-white px-6 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase">
            Recommended
          </div>
          <h3 className="text-xl font-black mb-2 uppercase tracking-widest text-amber-600">
            Single Sprint
          </h3>
          <div className="text-5xl font-black mb-8 text-slate-900">
            1,200 RWF
            <span className="text-sm text-slate-400 font-normal">
              {" "}
              /analysis
            </span>
          </div>
          <ul className="space-y-4 mb-10 flex-grow">
            {[
              "Full Strategic Roadmap",
              "Network Expansion Playbook",
              "Habit Action Plan",
              "PDF Export",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-slate-700 font-bold text-sm"
              >
                <Check className="text-amber-600" size={18} strokeWidth={3} />{" "}
                {item}
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              if (user) {
                router.push("/upgrade");
              } else {
                router.push("/login?ref=upgrade");
              }
            }}
            className="w-full py-5 rounded-2xl font-black bg-amber-600 text-white hover:bg-amber-700 transition-all shadow-xl shadow-amber-200 uppercase text-xs tracking-widest"
          >
            Unlock Analysis
          </button>
        </div>

        <div className="p-10 rounded-[3rem] bg-slate-900 text-white flex flex-col">
          <h3 className="text-xl font-black mb-2 uppercase tracking-widest text-slate-500">
            Architect
          </h3>
          <div className="text-5xl font-black mb-8">
            12,000 RWF<span className="text-sm text-slate-500 font-normal"> /mo</span>
          </div>
          <ul className="space-y-4 mb-10 grow">
            {[
              "Unlimited Roadmaps",
              "Real-time Trend Tracking",
              "Mentor Matchmaking",
              "Priority AI Support",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-slate-300 font-bold text-sm"
              >
                <Star className="text-amber-400 fill-amber-400" size={18} />{" "}
                {item}
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              if (user) {
                router.push("/upgrade");
              } else {
                router.push("/login?ref=upgrade");
              }
            }}
            className="w-full py-4 rounded-2xl font-black bg-white text-slate-900 hover:bg-amber-50 transition-all uppercase text-xs tracking-widest"
          >
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};
