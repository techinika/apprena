"use client"

const LessonPage = dynamic(
  () => import("@/components/client/content/courses/LessonPage/LessonPage"),
  { ssr: false }
);
import dynamic from "next/dynamic";
import React from "react";

async function page({
  params,
}: {
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }>;
}) {
  const { courseId, moduleId, lessonId } = await params;
  return (
    <div>
      <LessonPage courseId={courseId} moduleId={moduleId} lessonId={lessonId} />
    </div>
  );
}

export default page;
