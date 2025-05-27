import AnalyticsReports from "@/components/admin/reporting/AnalyticsReport";
import React from "react";

async function page({
  params,
}: {
  params: Promise<{ institutionid: string }>;
}) {
  const { institutionid } = await params;

  return (
    <div>
      <AnalyticsReports institutionId={institutionid} />
    </div>
  );
}

export default page;
