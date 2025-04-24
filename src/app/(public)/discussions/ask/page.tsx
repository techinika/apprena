import NewDiscussion from "@/components/public/discussions/NewDiscussion";
import ProtectedRoute from "@/lib/ProtectedRoute";
import React from "react";
import { Metadata } from "next";
import { APP } from "@/variables/globals";

export const metadata: Metadata = {
  title: "Ask a Question | APPRENA - Start a New Discussion and Get Help",
  description:
    "Start a new discussion on APPRENA. Ask questions, share insights, and get feedback from a vibrant community of trainers, educators, and learners.",
  keywords: [
    "ask a question",
    "start discussion",
    "APPRENA forum",
    "educator support",
    "eLearning questions",
    "teaching tips",
    "learning community",
    "training challenges",
    "L&D discussions",
    "learning collaboration",
  ],
  openGraph: {
    title: "Ask a Question | APPRENA - Start a New Discussion and Get Help",
    description:
      "Start a new discussion on APPRENA. Ask questions, share insights, and get feedback from a vibrant community of trainers, educators, and learners.",
    url: "https://apprena.app/discussions/ask",
    siteName: APP?.NAME,
    images: [
      {
        url: "https://apprena.app/white-logo.png",
        width: 1200,
        height: 630,
        alt: "Ask a Question on APPRENA",
      },
    ],
    type: "website",
  },
};

function page() {
  return (
    <div>
      <ProtectedRoute>
        <NewDiscussion />
      </ProtectedRoute>
    </div>
  );
}

export default page;
