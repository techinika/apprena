"use client";

import * as React from "react";
import {
  AudioWaveform,
  Building2,
  Command,
  Database,
  GalleryVerticalEnd,
  Library,
  Mail,
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

const data = {
  user: {
    name: "Achille Songa",
    email: "achille@techinika.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Techinika",
      logo: GalleryVerticalEnd,
      plan: "Startup",
    },
    {
      name: "Teknowledge",
      logo: AudioWaveform,
      plan: "Enterprise",
    },
    {
      name: "Achille Songa Lab",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Blog",
      url: "#",
      icon: Rss,
      isActive: false,
      items: [
        {
          title: "All Posts",
          url: "/admin/blog",
        },
        {
          title: "Add New Post",
          url: "/admin/blog/new",
        },
        {
          title: "Categories",
          url: "/blog/categories",
        },
        {
          title: "Drafts",
          url: "/admin/blog/drafts",
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
          url: "/admin/subscribers",
        },
        {
          title: "Contributors",
          url: "/admin/contributors",
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
      url: "/admin/comments",
      icon: MessageCircle,
    },
    {
      name: "Emails",
      url: "#",
      icon: Mail,
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
          url: "/admin/institutions",
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
          title: "Frequently Asked Questions",
          url: "/admin/faqs",
        },
        {
          title: "Subscription Plans",
          url: "/admin/plans",
        },
        {
          title: "System Features",
          url: "/admin/features",
        },
        {
          title: "Permissions",
          url: "/admin/permissions",
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
          url: "/admin/profile",
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
          url: "/admin/users",
        },
        {
          title: "Add New User",
          url: "#",
        },
        {
          title: "User Roles",
          url: "/admin/users/roles",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavCommunication communication={data.communication} />
        <NavManagement items={data.management} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
