import { NetworkPerson } from "@/types/activity";
import { Info, Users } from "lucide-react";

export const NetworkSection = ({
  network,
  reason,
}: {
  network: NetworkPerson[] | undefined;
  reason: string | undefined;
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {reason && (
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-4xl flex items-start md:items-center gap-4">
          <div className="bg-amber-100 p-2 rounded-xl">
            <Info className="text-amber-600" size={20} />
          </div>
          <p className="text-sm font-medium text-amber-900 leading-relaxed">
            {reason}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {network && network.length > 0 ? (
          network.map((person, index) => (
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
          ))
        ) : (
          <div className="col-span-2 py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
            No networking archetypes generated for this path.
          </div>
        )}
      </div>
    </div>
  );
};
