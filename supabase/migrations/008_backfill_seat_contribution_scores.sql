-- Backfill contribution scores for activity that existed before scoring triggers.

SELECT public.award_seat_points(
  author_id,
  'post_created',
  10,
  'seat_posts',
  id,
  'Created a community post'
)
FROM public.seat_posts;

SELECT public.award_seat_points(
  author_id,
  'comment_created',
  5,
  'seat_comments',
  id,
  'Added a community comment'
)
FROM public.seat_comments
WHERE is_deleted = false;

SELECT public.award_seat_points(
  user_id,
  'reaction_given',
  1,
  'seat_post_reactions',
  id,
  'Reacted to a community post'
)
FROM public.seat_post_reactions;

SELECT public.award_seat_points(
  post_author_id,
  'reaction_received',
  2,
  'seat_post_reactions',
  reaction_id,
  'Received a reaction on a community post'
)
FROM (
  SELECT
    reactions.id AS reaction_id,
    reactions.user_id AS reaction_user_id,
    posts.author_id AS post_author_id
  FROM public.seat_post_reactions reactions
  JOIN public.seat_posts posts ON posts.id = reactions.post_id
) reaction_awards
WHERE post_author_id IS NOT NULL
  AND post_author_id <> reaction_user_id;

SELECT public.award_seat_points(
  submitted_by,
  'pod_submission_approved',
  25,
  'seat_group_submissions',
  id,
  'Submitted an approved pod or homeschool group'
)
FROM public.seat_group_submissions
WHERE submitted_by IS NOT NULL
  AND status = 'approved';
