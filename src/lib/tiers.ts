export type SeatTier = "free" | "member" | "pro";

export const tierRank: Record<SeatTier, number> = {
  free: 0,
  member: 1,
  pro: 2,
};

export const tierLabels: Record<SeatTier, string> = {
  free: "Free",
  member: "Member",
  pro: "Pro",
};

export const tierPlans = [
  {
    tier: "free" as const,
    name: "Free",
    price: "$0",
    description: "Community access and launch-week resources.",
    features: ["Forum access", "Free ESA state guides", "Weekly recap", "Pod directory browsing"],
  },
  {
    tier: "member" as const,
    name: "Member",
    price: "$12/mo",
    description: "Practical tools, live support, and member-only downloads.",
    features: ["Member resource packs", "Live Q&A archive", "Planner bundles", "Tutor fit tools"],
  },
  {
    tier: "pro" as const,
    name: "Pro",
    price: "$29/mo",
    description: "Deeper launch support for families, educators, and learning builders.",
    features: ["Pro lesson packs", "Priority Q&A prompts", "Advanced templates", "Future tutor connection priority"],
  },
];

export function canAccessTier(currentTier: SeatTier, requiredTier: SeatTier) {
  return tierRank[currentTier] >= tierRank[requiredTier];
}
