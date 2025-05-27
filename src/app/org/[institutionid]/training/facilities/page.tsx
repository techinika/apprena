import MainLocationPage from "@/components/admin/training/Locations/MainLocationPage";
import React from "react";

async function page({
  params,
}: {
  params: Promise<{ institutionid: string }>;
}) {
  const { institutionid } = await params;
  return (
    <div>
      <MainLocationPage institutionId={institutionid} />
    </div>
  );
}

export default page;
