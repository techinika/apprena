import MainPage from "@/components/public/history/MainPage";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: `Today in History | APPRENA - Explore Historical Milestones for ${new Date().toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
    }
  )}`,
  description:
    "Discover significant events that happened today throughout history, including milestones in science, culture, politics, and more.",
  keywords: [
    "Today in History",
    "May 5 events",
    "historical milestones",
    "APPRENA",
    "historical events",
    "on this day",
    "history timeline",
    "educational resources",
    "learning history",
    "world history",
    "important dates",
    "historical anniversaries",
  ],
  openGraph: {
    title: "Today in History | APPRENA - Explore Historical Milestones",
    description:
      "Discover significant events that happened today throughout history, including milestones in science, culture, politics, and more.",
    url: "https://apprena.app/history",
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
