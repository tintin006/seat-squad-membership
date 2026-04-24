# SEAT Squad Membership Site — Build Roadmap

Date: 2026-04-23 09:11 PM EDT
Source spec: `/Users/chlinder/seat-squad-v1-spec.md`
Target: New SEAT Squad membership site sharing the existing Remix Academics / Mixtape360 Supabase project
Design system: Remix Academics Warm Editorial

---

## 0. Executive build decision

Build SEAT Squad as a dedicated Next.js App Router membership app that uses the existing Remix Academics Supabase project, but keeps its product data isolated through `seat_*` table names.

Do not create generic tables named `profiles`, `posts`, `events`, `resources`, or `notifications`. The existing database already has Remix/Mixtape360 concepts in `public.profiles`, `public.students`, `public.beat_articles`, mission tables, parent dashboard tables, etc. SEAT Squad should coexist by linking to existing auth/profile identity while keeping membership/community data namespaced.

Recommended pattern:

- Identity anchor: existing `auth.users` and existing `public.profiles`
- SEAT membership profile: `public.seat_profiles`
- All SEAT product tables: `public.seat_*`
- Storage buckets: `seat-public`, `seat-private`, `seat-post-images`, `seat-avatars`
- Stripe subscription state: `public.seat_subscriptions`
- Teachers2Tutors seam: passive fields on `public.seat_tutor_profiles`, not a full marketplace yet

This avoids breaking existing Remix/Mixtape360 code and avoids overloading the existing `profiles.tier` enum, which already appears to be used by Remix Report / Remix membership concepts.

---

## 1. Product goal

Ship a Skool-inspired but warmer, family-first membership platform for Black and Brown homeschool and hybrid families.

V1 must answer four jobs:

1. Give families a calm, trusted community home.
2. Give members practical resources and learning frameworks.
3. Give Remix a structured place to host events, courses, announcements, and feedback loops.
4. Create a clean future integration seam for Teachers2Tutors without prematurely building a full tutoring marketplace.

V1 is successful if a founding member can:

- Sign up or log in.
- Complete a three-step onboarding flow.
- Land inside a persistent app shell with left nav, main feed, and right rail.
- Read and post in allowed channels based on tier.
- Comment, react, bookmark, and report posts.
- Browse The Crate/resource library.
- RSVP to an event.
- View courses/lessons and track basic progress.
- Browse tutor profiles and send a connection request if Member+.
- Manage profile/settings.
- Upgrade/downgrade membership through Stripe.

---

## 2. Non-negotiable constraints

### 2.1 Shared database safety

SEAT Squad tables must coexist with existing Remix Academics/Mixtape360 tables.

Rules:

- Do not rename, drop, or repurpose existing tables.
- Do not modify existing `public.profiles.tier` for SEAT membership gating.
- Do not add SEAT-specific assumptions to existing Mixtape360 RLS policies.
- Use separate SEAT enums: `seat_role`, `seat_tier`, `seat_event_type`, etc.
- Use `seat_*` table names in `public` unless Supabase PostgREST schema configuration is deliberately updated for a dedicated `seat` schema.
- Every table gets RLS before production data touches it.
- Every migration must be idempotent enough for drift repair: `CREATE TABLE IF NOT EXISTS`, `DO $$ BEGIN ... EXCEPTION WHEN duplicate_object THEN NULL; END $$;` for enums where appropriate.

### 2.2 Design system safety

SEAT Squad uses the Remix Academics warm editorial system:

- Primary: Princeton Orange `#fb8b24`
- Background: warm cream/tan `#E8D0B4`
- Foreground: warm brown/ink `#3D2E22`
- Dark mode, if included: warm dark ink `#1A1410`, not pure black
- Radius: `0.5rem`
- Fonts: General Sans display + Inter body
- Brand symbol: orange asterisk PNG for SEAT/Remix surfaces
- No four-pointed star/✦ icons
- No generic SaaS purple gradients
- No cold-blue dashboard aesthetic

### 2.3 V1 product restraint

Do not overbuild:

