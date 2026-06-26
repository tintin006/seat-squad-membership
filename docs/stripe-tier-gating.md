# Stripe Tier Gating

SEAT Squad uses `seat_profiles.tier` as the app-facing access source of truth:

- `free`
- `member`
- `pro`

Stripe subscription state is stored in `seat_subscriptions`. Webhooks sync the active Stripe subscription back to both `seat_subscriptions` and `seat_profiles.tier`.

## Required Env

```bash
STRIPE_SECRET_KEY=sk_live_or_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_MEMBER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=https://seat.remixacademics.com
```

`NEXT_PUBLIC_SITE_URL` is optional locally because the checkout and portal routes can fall back to the request origin.

## Routes

- `POST /api/stripe/checkout`
  - Body: `{ "tier": "member" }` or `{ "tier": "pro" }`
  - Creates a Stripe Checkout subscription session.

- `POST /api/stripe/portal`
  - Creates a Stripe Customer Portal session for the current member.

- `POST /api/stripe/webhook`
  - Handles `checkout.session.completed`
  - Handles `customer.subscription.created`
  - Handles `customer.subscription.updated`
  - Handles `customer.subscription.deleted`

## Stripe Dashboard

Create two recurring subscription prices and copy their price IDs into env:

- SEAT Squad Member -> `STRIPE_MEMBER_PRICE_ID`
- SEAT Squad Pro -> `STRIPE_PRO_PRICE_ID`

Configure the webhook endpoint:

```text
https://YOUR_DOMAIN/api/stripe/webhook
```

Subscribe it to:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Current Gating

The resource library reads `seat_profiles.tier` server-side and locks downloads when the member's tier rank is below the download's required tier.

The current library includes:

- Free ESA state guides
- Member preview: Weekly Rhythm Planner Pack
- Pro preview: AI Literacy Mini-Unit
