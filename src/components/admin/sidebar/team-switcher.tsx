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
import { useAuth } from "@/lib/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/db/firebase";
import { Institution } from "@/types/Institution";
import { enUS } from "date-fns/locale";
import { useParams } from "next/navigation";

export function TeamSwitcher() {
  const { user } = useAuth();
  const { institutionId } = useParams();
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState<Institution>();
  const [institutions, setInstitutions] = React.useState<Institution[]>([]);

  React.useEffect(() => {
    const getData = async () => {
      if (!user) return;

      const q = query(
        collection(db, "institutions"),
        where("organizationAdmins", "array-contains", user?.uid)
      );
      onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            createdAt: docData.createdAt
              ? formatDistanceToNow(docData.createdAt.toDate(), {
                  addSuffix: true,
                  locale: enUS,
                })
              : "Unknown",
            ...docData,
          } as Institution;
        });
        const activeInst = data.find((inst) => inst.id === institutionId);
        setActiveTeam(activeInst || data[0] || null);
        setInstitutions(data);
      });
    };
    getData();
  }, [institutionId, user]);

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
                  {activeTeam?.name || "Select Institution"}
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
                    onClick={() => setActiveTeam(team)}
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
