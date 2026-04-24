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

-- RLS: Admins can do everything
CREATE POLICY "Admins can manage all seat profiles"
  ON public.seat_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.seat_profiles sp
      WHERE sp.id = auth.uid() AND sp.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.seat_profiles sp
      WHERE sp.id = auth.uid() AND sp.role = 'admin'
    )
  );

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
  USING (
    EXISTS (
      SELECT 1 FROM public.seat_profiles sp
      WHERE sp.id = auth.uid() AND sp.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.seat_profiles sp
      WHERE sp.id = auth.uid() AND sp.role = 'admin'
    )
  );

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_seat_profiles_tier ON public.seat_profiles(tier);
CREATE INDEX IF NOT EXISTS idx_seat_profiles_role ON public.seat_profiles(role);
CREATE INDEX IF NOT EXISTS idx_seat_subscriptions_user_id ON public.seat_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_seat_subscriptions_stripe_customer_id ON public.seat_subscriptions(stripe_customer_id);
