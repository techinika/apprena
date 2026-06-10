import OrganizationDetailClient from "@/components/pages/OrganizationDetailClient";
import { APP } from "@/variables/globals";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Organization | ${APP?.NAME}`,
  description: "View organization details, members, and team roadmaps on Apprena.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <OrganizationDetailClient />;
}
