import AccessibilitySettings from "@/components/admin/settings/AccessibilitySettings";
import React from "react";

async function page({
  params,
}: {
  params: Promise<{ institutionid: string }>;
}) {
  const { institutionid } = await params;

  return (
    <div>
      <AccessibilitySettings institutionId={institutionid} />
    </div>
  );
}

export default page;
