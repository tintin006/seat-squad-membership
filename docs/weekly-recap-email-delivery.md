# Weekly Recap Email Delivery

The in-app Weekly Recap can now be sent through Resend from the Admin dashboard.

## Required Env

```bash
RESEND_API_KEY=re_...
WEEKLY_RECAP_FROM="SEAT Squad <updates@your-verified-domain.com>"
NEXT_PUBLIC_SITE_URL=https://seat.remixacademics.com
SUPABASE_SERVICE_ROLE_KEY=...
```

`WEEKLY_RECAP_FROM` must use a domain verified in Resend.

## Admin Flow

1. Open `/admin`.
2. Use **Send test** first. This sends the current recap to the signed-in admin.
3. Use **Send to members** after the test looks right.

The member send targets:

- `seat_profiles.onboarding_complete = true`
- `seat_profiles.is_suspended = false`
- Matching Supabase Auth users with an email address

The first implementation caps a send at 500 recipients.

## API

`POST /api/weekly-recap/send`

Body:

```json
{ "mode": "test" }
```

or:

```json
{ "mode": "members" }
```

The route is admin-only and uses the Supabase service role key to match eligible `seat_profiles` to Auth user emails.

## Current Email Content

The email body is generated from:

- `src/lib/weekly-recap.ts`
- Latest forum threads
- Featured resource
- Featured Remix Report signal
- One clear next step

The renderer lives in:

`src/lib/weekly-recap-email.ts`

It produces both HTML and plain text bodies.
