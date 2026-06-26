import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPublicSiteUrl, getStripePriceId, isPaidTier, stripe } from "@/lib/stripe";
import type { SeatTier } from "@/lib/tiers";

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }

  const { tier } = await request.json() as { tier?: SeatTier };

  if (!tier || !isPaidTier(tier)) {
    return NextResponse.json({ error: "Choose a paid tier." }, { status: 400 });
  }

  const priceId = getStripePriceId(tier);
  if (!priceId) {
    return NextResponse.json({ error: `Missing Stripe price ID for ${tier}.` }, { status: 500 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("seat_profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const { data: existingSubscription } = await supabase
    .from("seat_subscriptions")
    .select("id, stripe_customer_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let customerId = existingSubscription?.stripe_customer_id || null;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: profile?.display_name || user.email?.split("@")[0],
      metadata: {
        seat_user_id: user.id,
      },
    });
    customerId = customer.id;

    await supabase.from("seat_subscriptions").insert({
      user_id: user.id,
      stripe_customer_id: customerId,
      tier: "free",
      status: "checkout_started",
    });
  }

  const siteUrl = getPublicSiteUrl(request.headers.get("origin"));
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${siteUrl}/settings?billing=success`,
    cancel_url: `${siteUrl}/settings?billing=canceled`,
    metadata: {
      seat_user_id: user.id,
      seat_tier: tier,
    },
    subscription_data: {
      metadata: {
        seat_user_id: user.id,
        seat_tier: tier,
      },
    },
  });

  return NextResponse.json({ url: session.url });
}
