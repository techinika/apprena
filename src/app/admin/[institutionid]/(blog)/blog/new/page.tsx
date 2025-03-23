"use client";

import dynamic from "next/dynamic";
import React, { use } from "react";

const AddNewPost = dynamic(() => import("@/components/admin/blog/AddNewPost"), {
  ssr: false,
});

export default function Page({
  params,
}: {
  params: Promise<{ institutionid: string }>;
}) {
  const { institutionid } = use(params);
  return (
    <div>
      <AddNewPost institutionId={institutionid} />
    </div>
  );
}
