import CreateTemplateClient from "@/components/pages/CreateTemplateClient";
import { APP } from "@/variables/globals";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Create Template | ${APP?.NAME}`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CreateTemplateClient />;
}
