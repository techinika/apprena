import Workspace from "@/components/pages/WorkSpacePage";
import { APP } from "@/variables/globals";
import React from "react";

export const metadata = {
  title: `My Workspace | ${APP?.NAME}`,
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
