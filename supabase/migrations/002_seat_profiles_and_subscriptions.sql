-- SEAT Squad core membership tables

-- Seat profiles: membership-specific profile data
CREATE TABLE IF NOT EXISTS public.seat_profiles (
  id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  role seat_role NOT NULL DEFAULT 'family',
  tier seat_tier NOT NULL DEFAULT 'free',
  onboarding_complete boolean NOT NULL DEFAULT false,
  methodology_tags text[] NOT NULL DEFAULT '{}',
  grade_levels text[] NOT NULL DEFAULT '{}',
  subject_tags text[] NOT NULL DEFAULT '{}',
  intent_tags text[] NOT NULL DEFAULT '{}',
  location text,
  bio text,
  profile_visibility text NOT NULL DEFAULT 'members',
  is_suspended boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS seat_profiles_updated_at ON public.seat_profiles;
CREATE TRIGGER seat_profiles_updated_at
  BEFORE UPDATE ON public.seat_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS: Enable
ALTER TABLE public.seat_profiles ENABLE ROW LEVEL SECURITY;

-- RLS: Users can read their own profile
CREATE POLICY "Users can read own seat profile"
  ON public.seat_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- RLS: Users can update their own profile
CREATE POLICY "Users can update own seat profile"
  ON public.seat_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS: Users can insert their own profile
CREATE POLICY "Users can insert own seat profile"
  ON public.seat_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS: Members can view other member profiles (if visibility allows)
CREATE POLICY "Members can view visible profiles"
  ON public.seat_profiles
  FOR SELECT
  TO authenticated
  USING (profile_visibility = 'members' OR profile_visibility = 'public');

-- Helper: check if user is a seat admin (SECURITY DEFINER to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.is_seat_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.seat_profiles sp
    WHERE sp.id = user_uuid AND sp.role = 'admin'
  );
$$;

-- RLS: Admins can do everything
CREATE POLICY "Admins can manage all seat profiles"
  ON public.seat_profiles
  FOR ALL
  TO authenticated
  USING (public.is_seat_admin(auth.uid()))
  WITH CHECK (public.is_seat_admin(auth.uid()));

-- Seat subscriptions: Stripe subscription state
CREATE TABLE IF NOT EXISTS public.seat_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text UNIQUE,
  tier seat_tier NOT NULL DEFAULT 'free',
  status text NOT NULL DEFAULT 'inactive',
  current_period_end timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS seat_subscriptions_updated_at ON public.seat_subscriptions;
CREATE TRIGGER seat_subscriptions_updated_at
  BEFORE UPDATE ON public.seat_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS: Enable
ALTER TABLE public.seat_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS: Users can read their own subscription
CREATE POLICY "Users can read own subscription"
  ON public.seat_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS: Admins can manage all subscriptions
CREATE POLICY "Admins can manage all subscriptions"
  ON public.seat_subscriptions
  FOR ALL
  TO authenticated
  USING (public.is_seat_admin(auth.uid()))
  WITH CHECK (public.is_seat_admin(auth.uid()));

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_seat_profiles_tier ON public.seat_profiles(tier);
CREATE INDEX IF NOT EXISTS idx_seat_profiles_role ON public.seat_profiles(role);
CREATE INDEX IF NOT EXISTS idx_seat_subscriptions_user_id ON public.seat_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_seat_subscriptions_stripe_customer_id ON public.seat_subscriptions(stripe_customer_id);

-- Helper: safely get or create seat_profile for a user
-- Defined here because it references seat_profiles which must already exist
CREATE OR REPLACE FUNCTION get_or_create_seat_profile(user_uuid uuid)
RETURNS TABLE (
  id uuid,
  display_name text,
  avatar_url text,
  role seat_role,
  tier seat_tier,
  onboarding_complete boolean,
  methodology_tags text[],
  grade_levels text[],
  subject_tags text[],
  intent_tags text[],
  location text,
  bio text,
  profile_visibility text,
  is_suspended boolean,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  existing_record public.seat_profiles%ROWTYPE;
BEGIN
  SELECT * INTO existing_record FROM public.seat_profiles WHERE seat_profiles.id = user_uuid;
  
  IF FOUND THEN
    RETURN QUERY SELECT * FROM public.seat_profiles WHERE seat_profiles.id = user_uuid;
    RETURN;
  END IF;
  
  INSERT INTO public.seat_profiles (id)
  VALUES (user_uuid)
  RETURNING * INTO existing_record;
  
  RETURN QUERY SELECT * FROM public.seat_profiles WHERE seat_profiles.id = user_uuid;
END;
$$;
