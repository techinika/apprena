import MainPage from "@/components/public/discussions/MainPage";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Community Forum | APPRENA - Connect, Discuss & Grow",
  description:
    "Join the APPRENA community forum to connect with educators, share insights, ask questions, and explore trending discussions in digital education, technology and growth insights.",
  keywords: [
    "APPRENA",
    "community forum",
    "digital learning community",
    "educator discussions",
    "training platform",
    "online learning",
    "teaching resources",
    "education tech",
    "eLearning support",
    "learning discussions",
    "L&D community",
    "teacher collaboration",
  ],
  openGraph: {
    title: "Community Forum | APPRENA - Connect, Discuss & Grow",
    description:
      "Join the APPRENA community forum to connect with educators, share insights, ask questions, and explore trending discussions in digital education, technology and growth insights.",
    url: "https://apprena.app/discussions",
    siteName: "APPRENA",
    images: [
      {
        url: "https://apprena.app/white-logo.png",
        width: 1200,
        height: 630,
        alt: "APPRENA Community Forum Discussions",
      },
    ],
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
