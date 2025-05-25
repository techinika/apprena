import CourseLayout from "@/components/admin/courses/OneCourseLayout/CourseLayout";
import { Metadata } from "next";
import { use } from "react";

export const metadata: Metadata = {
  title: "Course Details",
  description: "View and Edit Course.",
};

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: Promise<{ courseid: string }>;
}

export default function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const { courseid } = use(params);
  return <CourseLayout courseid={courseid}>{children}</CourseLayout>;
}
