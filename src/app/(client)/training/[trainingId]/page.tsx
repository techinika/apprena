import SessionPage from "@/components/client/content/training/OneTrainingSession/OneSession";
import React from "react";

async function page({ params }: { params: Promise<{ trainingId: string }> }) {
  const { trainingId } = await params;
  return (
    <div>
      <SessionPage id={trainingId} />
    </div>
  );
}

export default page;
