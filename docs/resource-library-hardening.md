# Resource Library Hardening

Downloads now route through:

```text
/api/resources/download/[id]
```

The route:

1. Requires an authenticated member.
2. Reads `seat_profiles.tier`.
3. Checks the download's required tier.
4. Generates a 60-second signed URL from the private Supabase Storage bucket.

## Storage Bucket

Migration `015_seat_private_storage_bucket.sql` creates:

```text
seat-private
```

The bucket is private and PDF-only.

## Upload Paths

Upload the existing ESA guide PDFs to these paths:

```text
seat-private/downloads/esa-state-guides/florida-homeschool-guide.pdf
seat-private/downloads/esa-state-guides/georgia-homeschool-guide.pdf
seat-private/downloads/esa-state-guides/north-carolina-homeschool-guide.pdf
seat-private/downloads/esa-state-guides/arizona-homeschool-guide.pdf
seat-private/downloads/esa-state-guides/tennessee-homeschool-guide.pdf
```

The public copies can stay during testing, but should be removed before paid/tier-locked downloads launch.

## Required Env

```bash
SUPABASE_SERVICE_ROLE_KEY=...
```

The service role key is used only server-side to create short-lived signed URLs after app-level tier checks.
