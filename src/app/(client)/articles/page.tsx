import MainPage from "@/components/client/content/articles/MainPage";
import { APP } from "@/variables/globals";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: `Articles | ${APP?.NAME}`,
  description:
    "Explore articles on APPRENA that share insights, tips, case studies and knowledge in education, technology, training, and digital skills development.",
  keywords: [
    "APPRENA articles",
    "educational content",
    "learning resources",
    "digital skills",
    "professional development",
    "online learning",
    "Rwanda eLearning",
    "professional development",
  ],
  openGraph: {
    title: `Articles | ${APP?.NAME}`,
    description:
      "Explore articles on APPRENA that share insights, tips, case studies, and knowledge in education, training, and digital skills development.",
    url: "https://apprena.app/articles",
    siteName: "APPRENA",
    type: "website",
  },
};

function page() {
  return (
    <div>
      <MainPage />
    </div>
  );
}

export default page;
