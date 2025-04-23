"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { APP } from "@/variables/globals";
import { ArrowRight, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Menu } from "./Menu";
import { useAuth } from "@/lib/AuthContext";
import { UserNav } from "./user-nav";
import Image from "next/image";

function Nav() {
  const { setTheme } = useTheme();
  const { user } = useAuth();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc =
    !mounted || theme === "light" || resolvedTheme === "light"
      ? "/white-logo.png"
      : "/black-logo.png";

  return (
    <div>
      <header className="size flex h-16 shrink-0 gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 justify-between items-center">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="relative z-20 flex items-center text-lg font-medium"
          >
            <Image
              src={logoSrc}
              width={150}
              height={300}
              alt={APP?.DESCRIPTION}
              className="object-cover"
            />
          </Link>
        </div>
        <Menu />
        <div className="px-4 flex gap-3 items-center">
          {!user && (
            <Link href="/login">
              <Button variant="glow">Sign In</Button>
            </Link>
          )}
          {!user && (
            <Link href="/register">
              <Button variant="default">
                Create your Account
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          )}
          {user && user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
            <Link href="/org">
              <Button variant="default">
                Manage Institution
                <ArrowRight />
              </Button>
            </Link>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              setTheme((prev) => {
                if (prev === "dark") return "light";
                if (prev === "light") return "system";
                return "dark";
              });
            }}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user && <UserNav />}
        </div>
      </header>
      <Separator />
    </div>
  );
}

export default Nav;
