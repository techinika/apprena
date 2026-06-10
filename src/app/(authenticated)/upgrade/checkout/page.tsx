import CheckoutPage from "@/components/pages/CheckoutPage";
import { APP } from "@/variables/globals";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Checkout | ${APP?.NAME}`,
  description: "Complete your upgrade to Apprena Pro and unlock premium features.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CheckoutPage />;
}
