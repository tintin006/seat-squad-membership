-- Fix SEAT Steward Bot scanner array appends.

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
