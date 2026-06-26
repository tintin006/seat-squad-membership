-- Founding member orientation uses the existing live session + RSVP workflow.

INSERT INTO public.seat_live_sessions (
  slug,
  title,
  description,
  cadence,
  day_label,
  time_label,
  timezone,
  status,
  question_channel_slug,
  resource_links
)
VALUES (
  'founding-member-orientation',
  'Founding Member Orientation',
  'A practical walkthrough for new SEAT Squad members: where to ask questions, where to download guides, how Live Q&A works, how to suggest pods or groups, and what we are building with founding member feedback.',
  'one-time',
  'First founding cohort',
  'Time announced soon',
  'America/New_York',
  'scheduled',
  'start-here',
  '[{"label":"Start Here","href":"/start-here","type":"Orientation"},{"label":"Member resources","href":"/resources","type":"Downloads"},{"label":"Weekly Live Q&A","href":"/events","type":"Event"}]'::jsonb
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  cadence = EXCLUDED.cadence,
  day_label = EXCLUDED.day_label,
  time_label = EXCLUDED.time_label,
  timezone = EXCLUDED.timezone,
  status = EXCLUDED.status,
  question_channel_slug = EXCLUDED.question_channel_slug,
  resource_links = EXCLUDED.resource_links;
