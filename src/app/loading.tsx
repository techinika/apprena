"use client";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950">
      <div className="fixed top-0 left-0 right-0 h-1 z-[60] overflow-hidden">
        <div className="h-full bg-amber-600 w-full origin-left motion-safe:animate-progress-fast" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-12">
          <div className="space-y-3">
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
          </div>
          <div className="h-12 w-12 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-6"
            >
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
              <div className="space-y-3">
                <div className="h-5 w-full bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                <div className="h-5 w-2/3 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
              </div>
              <div className="pt-4">
                <div className="h-12 w-full bg-slate-50 dark:bg-slate-800 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}