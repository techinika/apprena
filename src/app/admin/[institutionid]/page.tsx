import DashboardPage from "@/components/admin/home/Dashboard";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ institutionId: string }>;
}) {
  const { institutionId } = await params;
  return (
    <div>
      <DashboardPage institutionId={institutionId} />
    </div>
  );
}
