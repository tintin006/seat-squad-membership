-- SEAT Squad pod, microschool, and homeschool group directory submissions

CREATE TABLE IF NOT EXISTS public.seat_group_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by uuid REFERENCES public.seat_profiles(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'archived')),
  verification_status text NOT NULL DEFAULT 'self_reported' CHECK (verification_status IN ('self_reported', 'admin_verified', 'needs_update')),
  group_name text NOT NULL CHECK (char_length(trim(group_name)) >= 2),
  group_type text NOT NULL CHECK (group_type IN ('Homeschool co-op', 'Hybrid learning pod', 'Microschool', 'Field trip group', 'Parent meetup', 'Tutor-supported group')),
  format text NOT NULL DEFAULT 'in_person' CHECK (format IN ('in_person', 'hybrid', 'virtual')),
  city text NOT NULL CHECK (char_length(trim(city)) >= 2),
  state text NOT NULL CHECK (state ~ '^[A-Z]{2}$'),
  nearby_states text[] NOT NULL DEFAULT '{}',
  age_bands text[] NOT NULL DEFAULT '{}',
  inclusion_tags text[] NOT NULL DEFAULT '{}',
  cost_range text,
  meeting_rhythm text,
  website_url text CHECK (website_url IS NULL OR website_url ~* '^https?://'),
  source_url text CHECK (source_url IS NULL OR source_url ~* '^https?://'),
  contact_email text,
  contact_name text,
  description text NOT NULL CHECK (char_length(trim(description)) >= 20),
  admin_notes text,
  reviewed_by uuid REFERENCES public.seat_profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  last_verified_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT seat_group_submissions_reviewed_when_final CHECK (
    status IN ('pending', 'archived') OR reviewed_at IS NOT NULL
  )
);

DROP TRIGGER IF EXISTS seat_group_submissions_updated_at ON public.seat_group_submissions;
CREATE TRIGGER seat_group_submissions_updated_at
  BEFORE UPDATE ON public.seat_group_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.seat_group_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read approved group submissions"
  ON public.seat_group_submissions
  FOR SELECT
  TO authenticated
  USING (status = 'approved');

CREATE POLICY "Users can read own group submissions"
  ON public.seat_group_submissions
  FOR SELECT
  TO authenticated
  USING (submitted_by = auth.uid());

CREATE POLICY "Users can submit groups for review"
  ON public.seat_group_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (submitted_by = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can manage group submissions"
  ON public.seat_group_submissions
  FOR ALL
  TO authenticated
  USING (public.is_seat_admin(auth.uid()))
  WITH CHECK (public.is_seat_admin(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_seat_group_submissions_status ON public.seat_group_submissions(status);
CREATE INDEX IF NOT EXISTS idx_seat_group_submissions_state ON public.seat_group_submissions(state);
CREATE INDEX IF NOT EXISTS idx_seat_group_submissions_verification_status ON public.seat_group_submissions(verification_status);
CREATE INDEX IF NOT EXISTS idx_seat_group_submissions_expires_at ON public.seat_group_submissions(expires_at);
CREATE INDEX IF NOT EXISTS idx_seat_group_submissions_nearby_states ON public.seat_group_submissions USING gin(nearby_states);
CREATE INDEX IF NOT EXISTS idx_seat_group_submissions_age_bands ON public.seat_group_submissions USING gin(age_bands);
CREATE INDEX IF NOT EXISTS idx_seat_group_submissions_inclusion_tags ON public.seat_group_submissions USING gin(inclusion_tags);
