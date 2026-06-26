-- SEAT Steward Bot: conservative forum moderation assistant.
-- The bot flags content for human admin review. It does not auto-delete content.

CREATE TABLE IF NOT EXISTS public.seat_moderation_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type text NOT NULL CHECK (source_type IN ('post', 'comment')),
  source_id uuid NOT NULL,
  post_id uuid REFERENCES public.seat_posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES public.seat_comments(id) ON DELETE CASCADE,
  author_id uuid REFERENCES public.seat_profiles(id) ON DELETE SET NULL,
  bot_name text NOT NULL DEFAULT 'SEAT Steward Bot',
  bot_identity text NOT NULL DEFAULT 'Automated forum moderation assistant',
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  categories text[] NOT NULL DEFAULT '{}',
  confidence numeric(4, 2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  excerpt text NOT NULL,
  recommendation text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  reviewed_by uuid REFERENCES public.seat_profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(source_type, source_id)
);

DROP TRIGGER IF EXISTS seat_moderation_flags_updated_at ON public.seat_moderation_flags;
CREATE TRIGGER seat_moderation_flags_updated_at
  BEFORE UPDATE ON public.seat_moderation_flags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.seat_moderation_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage moderation flags"
  ON public.seat_moderation_flags
  FOR ALL
  TO authenticated
  USING (public.is_seat_admin(auth.uid()))
  WITH CHECK (public.is_seat_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.evaluate_seat_moderation_text(raw_text text)
RETURNS TABLE (
  should_flag boolean,
  severity text,
  categories text[],
  confidence numeric,
  recommendation text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  text_to_scan text := lower(coalesce(raw_text, ''));
  matched_categories text[] := ARRAY[]::text[];
  matched_severity text := 'low';
  matched_confidence numeric := 0.55;
  matched_recommendation text := 'Review for tone and context before taking action.';
BEGIN
  IF text_to_scan ~ '(kill myself|suicide|self[- ]harm|hurt myself|end my life)' THEN
    matched_categories := matched_categories || ARRAY['self-harm'];
    matched_severity := 'high';
    matched_confidence := 0.92;
    matched_recommendation := 'Review urgently. If credible, escalate to a human admin with crisis-support context.';
  END IF;

  IF text_to_scan ~ '(kill you|i will hurt|i''ll hurt|beat you|shoot you|come after you)' THEN
    matched_categories := matched_categories || ARRAY['threat'];
    matched_severity := 'high';
    matched_confidence := greatest(matched_confidence, 0.9);
    matched_recommendation := 'Review urgently for threat or targeted harassment.';
  END IF;

  IF text_to_scan ~ '(idiot|stupid|shut up|trash parent|bad mother|bad father|you people)' THEN
    matched_categories := matched_categories || ARRAY['harassment'];
    IF matched_severity <> 'high' THEN
      matched_severity := 'medium';
      matched_confidence := greatest(matched_confidence, 0.72);
      matched_recommendation := 'Review for personal attack, pile-on risk, or de-escalation opportunity.';
    END IF;
  END IF;

  IF text_to_scan ~ '(dox|address is|phone number is|ssn|social security|credit card)' THEN
    matched_categories := matched_categories || ARRAY['privacy'];
    matched_severity := 'high';
    matched_confidence := greatest(matched_confidence, 0.88);
    matched_recommendation := 'Review urgently for private personal information and remove if needed.';
  END IF;

  IF text_to_scan ~ '(buy now|limited time offer|crypto|forex|work from home guaranteed|dm me for prices)' THEN
    matched_categories := matched_categories || ARRAY['spam'];
    IF matched_severity <> 'high' THEN
      matched_severity := 'medium';
      matched_confidence := greatest(matched_confidence, 0.7);
      matched_recommendation := 'Review for promotional spam or off-topic solicitation.';
    END IF;
  END IF;

  RETURN QUERY SELECT
    cardinality(matched_categories) > 0,
    matched_severity,
    matched_categories,
    matched_confidence,
    matched_recommendation;
END;
$$;

CREATE OR REPLACE FUNCTION public.seat_steward_flag_content(
  flag_source_type text,
  flag_source_id uuid,
  flag_post_id uuid,
  flag_comment_id uuid,
  flag_author_id uuid,
  raw_text text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  result record;
BEGIN
  SELECT * INTO result
  FROM public.evaluate_seat_moderation_text(raw_text);

  IF result.should_flag THEN
    INSERT INTO public.seat_moderation_flags (
      source_type,
      source_id,
      post_id,
      comment_id,
      author_id,
      severity,
      categories,
      confidence,
      excerpt,
      recommendation
    )
    VALUES (
      flag_source_type,
      flag_source_id,
      flag_post_id,
      flag_comment_id,
      flag_author_id,
      result.severity,
      result.categories,
      result.confidence,
      left(regexp_replace(coalesce(raw_text, ''), '\s+', ' ', 'g'), 360),
      result.recommendation
    )
    ON CONFLICT (source_type, source_id) DO UPDATE
    SET
      severity = EXCLUDED.severity,
      categories = EXCLUDED.categories,
      confidence = EXCLUDED.confidence,
      excerpt = EXCLUDED.excerpt,
      recommendation = EXCLUDED.recommendation,
      status = CASE
        WHEN public.seat_moderation_flags.status = 'dismissed' THEN 'pending'
        ELSE public.seat_moderation_flags.status
      END,
      updated_at = now();
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.seat_steward_scan_post()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM public.seat_steward_flag_content(
    'post',
    NEW.id,
    NEW.id,
    NULL,
    NEW.author_id,
    coalesce(NEW.title, '') || ' ' || coalesce(NEW.content, '')
  );

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.seat_steward_scan_comment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM public.seat_steward_flag_content(
    'comment',
    NEW.id,
    NEW.post_id,
    NEW.id,
    NEW.author_id,
    NEW.content
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS seat_steward_scan_post_trigger ON public.seat_posts;
CREATE TRIGGER seat_steward_scan_post_trigger
  AFTER INSERT OR UPDATE OF title, content ON public.seat_posts
  FOR EACH ROW EXECUTE FUNCTION public.seat_steward_scan_post();

DROP TRIGGER IF EXISTS seat_steward_scan_comment_trigger ON public.seat_comments;
CREATE TRIGGER seat_steward_scan_comment_trigger
  AFTER INSERT OR UPDATE OF content ON public.seat_comments
  FOR EACH ROW EXECUTE FUNCTION public.seat_steward_scan_comment();

CREATE INDEX IF NOT EXISTS idx_seat_moderation_flags_status
  ON public.seat_moderation_flags(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seat_moderation_flags_author_id
  ON public.seat_moderation_flags(author_id);
CREATE INDEX IF NOT EXISTS idx_seat_moderation_flags_post_id
  ON public.seat_moderation_flags(post_id);
