import OrganizationDetailClient from "@/components/pages/OrganizationDetailClient";
import { APP } from "@/variables/globals";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Organization | ${APP?.NAME}`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <OrganizationDetailClient />;
}
