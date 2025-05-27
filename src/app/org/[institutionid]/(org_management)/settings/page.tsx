import MainSettings from "@/components/admin/settings/MainSettings";
import React from "react";

async function page({
  params,
}: {
  params: Promise<{ institutionid: string }>;
}) {
  const { institutionid } = await params;

  return (
    <div>
      <MainSettings institutionId={institutionid} />
    </div>
  );
}

export default page;
