import UpgradePage from "@/components/pages/UpgradePage";
import { APP } from "@/variables/globals";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Upgrade | ${APP?.NAME}`,
  description: "Unlock premium features with Apprena Pro.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <UpgradePage />;
}
