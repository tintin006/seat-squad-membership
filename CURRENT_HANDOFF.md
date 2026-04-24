# SEAT Squad Membership — Current Handoff

Last updated: 2026-04-23 11:45 PM EDT
Status: Phase 1 complete. Auth, onboarding, app shell, dashboard LIVE and tested end-to-end.

---

## Live Deployment

- Production: https://seat-squad-membership.vercel.app
- Vercel project: `seat-squad-membership`
- GitHub repo: https://github.com/tintin006/seat-squad-membership
- Stack: Next.js 16 App Router, TypeScript, Tailwind CSS v4, Supabase SSR

---

## What We Did Today (Apr 23, 2026)

### 1. Supabase Integration
- Installed `@supabase/ssr` and `@supabase/supabase-js`
- Created `src/lib/supabase/server.ts` — server-side client with cookie jar
- Created `src/lib/supabase/client.ts` — browser client
- Created `src/lib/supabase/middleware.ts` — session refresh in Next.js middleware
- Created `src/middleware.ts` — applies session refresh to all routes
- Connected to existing Remix Academics Supabase project (`wdfqtkqdfkdhwswnavzm`)
- Vercel env vars set: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Auth Pages
- `/login` — password sign-in, magic link (OTP), Google OAuth
- `/signup` — email/password with confirmation email flow
- `/auth/callback` — OAuth redirect handler, exchanges code for session
- All auth flows redirect authenticated users to `/`

### 3. Onboarding Flow (`/onboarding`)
- Three-screen flow:
  - Step 1: Role (Family / Educator / Both) — high-contrast selected state with thick orange border + checkmark
  - Step 2: Learning context (methodology tags, grade levels, subject tags)
  - Step 3: Intent tags + display name
- Protected by layout: redirects unauthenticated to `/login`, redirects already-onboarded to `/`
- On completion: upserts `seat_profiles` row with `onboarding_complete = true`
- **FIXED**: RLS infinite recursion resolved via `is_seat_admin()` SECURITY DEFINER function

### 4. App Shell + Dashboard
- Created `(app)` route group with auth-protected layout
- `AppShell` component:
  - Desktop: persistent left sidebar with nav (Home, Classroom, The Crate, Events, Members, Tutors)
  - Mobile: header with hamburger menu, collapsible nav drawer
  - Sign out button
- Dashboard home (`/`):
  - Welcome message with display name
  - Stats cards (Community, Events, The Crate — all at 0 until data exists)
  - Announcements section
  - Membership tier/role badges
- Settings page (`/settings`):
  - Edit display name, bio, location, profile visibility
  - Save to `seat_profiles`

### 5. Database Migrations (APPLIED)
- `supabase/migrations/001_seat_enums_and_helpers.sql`
  - `seat_role` enum: family, educator, both, admin
  - `seat_tier` enum: free, member, pro
  - `seat_event_type` enum
  - `seat_post_type` enum
  - `update_updated_at_column()` trigger function
- `supabase/migrations/002_seat_profiles_and_subscriptions.sql`
  - `public.seat_profiles` table with full RLS
  - `public.seat_subscriptions` table with full RLS
  - `is_seat_admin(uuid)` helper function (SECURITY DEFINER to prevent RLS recursion)
  - `get_or_create_seat_profile()` helper function
  - Indexes on tier, role, user_id, stripe_customer_id

### 6. Design System
- Warm editorial tokens active throughout
- Princeton Orange `#fb8b24` primary
- Cream background `#E8D0B4`
- `0.5rem` radius
- General Sans display + Inter body
- Orange asterisk brand symbol in nav

---

## Critical Blockers — RESOLVED

- ~~Migrations not applied~~ — Applied via SQL Editor
- ~~RLS infinite recursion in admin policies~~ — Fixed with `is_seat_admin()` SECURITY DEFINER function
- ~~Supabase anon key truncated in Vercel~~ — Fixed with full key
- ~~Email confirmation blocking testing~~ — Temporarily disabled for testing

---

## Git Status

- Remote: `https://github.com/tintin006/seat-squad-membership`
- Latest commit: `d8a532d` — fix: RLS infinite recursion + onboarding contrast
- Auto-deploy: Connected to Vercel

---

## Next Recommended Steps

### Phase 2 — Community Feed MVP
- `seat_channels` migration + seed data
- `seat_posts` migration
- `seat_comments` migration (max 2 levels)
- `seat_post_reactions` migration
- `seat_bookmarks` migration
- Feed page with channel filtering
- Post composer with plain text (Tiptap later)
- Reaction buttons (emoji picker)
- Comment threads
- Right rail: channel info, member count, upcoming events

### Phase 3 — Admin Foundation
- `/admin` route protected by `seat_role = admin`
- Members table with search/filter
- Suspend/unsuspend
- Content moderation queue from `seat_post_reports`

---

## File Map

```
src/
  app/
    (app)/
      layout.tsx          # Auth guard, fetches seat_profile, renders AppShell
      page.tsx            # Dashboard home
      settings/
        page.tsx          # Profile settings
    (auth)/
      login/
        page.tsx          # Login with password/magic link/Google
      signup/
        page.tsx          # Signup with email confirmation
    auth/
      callback/
        route.ts          # OAuth code exchange
    onboarding/
      layout.tsx          # Auth guard + onboarding completion check
      page.tsx            # Three-step onboarding flow
    layout.tsx            # Root layout with Inter font, metadata
    globals.css           # Warm editorial theme tokens
  components/
    app-shell.tsx         # Left nav, mobile menu, sign out
  lib/
    supabase/
      server.ts           # createServerClient for SSR
      client.ts           # createBrowserClient for client
      middleware.ts       # updateSession for middleware
  middleware.ts           # Applies session refresh globally
  supabase/
    migrations/
      001_seat_enums_and_helpers.sql
      002_seat_profiles_and_subscriptions.sql
```

---

## Env Vars (Vercel)

| Name | Value | Scope |
|------|-------|-------|
| NEXT_PUBLIC_SUPABASE_URL | https://wdfqtkqdfkdhwswnavzm.supabase.co | Production |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | [full key] | Production |

---

## Verification Commands

```bash
cd ~/seat-squad-membership
npm run build          # Verify production build
npm run dev            # Local dev server
```

---

## Production Checklist Before Public Launch

- [ ] Re-enable email confirmation in Supabase Auth settings
- [ ] Configure Google OAuth (enable provider + add Client ID/Secret)
- [ ] Configure custom email templates (Supabase Auth > Email Templates)
- [ ] Add Privacy Policy and Terms of Service pages
- [ ] Set up Stripe integration for subscriptions
- [ ] Add rate limiting to auth endpoints
- [ ] Run full security audit (RLS, admin policies, input validation)