- No infinite nested comments; max two levels.
- No complex recommendation algorithm; chronological feed + top posts toggle only.
- No in-platform tutor payments in SEAT Squad.
- No direct messages in V1.
- No full vendor self-serve portal in V1.
- No semantic search until resource volume justifies `pgvector`.
- No complicated gamification beyond course completion badges and profile indicators.

---

## 3. Recommended app architecture

### 3.1 Repository/app

Create a new dedicated app, ideally:

`/Users/chlinder/seat-squad-membership`

Framework:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui customized to Remix warm editorial tokens
- Supabase SSR helpers / `@supabase/ssr`
- React Query for server state where useful
- Zustand for local shell state: sidebar, composer modal, filters
- Tiptap for rich text composer
- Stripe for subscriptions
- Resend for transactional/digest emails
- Vercel for hosting

Why separate app instead of embedding inside `remix-academics-site`:

- The main Remix Academics site is a Vite marketing/public site.
- The SEAT Squad spec requires Next.js middleware, SSR auth helpers, API routes, Stripe webhooks, PWA, and richer app-shell behavior.
- A separate app keeps membership complexity out of the public marketing site while still sharing the same Supabase backend and design system.

### 3.2 URL strategy

Best production target:

- Marketing entry: `https://remixacademics.com/seat-squad`
- Membership app: `https://seat.remixacademics.com` or `https://members.remixacademics.com`

If the user wants the full app under `/seat-squad`, use a Vercel rewrite/proxy from the marketing domain to the Next app. But the cleanest architecture is:

- `/seat-squad` remains a public landing/spec/conversion page on Remix Academics.
- CTA sends to `seat.remixacademics.com` for auth/app.

Do not force the full app into the Vite marketing codebase unless there is a hard constraint against subdomains.

---

## 4. Database roadmap

### 4.1 Core identity and membership tables

Use `public.profiles` as a cross-product identity anchor, but put SEAT-specific membership state in `public.seat_profiles` and `public.seat_subscriptions`.

Proposed tables:

```sql
public.seat_profiles
- id uuid primary key references public.profiles(id) on delete cascade
- display_name text
- avatar_url text
- role seat_role not null default 'family'
- tier seat_tier not null default 'free'
- onboarding_complete boolean not null default false
- methodology_tags text[] not null default '{}'
- grade_levels text[] not null default '{}'
- subject_tags text[] not null default '{}'
- intent_tags text[] not null default '{}'
- location text
- bio text
- profile_visibility text not null default 'members'
- is_suspended boolean not null default false
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

public.seat_subscriptions
- id uuid primary key default gen_random_uuid()
- user_id uuid not null references public.profiles(id) on delete cascade
- stripe_customer_id text unique
- stripe_subscription_id text unique
- tier seat_tier not null default 'free'
- status text not null default 'inactive'
- current_period_end timestamptz
- cancel_at_period_end boolean not null default false
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()
```

Enums:

```sql
seat_role: family, educator, both, admin
seat_tier: free, member, pro
```

Important: keep `seat_profiles.tier` synced from Stripe webhooks; do not rely on `public.profiles.tier`.

### 4.2 Community tables

```sql
seat_channels
seat_posts
seat_post_reactions
seat_comments
seat_bookmarks
seat_post_reports
```

Design notes:

- Store rich text as JSONB from Tiptap.
- Store a plain-text excerpt/search column for search and moderation preview.
- `seat_comments.parent_id` allows one nested reply level; enforce deeper nesting in app logic or DB trigger.
- `seat_channels.min_post_tier` and `seat_channels.min_read_tier` make gating data-driven.
- Admin-only channels use `admin_only boolean`.

### 4.3 Resource library / The Crate

```sql
seat_resources
seat_resource_downloads
seat_resource_collections
seat_resource_collection_items
```

Indexes:

- GIN indexes on tags arrays.
- `pg_trgm` index on title/description/search text.
- Counter cache for downloads if needed, but treat analytics as derived where possible.

Storage:

- `seat-private` for gated member downloads.
- `seat-public` for previews and public marketing assets.
- Serve private resources through signed URLs, not raw public links.

