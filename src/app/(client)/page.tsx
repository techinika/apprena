import LandingPage from "@/components/client/landing-page/LandingPage";
import { APP } from "@/variables/globals";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: `${APP?.NAME} — ${APP?.SLOGAN}`,
  description: APP?.DESCRIPTION,
};

function page() {
  return (
    <div>
      <LandingPage />
    </div>
  );
}

export default page;
