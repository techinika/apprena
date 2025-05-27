import AIInsights from "@/components/admin/reporting/AIInsights";
import React from "react";

async function page({
  params,
}: {
  params: Promise<{ institutionid: string }>;
}) {
  const { institutionid } = await params;

  return (
    <div>
      <AIInsights institutionId={institutionid} />
    </div>
  );
}

export default page;
