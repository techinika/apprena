import TrainingReports from "@/components/admin/reporting/TrainingReports";
import React from "react";

async function page({
  params,
}: {
  params: Promise<{ institutionid: string }>;
}) {
  const { institutionid } = await params;

  return (
    <div>
      <TrainingReports institutionId={institutionid} />
    </div>
  );
}

export default page;
