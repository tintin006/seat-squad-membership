-- SEAT Squad founder launch content template
--
-- Use this after your founder/admin user has signed up and completed onboarding.
-- Edit founder_email below, then run this in the Supabase SQL Editor.
--
-- This intentionally lives in docs instead of supabase/migrations because it is
-- launch content, not schema. It can be run again safely; posts are deduped by
-- their exact title.

DO $$
DECLARE
  founder_email text := 'YOUR_EMAIL_HERE';
  founder_id uuid;
  general_id uuid;
  tips_id uuid;
  educator_id uuid;
  events_id uuid;
  crate_id uuid;
BEGIN
  SELECT id INTO founder_id
  FROM auth.users
  WHERE email = founder_email
  LIMIT 1;

  IF founder_id IS NULL THEN
    RAISE EXCEPTION 'No auth user found for founder_email: %', founder_email;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.seat_profiles WHERE id = founder_id) THEN
    RAISE EXCEPTION 'Founder auth user exists, but seat_profile does not. Complete onboarding first.';
  END IF;

  UPDATE public.seat_profiles
  SET
    display_name = COALESCE(display_name, 'Remix Academics'),
    role = 'admin',
    tier = 'pro',
    onboarding_complete = true,
    updated_at = now()
  WHERE id = founder_id;

  SELECT id INTO general_id FROM public.seat_channels WHERE slug = 'general';
  SELECT id INTO tips_id FROM public.seat_channels WHERE slug = 'homeschool-tips';
  SELECT id INTO educator_id FROM public.seat_channels WHERE slug = 'educator-lounge';
  SELECT id INTO events_id FROM public.seat_channels WHERE slug = 'events-meetups';
  SELECT id INTO crate_id FROM public.seat_channels WHERE slug = 'crate-showcase';

  IF general_id IS NULL OR tips_id IS NULL OR educator_id IS NULL OR events_id IS NULL OR crate_id IS NULL THEN
    RAISE EXCEPTION 'One or more default SEAT Squad channels are missing. Run migration 003 first.';
  END IF;

  INSERT INTO public.seat_posts (
    channel_id,
    author_id,
    type,
    title,
    content,
    is_pinned,
    is_announcement
  )
  SELECT
    general_id,
    founder_id,
    'announcement',
    'Welcome to The SEAT Squad',
    'Welcome in. The SEAT Squad is a community for families, educators, tutors, and learning builders who believe education should be flexible, culturally affirming, and centered on the actual child in front of us.

This space is for practical help, honest questions, useful resources, and building something better together.

Start here:

1. Introduce yourself in General.
2. Share what kind of learner or family you are supporting this season.
3. Tell us one thing that would make your learning life feel easier this month.

We are starting small on purpose. Small means we can listen well.',
    true,
    true
  WHERE NOT EXISTS (
    SELECT 1 FROM public.seat_posts WHERE title = 'Welcome to The SEAT Squad'
  );

  INSERT INTO public.seat_posts (
    channel_id,
    author_id,
    type,
    title,
    content,
    is_pinned,
    is_announcement
  )
  SELECT
    general_id,
    founder_id,
    'text',
    'Introduce yourself: who are you supporting?',
    'Drop a quick hello and tell us:

- Your role: parent, guardian, educator, tutor, coach, or a blend
- Age or grade band you are supporting
- What brought you here
- One topic you hope we talk about more

No perfect intro needed. A sentence is enough.',
    true,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM public.seat_posts WHERE title = 'Introduce yourself: who are you supporting?'
  );

  INSERT INTO public.seat_posts (
    channel_id,
    author_id,
    type,
    title,
    content,
    is_pinned,
    is_announcement
  )
  SELECT
    tips_id,
    founder_id,
    'text',
    'Weekly reset: what is working, what is not?',
    'Use this thread as a low-pressure weekly reset.

Reply with:

- One thing that worked this week
- One thing that felt heavier than expected
- One thing you want to try next

The goal is not to perform homeschool success. The goal is to notice patterns and make the next week a little more livable.',
    true,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM public.seat_posts WHERE title = 'Weekly reset: what is working, what is not?'
  );

  INSERT INTO public.seat_posts (
    channel_id,
    author_id,
    type,
    title,
    content,
    is_pinned,
    is_announcement
  )
  SELECT
    educator_id,
    founder_id,
    'text',
    'Educators and tutors: what do families ask for too late?',
    'For educators, tutors, and learning coaches:

What is one support families often seek only after things have already gotten stressful?

Examples might include reading intervention, executive function support, math confidence, IEP navigation, study habits, or parent-child learning routines.

This thread will help us design better resources before families hit crisis mode.',
    true,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM public.seat_posts WHERE title = 'Educators and tutors: what do families ask for too late?'
  );

  INSERT INTO public.seat_posts (
    channel_id,
    author_id,
    type,
    title,
    content,
    is_pinned,
    is_announcement
  )
  SELECT
    events_id,
    founder_id,
    'announcement',
    'Coming soon: founding member orientation',
    'We will host a short founding member orientation to walk through the community, hear what families need most, and shape the first round of resources.

The first version will be simple:

- What SEAT Squad is for
- What we are building first
- How to ask for help
- What kinds of posts and resources are most useful

Reply with the days and times that usually work best for you.',
    true,
    true
  WHERE NOT EXISTS (
    SELECT 1 FROM public.seat_posts WHERE title = 'Coming soon: founding member orientation'
  );

  INSERT INTO public.seat_posts (
    channel_id,
    author_id,
    type,
    title,
    content,
    is_pinned,
    is_announcement
  )
  SELECT
    crate_id,
    founder_id,
    'text',
    'The Crate request thread',
    'The Crate will hold practical teaching tools, parent enablement resources, and remixable learning ideas.

Tell us what you wish you had on hand:

- A one-page explainer?
- A lesson remix?
- A weekly rhythm?
- A script for talking to your learner?
- A way to adapt schoolwork for a neurodivergent learner?
- A tool for helping your child regain confidence?

Drop requests here. The best resources will come from real family friction, not generic advice.',
    true,
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM public.seat_posts WHERE title = 'The Crate request thread'
  );
END $$;
