"use client";

import { SidebarNav } from "@/components/client/profile/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Training",
  description: "View and Edit Training.",
};

interface SettingsLayoutProps {
  children: React.ReactNode;
  trainingId: string;
}

export default function TrainingLayout({
  children,
  trainingId,
}: SettingsLayoutProps) {
  const sidebarNavItems = [
    {
      title: "Details",
      href: `${trainingId}`,
    },
    {
      title: "Modules",
      href: `${trainingId}/modules`,
    },
    {
      title: "Lessons",
      href: `${trainingId}/lessons`,
    },
    {
      title: "People",
      href: `${trainingId}/people`,
    },
    {
      title: "Resources",
      href: `${trainingId}/resources`,
    },
    {
      title: "Attendance",
      href: `${trainingId}/attendance`,
    },
    {
      title: "Reviews",
      href: `${trainingId}/reviews`,
    },
  ];

  return (
    <div className="hidden space-y-6 py-10 md:block">
      <div className="space-y-0.5 size flex items-center justify-between flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Training Details
          </h2>
          <p className="text-muted-foreground">Manage this training.</p>
        </div>
        <Link href={`/training/${trainingId}`}>
          <Button>View Training</Button>
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
