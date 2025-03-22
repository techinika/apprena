"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Institution } from "@/types/Institution";
import { useParams, usePathname, useRouter } from "next/navigation";

export function TeamSwitcher({
  activeInstitution,
  setActiveInstitution,
  institutions,
}: {
  activeInstitution: Institution | undefined;
  setActiveInstitution: (institution: Institution) => void;
  institutions: Institution[];
}) {
  const pathname = usePathname();
  const { institutionId } = useParams<{ institutionId: string }>();
  const router = useRouter();
  const { isMobile } = useSidebar();

  console.log(institutionId);

  const handleTeamSwitch = (team: Institution) => {
    setActiveInstitution(team);
    const oldPathArray = pathname.split("/");
    oldPathArray[2] = team?.id;
    const newPath = oldPathArray.join("/");

    // Debugging Logs
    console.log("Current Pathname:", pathname);
    console.log("Old Institution ID:", institutionId);
    console.log("New Institution ID:", team?.id);
    console.log("New Path:", newPath);
    router.push(newPath);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {/* <activeTeam.logo className="size-4" /> */}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeInstitution?.name || "Select Institution"}
                </span>
                <span className="truncate text-xs">Enterprise</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Institutions
            </DropdownMenuLabel>
            {institutions
              ? institutions.map((team, index) => (
                  <DropdownMenuItem
                    key={team?.id}
                    onClick={() => handleTeamSwitch(team)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      {/* <team.logo className="size-4 shrink-0" /> */}
                    </div>
                    {team?.name}
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                ))
              : null}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add Institution
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
