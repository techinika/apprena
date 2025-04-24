import AuthHome from "@/components/client/home/AuthHome";
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
      <AuthHome />
    </div>
  );
}

export default page;
