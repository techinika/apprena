import AssignPeople from "@/components/admin/people/OrgPeople/AssignPeople";
import React from "react";

async function page({
  params,
}: {
  params: Promise<{ institutionid: string }>;
}) {
  const { institutionid } = await params;
  return (
    <div>
      <AssignPeople institutionId={institutionid} />
    </div>
  );
}

export default page;
