-- SEAT Squad enums and helper functions
-- Run this in the Supabase SQL Editor before 002_seat_profiles_and_subscriptions.sql

-- Role enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'seat_role') THEN
    CREATE TYPE seat_role AS ENUM ('family', 'educator', 'both', 'admin');
  END IF;
END $$;

-- Tier enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'seat_tier') THEN
    CREATE TYPE seat_tier AS ENUM ('free', 'member', 'pro');
  END IF;
END $$;

-- Event type enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'seat_event_type') THEN
    CREATE TYPE seat_event_type AS ENUM ('orientation', 'strategy', 'educator_lab', 'office_hours', 'community', 'workshop');
  END IF;
END $$;

-- Post type enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'seat_post_type') THEN
    CREATE TYPE seat_post_type AS ENUM ('text', 'image', 'link', 'poll', 'announcement');
  END IF;
END $$;

-- Helper: update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
