-- Tutor Connection MVP: reviewed tutor profiles and family connection requests.

CREATE TABLE IF NOT EXISTS public.seat_tutor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by uuid REFERENCES public.seat_profiles(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'archived')),
  display_name text NOT NULL,
  headline text NOT NULL,
  subjects text[] NOT NULL DEFAULT '{}',
  learner_fit_tags text[] NOT NULL DEFAULT '{}',
  formats text[] NOT NULL DEFAULT '{}',
  states text[] NOT NULL DEFAULT '{}',
  rate_range text,
  bio text NOT NULL,
  contact_email text,
  website_url text CHECK (website_url IS NULL OR website_url ~* '^https?://'),
  admin_notes text,
  reviewed_by uuid REFERENCES public.seat_profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS seat_tutor_profiles_updated_at ON public.seat_tutor_profiles;
CREATE TRIGGER seat_tutor_profiles_updated_at
  BEFORE UPDATE ON public.seat_tutor_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.seat_tutor_connection_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES public.seat_profiles(id) ON DELETE CASCADE,
  tutor_profile_id uuid REFERENCES public.seat_tutor_profiles(id) ON DELETE SET NULL,
  learner_age_band text NOT NULL,
  subjects text[] NOT NULL DEFAULT '{}',
  support_goal text NOT NULL,
  schedule_notes text,
  budget_range text,
  preferred_format text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'matched', 'closed', 'archived')),
  admin_notes text,
  reviewed_by uuid REFERENCES public.seat_profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS seat_tutor_connection_requests_updated_at ON public.seat_tutor_connection_requests;
CREATE TRIGGER seat_tutor_connection_requests_updated_at
  BEFORE UPDATE ON public.seat_tutor_connection_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.seat_tutor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_tutor_connection_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read approved tutor profiles"
  ON public.seat_tutor_profiles
  FOR SELECT
  TO authenticated
  USING (status = 'approved');

CREATE POLICY "Users can read own tutor profiles"
  ON public.seat_tutor_profiles
  FOR SELECT
  TO authenticated
  USING (submitted_by = auth.uid());

CREATE POLICY "Users can submit tutor profiles"
  ON public.seat_tutor_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (submitted_by = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can manage tutor profiles"
  ON public.seat_tutor_profiles
  FOR ALL
  TO authenticated
  USING (public.is_seat_admin(auth.uid()))
  WITH CHECK (public.is_seat_admin(auth.uid()));

CREATE POLICY "Users can read own tutor connection requests"
  ON public.seat_tutor_connection_requests
  FOR SELECT
  TO authenticated
  USING (requester_id = auth.uid());

CREATE POLICY "Users can create tutor connection requests"
  ON public.seat_tutor_connection_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (requester_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can manage tutor connection requests"
  ON public.seat_tutor_connection_requests
  FOR ALL
  TO authenticated
  USING (public.is_seat_admin(auth.uid()))
  WITH CHECK (public.is_seat_admin(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_seat_tutor_profiles_status ON public.seat_tutor_profiles(status);
CREATE INDEX IF NOT EXISTS idx_seat_tutor_connection_requests_status ON public.seat_tutor_connection_requests(status);
