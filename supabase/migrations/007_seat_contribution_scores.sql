-- Lightweight SEAT Squad contribution scoring, leaderboard totals, and badges.

CREATE TABLE IF NOT EXISTS public.seat_point_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.seat_profiles(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (
    event_type IN (
      'post_created',
      'comment_created',
      'reaction_given',
      'reaction_received',
      'pod_submission_approved',
      'manual_adjustment'
    )
  ),
  points int NOT NULL CHECK (points <> 0),
  source_type text NOT NULL,
  source_id uuid,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, event_type, source_type, source_id)
);

CREATE TABLE IF NOT EXISTS public.seat_point_totals (
  user_id uuid PRIMARY KEY REFERENCES public.seat_profiles(id) ON DELETE CASCADE,
  total_points int NOT NULL DEFAULT 0 CHECK (total_points >= 0),
  posts_count int NOT NULL DEFAULT 0 CHECK (posts_count >= 0),
  comments_count int NOT NULL DEFAULT 0 CHECK (comments_count >= 0),
  reactions_given_count int NOT NULL DEFAULT 0 CHECK (reactions_given_count >= 0),
  reactions_received_count int NOT NULL DEFAULT 0 CHECK (reactions_received_count >= 0),
  pod_submissions_count int NOT NULL DEFAULT 0 CHECK (pod_submissions_count >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seat_badges (
  slug text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seat_member_badges (
  user_id uuid NOT NULL REFERENCES public.seat_profiles(id) ON DELETE CASCADE,
  badge_slug text NOT NULL REFERENCES public.seat_badges(slug) ON DELETE CASCADE,
  awarded_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, badge_slug)
);

ALTER TABLE public.seat_point_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_point_totals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_member_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own point events"
  ON public.seat_point_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage point events"
  ON public.seat_point_events
  FOR ALL
  TO authenticated
  USING (public.is_seat_admin(auth.uid()))
  WITH CHECK (public.is_seat_admin(auth.uid()));

CREATE POLICY "Members can read contribution totals"
  ON public.seat_point_totals
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.seat_profiles sp
      WHERE sp.id = seat_point_totals.user_id
        AND sp.is_suspended = false
        AND sp.profile_visibility IN ('members', 'public')
    )
  );

CREATE POLICY "Admins can manage contribution totals"
  ON public.seat_point_totals
  FOR ALL
  TO authenticated
  USING (public.is_seat_admin(auth.uid()))
  WITH CHECK (public.is_seat_admin(auth.uid()));

CREATE POLICY "Members can read badge definitions"
  ON public.seat_badges
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage badge definitions"
  ON public.seat_badges
  FOR ALL
  TO authenticated
  USING (public.is_seat_admin(auth.uid()))
  WITH CHECK (public.is_seat_admin(auth.uid()));

CREATE POLICY "Members can read visible member badges"
  ON public.seat_member_badges
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.seat_profiles sp
      WHERE sp.id = seat_member_badges.user_id
        AND sp.is_suspended = false
        AND sp.profile_visibility IN ('members', 'public')
    )
  );

CREATE POLICY "Admins can manage member badges"
  ON public.seat_member_badges
  FOR ALL
  TO authenticated
  USING (public.is_seat_admin(auth.uid()))
  WITH CHECK (public.is_seat_admin(auth.uid()));

INSERT INTO public.seat_badges (slug, name, description, icon, sort_order)
VALUES
  ('first_post', 'First Post', 'Shared a first post with the community.', 'MessageSquare', 10),
  ('conversation_starter', 'Conversation Starter', 'Started three community threads.', 'Sparkles', 20),
  ('helpful_reply', 'Helpful Reply', 'Added five replies or comments.', 'MessagesSquare', 30),
  ('pod_scout', 'Pod Scout', 'Submitted a pod or homeschool group that was approved.', 'MapPinned', 40),
  ('community_spark', 'Community Spark', 'Earned 50 contribution points.', 'Flame', 50),
  ('founding_voice', 'Founding Voice', 'Earned 100 contribution points.', 'Trophy', 60)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order;

