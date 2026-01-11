"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, LayoutDashboard } from "lucide-react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="text-emerald-600" size={40} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-4 text-balance">
          Intelligence Map Complete
        </h1>
        <p className="text-slate-500 mb-10 leading-relaxed">
          Your custom career execution plan has been generated and added to your
          workspace.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => router.push(`/workspace/${id}`)}
            className="w-full py-5 bg-amber-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-amber-700 transition-all shadow-lg shadow-amber-200"
          >
            View Roadmap <ArrowRight size={18} />
          </button>

          <button
            onClick={() => router.replace("/workspace")}
            className="w-full py-5 bg-slate-100 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
          >
            <LayoutDashboard size={18} /> Go to Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
