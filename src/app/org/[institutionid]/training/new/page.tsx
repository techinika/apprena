import NewTrainingPage from "@/components/admin/training/NewTrainingPage";
import React from "react";

async function page({
  params,
}: {
  params: Promise<{ institutionid: string }>;
}) {
  const { institutionid } = await params;
  return (
    <div>
      <NewTrainingPage institutionId={institutionid} />
    </div>
  );
}

export default page;
