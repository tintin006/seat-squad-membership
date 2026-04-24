# SEAT Squad Membership — Current Handoff

Last updated: 2026-04-24 12:30 AM EDT
Status: Phases 1, 2, and 3 COMPLETE. Auth, onboarding, app shell, dashboard, community feed, and admin dashboard all built, deployed, and tested end-to-end.

---

## Live Deployment

- Production: https://seat-squad-membership.vercel.app
- Vercel project: `seat-squad-membership`
- GitHub repo: https://github.com/tintin006/seat-squad-membership
- Stack: Next.js 16 App Router, TypeScript, Tailwind CSS v4, Supabase SSR

---

## What We Did Today (Apr 23, 2026)

### Phase 1 — Auth, Onboarding, App Shell, Dashboard
- Supabase SSR integration (`@supabase/ssr`, server/client/middleware clients)
- Auth pages: `/login`, `/signup`, `/auth/callback`
- Three-step onboarding (`/onboarding`) with role selection, learning context, intent + display name
- App shell with responsive left nav (desktop) / hamburger drawer (mobile)
- Dashboard home with welcome, stats cards, announcements, membership badges
- Settings page (`/settings`) for profile editing
- **Critical fixes:**
  - RLS infinite recursion resolved via `is_seat_admin()` SECURITY DEFINER function
  - Supabase anon key fixed (was truncated)
  - `get_or_create_seat_profile` moved to migration 002 to resolve compile-time dependency
  - Onboarding role cards: thick orange border + checkmark + deeper background

### Phase 2 — Community Feed
- Migration `003_seat_community_feed.sql` applied:
  - `seat_channels` — 5 default channels seeded (General, Homeschool Tips, Educator Lounge, Events & Meetups, The Crate Showcase)
  - `seat_posts` — with RLS, pinned/announcement flags, view count
  - `seat_comments` — 2-level nesting enforced by `check_comment_depth()` trigger
  - `seat_post_reactions` — emoji reactions with toggle support
  - `seat_bookmarks` — per-user bookmarks
  - `seat_post_reports` — moderation queue
- Feed UI components:
  - `ChannelSidebar` — left rail channel filter with post counts
  - `PostComposer` — create posts with channel/type selector
  - `PostCard` — author info, content, bookmark, report, pinned/announcement badges
  - `ReactionBar` — quick emoji picker + toggle reactions
  - `CommentThread` — 2-level comments with reply input
  - `RightRail` — channel info, member count, upcoming events placeholder
- Dashboard (`/`) now renders full community feed instead of static placeholder

### Phase 3 — Admin Foundation
- `/admin` route protected by `isAdmin` server-side check
- `AppShell` conditionally shows Admin nav item for admin users
- Admin dashboard components:
  - `MembersTable` — search, role filter, role changer dropdown, suspend/unsuspend
  - `ReportsQueue` — pending reports with resolve/dismiss actions
- Stats cards: Total Members, Admins, Suspended, Pending Reports

### Database Migrations (ALL APPLIED)
1. `001_seat_enums_and_helpers.sql` — enums, `update_updated_at_column()`
2. `002_seat_profiles_and_subscriptions.sql` — `seat_profiles`, `seat_subscriptions`, `is_seat_admin()`, `get_or_create_seat_profile()`
3. `003_seat_community_feed.sql` — channels, posts, comments, reactions, bookmarks, reports + 5 seeded channels

### Design System
- Warm editorial tokens active throughout
- Princeton Orange `#fb8b24` primary
- Cream background `#E8D0B4`
- `0.5rem` radius
- General Sans display + Inter body
- Orange asterisk brand symbol in nav

---

## Git Status

- Remote: `https://github.com/tintin006/seat-squad-membership`
- Latest commit: `70c9e23` — feat: Phase 2 community feed + Phase 3 admin dashboard
- Auto-deploy: Connected to Vercel
- Build status: Clean

---

## File Map

```
src/
  app/
    (app)/
      layout.tsx          # Auth guard, fetches seat_profile, renders AppShell
      page.tsx            # Dashboard home — fetches feed data, renders FeedPage
      feed-page.tsx       # Client component: channel filter, composer, post list, right rail
      admin/
        page.tsx          # Server component: admin guard, fetches members + reports
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
    app-shell.tsx         # Left nav, mobile menu, sign out, conditional Admin link
    feed/
      channel-sidebar.tsx # Channel filter with post counts
      post-composer.tsx   # Create posts with channel/type selector
      post-card.tsx       # Post display with bookmark, report, reactions, comments
      reaction-bar.tsx    # Emoji picker + toggle reactions
      comment-thread.tsx  # 2-level comment threads with reply
      right-rail.tsx      # Channel info, member count, upcoming events
    admin/
      members-table.tsx   # Searchable/filterable members table with suspend/role
      reports-queue.tsx   # Pending reports with resolve/dismiss
  lib/
    supabase/
      server.ts           # createServerClient for SSR
      client.ts           # createBrowserClient for client
      middleware.ts       # updateSession for middleware
  middleware.ts           # Applies session refresh globally
  types/
    database.ts           # TypeScript types for all SEAT tables
  supabase/
    migrations/
      001_seat_enums_and_helpers.sql
      002_seat_profiles_and_subscriptions.sql
      003_seat_community_feed.sql
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
- [ ] Add real-time updates for feed (Supabase realtime or polling)
- [ ] Add image upload support for posts
- [ ] Add rich text editor (Tiptap) for post composer

---

## Next Recommended Steps (Phase 4+)

1. **Real-time feed updates** — Supabase Realtime for instant post/reaction/comment updates
2. **Image uploads** — Supabase Storage for post images
3. **Rich text editor** — Tiptap for formatted posts
4. **Event system** — `seat_events` table + calendar view + RSVP
5. **DMs / private messaging** — `seat_conversations` + `seat_messages`
6. **Notifications** — in-app notification bell + push notifications
7. **Mobile PWA** — service worker, manifest, offline support
8. **Stripe billing** — subscription tiers, checkout, webhooks
