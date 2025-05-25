"use client";

import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { ArrowRightIcon, CalendarCheck } from "lucide-react";
import { Section } from "../../ui/section";
import { MockupFrame } from "../../ui/mockup";
import Glow from "../../ui/glow";
import Link from "next/link";
import { HeroVideoDialog } from "@/components/ui/hero-video";
import { useAuth } from "@/lib/AuthContext";

export default function Hero() {
  const { user } = useAuth();
  return (
    <Section className="fade-bottom pb-0 sm:pb-0 md:pb-0 size">
      <div className="mx-auto flex max-w-container flex-col gap-12 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          <Badge variant="outline" className="animate-appear">
            <span className="text-muted-foreground">
              Check us on Product Hunt
            </span>
            <Link
              href="https://www.producthunt.com/posts/apprena"
              className="flex items-center gap-1"
              target="_blank"
            >
              Check here
              <ArrowRightIcon className="h-3 w-3" />
            </Link>
          </Badge>
          <h1 className="relative inline-block animate-appear bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-4xl font-semibold leading-tight text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-8xl md:leading-tight">
            The Learning Platform You Deserve
          </h1>
          <p className="text-md relative max-w-[550px] animate-appear font-medium text-muted-foreground opacity-100 delay-100 sm:text-xl">
            Access courses and training sessions from different professional
            institutions, and teachers. Learn from the best.
          </p>
          <div className="relative flex animate-appear justify-center gap-4 opacity-100 delay-300">
            <div className="relative flex animate-appear justify-center gap-4 opacity-100 delay-300">
              <Button variant="default" size="lg" asChild>
                <Link href={!user ? "/register" : "/home"}>Get Started</Link>
              </Button>
              <Button variant="glow" size="lg" asChild>
                <Link
                  href="https://forms.gle/Dzcfv9skixRXDCuS6"
                  target="_blank"
                >
                  <CalendarCheck className="mr-2 h-4 w-4" /> Book a Demo
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative pt-12">
            <MockupFrame
              className="animate-appear opacity-100 w-full delay-700"
              size="small"
            >
              <div className="relative">
                <HeroVideoDialog
                  className="block dark:hidden"
                  animationStyle="from-center"
                  videoSrc="https://www.youtube.com/embed/TcOEt6TdoYQ?si=4rb-zSdDkVK9qxxb"
                  thumbnailSrc="https://cdn.mos.cms.futurecdn.net/WmpBUK2hFaccqf5TqJYwAe-1200-80.jpg"
                  thumbnailAlt="Hero Video"
                />
                <HeroVideoDialog
                  className="hidden dark:block"
                  animationStyle="from-center"
                  videoSrc="https://www.youtube.com/embed/TcOEt6TdoYQ?si=4rb-zSdDkVK9qxxb"
                  thumbnailSrc="https://cdn.mos.cms.futurecdn.net/WmpBUK2hFaccqf5TqJYwAe-1200-80.jpg"
                  thumbnailAlt="Hero Video"
                />
              </div>
            </MockupFrame>
            <Glow
              variant="center"
              className="scale-y-[10%] w-2/3 opacity-30 sm:scale-y-[15%] md:scale-y-[25%]"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
