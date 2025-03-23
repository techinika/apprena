import DashboardPage from "@/components/admin/home/Dashboard";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ institutionid: string }>;
}) {
  const { institutionid } = await params;
  return (
    <div>
      <DashboardPage institutionId={institutionid} />
    </div>
  );
}
