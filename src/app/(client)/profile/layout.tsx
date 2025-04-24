import ProfileLayout from "@/components/client/profile/ProfileLayout";
import ProtectedRoute from "@/lib/ProtectedRoute";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile",
  description: "View and Edit Profile.",
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <ProtectedRoute>
      <ProfileLayout>{children}</ProfileLayout>
    </ProtectedRoute>
  );
}
