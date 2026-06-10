import CreateOrgRoadmapClient from "@/components/pages/CreateOrgRoadmapClient";
import { APP } from "@/variables/globals";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Create Team Roadmap | ${APP?.NAME}`,
  description: "Build a collaborative team roadmap for your organization on Apprena.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CreateOrgRoadmapClient />;
}
