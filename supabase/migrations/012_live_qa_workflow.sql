-- Live Weekly Q&A workflow: recurring session, RSVPs, and post-session archive fields.

CREATE TABLE IF NOT EXISTS public.seat_live_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  cadence text NOT NULL DEFAULT 'weekly',
  day_label text NOT NULL,
  time_label text NOT NULL,
  timezone text NOT NULL DEFAULT 'America/New_York',
  location_url text CHECK (location_url IS NULL OR location_url ~* '^https?://'),
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'complete', 'canceled')),
  starts_at timestamptz,
  question_channel_slug text NOT NULL DEFAULT 'live-qa',
  replay_url text CHECK (replay_url IS NULL OR replay_url ~* '^https?://'),
  recap text,
  resource_links jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS seat_live_sessions_updated_at ON public.seat_live_sessions;
CREATE TRIGGER seat_live_sessions_updated_at
  BEFORE UPDATE ON public.seat_live_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.seat_live_session_rsvps (
  session_id uuid NOT NULL REFERENCES public.seat_live_sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.seat_profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'interested' CHECK (status IN ('interested', 'going', 'canceled')),
  question_post_id uuid REFERENCES public.seat_posts(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (session_id, user_id)
);

DROP TRIGGER IF EXISTS seat_live_session_rsvps_updated_at ON public.seat_live_session_rsvps;
CREATE TRIGGER seat_live_session_rsvps_updated_at
  BEFORE UPDATE ON public.seat_live_session_rsvps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.seat_live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_live_session_rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read live sessions"
  ON public.seat_live_sessions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage live sessions"
  ON public.seat_live_sessions
  FOR ALL
  TO authenticated
  USING (public.is_seat_admin(auth.uid()))
  WITH CHECK (public.is_seat_admin(auth.uid()));

CREATE POLICY "Users can read own live session RSVPs"
  ON public.seat_live_session_rsvps
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own live session RSVPs"
  ON public.seat_live_session_rsvps
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all live session RSVPs"
  ON public.seat_live_session_rsvps
  FOR ALL
  TO authenticated
  USING (public.is_seat_admin(auth.uid()))
  WITH CHECK (public.is_seat_admin(auth.uid()));

INSERT INTO public.seat_live_sessions (
  slug,
  title,
  description,
  cadence,
  day_label,
  time_label,
  timezone,
  status,
  question_channel_slug
)
VALUES (
  'weekly-live-qa',
  'Weekly Live Q&A',
  'Bring the practical homeschool, ESA, pod, curriculum, tutor, planning, or deschooling question you want help thinking through. We will pull from forum questions first, then take live follow-ups.',
  'weekly',
  'Thursdays',
  '7:00 PM ET',
  'America/New_York',
  'scheduled',
  'live-qa'
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  cadence = EXCLUDED.cadence,
  day_label = EXCLUDED.day_label,
  time_label = EXCLUDED.time_label,
  timezone = EXCLUDED.timezone,
  question_channel_slug = EXCLUDED.question_channel_slug;

CREATE INDEX IF NOT EXISTS idx_seat_live_sessions_slug ON public.seat_live_sessions(slug);
CREATE INDEX IF NOT EXISTS idx_seat_live_sessions_status ON public.seat_live_sessions(status);
CREATE INDEX IF NOT EXISTS idx_seat_live_session_rsvps_user_id ON public.seat_live_session_rsvps(user_id);
