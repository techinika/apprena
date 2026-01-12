"use client";

import { useAuth } from "@/lib/AuthContext";
import { APP } from "@/variables/globals";
import Link from "next/link";

function MainNav() {
  const { user } = useAuth();
  return (
    <nav className="flex justify-between items-center py-6 px-8 max-w-7xl mx-auto w-full text-white">
      <Link href="/">
        <div className="relative w-30 transition-transform group-hover:scale-105">
          <img
            src="/transparent-logo.png"
            alt={`${APP?.NAME} Logo`}
            className="object-contain w-full h-full"
          />
        </div>
      </Link>
      <div className="space-x-8 font-medium hidden md:flex opacity-90">
        <Link
          href="#how-it-works"
          className="hover:underline underline-offset-4 decoration-2"
        >
          How it Works
        </Link>
        <Link
          href="#pricing"
          className="hover:underline underline-offset-4 decoration-2"
        >
          Pricing
        </Link>
      </div>
      {user ? (
        <Link href="/workspace">
          <button className="bg-amber-500/20 border border-white/30 backdrop-blur-md text-white px-6 py-2 rounded-full font-medium hover:bg-white hover:text-amber-600 transition-all">
            Go To Workspace
          </button>
        </Link>
      ) : (
        <Link href="/login">
          <button className="bg-amber-500/20 border border-white/30 backdrop-blur-md text-white px-6 py-2 rounded-full font-medium hover:bg-white hover:text-amber-600 transition-all">
            Login
          </button>
        </Link>
      )}
    </nav>
  );
}

export default MainNav;
