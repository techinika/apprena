import HomePage from "@/components/pages/HomePage";
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
      <HomePage />
    </div>
  );
}

export default page;
