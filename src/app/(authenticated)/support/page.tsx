import SupportPage from "@/components/pages/SupportPage";
import { APP } from "@/variables/globals";
import React from "react";

export const metadata = {
  title: `Support & Help Center | ${APP?.NAME}`,
  description:
    "Need help? Contact our team for assistance with roadmaps, workspace tools, or account management.",
  alternates: { canonical: "/support" },
};

function page() {
  return (
    <div>
      <SupportPage />
    </div>
  );
}

export default page;
