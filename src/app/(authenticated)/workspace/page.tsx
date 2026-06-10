import Workspace from "@/components/pages/WorkSpacePage";
import { APP } from "@/variables/globals";
import React from "react";

export const metadata = {
  title: `My Workspace | ${APP?.NAME}`,
  description: "Manage your roadmaps, track progress, and access your learning workspace on Apprena.",
  robots: { index: false, follow: false },
};

function page() {
  return (
    <div>
      <Workspace />
    </div>
  );
}

export default page;
