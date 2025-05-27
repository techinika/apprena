"use client";

import * as React from "react";
import {
  Bell,
  BookText,
  Building2,
  CalendarDays,
  ChartNoAxesColumn,
  CircleHelp,
  Component,
  Database,
  GraduationCap,
  Library,
  Lightbulb,
  LocateIcon,
  Logs,
  Mail,
  MailQuestion,
  MessageCircle,
  Notebook,
  Paperclip,
  Rss,
  Settings2,
  Sparkles,
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
import { NavTraining } from "./nav-training";
import { NavOrg } from "./nav-org";
import { NavReporting } from "./nav-reporting";

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
            title: "Certifications",
            url: `/org/${institutionId}/courses/certifications`,
          },
        ],
      },
      {
        title: "Knowledge Base",
        url: "#",
        icon: Paperclip,
        items: [
          {
            title: "Gallery",
            url: `/org/${institutionId}/gallery`,
          },
        ],
      },
    ],
    navTraining: [
      {
        title: "Training",
        url: "#",
        icon: GraduationCap,
        isActive: false,
        items: [
          {
            title: "All Trainings",
            url: `/org/${institutionId}/training`,
          },
          {
            title: "Add New Training",
            url: `/org/${institutionId}/training/new`,
          },
          {
            title: "Certifications",
            url: `/org/${institutionId}/training/certifications`,
          },
        ],
      },
      {
        title: "Locations & Rooms",
        url: "#",
        icon: LocateIcon,
        isActive: false,
        items: [
          {
            title: "All Facilities",
            url: `/org/${institutionId}/training/facilities`,
          },
        ],
      },
      {
        title: "Training Calendar",
        url: "#",
        icon: CalendarDays,
        isActive: false,
        items: [
          {
            title: "All Trainings",
            url: `/org/${institutionId}/training/calendar`,
          },
          {
            title: "Past Trainings",
            url: `/org/${institutionId}/courses/new`,
          },
        ],
      },
    ],
    communication: [
      {
        name: "Announcements",
        url: `/org/${institutionId}/announcements`,
        icon: Bell,
      },
      {
        name: "Teams Chat",
        url: `/org/${institutionId}/team-chat`,
        icon: MessageCircle,
      },
      {
        name: "Emails",
        url: `/org/${institutionId}/emails`,
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
    navOrg: [
      {
        title: "People",
        url: "#",
        isActive: false,
        icon: Users,
        items: [
          {
            title: "Employees",
            url: `/org/${institutionId}/organization/employees`,
          },
          {
            title: "Learners",
            url: `/org/${institutionId}/organization/learners`,
          },
          {
            title: "Add New Person",
            url: `/org/${institutionId}/organization/new-person`,
          },
        ],
      },
      {
        title: "Custom Roles",
        url: "#",
        isActive: false,
        icon: Notebook,
        items: [
          {
            title: "Roles",
            url: `/org/${institutionId}/organization/custom-roles`,
          },
          {
            title: "Permissions",
            url: `/org/${institutionId}/organization/custom-permissions`,
          },
        ],
      },
      {
        title: "Departments",
        url: "#",
        isActive: false,
        icon: Component,
        items: [
          {
            title: "Departments",
            url: `/org/${institutionId}/organization/departments`,
          },
          {
            title: "Add New Department",
            url: `/org/${institutionId}/organization/departments/new`,
          },
        ],
      },
      {
        title: "Org Settings",
        url: "#",
        isActive: false,
        icon: Settings2,
        items: [
          {
            title: "Main Settings",
            url: `/org/${institutionId}/organization/settings/`,
          },
          {
            title: "Branding Settings",
            url: `/org/${institutionId}/organization/settings/branding`,
          },
          {
            title: "Accessibility Settings",
            url: `/org/${institutionId}/organization/settings/accessibility`,
          },
          {
            title: "Integrations",
            url: `/org/${institutionId}/organization/settings/integrations`,
          },
          {
            title: "Billing & Subscription",
            url: `/org/${institutionId}/organization/settings/billing`,
          },
        ],
      },
    ],
    reporting: [
      {
        name: "Analytics",
        url: `/org/${institutionId}/reporting/analytics`,
        icon: ChartNoAxesColumn,
      },
      {
        name: "User Reports",
        url: `/org/${institutionId}/reporting/user-reports`,
        icon: BookText,
      },
      {
        name: "Content Reports",
        url: `/org/${institutionId}/content-reports`,
        icon: BookText,
      },
      {
        name: "Training Reports",
        url: `/org/${institutionId}/reporting/training-reports`,
        icon: BookText,
      },
      {
        name: "AI Insights",
        url: `/org/${institutionId}/reporting/insights`,
        icon: Sparkles,
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
            url: `/org/${institutionId}/institutions/new`,
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
            title: "Default Settings",
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
        title: "Audit Logs",
        url: "#",
        isActive: false,
        icon: Logs,
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
      {
        title: "Support Center",
        url: "#",
        isActive: false,
        icon: CircleHelp,
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
        <NavTraining items={data.navTraining} />
        <NavCommunication communication={data.communication} />
        <NavCommunity communication={data.community} />
        <NavOrg items={data.navOrg} />
        <NavReporting communication={data.reporting} />
        <NavManagement items={data.management} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
