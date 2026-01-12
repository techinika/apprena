import PrivacyPolicy from "@/components/compliance/PrivacyPolicy";
import { APP } from "@/variables/globals";
import React from "react";

export const metadata = {
  title: `Privacy Policy | ${APP?.NAME}`,
  description:
    "Read our legal documentation regarding the use of AI services and data protection.",
};

function page() {
  return (
    <div>
      <PrivacyPolicy />
    </div>
  );
}

export default page;
