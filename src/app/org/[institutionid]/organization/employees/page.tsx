import { EmployeesList } from "@/components/admin/people/OrgPeople/EmployeesList";
import React from "react";

async function page({
  params,
}: {
  params: Promise<{ institutionid: string }>;
}) {
  const { institutionid } = await params;
  return (
    <div>
      <EmployeesList institutionId={institutionid} />
    </div>
  );
}

export default page;
