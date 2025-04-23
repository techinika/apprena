import CoursesList from "@/components/admin/courses/CoursesList";
import React from "react";

async function page({
  params,
}: {
  params: Promise<{ institutionid: string }>;
}) {
  const { institutionid } = await params;
  return (
    <div>
      <CoursesList institutionId={institutionid} />
    </div>
  );
}

export default page;
