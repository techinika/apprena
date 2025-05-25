import Summary from "@/components/admin/courses/OneCourseLayout/Summary";
import React from "react";

async function page({
  params,
}: {
  params: Promise<{ institutionid: string; courseid: string }>;
}) {
  const { courseid, institutionid } = await params;
  return (
    <div>
      <Summary courseId={courseid} institutionId={institutionid} />
    </div>
  );
}

export default page;
