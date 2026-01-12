import LoginPage from "@/components/pages/LoginPage";
import { APP } from "@/variables/globals";
import React from "react";

export const metadata = {
  title: `Login | ${APP?.NAME}`,
  description:
    "Sign in to your account to continue your learning journey and access your custom roadmaps.",
};

function page() {
  return (
    <div>
      <LoginPage />
    </div>
  );
}

export default page;
