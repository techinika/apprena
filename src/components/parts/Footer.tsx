import { APP } from "@/variables/globals";
import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <footer className="bg-white py-24 px-8 text-center border-t border-slate-100">
      <div className="mb-8 flex items-center justify-center gap-2">
        <div className="relative w-30 transition-transform group-hover:scale-105">
          <img
            src="/transparent-black.png"
            alt={`${APP?.NAME} Logo`}
            className="object-contain w-full h-full"
          />
        </div>
      </div>

      <div className="flex justify-center gap-10 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-10">
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

      <div className="mb-12 flex justify-center">
        <Link
          href="https://certification.dbi.rw/public?name=Cishahayo - Tekinika"
          target="_blank"
          rel="noopener noreferrer"
          className="group transition-all duration-300 transform hover:scale-105"
        >
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-4 hover:shadow-lg hover:shadow-slate-200/50 transition-all">
            <img
              src="/seal.png"
              alt="EdTech Project Certification seal from DBI Rwanda"
              className="h-30 w-auto grayscale group-hover:grayscale-0 transition-all"
            />
            <div className="text-left border-l border-slate-200 pl-4">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                Certified
              </p>
              <p className="text-[10px] font-bold text-slate-700 uppercase leading-none">
                EdTech Innovator
              </p>
            </div>
          </div>
        </Link>
      </div>

      <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.4em]">
        {`© 2025-${new Date().getFullYear()}. ${APP?.SLOGAN}`}
      </p>
    </footer>
  );
}

export default Footer;
