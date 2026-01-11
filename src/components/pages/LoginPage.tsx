"use client";

import React, { useState } from "react";
import { Zap, ShieldCheck, Loader2 } from "lucide-react";
import { APP } from "@/variables/globals";
import Link from "next/link";
import { handleGoogleLogin } from "@/db/operations/GoogleLogin";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <div className="hidden lg:flex bg-slate-950 relative overflow-hidden flex-col justify-between p-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_var(--tw-gradient-stops))] from-amber-600/20 via-transparent to-transparent" />

        <div className="relative z-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-black text-2xl tracking-tighter mb-12"
          >
            <div className="bg-amber-600 p-1.5 rounded-lg">
              <Zap className="fill-white" size={20} />
            </div>
            {APP?.NAME || "PathAI"}
          </Link>

          <h2 className="text-5xl font-black text-white leading-tight mb-6">
            Your 10-year career <br />
            <span className="text-amber-400">starts here.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-md font-medium">
            Join 5,000+ ambitious architects building their legacy with
            AI-driven roadmaps.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4 text-slate-300">
            <div className="h-px w-12 bg-amber-500/50" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">
              Trusted By Pros At
            </span>
          </div>
          <div className="flex gap-8 opacity-30 grayscale invert">
            <div className="font-black text-xl italic">Google</div>
            <div className="font-black text-xl italic">Meta</div>
            <div className="font-black text-xl italic">Stripe</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex justify-center mb-12">
            <div className="flex items-center gap-2 text-slate-900 font-black text-3xl tracking-tighter">
              <div className="bg-amber-600 p-2 rounded-xl">
                <Zap className="text-white fill-white" size={24} />
              </div>
              {APP?.NAME}
            </div>
          </div>

          <div className="text-center lg:text-left mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-3">
              Welcome Back
            </h1>
            <p className="text-slate-500 font-medium">
              Sign in to access your roadmaps and mentor sessions.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleGoogleLogin(setLoading, router)}
              disabled={loading}
              className="w-full group relative flex items-center justify-center gap-3 bg-white border-2 border-slate-100 py-4 rounded-2xl font-bold text-slate-700 hover:border-amber-600 hover:bg-amber-50/30 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin text-amber-600" size={20} />
              ) : (
                <>
                  {/* Custom Google G-Logo Icon */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    className="mr-2"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
          </div>

          <div className="mt-12">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                We only request access to your basic profile and email. We will
                never post on your behalf or share your data with third parties.
              </p>
            </div>
          </div>

          <footer className="mt-20 text-center">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              By signing in, you agree to our <br />
              <Link href="/terms" className="text-amber-600 hover:underline">
                Terms of Service
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
