import TermsOfService from "@/components/compliance/TermsOfService";
import { APP } from "@/variables/globals";
import React from "react";

export const metadata = {
  title: `Terms of Service | ${APP?.NAME}`,
  description:
    "Read our legal documentation regarding the use of AI services and data protection.",
  alternates: { canonical: "/terms" },
};

function page() {
  return (
    <div>
      <TermsOfService />
    </div>
  );
}

export default page;
