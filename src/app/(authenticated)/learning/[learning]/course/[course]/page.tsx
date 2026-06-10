import { Metadata } from "next";
import { APP } from "@/variables/globals";
import CourseViewer from "@/components/pages/CourseViewer";

export const metadata: Metadata = {
  title: `Course | ${APP?.NAME}`,
  description: "Continue your course and track your learning progress on Apprena.",
  robots: { index: false, follow: false },
};

export default async function page({ params }: { params: Promise<{ course: string }> }) {
  const { course } = await params;
  return <CourseViewer moduleIndex={course} />;
}