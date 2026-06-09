import Image from "next/image";
import { getBadgeData } from "@/db/operations/BadgeVerify";
import { formatDate } from "@/lib/functions";
import { APP } from "@/variables/globals";
import { Award, ShieldAlert, ShieldCheck } from "lucide-react";

export default async function VerifyPage({ id }: { id: string }) {
  const data = await getBadgeData(id);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {data ? (
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100 text-center relative">
            <div className="top-0 left-0 w-full h-3 bg-linear-to-r from-amber-400 to-amber-500" />

            <div className="mt-4 mb-8">
              <Image
                src={data.photoURL || ""}
                width={80}
                height={80}
                className="rounded-full mx-auto border-4 border-white shadow-lg -mt-16"
                alt="Verified User"
              />
              <h1 className="text-2xl font-black text-slate-900 mt-4 leading-tight">
                {data.displayName}
              </h1>
              <p className="text-amber-600 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-1">
                <ShieldCheck size={16} /> Verified Learner
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <Award size={48} className="mx-auto text-amber-500 mb-4" />
                <h2 className="text-xl font-black text-slate-900 uppercase">
                  {data.title}
                </h2>
                <p className="text-slate-500 font-medium mt-2">
                  Completed on {formatDate(data.unlockedAt)}
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span>Verified by {APP?.NAME} AI</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <ShieldAlert size={64} className="mx-auto text-red-400 mb-4" />
            <h2 className="text-2xl font-black">Credential Not Found</h2>
            <p className="text-slate-500">
              This link may be broken or the badge was revoked.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
