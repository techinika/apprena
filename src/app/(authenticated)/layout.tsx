import type { Metadata } from "next";
import { APP } from "@/variables/globals";
import AuthNav from "@/components/parts/AuthNav";
import MentorChat from "@/components/parts/chat/MentorChatWrapper";

export const metadata: Metadata = {
  title: `${APP?.NAME} | ${APP?.SLOGAN}`,
  description: APP?.DESCRIPTION,
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AuthNav />
      {children}
      <MentorChat />
    </div>
  );
}
