/*
  # Update profiles table with additional columns

  1. New Columns
    - `fcm_token` (text, nullable) - For push notifications
    - `phone` (text, nullable) - Contact information
    - `location` (geography, nullable) - For facilitator location tracking
    - `is_active` (boolean) - For facilitator availability

  2. Indexes
    - Spatial index on location
    - Composite index on role and is_active
*/

-- Add new columns to profiles table if they don't exist
DO $$
BEGIN
  -- Add fcm_token column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'fcm_token'
  ) THEN
    ALTER TABLE profiles ADD COLUMN fcm_token text;
  END IF;

  -- Add phone column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone text;
  END IF;

  -- Add location column for facilitators if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'location'
  ) THEN
    ALTER TABLE profiles ADD COLUMN location geography(Point, 4326);
  END IF;

  -- Add is_active column for facilitator availability if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_active boolean DEFAULT true;
  END IF;
END $$;

-- Create spatial index on location for facilitators
CREATE INDEX IF NOT EXISTS profiles_location_idx ON profiles USING GIST (location);

-- Create index on role and is_active for facilitator queries
CREATE INDEX IF NOT EXISTS profiles_role_active_idx ON profiles (role, is_active);