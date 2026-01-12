import AnalysisDetail from "@/components/pages/OneActivityPage";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ activity: string }>;
}) {
  const { activity } = await params;

  return {
    title: `Roadmap ${activity} | Workspace`,
    robots: { index: false, follow: false },
  };
}

async function page({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;
  return (
    <div>
      <AnalysisDetail activityId={activity} />
    </div>
  );
}

export default page;