### 4.4 Classroom

```sql
seat_courses
seat_lessons
seat_course_progress
seat_badges
seat_user_badges
```

V1 behavior:

- First lesson preview for free members where course allows it.
- Member gets full non-Pro courses.
- Pro gets all courses.
- Sequential unlock is a course-level boolean.

### 4.5 Events

```sql
seat_events
seat_rsvps
seat_event_reminders
```

V1 behavior:

- Free RSVP becomes waitlist.
- Member RSVP is confirmed if capacity allows.
- Pro may have priority for Pro events.
- Join URLs remain hidden until day-of/start window for gated events.

### 4.6 Tutor directory and Teachers2Tutors seam

```sql
seat_tutor_profiles
seat_connection_requests
```

Add these from V1 even if UI is lightweight:

- `t2t_linked boolean not null default false`
- `t2t_profile_id uuid null`
- `approval_status text not null default 'pending'`
- `external_booking_url text`

SEAT Squad should not process tutor session payments. Phase 2 Teachers2Tutors owns booking/payment.

### 4.7 Member directory and pods/co-ops

```sql
seat_member_directory_settings
seat_pod_listings
seat_pod_listing_requests
```

No DMs in V1. Pod listings use contact method or external link, subject to admin approval.

### 4.8 Vendor discounts

```sql
seat_discounts
seat_discount_clicks
```

Track clicks as events, not just a mutable counter, so analytics can be rebuilt.

### 4.9 Notifications

```sql
seat_notifications
seat_notification_preferences
seat_email_digest_runs
```

V1 notifications:

- Reply to your post
- Reaction to your post
- Event RSVP update/reminder
- Connection request update
- New admin announcement
- New resource in selected category

---

## 5. RLS and security model

### 5.1 Helper functions

Create helper functions early:

```sql
public.get_seat_tier(user_uuid uuid) returns seat_tier
public.get_seat_role(user_uuid uuid) returns seat_role
public.is_seat_admin(user_uuid uuid) returns boolean
public.seat_tier_rank(tier seat_tier) returns int
public.can_access_seat_tier(user_uuid uuid, required seat_tier) returns boolean
```

Use these in RLS policies to avoid duplicating tier logic everywhere.

### 5.2 RLS principles

- Free members can read public/free content.
- Member+ can post in member-gated channels and download member resources.
- Pro can access pro resources/courses/events.
- Users can update only their own SEAT profile fields.
- Admins can moderate and manage all SEAT tables.
- Suspended users can read allowed content but cannot post/comment/react/RSVP/request connections.
- Private storage downloads must route through signed URL server action/API that verifies tier first.

### 5.3 Moderation safety

Every user-generated surface needs a report path:

- Posts
- Comments
- Tutor profiles
- Pod listings

Admin dashboard must allow: dismiss report, hide content, warn user, suspend user.

---

## 6. Frontend information architecture

### 6.1 Auth routes

- `/login`
- `/signup`
- `/magic-link`
- `/auth/callback`
- `/onboarding`

### 6.2 App shell routes

- `/` or `/home` — community feed
- `/classroom` — course list
- `/classroom/[courseSlug]`
- `/classroom/[courseSlug]/[lessonSlug]`
- `/crate` — resource library
- `/crate/[resourceSlug]`
- `/events`
- `/events/[eventId]`
- `/members`
- `/pods`
- `/tutors`
- `/profile/[userId]`
- `/settings`
- `/billing`
- `/admin`

### 6.3 Persistent layout

Authenticated layout:

- Top nav: logo, search, notifications, avatar
- Left nav: fixed desktop, drawer mobile
- Main panel: scrollable content
- Right rail: contextual sticky panel
- Mobile bottom nav: Home, Classroom, Crate, Events, Profile

### 6.4 Dashboard tone

Use human language in empty/loading/error states:

- Empty feed: “Your feed is quiet right now — be the first to post something good.”
- Locked resource: “This one is for SEAT Members. You can still preview the first page.”
- Upgrade nudge: “Want the full library? Member access opens every download and session replay.”
- Report success: “Got it. We’ll review this and keep the room safe.”

