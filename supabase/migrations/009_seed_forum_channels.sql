-- Add forum/message-board channels that match the SEAT Squad member benefits.

INSERT INTO public.seat_channels (slug, name, description, color, is_default, is_public)
VALUES
  ('start-here', 'Start Here', 'Orientation, first steps, and the cleanest path when learning life feels loud.', '#0f4c5c', false, true),
  ('crate-requests', 'Crate Requests', 'Ask for guides, planners, calendars, lesson plans, and resource remixes.', '#5f0f40', false, true),
  ('pods-groups', 'Pods & Groups', 'Microschool, pod, co-op, and homeschool group discovery.', '#edb72c', false, true),
  ('live-qa', 'Live Q&A', 'Weekly questions, office hours, replays, and member follow-up.', '#9a031e', false, true),
  ('wins-friction', 'Wins & Friction', 'Share what worked, what felt heavy, and what you want help untangling.', '#2f855a', false, true)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  color = EXCLUDED.color,
  is_public = EXCLUDED.is_public;
