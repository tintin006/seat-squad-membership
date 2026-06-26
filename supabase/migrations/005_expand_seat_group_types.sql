-- Expand SEAT Squad group directory types for seed directory coverage.

ALTER TABLE public.seat_group_submissions
  DROP CONSTRAINT IF EXISTS seat_group_submissions_group_type_check;

ALTER TABLE public.seat_group_submissions
  ADD CONSTRAINT seat_group_submissions_group_type_check
  CHECK (
    group_type IN (
      'Homeschool co-op',
      'Hybrid learning pod',
      'Microschool',
      'Field trip group',
      'Parent meetup',
      'Tutor-supported group',
      'Homeschool support association',
      'Support group',
      'Faith group',
      'Secular group',
      'Inclusive group',
      'Resource group',
      'Special interest group',
      'Special needs group',
      'Military support group',
      'Volunteer support group',
      'Co-school'
    )
  );

CREATE UNIQUE INDEX IF NOT EXISTS idx_seat_group_submissions_unique_location_name
  ON public.seat_group_submissions (lower(group_name), lower(city), state);