---

## 7. Build phases

## Phase 0 — Planning, repo, and schema safety

Goal: lock architecture before writing feature code.

Deliverables:

1. Create `seat-squad-membership` repo/app.
2. Copy Remix warm editorial tokens into Tailwind/CSS.
3. Add a `CURRENT_HANDOFF.md` from day one.
4. Configure Supabase env vars against the existing Remix Supabase project.
5. Generate a schema collision audit from existing migrations.
6. Create a migration plan using only `seat_*` table names.
7. Confirm storage bucket names.
8. Confirm Stripe product/price mapping for `member` and `pro`.

Acceptance criteria:

- App boots locally.
- Theme visually matches Remix Academics.
- No hardcoded old colors: `#FF6C01`, `#0a0a0a`, `#000`.
- Migration plan lists every new table and confirms no existing table is repurposed.

Recommended commit:

`chore: scaffold seat squad membership app`

---

## Phase 1 — Auth, onboarding, membership profile

Goal: a user can enter the SEAT app and become a free member.

Deliverables:

1. Supabase SSR auth setup.
2. Route middleware protection.
3. Login/signup/magic-link flow.
4. Google OAuth callback.
5. `seat_profiles` migration and RLS.
6. Profile creation RPC or trigger after signup.
7. Three-screen onboarding:
   - Role: Family / Educator-Tutor / Both
   - Learning environment: methodology, grades, subjects
   - Intent tags: community, resources, tutor, get kid on track, support families
8. `useSeatMembership` hook reads `seat_profiles`.
9. Basic settings/profile page.

Acceptance criteria:

- New user can sign up and complete onboarding.
- Onboarding completion creates/updates exactly one `seat_profiles` row.
- Refresh keeps session.
- Logged-out users are redirected to login.
- Suspended placeholder logic exists even before admin UI.

Recommended commit:

`feat: add seat auth and onboarding`

---

## Phase 2 — App shell and community feed MVP

Goal: make SEAT Squad feel like a real membership home.

Deliverables:

1. Authenticated app shell:
   - Top nav
   - Left nav
   - Main panel
   - Right rail
   - Mobile bottom nav
2. Seed channels:
   - Announcements
   - General
   - Curriculum Talk
   - Learning Wins
   - Ask the Squad
   - Resource Swap
   - Cultural Learning
   - Admin/Ops
3. Feed view by channel.
4. Post composer with Tiptap.
5. Image upload to `seat-post-images`.
6. Reactions.
7. Threaded comments, two levels max.
8. Bookmark posts.
9. Report posts/comments.
10. Admin pinning for announcements.
11. Right rail shows channel description, member count, upcoming events placeholder, featured Crate tip placeholder.

Acceptance criteria:

- Free users can post only where allowed: General and Learning Wins.
- Member+ users can post in member channels.
- Announcements are admin-only to create.
- Report action creates moderation queue records.
- No user can update/delete someone else’s content unless admin.

Recommended commit:

`feat: add seat community feed`

---

## Phase 3 — Admin foundation and moderation

Goal: give Remix operators control before the community opens.

Deliverables:

1. `/admin` route protected by `seat_role = admin`.
2. Members table:
   - Search
   - Role filter
   - Tier filter
   - Suspend/unsuspend
   - Change role/tier manually for testing and comped users
3. Moderation queue:
   - Reported posts/comments
   - Dismiss report
   - Hide/delete content
   - Suspend user
4. Channel manager:
   - Create/archive channel
   - Set min read/post tier
   - Sort order

Acceptance criteria:

- Non-admin users cannot access admin data through UI or direct API calls.
- Suspension blocks posting/commenting/reacting/RSVPs.
- Admin actions are recorded in `seat_admin_audit_log`.

Recommended commit:

`feat: add seat admin moderation tools`

---

## Phase 4 — The Crate and resource library

Goal: deliver the core resource value proposition.

Deliverables:

1. `seat_resources` migration with metadata.
2. Resource library page.
3. The Crate featured banner.
4. Search/filter/sort:
   - Subject
   - Grade level
   - Methodology
   - Resource type
   - Tier
