import AnalysisDetail from "@/components/pages/OneActivityPage";
import React from "react";

async function page({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;
  return (
    <div>
      <AnalysisDetail activityId={activity} />
    </div>
  );
}

export default page;
