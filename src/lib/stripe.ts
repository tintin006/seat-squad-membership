import Stripe from "stripe";
import type { SeatTier } from "@/lib/tiers";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const stripePriceIds: Partial<Record<Exclude<SeatTier, "free">, string>> = {
  member: process.env.STRIPE_MEMBER_PRICE_ID,
  pro: process.env.STRIPE_PRO_PRICE_ID,
};

export function getStripePriceId(tier: SeatTier) {
  if (tier === "free") return null;
  return stripePriceIds[tier] || null;
}

export function getTierForStripePrice(priceId: string | null | undefined): SeatTier {
  if (!priceId) return "free";
  if (priceId === stripePriceIds.pro) return "pro";
  if (priceId === stripePriceIds.member) return "member";
  return "free";
}

export function isPaidTier(tier: SeatTier): tier is Exclude<SeatTier, "free"> {
  return tier === "member" || tier === "pro";
}

export function getPublicSiteUrl(origin?: string | null) {
  return process.env.NEXT_PUBLIC_SITE_URL || origin || "http://localhost:3000";
}
