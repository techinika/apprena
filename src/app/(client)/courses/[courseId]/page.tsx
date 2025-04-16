import CoursePage from "@/components/client/content/courses/OneCourse/CoursePage";
import React from "react";

async function page({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  return (
    <div>
      <CoursePage id={courseId} />
    </div>
  );
}

export default page;
