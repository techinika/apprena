import Discussions from "@/components/admin/community/discussions/Discussions";
import React from "react";

async function page({
  params,
}: {
  params: Promise<{ institutionid: string }>;
}) {
  const { institutionid } = await params;
  return (
    <div>
      <Discussions institutionId={institutionid} />
    </div>
  );
}

export default page;
