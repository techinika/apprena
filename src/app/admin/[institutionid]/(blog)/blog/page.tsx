import React from "react";

import BlogList from "@/components/admin/blog/BlogList";

async function page({
  params,
}: {
  params: Promise<{ institutionid: string }>;
}) {
  const { institutionid } = await params;
  return (
    <div>
      <BlogList institutionId={institutionid} />
    </div>
  );
}

export default page;
