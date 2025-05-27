import BrandingSettings from "@/components/admin/settings/BrandingSettings";
import React from "react";

async function page({
  params,
}: {
  params: Promise<{ institutionid: string }>;
}) {
  const { institutionid } = await params;

  return (
    <div>
      <BrandingSettings institutionId={institutionid} />
    </div>
  );
}

export default page;
