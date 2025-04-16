"use client";

import * as React from "react";
import {
  Building2,
  CalendarDays,
  Database,
  Library,
  Lightbulb,
  Mail,
  MailQuestion,
  MessageCircle,
  Paperclip,
  Rss,
  Settings2,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/admin/sidebar/nav-main";
import { NavManagement } from "@/components/admin/sidebar/nav-management";
import { NavUser } from "@/components/admin/sidebar/nav-user";
import { TeamSwitcher } from "@/components/admin/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavCommunication } from "./app-communication";
import { redirect } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Institution } from "@/types/Institution";
import { NavCommunity } from "./app-community";

export function AppSidebar({
  activeInstitution,
  setActiveInstitution,
  institutions,
  institutionId,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  activeInstitution: Institution | undefined;
  setActiveInstitution: (activeInstitution: Institution) => void;
  institutions: Institution[];
  institutionId: string;
}) {
  const { user } = useAuth();

  React.useEffect(() => {
    if (!institutionId || !user || !activeInstitution) return;

    const isCurrentTeam = activeInstitution.id === institutionId;
    const isMember = activeInstitution?.organizationAdmins?.includes(user?.uid);

    if (!isCurrentTeam || !isMember) {
      redirect("/admin");
    }
  }, [institutionId, user, activeInstitution]);

  const data = {
    navMain: [
      {
        title: "Blog",
        url: "#",
        icon: Rss,
        isActive: false,
        items: [
          {
            title: "All Posts",
            url: `/admin/${institutionId}/blog`,
          },
          {
            title: "Add New Post",
            url: `/admin/${institutionId}/blog/new`,
          },
          {
            title: "Categories",
            url: `/admin/${institutionId}/blog/categories`,
          },
          {
            title: "Drafts",
            url: `/admin/${institutionId}/blog/drafts`,
          },
        ],
      },
      {
        title: "History Events",
        url: "#",
        icon: CalendarDays,
        isActive: false,
        items: [
          {
            title: "All Events",
            url: `/admin/${institutionId}/events`,
          },
          {
            title: "Add New Event",
            url: `/admin/${institutionId}/events/new`,
          },
        ],
      },
      {
        title: "Courses",
        url: "#",
        icon: Library,
        isActive: false,
        items: [
          {
            title: "All Courses",
            url: "#",
          },
          {
            title: "Knowledge Base",
            url: "#",
          },
          {
            title: "Knowledge Checks",
            url: "#",
          },
          {
            title: "Live Online Courses",
            url: "#",
          },
          {
            title: "Certifications",
            url: "#",
          },
        ],
      },
      {
        title: "People",
        url: "#",
        icon: Users,
        items: [
          {
            title: "Subscribers",
            url: `/admin/${institutionId}/subscribers`,
          },
          {
            title: "Contributors",
            url: `/admin/${institutionId}/contributors`,
          },
        ],
      },
      {
        title: "Media",
        url: "#",
        icon: Paperclip,
        items: [
          {
            title: "Media Gallery",
            url: "#",
          },
          {
            title: "Images",
            url: "#",
          },
          {
            title: "Documents (PDFs)",
            url: "#",
          },
          {
            title: "Videos",
            url: "#",
          },
          {
            title: "Audios",
            url: "#",
          },
        ],
      },
    ],
    communication: [
      {
        name: "Comments",
        url: `/admin/${institutionId}/comments`,
        icon: MessageCircle,
      },
      {
        name: "Emails",
        url: "#",
        icon: Mail,
      },
    ],
    community: [
      {
        name: "Topics",
        url: `/admin/${institutionId}/topics`,
        icon: Lightbulb,
      },
      {
        name: "Discussions",
        url: `/admin/${institutionId}/discussions`,
        icon: MailQuestion,
      },
    ],
    management: [
      {
        title: "Institutions",
        url: "#",
        isActive: false,
        icon: Building2,
        items: [
          {
            title: "All Institutions",
            url: `/admin/${institutionId}/institutions`,
          },
          {
            title: "Add new Institution",
            url: "#",
          },
        ],
      },
      {
        title: "General Data",
        url: "#",
        isActive: false,
        icon: Database,
        items: [
          {
            title: "FAQs",
            url: `/admin/${institutionId}/faqs`,
          },
          {
            title: "Subscription Plans",
            url: `/admin/${institutionId}/plans`,
          },
          {
            title: "System Features",
            url: `/admin/${institutionId}/features`,
          },
          {
            title: "Permissions",
            url: `/admin/${institutionId}/permissions`,
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        isActive: false,
        icon: Settings2,
        items: [
          {
            title: "Personal Settings",
            url: `/admin/${institutionId}/profile`,
          },
          {
            title: "Team Settings",
            url: "#",
          },
          {
            title: "Billing Settings",
            url: "#",
          },
        ],
      },
      {
        title: "Users",
        url: "#",
        isActive: false,
        icon: Users,
        items: [
          {
            title: "Users List",
            url: `/admin/${institutionId}/users`,
          },
          {
            title: "Add New User",
            url: "#",
          },
          {
            title: "User Roles",
            url: `/admin/${institutionId}/users/roles`,
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          activeInstitution={activeInstitution}
          institutions={institutions}
          setActiveInstitution={setActiveInstitution}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavCommunication communication={data.communication} />
        <NavCommunity communication={data.community} />
        <NavManagement items={data.management} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
