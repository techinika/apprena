"use client";

import { ModeToggle } from "../../ui/mode-toggle";
import {
  Footer,
  FooterColumn,
  FooterBottom,
  FooterContent,
} from "../../ui/footer";
import Link from "next/link";
import { APP } from "@/variables/globals";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function FooterSection() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc =
    !mounted || theme === "light" || resolvedTheme === "light"
      ? "/white-logo.png"
      : "/black-logo.png";

  return (
    <footer className="w-full bg-background size">
      <Separator />
      <div className="mx-auto">
        <Footer>
          <FooterContent className="flex justify-between gap-3 flex-wrap">
            <FooterColumn className="col-span-2 sm:col-span-3 md:col-span-1">
              <Image
                src={logoSrc}
                width={200}
                height={300}
                alt={APP?.DESCRIPTION}
                className="object-cover"
              />
            </FooterColumn>
            <FooterColumn>
              <h3 className="text-md pt-1 font-semibold">Product</h3>
              <Link href="/" className="text-sm text-muted-foreground">
                Changelog
              </Link>
              <Link href="/" className="text-sm text-muted-foreground">
                Documentation
              </Link>
              <Link
                href="/discussions"
                className="text-sm text-muted-foreground"
              >
                Community Discussions
              </Link>
              <Link href="/start" className="text-sm text-muted-foreground">
                Subscribe to a paid plan
              </Link>
              <Link href="/history" className="text-sm text-muted-foreground">
                Today in history
              </Link>
            </FooterColumn>

            <FooterColumn>
              <h3 className="text-md pt-1 font-semibold">Company</h3>
              <Link href="/" className="text-sm text-muted-foreground">
                About
              </Link>
              <Link href="/" className="text-sm text-muted-foreground">
                Careers
              </Link>
              <Link href="/" className="text-sm text-muted-foreground">
                Blog
              </Link>
              <Link href="/" className="text-sm text-muted-foreground">
                Testimonials
              </Link>
              <Link href="/" className="text-sm text-muted-foreground">
                Our People
              </Link>
            </FooterColumn>
            <FooterColumn>
              <h3 className="text-md pt-1 font-semibold">Contact Us</h3>
              <Link
                href="https://linkedin.com/company/techinika"
                target="_blank"
                className="text-sm text-muted-foreground"
              >
                LinkedIn
              </Link>
              <Link
                target="_blank"
                href="https://x.com/techinika"
                className="text-sm text-muted-foreground"
              >
                X (Twitter)
              </Link>
              <Link
                href="https://instagram.com/techinika"
                target="_blank"
                className="text-sm text-muted-foreground"
              >
                Instagram
              </Link>
              <Link
                href="https://facebook.com/techinika"
                target="_blank"
                className="text-sm text-muted-foreground"
              >
                Facebook
              </Link>
            </FooterColumn>
            <FooterColumn></FooterColumn>
          </FooterContent>
          <FooterBottom>
            <div>
              &copy; {new Date().getFullYear()} {APP?.NAME}. All rights reserved
            </div>
            <div className="flex items-center gap-4">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <ModeToggle />
            </div>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  );
}
