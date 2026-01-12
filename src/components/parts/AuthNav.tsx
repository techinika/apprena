/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { APP } from "@/variables/globals";
import {
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Mail,
  Shield,
} from "lucide-react";
import Link from "next/link";

function AuthNav() {
  const { logout, user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/workspace"
            className="text-xl font-black text-amber-600 flex items-center gap-2"
          >
            {/* <div className="bg-amber-600 p-1.5 rounded-lg shadow-sm shadow-amber-100">
              <LayoutDashboard className="text-white" size={18} />
            </div> */}
            {APP?.NAME}
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-500">
            <Link href="/workspace" className="text-amber-600">
              Workspace
            </Link>
            <Link href="/learning" className="hover:text-slate-800 transition">
              My Learning
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden hover:ring-4 hover:ring-amber-50 transition-all focus:outline-none"
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-amber-100 text-amber-600 font-black uppercase">
                  {user?.displayName?.charAt(0) || <UserIcon size={18} />}
                </div>
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-100 rounded-[2rem] shadow-2xl z-50 py-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-6 py-4 border-b border-slate-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                    Your Account
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 font-bold shrink-0">
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          className="rounded-lg"
                          alt="User Profile"
                        />
                      ) : (
                        user?.displayName?.charAt(0)
                      )}
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-black text-slate-900 truncate leading-none mb-1">
                        {user?.displayName}
                      </p>
                      <p className="text-xs text-slate-500 truncate font-medium">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all font-bold text-sm"
                  >
                    <Shield size={18} strokeWidth={2.5} /> Profile Settings
                  </Link>
                  <Link
                    href="/notifications"
                    className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all font-bold text-sm"
                  >
                    <Mail size={18} strokeWidth={2.5} /> Notifications
                  </Link>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-50 px-2">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-black text-sm"
                  >
                    <LogOut size={18} strokeWidth={2.5} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default AuthNav;
