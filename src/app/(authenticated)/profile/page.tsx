import ProfilePage from "@/components/pages/ProfilePage";
import { APP } from "@/variables/globals";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Profile | ${APP?.NAME}`,
  description: "Manage your Apprena profile, settings, and achievements.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ProfilePage />;
}
