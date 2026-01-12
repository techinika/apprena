import LearningPage from "@/components/pages/LearningPage";
import { APP } from "@/variables/globals";
import React from "react";

export const metadata = {
  title: `My Learning Paths | ${APP?.NAME}`,
  description: "Track your progress and master new skills.",
  robots: { index: false, follow: false },
};

function page() {
  return (
    <div>
      <LearningPage />
    </div>
  );
}

export default page;