5. Admin resource uploader.
6. Signed URL download API/server action.
7. Free preview/public file path support.
8. Download tracking.
9. Optional non-member Crate capture flow if app has public resource teaser pages.

Acceptance criteria:

- Free user sees previews but cannot download member-only resources.
- Member user can download member resources through signed URL.
- Admin can upload/edit/archive resources.
- Search uses trigram/fuzzy matching where available.

Recommended commit:

`feat: add crate resource library`

---

## Phase 5 — Stripe paid tier activation

Goal: turn free members into paid members securely.

Deliverables:

1. Stripe products/prices:
   - SEAT Squad Member
   - SEAT Squad Pro
2. Checkout route/server action.
3. Customer portal route/server action.
4. Stripe webhook endpoint:
   - subscription created
   - subscription updated
   - subscription deleted/canceled
5. `seat_subscriptions` table.
6. Tier sync from webhook to `seat_profiles.tier`.
7. Upgrade CTAs for locked actions.
8. Billing page.

Acceptance criteria:

- Test checkout updates `seat_profiles.tier` after webhook.
- Cancel/downgrade updates access.
- Webhook signature is verified.
- UI gating and RLS agree.
- No payment method details stored in Supabase.

Recommended commit:

`feat: add seat stripe subscriptions`

---

## Phase 6 — Events

Goal: establish monthly programming rhythm.

Deliverables:

1. Event tables and RLS.
2. Events list + calendar/list toggle.
3. Event detail page.
4. RSVP flow.
5. Tier/capacity logic:
   - Free = waitlist where required
   - Member = confirmed if capacity available
   - Pro = pro events + priority rules
6. Resend transactional emails:
   - RSVP confirmation
   - 24-hour reminder
   - Day-of join link
   - Post-event replay link
7. Admin event manager.

Acceptance criteria:

- Join URL is not exposed to unauthorized tiers.
- RSVP state is visible to user.
- Admin can export RSVP list.
- Email templates render with correct event/user data.

Recommended commit:

`feat: add seat events and rsvps`

---

## Phase 7 — Classroom

Goal: add structured learning content without bloating the feed.

Deliverables:

1. Course/lesson tables.
2. Course list cards.
3. Lesson page with markdown/MDX and video embed.
4. Progress tracking.
5. Sequential unlock optional per course.
6. Completion badge awarded on course completion.
7. Admin course/lesson editor.
8. Initial V1 content slots:
   - The Remix Framework
   - Mixtape360 Orientation
   - 2-3 Pro placeholders

Acceptance criteria:

- Free members can preview first lesson only where configured.
- Member+ can access published member courses.
- Pro can access Pro courses.
- Progress survives refresh and is tied to user.

Recommended commit:

`feat: add seat classroom courses`

---

## Phase 8 — Member directory, pods/co-ops, and vendor discounts

Goal: deepen practical member utility.

Deliverables:

1. Member directory opt-in settings.
2. Member cards and filters.
3. Pod/co-op board:
   - Listing creation
   - Admin approval
   - Browse/filter
4. Vendor discount hub:
   - Cards
   - Member+ gating
   - Affiliate links
   - Click tracking
5. Admin managers for pods and discounts.

Acceptance criteria:

- Member directory respects visibility settings.
- Pod listings require approval before public display.
- Free users see upgrade CTA for discounts but not full gated details.
- Discount clicks are tracked as events.

Recommended commit:

`feat: add seat directories and discounts`

---

## Phase 9 — Tutor directory and AI-assisted matching

Goal: establish the Teachers2Tutors bridge without building marketplace payments.

Deliverables:

1. Tutor profile table and RLS.
2. Tutor profile creation flow for educators.
3. Admin approval for tutor profiles.
4. Tutor directory filters.
5. Connection request flow.
6. AI draft tutor profile endpoint:
   - `POST /api/ai/draft-tutor-profile`
7. AI tutor matching endpoint:
   - `POST /api/ai/match-tutor`
8. Match results with explanation.
9. Email notifications for connection requests.

