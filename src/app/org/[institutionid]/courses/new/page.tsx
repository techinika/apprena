import NewCoursePage from "@/components/admin/courses/NewCoursePage";
import React from "react";

async function page({
  params,
}: {
  params: Promise<{ institutionid: string }>;
}) {
  const { institutionid } = await params;
  return (
    <div>
      <NewCoursePage institutionId={institutionid} />
    </div>
  );
}

export default page;
