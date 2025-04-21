import UserProfile from "@/components/public/profiles/userProfile";
import React from "react";

async function page({
  params,
}: {
  params: Promise<{ userProfileId: string }>;
}) {
  const { userProfileId } = await params;
  return (
    <div>
      <UserProfile id={userProfileId} />
    </div>
  );
}

export default page;
