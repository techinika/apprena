import { Metadata } from "next";
import { APP } from "@/variables/globals";
import ExplorePage from "@/components/pages/ExplorePage";

export const metadata: Metadata = {
  title: `Explore Public Roadmaps | ${APP?.NAME}`,
  description: "Discover career roadmaps shared by professionals.",
};

export default function page() {
  return <ExplorePage />;
}