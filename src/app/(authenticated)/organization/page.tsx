import OrganizationPageClient from "@/components/pages/OrganizationPageClient";
import { APP } from "@/variables/globals";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Organizations | ${APP?.NAME}`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <OrganizationPageClient />;
}
