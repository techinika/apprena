import { LearnersList } from "@/components/admin/people/OrgPeople/LearnersList";
import React from "react";

async function page({
  params,
}: {
  params: Promise<{ institutionid: string }>;
}) {
  const { institutionid } = await params;
  return (
    <div>
      <LearnersList institutionId={institutionid} />
    </div>
  );
}

export default page;
