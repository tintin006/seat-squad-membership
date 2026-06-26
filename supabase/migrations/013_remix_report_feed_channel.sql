-- The Remix Report context feed and forum discussion channel.

INSERT INTO public.seat_channels (slug, name, description, color, is_default, is_public)
VALUES (
  'remix-report',
  'The Remix Report',
  'Discuss Remix Report signals, field notes, education trends, and member takeaways.',
  '#0f4c5c',
  false,
  true
)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  color = EXCLUDED.color,
  is_public = EXCLUDED.is_public;
