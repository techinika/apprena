import NotificationsPage from "@/components/pages/NotificationsPage";
import { APP } from "@/variables/globals";
import React from "react";

export const metadata = {
  title: `Notifications | ${APP?.NAME}`,
  description: "View your notifications and stay updated on your learning journey.",
};

function page() {
  return <NotificationsPage />;
}

export default page;