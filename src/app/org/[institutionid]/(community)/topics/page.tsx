import Topics from "@/components/admin/community/topics/Topics";
import React from "react";

async function page({
  params,
}: {
  params: Promise<{ institutionid: string }>;
}) {
  const { institutionid } = await params;
  return (
    <div>
      <Topics institutionId={institutionid} />
    </div>
  );
}

export default page;
