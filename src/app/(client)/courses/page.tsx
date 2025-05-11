import MainPage from "@/components/client/content/courses/MainPage";
import { APP } from "@/variables/globals";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: `Courses | ${APP?.NAME}`,
  description:
    "Discover a wide range of courses on APPRENA designed to enhance your skills in education, technology, training, and digital development.",
  keywords: [
    "APPRENA courses",
    "online learning",
    "digital skills",
    "professional development",
    "education technology",
    "eLearning Rwanda",
    "training programs",
    "skill enhancement",
  ],
  openGraph: {
    title: `Courses | ${APP?.NAME}`,
    description:
      "Explore a variety of courses on APPRENA to advance your knowledge in education, technology, and digital skills development.",
    url: "https://apprena.app/courses",
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
