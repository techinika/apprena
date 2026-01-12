import VerifyPage from "@/components/pages/VerifyPage";
import { APP } from "@/variables/globals";
import React from "react";

export const metadata = {
  title: `Credential Verification | ${APP?.NAME}`,
  robots: { index: false, follow: true },
};

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <VerifyPage id={id} />
    </div>
  );
}

export default page;
