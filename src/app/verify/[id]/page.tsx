import VerifyPage from "@/components/pages/VerifyPage";
import { APP } from "@/variables/globals";
import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://apprena.app";

export const metadata = {
  title: `Credential Verification | ${APP?.NAME}`,
  description: "Verify a career achievement or badge issued by Apprena.",
  robots: { index: false, follow: true },
  openGraph: {
    title: `Credential Verification | ${APP?.NAME}`,
    description: "Verify a career achievement or badge issued by Apprena.",
    url: `${baseUrl}/verify`,
    type: "website",
    images: [{ url: "/api/og?title=Credential+Verification&description=Verify+a+career+achievement+issued+by+Apprena", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Credential Verification | ${APP?.NAME}`,
    description: "Verify a career achievement or badge issued by Apprena.",
    images: ["/api/og?title=Credential+Verification&description=Verify+a+career+achievement+issued+by+Apprena"],
  },
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
