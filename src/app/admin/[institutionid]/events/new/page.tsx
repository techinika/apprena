
import NewEvent from "@/components/admin/events/NewEvent";
import React from "react";

async function page({
  params,
}: {
  params: Promise<{ institutionid: string }>;
}) {
  const { institutionid } = await params;
  return (
    <div>
      <NewEvent institutionId={institutionid} />
    </div>
  );
}

export default page;