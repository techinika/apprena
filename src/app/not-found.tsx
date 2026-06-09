import type { Metadata } from "next";
import { APP } from "@/variables/globals";
import NotFoundClient from "./not-found-client";

export const metadata: Metadata = {
  title: `404 - Page Not Found | ${APP?.NAME}`,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundClient />;
}
