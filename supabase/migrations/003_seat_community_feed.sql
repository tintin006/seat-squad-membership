-- SEAT Squad Community Feed tables

-- =============================================
-- 1. CHANNELS
-- =============================================
CREATE TABLE IF NOT EXISTS public.seat_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  color text DEFAULT '#fb8b24',
  is_default boolean NOT NULL DEFAULT false,
  is_public boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES public.seat_profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS seat_channels_updated_at ON public.seat_channels;
CREATE TRIGGER seat_channels_updated_at
  BEFORE UPDATE ON public.seat_channels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.seat_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read channels"
  ON public.seat_channels FOR SELECT TO authenticated, anon
  USING (is_public = true);

CREATE POLICY "Admins can manage channels"
  ON public.seat_channels FOR ALL TO authenticated
  USING (public.is_seat_admin(auth.uid()))
  WITH CHECK (public.is_seat_admin(auth.uid()));

-- =============================================
-- 2. POSTS
-- =============================================
CREATE TABLE IF NOT EXISTS public.seat_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid NOT NULL REFERENCES public.seat_channels(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.seat_profiles(id) ON DELETE CASCADE,
  type seat_post_type NOT NULL DEFAULT 'text',
  title text,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  is_pinned boolean NOT NULL DEFAULT false,
  is_announcement boolean NOT NULL DEFAULT false,
  is_locked boolean NOT NULL DEFAULT false,
  view_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS seat_posts_updated_at ON public.seat_posts;
CREATE TRIGGER seat_posts_updated_at
  BEFORE UPDATE ON public.seat_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.seat_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read posts in public channels"
  ON public.seat_posts FOR SELECT TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM public.seat_channels c
      WHERE c.id = seat_posts.channel_id AND c.is_public = true
    )
  );

CREATE POLICY "Authenticated can create posts"
  ON public.seat_posts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own posts"
  ON public.seat_posts FOR UPDATE TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Admins can manage all posts"
  ON public.seat_posts FOR ALL TO authenticated
  USING (public.is_seat_admin(auth.uid()))
  WITH CHECK (public.is_seat_admin(auth.uid()));

-- =============================================
-- 3. COMMENTS (max 2 levels enforced by trigger)
-- =============================================
CREATE TABLE IF NOT EXISTS public.seat_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.seat_posts(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.seat_comments(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.seat_profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_deleted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS seat_comments_updated_at ON public.seat_comments;
CREATE TRIGGER seat_comments_updated_at
  BEFORE UPDATE ON public.seat_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enforce max 2 levels of nesting
CREATE OR REPLACE FUNCTION public.check_comment_depth()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_id IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM public.seat_comments pc
      WHERE pc.id = NEW.parent_id AND pc.parent_id IS NOT NULL
    ) THEN
      RAISE EXCEPTION 'Comments can only be nested 2 levels deep';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_comment_depth_trigger ON public.seat_comments;
CREATE TRIGGER check_comment_depth_trigger
  BEFORE INSERT ON public.seat_comments
  FOR EACH ROW EXECUTE FUNCTION public.check_comment_depth();

ALTER TABLE public.seat_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments"
  ON public.seat_comments FOR SELECT TO authenticated, anon
  USING (is_deleted = false);

CREATE POLICY "Authenticated can create comments"
  ON public.seat_comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own comments"
  ON public.seat_comments FOR UPDATE TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Admins can manage all comments"
  ON public.seat_comments FOR ALL TO authenticated
  USING (public.is_seat_admin(auth.uid()))
  WITH CHECK (public.is_seat_admin(auth.uid()));

-- =============================================
-- 4. POST REACTIONS
-- =============================================
CREATE TABLE IF NOT EXISTS public.seat_post_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.seat_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.seat_profiles(id) ON DELETE CASCADE,
  emoji text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id, emoji)
);

ALTER TABLE public.seat_post_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reactions"
  ON public.seat_post_reactions FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Users can toggle own reactions"
  ON public.seat_post_reactions FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 5. BOOKMARKS
-- =============================================
CREATE TABLE IF NOT EXISTS public.seat_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.seat_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.seat_profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.seat_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bookmarks"
  ON public.seat_bookmarks FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own bookmarks"
  ON public.seat_bookmarks FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 6. POST REPORTS (for moderation queue)
-- =============================================
CREATE TABLE IF NOT EXISTS public.seat_post_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.seat_posts(id) ON DELETE CASCADE,
  reporter_id uuid NOT NULL REFERENCES public.seat_profiles(id) ON DELETE CASCADE,
  reason text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'pending',
  resolved_by uuid REFERENCES public.seat_profiles(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.seat_post_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own reports"
  ON public.seat_post_reports FOR SELECT TO authenticated
  USING (auth.uid() = reporter_id);

CREATE POLICY "Users can create reports"
  ON public.seat_post_reports FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can manage all reports"
  ON public.seat_post_reports FOR ALL TO authenticated
  USING (public.is_seat_admin(auth.uid()))
  WITH CHECK (public.is_seat_admin(auth.uid()));

-- =============================================
-- 7. INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_posts_channel_id ON public.seat_posts(channel_id);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.seat_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.seat_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_pinned ON public.seat_posts(is_pinned) WHERE is_pinned = true;
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.seat_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.seat_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_reactions_post_id ON public.seat_post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.seat_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.seat_post_reports(status);

-- =============================================
-- 8. SEED DEFAULT CHANNELS
-- =============================================
INSERT INTO public.seat_channels (slug, name, description, color, is_default, is_public)
VALUES
  ('general', 'General', 'Welcome to the SEAT Squad. Introduce yourself, ask questions, and connect with the community.', '#fb8b24', true, true),
  ('homeschool-tips', 'Homeschool Tips', 'Share resources, strategies, and wins from your homeschool journey.', '#22c55e', false, true),
  ('educator-lounge', 'Educator Lounge', 'A space for teachers, tutors, and education professionals.', '#3b82f6', false, true),
  ('events-meetups', 'Events & Meetups', 'Upcoming SEAT Squad events, virtual meetups, and local gatherings.', '#a855f7', false, true),
  ('crate-showcase', 'The Crate Showcase', 'Share what you built, discovered, or learned from The Crate.', '#e11d48', false, true)
ON CONFLICT (slug) DO NOTHING;
