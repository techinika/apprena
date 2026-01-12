import { APP } from "@/variables/globals";
import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <footer className="bg-white py-24 px-8 text-center border-t border-slate-100">
      <div className="text-2xl font-black text-slate-900 mb-8 tracking-tighter flex items-center justify-center gap-2">
        {/* <div className="bg-amber-600 p-1.5 rounded-lg">
              <Zap className="text-white fill-white" size={18} />
            </div> */}
        {APP?.NAME || "PathAI"}
      </div>
      <div className="flex justify-center gap-10 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-12">
        <Link href="/terms" className="hover:text-amber-600 transition">
          Terms
        </Link>
        <Link href="/privacy" className="hover:text-amber-600 transition">
          Privacy
        </Link>
        <Link href="/support" className="hover:text-amber-600 transition">
          Support
        </Link>
      </div>
      <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.4em]">
        {`© 2025-${new Date().getFullYear()}. ${APP?.SLOGAN}`}
      </p>
    </footer>
  );
}

export default Footer;
