"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { APP } from "@/variables/globals";
import { ArrowRight, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { UserNav } from "./user-nav";
import { Button } from "@/components/ui/button";
import AuthMenu from "./Auth.Menu";
import Image from "next/image";
import { useAuth } from "@/lib/AuthContext";

function AuthNav() {
  const { user } = useAuth();
  const { setTheme, theme, resolvedTheme } = useTheme();
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
      <header className="size flex h-16 shrink-0 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between items-center">
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
        <AuthMenu />
        <div className="px-4 flex gap-3 items-center">
          {user && user?.email === "niguterwanda@gmail.com" && (
            <Link href="/admin">
              <Button variant="default">
                Manage Institution
                <ArrowRight />
              </Button>
            </Link>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <UserNav />
        </div>
      </header>
      <Separator />
    </div>
  );
}

export default AuthNav;
