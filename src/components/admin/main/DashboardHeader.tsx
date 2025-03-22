"use client";

import React from "react";
import { SidebarTrigger } from "../../ui/sidebar";
import { Separator } from "../../ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { Bell, CircleHelp, House, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Institution } from "@/types/Institution";

function DashboardHeader({
  activeInstitution,
}: {
  activeInstitution: Institution | undefined;
}) {
  const { setTheme } = useTheme();
  return (
    <div>
      <header className="flex h-16 shrink-0 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between items-center">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Link href="/admin" className="font-semibold">
            {activeInstitution?.name || "Select Institution"}
          </Link>
        </div>
        <div className="px-4 flex gap-3 items-center">
          <Link href="/home">
            <Button size="icon" variant="outline">
              <House className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-0 dark:scale-100" />
            </Button>
          </Link>
          <Button size="icon" variant="outline">
            <Bell className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-0 dark:scale-100" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button size="icon" variant="outline">
            <Search className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-0 dark:scale-100" />
            <span className="sr-only">Open Global Search</span>
          </Button>
          <Button size="icon" variant="outline">
            <CircleHelp className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-0 dark:scale-100" />
            <span className="sr-only">Request for Support</span>
          </Button>
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
        </div>
      </header>
      <Separator />
    </div>
  );
}

export default DashboardHeader;
