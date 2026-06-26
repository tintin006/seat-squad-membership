import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTierForStripePrice, stripe } from "@/lib/stripe";
import type { SeatTier } from "@/lib/tiers";

function subscriptionPeriodEnd(subscription: Stripe.Subscription) {
  const periodEnd = (subscription as unknown as { current_period_end?: number }).current_period_end;
  return periodEnd ? new Date(periodEnd * 1000).toISOString() : null;
}

function tierFromSubscription(subscription: Stripe.Subscription): SeatTier {
  const metadataTier = subscription.metadata?.seat_tier as SeatTier | undefined;
  if (metadataTier === "member" || metadataTier === "pro") return metadataTier;
  return getTierForStripePrice(subscription.items.data[0]?.price.id);
}

function activeProfileTier(subscription: Stripe.Subscription, subscriptionTier: SeatTier): SeatTier {
  return subscription.status === "active" || subscription.status === "trialing" ? subscriptionTier : "free";
}

async function syncSubscription(subscription: Stripe.Subscription) {
  const supabase = createAdminClient();
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  const subscriptionTier = tierFromSubscription(subscription);
  const profileTier = activeProfileTier(subscription, subscriptionTier);
  const userId = subscription.metadata?.seat_user_id;

  const { data: existing } = userId
    ? { data: null }
    : await supabase
        .from("seat_subscriptions")
        .select("user_id")
        .eq("stripe_customer_id", customerId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

  const resolvedUserId = userId || existing?.user_id;
  if (!resolvedUserId) return;

  await supabase.from("seat_subscriptions").upsert({
    user_id: resolvedUserId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    tier: subscriptionTier,
    status: subscription.status,
    current_period_end: subscriptionPeriodEnd(subscription),
    cancel_at_period_end: subscription.cancel_at_period_end,
  }, {
    onConflict: "stripe_subscription_id",
  });

  await supabase
    .from("seat_profiles")
    .update({
      tier: profileTier,
      updated_at: new Date().toISOString(),
    })
    .eq("id", resolvedUserId);
}

async function syncCheckoutSession(session: Stripe.Checkout.Session) {
  if (!stripe || typeof session.subscription !== "string") return;
  const subscription = await stripe.subscriptions.retrieve(session.subscription);
  await syncSubscription(subscription);
}

export async function POST(request: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook signature.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      await syncCheckoutSession(event.data.object as Stripe.Checkout.Session);
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await syncSubscription(event.data.object as Stripe.Subscription);
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
