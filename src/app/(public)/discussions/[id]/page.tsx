import OneDiscussionPage from "@/components/public/discussions/OneDiscussionPage";
import React from "react";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <OneDiscussionPage discussionId={id} />
    </div>
  );
}

export default page;
