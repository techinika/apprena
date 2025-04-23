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
// import { db } from "@/db/firebase";
// import { doc } from "firebase/firestore";

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

    // const userRef = doc(db, "profile", user?.uid);

    const isCurrentTeam = activeInstitution.id === institutionId;
    // const isMember = activeInstitution?.organizationAdmins?.some(
    //   (ref) => ref?.id === userRef?.id
    // );

    if (!isCurrentTeam) {
      redirect("/org");
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
            url: `/org/${institutionId}/blog`,
          },
          {
            title: "Add New Post",
            url: `/org/${institutionId}/blog/new`,
          },
          {
            title: "Drafts",
            url: `/org/${institutionId}/blog/drafts`,
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
            url: `/org/${institutionId}/events`,
          },
          {
            title: "Add New Event",
            url: `/org/${institutionId}/events/new`,
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
            url: `/org/${institutionId}/courses`,
          },
          {
            title: "New Course",
            url: `/org/${institutionId}/courses/new`,
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
        url: `/org/${institutionId}/comments`,
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
        url: `/org/${institutionId}/topics`,
        icon: Lightbulb,
      },
      {
        name: "Discussions",
        url: `/org/${institutionId}/discussions`,
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
            url: `/org/${institutionId}/institutions`,
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
            url: `/org/${institutionId}/faqs`,
          },
          {
            title: "Subscription Plans",
            url: `/org/${institutionId}/plans`,
          },
          {
            title: "System Features",
            url: `/org/${institutionId}/features`,
          },
          {
            title: "Permissions",
            url: `/org/${institutionId}/permissions`,
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
            url: `/org/${institutionId}/profile`,
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
            url: `/org/${institutionId}/users`,
          },
          {
            title: "Subscribers",
            url: `/org/${institutionId}/subscribers`,
          },
          {
            title: "Contributors",
            url: `/org/${institutionId}/contributors`,
          },
          {
            title: "Contributors",
            url: `/org/${institutionId}/employees`,
          },
          {
            title: "Subscribers",
            url: `/org/${institutionId}/users/new`,
          },
          {
            title: "User Roles",
            url: `/org/${institutionId}/users/roles`,
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