CREATE OR REPLACE FUNCTION public.evaluate_seat_badges(member_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  totals public.seat_point_totals%ROWTYPE;
BEGIN
  SELECT * INTO totals
  FROM public.seat_point_totals
  WHERE user_id = member_uuid;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  IF totals.posts_count >= 1 THEN
    INSERT INTO public.seat_member_badges (user_id, badge_slug)
    VALUES (member_uuid, 'first_post')
    ON CONFLICT DO NOTHING;
  END IF;

  IF totals.posts_count >= 3 THEN
    INSERT INTO public.seat_member_badges (user_id, badge_slug)
    VALUES (member_uuid, 'conversation_starter')
    ON CONFLICT DO NOTHING;
  END IF;

  IF totals.comments_count >= 5 THEN
    INSERT INTO public.seat_member_badges (user_id, badge_slug)
    VALUES (member_uuid, 'helpful_reply')
    ON CONFLICT DO NOTHING;
  END IF;

  IF totals.pod_submissions_count >= 1 THEN
    INSERT INTO public.seat_member_badges (user_id, badge_slug)
    VALUES (member_uuid, 'pod_scout')
    ON CONFLICT DO NOTHING;
  END IF;

  IF totals.total_points >= 50 THEN
    INSERT INTO public.seat_member_badges (user_id, badge_slug)
    VALUES (member_uuid, 'community_spark')
    ON CONFLICT DO NOTHING;
  END IF;

  IF totals.total_points >= 100 THEN
    INSERT INTO public.seat_member_badges (user_id, badge_slug)
    VALUES (member_uuid, 'founding_voice')
    ON CONFLICT DO NOTHING;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.award_seat_points(
  member_uuid uuid,
  award_event_type text,
  award_points int,
  award_source_type text,
  award_source_id uuid,
  award_reason text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  inserted_points int;
BEGIN
  IF member_uuid IS NULL OR award_points = 0 THEN
    RETURN false;
  END IF;

  INSERT INTO public.seat_point_events (
    user_id,
    event_type,
    points,
    source_type,
    source_id,
    reason
  )
  VALUES (
    member_uuid,
    award_event_type,
    award_points,
    award_source_type,
    award_source_id,
    award_reason
  )
  ON CONFLICT DO NOTHING
  RETURNING points INTO inserted_points;

  IF inserted_points IS NULL THEN
    RETURN false;
  END IF;

  INSERT INTO public.seat_point_totals (
    user_id,
    total_points,
    posts_count,
    comments_count,
    reactions_given_count,
    reactions_received_count,
    pod_submissions_count
  )
  VALUES (
    member_uuid,
    GREATEST(inserted_points, 0),
    CASE WHEN award_event_type = 'post_created' THEN 1 ELSE 0 END,
    CASE WHEN award_event_type = 'comment_created' THEN 1 ELSE 0 END,
    CASE WHEN award_event_type = 'reaction_given' THEN 1 ELSE 0 END,
    CASE WHEN award_event_type = 'reaction_received' THEN 1 ELSE 0 END,
    CASE WHEN award_event_type = 'pod_submission_approved' THEN 1 ELSE 0 END
  )
  ON CONFLICT (user_id) DO UPDATE
  SET
    total_points = GREATEST(public.seat_point_totals.total_points + inserted_points, 0),
    posts_count = public.seat_point_totals.posts_count + CASE WHEN award_event_type = 'post_created' THEN 1 ELSE 0 END,
    comments_count = public.seat_point_totals.comments_count + CASE WHEN award_event_type = 'comment_created' THEN 1 ELSE 0 END,
    reactions_given_count = public.seat_point_totals.reactions_given_count + CASE WHEN award_event_type = 'reaction_given' THEN 1 ELSE 0 END,
    reactions_received_count = public.seat_point_totals.reactions_received_count + CASE WHEN award_event_type = 'reaction_received' THEN 1 ELSE 0 END,
    pod_submissions_count = public.seat_point_totals.pod_submissions_count + CASE WHEN award_event_type = 'pod_submission_approved' THEN 1 ELSE 0 END,
    updated_at = now();

  PERFORM public.evaluate_seat_badges(member_uuid);
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.score_seat_post_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM public.award_seat_points(
    NEW.author_id,
    'post_created',
    10,
    'seat_posts',
    NEW.id,
    'Created a community post'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.score_seat_comment_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM public.award_seat_points(
    NEW.author_id,
    'comment_created',
    5,
    'seat_comments',
    NEW.id,
    'Added a community comment'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.score_seat_reaction_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  post_author uuid;
BEGIN
  PERFORM public.award_seat_points(
    NEW.user_id,
    'reaction_given',
    1,
    'seat_post_reactions',
    NEW.id,
    'Reacted to a community post'
  );

  SELECT author_id INTO post_author
  FROM public.seat_posts
  WHERE id = NEW.post_id;

  IF post_author IS NOT NULL AND post_author <> NEW.user_id THEN
    PERFORM public.award_seat_points(
      post_author,
      'reaction_received',
      2,
      'seat_post_reactions',
      NEW.id,
      'Received a reaction on a community post'
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.score_seat_group_submission_approved()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.submitted_by IS NOT NULL
    AND NEW.status = 'approved'
    AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM NEW.status)
  THEN
    PERFORM public.award_seat_points(
      NEW.submitted_by,
      'pod_submission_approved',
      25,
      'seat_group_submissions',
      NEW.id,
      'Submitted an approved pod or homeschool group'
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS score_seat_post_created_trigger ON public.seat_posts;
CREATE TRIGGER score_seat_post_created_trigger
  AFTER INSERT ON public.seat_posts
  FOR EACH ROW EXECUTE FUNCTION public.score_seat_post_created();

DROP TRIGGER IF EXISTS score_seat_comment_created_trigger ON public.seat_comments;
CREATE TRIGGER score_seat_comment_created_trigger
  AFTER INSERT ON public.seat_comments
  FOR EACH ROW EXECUTE FUNCTION public.score_seat_comment_created();

DROP TRIGGER IF EXISTS score_seat_reaction_created_trigger ON public.seat_post_reactions;
CREATE TRIGGER score_seat_reaction_created_trigger
  AFTER INSERT ON public.seat_post_reactions
  FOR EACH ROW EXECUTE FUNCTION public.score_seat_reaction_created();

DROP TRIGGER IF EXISTS score_seat_group_submission_approved_trigger ON public.seat_group_submissions;
CREATE TRIGGER score_seat_group_submission_approved_trigger
  AFTER INSERT OR UPDATE OF status ON public.seat_group_submissions
  FOR EACH ROW EXECUTE FUNCTION public.score_seat_group_submission_approved();

CREATE INDEX IF NOT EXISTS idx_seat_point_events_user_created_at
  ON public.seat_point_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seat_point_events_event_type
  ON public.seat_point_events(event_type);
CREATE INDEX IF NOT EXISTS idx_seat_point_totals_total_points
  ON public.seat_point_totals(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_seat_member_badges_user_id
  ON public.seat_member_badges(user_id);
