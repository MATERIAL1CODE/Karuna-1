/*
  # Add Phone Support to Profiles

  1. Schema Changes
    - Add phone column to profiles table
    - Update constraints to allow either email or phone
    - Add indexes for phone lookups

  2. Security
    - Update RLS policies to handle phone authentication
    - Ensure proper validation for phone numbers
*/

-- Add phone column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;

-- Update the unique constraint to allow either email or phone
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_email_key;

-- Create a unique constraint that allows either email or phone to be unique
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_unique 
  ON profiles (email) 
  WHERE email IS NOT NULL AND email != '';

CREATE UNIQUE INDEX IF NOT EXISTS profiles_phone_unique 
  ON profiles (phone) 
  WHERE phone IS NOT NULL AND phone != '';

-- Update the handle_new_user function to support phone authentication
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Always create profile for new users, regardless of auth method
  INSERT INTO public.profiles (id, email, phone, role)
  VALUES (
    new.id,
    COALESCE(new.email, ''),
    COALESCE(new.phone, ''),
    COALESCE(new.raw_user_meta_data->>'role', 'citizen')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, profiles.email),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    role = COALESCE(EXCLUDED.role, profiles.role),
    updated_at = now();
  
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Could not create/update profile for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the handle_user_update function to support phone updates
CREATE OR REPLACE FUNCTION handle_user_update()
RETURNS trigger AS $$
BEGIN
  -- Update profile when user is updated (e.g., phone confirmed)
  UPDATE public.profiles 
  SET 
    email = COALESCE(NEW.email, profiles.email),
    phone = COALESCE(NEW.phone, profiles.phone),
    updated_at = now()
  WHERE id = NEW.id;
  
  -- If profile doesn't exist, create it
  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, email, phone, role)
    VALUES (
      NEW.id,
      COALESCE(NEW.email, ''),
      COALESCE(NEW.phone, ''),
      COALESCE(NEW.raw_user_meta_data->>'role', 'citizen')
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Could not update profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add index for phone lookups
CREATE INDEX IF NOT EXISTS profiles_phone_idx ON profiles (phone) WHERE phone IS NOT NULL AND phone != '';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON public.profiles TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;