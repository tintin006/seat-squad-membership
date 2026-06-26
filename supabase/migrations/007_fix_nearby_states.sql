-- Fix nearby_states for all seed group submissions
-- Corrects the hardcoded nearby_states to use geographic proximity
-- Run after 006_seed_seat_group_directory.sql

-- GA groups → FL, AL, NC, SC, TN
UPDATE public.seat_group_submissions
SET nearby_states = ARRAY['FL', 'AL', 'NC', 'SC', 'TN']::text[]
WHERE state = 'GA';

-- FL groups → GA, AL
UPDATE public.seat_group_submissions
SET nearby_states = ARRAY['GA', 'AL']::text[]
WHERE state = 'FL';

-- AZ groups → CA, TX
UPDATE public.seat_group_submissions
SET nearby_states = ARRAY['CA', 'TX']::text[]
WHERE state = 'AZ';

-- TN groups → GA, AL, NC
UPDATE public.seat_group_submissions
SET nearby_states = ARRAY['GA', 'AL', 'NC']::text[]
WHERE state = 'TN';

-- NC groups → SC, GA, TN, VA
UPDATE public.seat_group_submissions
SET nearby_states = ARRAY['SC', 'GA', 'TN', 'VA']::text[]
WHERE state = 'NC';

-- AL groups → FL, GA, TN
UPDATE public.seat_group_submissions
SET nearby_states = ARRAY['FL', 'GA', 'TN']::text[]
WHERE state = 'AL';

-- SC groups → NC, GA
UPDATE public.seat_group_submissions
SET nearby_states = ARRAY['NC', 'GA']::text[]
WHERE state = 'SC';

-- VA groups → MD, NC
UPDATE public.seat_group_submissions
SET nearby_states = ARRAY['MD', 'NC']::text[]
WHERE state = 'VA';

-- TX groups → AZ
UPDATE public.seat_group_submissions
SET nearby_states = ARRAY['AZ']::text[]
WHERE state = 'TX';

-- PA groups → OH, VA
UPDATE public.seat_group_submissions
SET nearby_states = ARRAY['OH', 'VA']::text[]
WHERE state = 'PA';

-- OH groups → PA, VA
UPDATE public.seat_group_submissions
SET nearby_states = ARRAY['PA', 'VA']::text[]
WHERE state = 'OH';
