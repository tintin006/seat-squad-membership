# Pod Directory Supabase Hardening Runbook

Last updated: 2026-06-26

## Current Status

As of 2026-06-26, Supabase CLI `2.108.0` is installed locally via Homebrew.

`supabase/migrations/004_seat_group_directory.sql` has been applied to the linked remote Supabase project and repaired into migration history as version `004`.

Remote verification completed:

- `public.seat_group_submissions` exists.
- table columns match the migration, including verification and expiry fields.
- RLS policies exist for approved reads, own-submission reads, member inserts, and admin management.
- indexes exist for status, state, verification status, expiry, nearby states, age bands, and inclusion tags.
- remote row count was `0` immediately after migration.
- generated remote types at `/tmp/seat-squad-remote-types.ts` include `seat_group_submissions`.

Note: local migrations `001`, `002`, and `003` are not recorded in the remote migration history even though their database objects exist remotely. Do not run `supabase db push` until that older migration-history mismatch is audited or repaired deliberately.

## Scope

This runbook covers the SEAT Squad Pods & Groups directory MVP:

- Member-facing route: `/pods`
- Demo route: `/demo/pods`
- Submission table: `public.seat_group_submissions`
- Migration: `supabase/migrations/004_seat_group_directory.sql`
- Admin review UI: Admin Dashboard > Group Submissions

## Migration

Apply `004_seat_group_directory.sql` after migrations `001` through `003` are already present. This has already been done on the linked remote project as of 2026-06-26.

The migration creates a reviewable directory submission table with:

- `pending`, `approved`, `rejected`, `archived` statuses
- `self_reported`, `admin_verified`, `needs_update` verification states
- group type and format check constraints
- two-letter uppercase state code constraint
- URL checks for `website_url` and `source_url`
- minimum description length
- review metadata: `admin_notes`, `reviewed_by`, `reviewed_at`
- freshness metadata: `last_verified_at`, `expires_at`
- RLS for member submissions, own-submission reads, approved listing reads, and admin management

## RLS Checks

Before launch, verify with test users:

- Anonymous users cannot read `seat_group_submissions`.
- Authenticated members can insert only rows where `submitted_by = auth.uid()` and `status = 'pending'`.
- Authenticated members cannot insert directly as `approved`.
- Authenticated members can read their own pending submissions.
- Authenticated members can read approved listings.
- Only admins can approve, reject, archive, or edit submissions.

## Real Loop Test

1. Sign in as a non-admin member.
2. Open `/pods`.
3. Submit a group with no optional URL.
4. Confirm a row appears with:
   - `status = 'pending'`
   - `verification_status = 'self_reported'`
   - blank optional fields stored as `null`
5. Confirm the pending row does not appear in the public directory list.
6. Sign in as admin.
7. Open `/admin`.
8. Add an admin note.
9. Approve the group.
10. Confirm the row updates with:
    - `status = 'approved'`
    - `verification_status = 'admin_verified'`
    - `reviewed_by` set
    - `reviewed_at` set
    - `last_verified_at` set
    - `expires_at` about one year ahead
11. Confirm the listing appears on `/pods`.
12. Submit another row and reject it.
13. Confirm rejected rows remain hidden from `/pods`.

## Data Policy

Directory fields are member-visible once approved. Do not approve private contact information unless it is clearly intended as public-facing group contact info.

Recommended admin standard:

- Prefer group website or public contact page over personal email.
- Treat inclusion tags as self-reported unless the group states them publicly.
- Use `admin_notes` for verification context and concerns.
- Archive or re-check listings at `expires_at`.

## Starter Seed Criteria

For initial seed listings, require:

- public website, directory page, or public social page
- city and state
- group type
- age band or learner range
- cost range or "not listed"
- contact method or public inquiry link
- recent activity signal

Prioritize GA, FL, NC, AZ, and TN for the first pass.
