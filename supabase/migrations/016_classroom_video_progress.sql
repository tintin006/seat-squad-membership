-- Classroom video progress for the How-to Homeschool video library.

CREATE TABLE IF NOT EXISTS public.seat_video_progress (
  user_id uuid NOT NULL REFERENCES public.seat_profiles(id) ON DELETE CASCADE,
  video_id text NOT NULL,
  completed_at timestamptz,
  last_watched_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, video_id)
);

DROP TRIGGER IF EXISTS seat_video_progress_updated_at ON public.seat_video_progress;
CREATE TRIGGER seat_video_progress_updated_at
  BEFORE UPDATE ON public.seat_video_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.seat_video_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own video progress"
  ON public.seat_video_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own video progress"
  ON public.seat_video_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all video progress"
  ON public.seat_video_progress
  FOR ALL
  TO authenticated
  USING (public.is_seat_admin(auth.uid()))
  WITH CHECK (public.is_seat_admin(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_seat_video_progress_user_id
  ON public.seat_video_progress(user_id);
