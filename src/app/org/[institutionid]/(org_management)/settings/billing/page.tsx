import BillingSettings from "@/components/admin/settings/BillingSettings";
import React from "react";

async function page({
  params,
}: {
  params: Promise<{ institutionid: string }>;
}) {
  const { institutionid } = await params;

  return (
    <div>
      <BillingSettings institutionId={institutionid} />
    </div>
  );
}

export default page;
