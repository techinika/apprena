import OneArticleView from "@/components/client/content/articles/OneArticleView";
import React from "react";

async function page({ params }: { params: Promise<{ slug: string }> }) {
  const {slug} = await params;
  return (
    <div>
      <OneArticleView slug={slug}/>
    </div>
  );
}

export default page;
