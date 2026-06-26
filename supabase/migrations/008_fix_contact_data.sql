-- Fix contact data: migrate non-email values from contact_email to contact_name
-- Run after 006_seed_seat_group_directory.sql
-- 
-- Background: contact_email was overloaded with display text like "Facebook Group",
-- "Brenda Barrett", "Steering Team" — not actual emails. This migration:
--   1. Copies non-email values from contact_email → contact_name
--   2. Clears contact_email for entries that aren't email-based

-- Helper: check if a string looks like an email
-- We'll do this with simple pattern matching

-- Step 1: For rows where contact_email is NOT an email, copy it to contact_name
UPDATE public.seat_group_submissions
SET 
  contact_name = CASE 
    WHEN contact_email IS NOT NULL AND contact_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    THEN contact_name || CASE WHEN contact_name IS NULL OR contact_name = '' THEN '' ELSE '; ' END || contact_email
    ELSE contact_name
  END,
  contact_email = CASE 
    WHEN contact_email IS NOT NULL AND contact_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    THEN NULL
    ELSE contact_email
  END
WHERE contact_email IS NOT NULL
  AND contact_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';

-- Step 2: Fix known malformed URLs
-- Columbus Learning Cooperative had 'https://learning.coop' (not a valid URL - actual was email)
UPDATE public.seat_group_submissions
SET 
  website_url = NULL,
  contact_email = 'columbus@learning.coop'
WHERE group_name = 'Columbus Learning Cooperative' 
  AND city = 'Columbus'
  AND state = 'OH';

-- Verify results
SELECT 
  group_name,
  city,
  state,
  contact_email,
  contact_name,
  website_url,
  CASE 
    WHEN contact_email IS NOT NULL 
    AND contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' 
    THEN 'email' 
    WHEN contact_email IS NULL THEN 'null' 
    ELSE 'INVALID' 
  END as contact_type
FROM public.seat_group_submissions
WHERE status = 'approved'
ORDER BY state, city, group_name;
