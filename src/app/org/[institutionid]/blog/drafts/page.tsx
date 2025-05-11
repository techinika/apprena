import Drafts from "@/components/admin/blog/Drafts";
import React from "react";

async function page({
  params,
}: {
  params: Promise<{ institutionid: string }>;
}) {
  const { institutionid } = await params;

  return (
    <div>
      <Drafts institutionId={institutionid} />
    </div>
  );
}

export default page;
