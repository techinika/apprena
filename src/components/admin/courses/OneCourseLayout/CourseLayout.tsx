"use client";

import { SidebarNav } from "@/components/client/profile/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Course",
  description: "View and Edit Course.",
};

interface SettingsLayoutProps {
  children: React.ReactNode;
  courseid: string;
}

export default function CourseLayout({
  children,
  courseid,
}: SettingsLayoutProps) {
  const sidebarNavItems = [
    {
      title: "Course Summary",
      href: `${courseid}`,
    },
    {
      title: "Modules",
      href: `${courseid}/modules`,
    },
    {
      title: "Lessons",
      href: `${courseid}/lessons`,
    },
    {
      title: "Learners",
      href: `${courseid}/learners`,
    },
  ];

  return (
    <div className="hidden space-y-6 py-10 md:block">
      <div className="space-y-0.5 size flex items-center justify-between flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Link href={`/courses/${courseid}`}>
          <Button>View Course</Button>
        </Link>
      </div>
      <Separator className="my-6 size" />
      <div className="size flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 w-full">{children}</div>
      </div>
    </div>
  );
}