Acceptance criteria:

- Free users can browse previews.
- Member+ users can view full tutor profiles and send requests.
- Tutor profile is not public until approved.
- No tutor payment/scheduling is processed inside SEAT Squad.
- `t2t_linked` and `t2t_profile_id` fields exist but remain passive.

Recommended commit:

`feat: add seat tutor directory`

---

## Phase 10 — Notifications, search, digest, and PWA polish

Goal: prepare for ongoing usage.

Deliverables:

1. In-app notification bell.
2. Notification preferences page.
3. Weekly digest generator.
4. Search across posts/resources/tutors.
5. PWA install shell and mobile safe-area handling.
6. Loading skeletons and empty states.
7. Accessibility pass.
8. Performance/code-splitting pass.

Acceptance criteria:

- Notification unread count works.
- Users can mark notifications read.
- Email preferences are respected.
- Mobile nav works cleanly on iOS safe areas.
- Lighthouse/accessibility checks are acceptable.

Recommended commit:

`feat: add seat notifications and pwa polish`

---

## 8. Suggested migration sequence

Keep migrations small and reversible.

1. `001_seat_enums_and_helpers.sql`
   - Enums
   - Tier helper functions
   - Admin helper functions

2. `002_seat_profiles_and_subscriptions.sql`
   - `seat_profiles`
   - `seat_subscriptions`
   - RLS
   - trigger/RPC to create SEAT profile

3. `003_seat_community.sql`
   - Channels/posts/comments/reactions/bookmarks/reports
   - Seed default channels
   - RLS

4. `004_seat_admin_audit.sql`
   - Audit log
   - Moderation support

5. `005_seat_resources.sql`
   - Resource tables
   - Download tracking
   - Storage policies
   - `pg_trgm` indexes

6. `006_seat_events.sql`
   - Events/RSVP/reminders

7. `007_seat_classroom.sql`
   - Courses/lessons/progress/badges

8. `008_seat_directories.sql`
   - Member visibility
   - Pod listings
   - Discounts/clicks

9. `009_seat_tutors.sql`
   - Tutor profiles
   - Connection requests
   - T2T bridge fields

10. `010_seat_notifications.sql`
   - Notifications
   - Preferences
   - Digest tracking

Each migration should include:

- RLS enabled before app access.
- Policies with explicit tier/role checks.
- Indexes for FKs, created_at, tier gates, and search fields.
- `updated_at` triggers where needed.
- No destructive changes to existing Remix tables.

---

## 9. API/server route roadmap

Use server actions or route handlers, but keep the boundaries clear.

Core routes:

- `POST /api/stripe/checkout`
- `POST /api/stripe/portal`
- `POST /api/webhooks/stripe`
- `POST /api/resources/[id]/signed-url`
- `POST /api/events/[id]/rsvp`
- `POST /api/ai/draft-tutor-profile`
- `POST /api/ai/match-tutor`
- `POST /api/admin/moderation/action`
- `POST /api/notifications/mark-read`

Rules:

- Every server route must resolve authenticated user server-side.
- Every tier-gated route must verify `seat_profiles.tier` server-side.
- Do not rely on client-hidden buttons for access control.
- Stripe webhook must use raw body signature verification.
- AI endpoints must rate-limit by user/tier.

---

## 10. Testing and verification roadmap

### 10.1 Automated tests

Minimum test suites:

- Auth/onboarding route guards
- `useSeatMembership` hook behavior
- RLS integration tests where practical
- Stripe webhook tier sync
- Resource signed URL access checks
- Event RSVP tier/capacity logic
- Community posting permissions
- Admin authorization checks

### 10.2 Manual acceptance scripts

Create seeded users:

- `seat-free-parent@example.com`
- `seat-member-parent@example.com`
- `seat-pro-parent@example.com`
- `seat-educator@example.com`
- `seat-admin@example.com`
- `seat-suspended@example.com`

Run through:

1. Free user onboarding and locked member actions.
2. Member posting/downloading/RSVP.
3. Pro course/event access.
4. Educator tutor profile draft and approval.
5. Admin moderation and suspension.
6. Stripe test checkout/cancel.
7. Mobile app shell on iPhone viewport.

