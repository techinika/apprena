import { cn } from "@/lib/utils";
import { Section } from "../../ui/section";
import { Button } from "../../ui/button";
import { CircleCheckBig, User, Users } from "lucide-react";
import Link from "next/link";

type Plan = {
  name: string;
  icon?: React.ReactNode;
  description: string;
  price: number;
  priceNote: string;
  cta: {
    variant: "outline" | "default";
    label: string;
    href: string;
  };
  features: string[];
  featured: boolean;
  classes?: string;
};

const plans: Plan[] = [
  {
    name: "Free",
    description:
      "For everyone starting out and wanting to explore courses offered on our platform.",
    price: 0,
    priceNote: "Free forever.",
    cta: {
      variant: "outline",
      label: "Get started for free",
      href: "/register",
    },
    features: [
      "Access to free and public content",
      "Access to Community Discussion",
      "Ability to join any organization",
    ],
    featured: false,
    classes: "bg-transparent border border-input hidden lg:flex",
  },
  {
    name: "Pro",
    icon: <User className="h-4 w-4" />,
    description: "For everyone who want to go in depth on a subject.",
    price: 50,
    priceNote:
      "Annual subscription. No other payment required. Access to every public content on the platform.",
    cta: {
      variant: "default",
      label: "Get all-access",
      href: "#",
    },
    features: [
      `Access to all public content`,
      `Access to Community Discussion`,
      `Personalized Recommendations`,
      `Ability to join an organization`,
    ],
    featured: true,
    classes:
      "after:content-[''] after:absolute after:-top-[128px] after:left-1/2 after:h-[128px] after:w-[100%] after:max-w-[960px] after:-translate-x-1/2 after:rounded-[50%] after:bg-brand-foreground/70 after:blur-[72px]",
  },
  {
    name: "Pro Team",
    icon: <Users className="h-4 w-4" />,
    description:
      "For institutions and HR Departments that wants to upskill or train.",
    price: 120,
    priceNote: "Annual subscription. Pay per admin. No other payment required.",
    cta: {
      variant: "default",
      label: "Get all-access",
      href: "#",
    },
    features: [
      "All the features will be available for your entire institution",
    ],
    featured: false,
    classes:
      "after:content-[''] after:absolute after:-top-[128px] after:left-1/2 after:h-[128px] after:w-[100%] after:max-w-[960px] after:-translate-x-1/2 after:rounded-[50%] after:bg-primary/30 after:blur-[72px]",
  },
  {
    name: "Enterprise Plan",
    icon: <Users className="h-4 w-4" />,
    description:
      "For institutions and HR Departments that wants to upskill or train.",
    price: 500,
    priceNote: "Annual subscription. Pay per admin. No other payment required.",
    cta: {
      variant: "default",
      label: "Get all-access",
      href: "#",
    },
    features: ["Choose only features you need for your organization."],
    featured: false,
    classes:
      "after:content-[''] after:absolute after:-top-[128px] after:left-1/2 after:h-[128px] after:w-[100%] after:max-w-[960px] after:-translate-x-1/2 after:rounded-[50%] after:bg-primary/50 after:blur-[78px]",
  },
];

export default function Pricing() {
  return (
    <Section>
      <div className="mx-auto flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-4 text-center sm:gap-8">
          <h2 className="text-3xl font-semibold leading-tight sm:text-5xl sm:leading-tight">
            Access your Deserved Learning Experience
          </h2>
          <p className="text-md max-w-[600px] font-medium text-muted-foreground sm:text-xl">
            Invest in your future by securing a subscription that will unlock
            your next step in lifetime evolution.
          </p>
        </div>
        <div className="mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col gap-6 overflow-hidden rounded-2xl bg-primary/5 p-8",
                plan.classes
              )}
            >
              <hr
                className={cn(
                  "absolute top-0 h-[1px] border-0 bg-gradient-to-r from-transparent via-foreground/60 to-transparent",
                  plan.featured && "via-brand"
                )}
              />
              <div className="flex flex-col gap-7">
                <div className="flex flex-col gap-2">
                  <h2 className="flex items-center gap-2 font-bold">
                    {plan.icon && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {plan.icon}
                      </div>
                    )}
                    {plan.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 lg:flex-col lg:items-start xl:flex-row xl:items-center">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-muted-foreground">
                      $
                    </span>
                    <span className="text-6xl font-bold">{plan.price}</span>
                  </div>
                  <div className="flex min-h-[40px] flex-col">
                    {plan.price > 0 && (
                      <>
                        <span className="text-sm">Annual payment</span>
                        <span className="text-sm text-muted-foreground">
                          plus local taxes
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <Button variant={plan.cta.variant} size="lg" asChild>
                  <Link href={plan.cta.href}>{plan.cta.label}</Link>
                </Button>
                <p className="min-h-[40px] text-sm text-muted-foreground">
                  {plan.priceNote}
                </p>
                <hr className="border-input" />
              </div>
              <div>
                <ul className="flex flex-col gap-2">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                    >
                      <CircleCheckBig className="h-4 w-4 shrink-0 text-muted-foreground" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
