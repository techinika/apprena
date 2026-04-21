export interface PricingTier {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: string[];
  popular?: boolean;
  type: "individual" | "organization";
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Explorer",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Perfect to get started",
    features: [
      "2 Career Analyses",
      "Basic Roadmap View",
      "Social Insights",
    ],
    type: "individual",
  },
  {
    id: "sprint",
    name: "Single Sprint",
    monthlyPrice: 1200,
    annualPrice: 12000,
    description: "One detailed career analysis",
    features: [
      "Full Strategic Roadmap",
      "Network Expansion Playbook",
      "Habit Action Plan",
      "PDF Export",
    ],
    type: "individual",
  },
  {
    id: "architect",
    name: "The Architect",
    monthlyPrice: 12000,
    annualPrice: 120000,
    description: "For career-focused professionals",
    popular: true,
    features: [
      "Unlimited Roadmaps",
      "Real-time Trend Tracking",
      "Mentor Matchmaking",
      "Priority AI Support",
      "Personal Mentor Chat",
    ],
    type: "individual",
  },
  {
    id: "team-starter",
    name: "Team Starter",
    monthlyPrice: 24000,
    annualPrice: 240000,
    description: "For small teams (up to 5 members)",
    features: [
      "Up to 5 Team Members",
      "Organization Templates",
      "Member Progress Tracking",
      "Assign Manual Mentors",
      "Team Analytics",
      "Priority Support",
    ],
    type: "organization",
  },
  {
    id: "team-growth",
    name: "Team Growth",
    monthlyPrice: 40000,
    annualPrice: 400000,
    description: "Growing organizations (up to 15 members)",
    popular: true,
    features: [
      "Up to 15 Team Members",
      "All Team Starter Features",
      "Custom Learning Paths",
      "Deadline Management",
      "Advanced Analytics",
      "Dedicated Account Manager",
    ],
    type: "organization",
  },
  {
    id: "team-enterprise",
    name: "Team Enterprise",
    monthlyPrice: 80000,
    annualPrice: 800000,
    description: "Large organizations (unlimited members)",
    features: [
      "Unlimited Team Members",
      "All Team Growth Features",
      "White-label Options",
      "API Access",
      "Custom Integrations",
      "24/7 Enterprise Support",
    ],
    type: "organization",
  },
];

export function getMonthlyPrice(tierId: string): number {
  const tier = PRICING_TIERS.find(t => t.id === tierId);
  return tier?.monthlyPrice || 0;
}

export function getAnnualPrice(tierId: string): number {
  const tier = PRICING_TIERS.find(t => t.id === tierId);
  return tier?.annualPrice || 0;
}

export function getPriceByBilling(tierId: string, isAnnual: boolean): number {
  return isAnnual ? getAnnualPrice(tierId) : getMonthlyPrice(tierId);
}

export function getTierById(tierId: string): PricingTier | undefined {
  return PRICING_TIERS.find(t => t.id === tierId);
}

export function getIndividualTiers(): PricingTier[] {
  return PRICING_TIERS.filter(t => t.type === "individual");
}

export function getOrganizationTiers(): PricingTier[] {
  return PRICING_TIERS.filter(t => t.type === "organization");
}

export const BILLING_CYCLE = {
  MONTHLY: "monthly",
  ANNUAL: "annual",
} as const;