### 10.3 Deployment verification

Before each production deploy:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- Supabase migration dry-run/review
- Verify RLS with seeded users
- Verify Stripe webhook in test mode
- Browser smoke test core routes

---

## 11. Launch plan

### Internal alpha

Audience: Remix operators only.

Goal:

- Verify auth, onboarding, admin controls, RLS, and app shell.

Exit criteria:

- Admin can recover from bad content/user state.
- No cross-product Supabase breakage.
- Basic posting/commenting/resource flow stable.

### Founding cohort beta

Audience: 20-50 invited waitlist members.

Goal:

- Validate channel taxonomy, resource usefulness, onboarding questions, tone, and event rhythm.

Exit criteria:

- 70%+ onboarding completion.
- 40%+ post/comment/reaction within first week.
- At least 5 resource downloads per 10 members.
- No major moderation/safety incidents.

### Paid member launch

Audience: broader SEAT waitlist.

Goal:

- Activate Stripe paid tiers and Member/Pro gating.

Exit criteria:

- Checkout/webhook reliable.
- Member-gated resources/events work.
- Upgrade nudges are helpful, not punitive.

### Tutor bridge pilot

Audience: small approved educator/tutor cohort.

Goal:

- Validate tutor profile fields, matching intake, and connection request flow.

Exit criteria:

- Families can identify good-fit tutors.
- Tutors can maintain profile quality.
- Teachers2Tutors requirements become clearer before Phase 2 build.

---

## 12. Key risks and mitigations

### Risk: Existing `profiles` table conflicts with SEAT membership tiers

Mitigation:

- Use `seat_profiles.tier`, `seat_role`, and helper functions.
- Never use existing `profiles.tier` for SEAT access.

### Risk: RLS breaks existing Remix/Mixtape360 behavior

Mitigation:

- Only add policies to new `seat_*` tables in SEAT migrations.
- Avoid modifying existing policies except by explicit separate audit.

### Risk: V1 turns into a full marketplace

Mitigation:

- Tutor payments/bookings stay external or Teachers2Tutors-owned.
- SEAT V1 only supports profiles, matching, and connection requests.

### Risk: Community moderation is underbuilt

Mitigation:

- Ship reports, admin queue, suspension, and audit log before public beta.

### Risk: Design drifts into generic SaaS

Mitigation:

- Start from Remix Academics tokens.
- Use editorial hierarchy, warm surfaces, strong typography, orange asterisk branding.
- Review every empty state and CTA for human community voice.

### Risk: Signed resource URLs leak

Mitigation:

- Private bucket only.
- Short-lived signed URLs.
- Server-side tier check every time a URL is generated.

---

## 13. Immediate next steps

1. Decide URL architecture:
   - Recommended: public `/seat-squad` landing page + `seat.remixacademics.com` app.
   - Alternative: full app under `/seat-squad` via rewrite/proxy.

2. Create the new Next.js repo/app.

3. Copy the Remix warm editorial theme into the new app before building UI.

4. Write `001_seat_enums_and_helpers.sql` and `002_seat_profiles_and_subscriptions.sql` as the first migration pair.

5. Build auth/onboarding before any feed/resource/tutor work.

6. Seed default channels and admin account.

7. Build the app shell and feed MVP.

8. Open internal alpha before Stripe/tutors.

---

## 14. Definition of V1 done

V1 is done when:

- New app is live on Vercel.
- It uses the existing Remix Supabase project safely with only `seat_*` product tables.
- Warm editorial design system is consistent with Remix Academics.
- Auth/onboarding works.
- Community feed works with tier-gated posting.
- Admin moderation works.
- The Crate/resource library works with signed gated downloads.
- Stripe upgrades sync to `seat_profiles.tier`.
- Events and Classroom work at a usable V1 level.
- Tutor directory exists as a lightweight Teachers2Tutors bridge.
- No existing Remix Academics or Mixtape360 production routes are broken.
- `CURRENT_HANDOFF.md` documents where to resume.
