"use client"

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Section } from "@/components/ui/section";
import { APP } from "@/variables/globals";
import {
  ChartBarBigIcon,
  Signature,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import React from "react";

export function Benefits() {
  return (
    <Section>
      <div className="flex flex-col items-center gap-4 text-center sm:gap-8 pb-20">
        <h2 className="text-3xl font-semibold leading-tight sm:text-5xl sm:leading-tight">
          This is why they use {APP?.NAME}!
        </h2>
        <p className="text-md max-w-[600px] font-medium text-muted-foreground sm:text-xl">
          Do you want to know why institutions and learners love {APP?.NAME}?
          Give us a few seconds and we show you why.
        </p>
      </div>
      <BentoGrid>
        {items.map((item, i: number) => (
          <BentoGridItem
            key={i + 1}
            title={item.title}
            description={item.description}
            header={item.header}
            icon={item.icon}
            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
          />
        ))}
      </BentoGrid>
    </Section>
  );
}
const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-linear-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);
const items = [
  {
    title: "Control over contents",
    description:
      "Organizations have access to control content their people can access.",
    header: <Skeleton />,
    icon: <SlidersHorizontal className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Personalized Recommendations",
    description: "For learners, We recommend best courses based on your goals.",
    header: <Skeleton />,
    icon: <Signature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Manage Training Operations",
    description:
      "Organizations have access to features to manage their training programs.",
    header: <Skeleton />,
    icon: <Signature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Community Discussions",
    description:
      "Learners have access to community discussions where they share knowledge.",
    header: <Skeleton />,
    icon: <Users className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Learn from Prestigious Institutions",
    description:
      "Content on our platform comes from organizations that are the best in their fields with professional instructors.",
    header: <Skeleton />,
    icon: <ChartBarBigIcon className="h-4 w-4 text-neutral-500" />,
  },
];
