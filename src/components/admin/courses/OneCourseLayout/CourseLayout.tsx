// app/org/[institutionId]/courses/[courseId]/layout.tsx
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

export default function CourseLayout({
  courseId,
  institutionId,
  children,
}: {
  courseId: string;
  institutionId: string;
  children: React.ReactNode;
}) {
  const sidebarNavItems = [
    {
      title: "Course Overview",
      href: `/org/${institutionId}/courses/${courseId}`,
    },
    {
      title: "Curriculum",
      href: `/org/${institutionId}/courses/${courseId}/curriculum`,
    },
    {
      title: "Modules",
      href: `/org/${institutionId}/courses/${courseId}/modules`,
    },
    {
      title: "Lessons",
      href: `/org/${institutionId}/courses/${courseId}/lessons`,
    },
    {
      title: "Assessments",
      href: `/org/${institutionId}/courses/${courseId}/assessments`,
    },
    {
      title: "People",
      href: `/org/${institutionId}/courses/${courseId}/people`,
    },
    {
      title: "Certification",
      href: `/org/${institutionId}/courses/${courseId}/certification`,
    },
    {
      title: "Resources",
      href: `/org/${institutionId}/courses/${courseId}/resources`,
    },
    {
      title: "Reviews",
      href: `/org/${institutionId}/courses/${courseId}/reviews`,
    },
  ];

  return (
    <div className="hidden space-y-6 py-10 md:block">
      <div className="space-y-0.5 size flex items-center justify-between flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Course Details</h2>
          <p className="text-muted-foreground">Manage the course details.</p>
        </div>
        <Link href={`/courses/${courseId}`}>
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
