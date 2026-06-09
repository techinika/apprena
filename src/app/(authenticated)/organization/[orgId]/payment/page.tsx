import OrgPaymentClient from "@/components/pages/OrgPaymentClient";
import { APP } from "@/variables/globals";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Payment | ${APP?.NAME}`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <OrgPaymentClient />;
}
