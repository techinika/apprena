import InvitationClient from "@/components/pages/InvitationClient";
import { APP } from "@/variables/globals";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Invitation | ${APP?.NAME}`,
  description: "Accept your organization invitation to join your team on Apprena.",
  robots: { index: false, follow: false },
};

export default function Page({ params }: { params: Promise<{ token: string }> }) {
  return <InvitationClient params={params} />;
}
