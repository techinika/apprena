import CreateRoadmap from "@/components/pages/CreateActivity";
import { APP } from "@/variables/globals";
import React from "react";

export const metadata = {
  title: `Create New Roadmap | ${APP?.NAME}`,
  robots: { index: false, follow: false },
};

function page() {
  return (
    <div>
      <CreateRoadmap />
    </div>
  );
}

export default page;
