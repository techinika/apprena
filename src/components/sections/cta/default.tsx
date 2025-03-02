import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import Glow from "@/components/ui/glow";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function CTA() {
  return (
    <Section className="relative w-full overflow-hidden">
      <div className="relative z-10 mx-auto flex max-w-container flex-col items-center gap-6 text-center sm:gap-10">
        <h2 className="text-3xl font-semibold sm:text-5xl">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-muted-foreground">
          You will get to hear from us every day, with latest features and news.
        </p>
        <div className="flex flex-col items-center gap-4 self-stretch">
          <div className="flex w-full max-w-[420px] gap-2 items-center">
            <Input
              type="email"
              placeholder="Email address"
              className="grow border-brand/20 bg-foreground/10 z-50"
            />
            <Button variant="default" size="default" asChild>
              <Link href="/">Subscribe</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            We will never spam you, only send you relevant content.
          </p>
        </div>
        <Glow
          variant="center"
          className="scale-y-[10%] w-1/2 opacity-30 sm:scale-y-[15%] md:scale-y-[25%]"
        />
      </div>
    </Section>
  );
}
