import IntegrationSettings from "@/components/admin/settings/IntegrationSettings";
import React from "react";

async function page({
  params,
}: {
  params: Promise<{ institutionid: string }>;
}) {
  const { institutionid } = await params;

  return (
    <div>
      <IntegrationSettings institutionId={institutionid} />
    </div>
  );
}

export default page;
