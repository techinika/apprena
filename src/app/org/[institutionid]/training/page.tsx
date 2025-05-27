import TrainingList from "@/components/admin/training/TrainingList";
import React from "react";

async function page({
  params,
}: {
  params: Promise<{ institutionid: string }>;
}) {
  const { institutionid } = await params;
  return (
    <div>
      <TrainingList institutionId={institutionid} />
    </div>
  );
}

export default page;
