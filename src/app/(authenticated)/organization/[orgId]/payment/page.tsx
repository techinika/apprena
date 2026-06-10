import OrgPaymentClient from "@/components/pages/OrgPaymentClient";
import { APP } from "@/variables/globals";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Payment | ${APP?.NAME}`,
  description: "Manage payment and billing for your Apprena organization.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <OrgPaymentClient />;
}
