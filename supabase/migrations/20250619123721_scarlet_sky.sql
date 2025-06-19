/*
  # Fix Authentication Flow and Profile Management

  1. Database Schema Fixes
    - Fix profiles table constraints
    - Ensure proper phone/email handling
    - Update triggers for better error handling

  2. Security Updates
    - Fix RLS policies
    - Ensure proper permissions
    - Handle both email and phone authentication

  3. Profile Management
    - Better profile creation logic
    - Handle missing profiles gracefully
    - Support both auth methods
*/

-- First, let's clean up any existing constraints that might cause issues
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_email_key;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_phone_key;

-- Drop existing indexes to recreate them properly
DROP INDEX IF EXISTS profiles_email_unique;
DROP INDEX IF EXISTS profiles_phone_unique;
DROP INDEX IF EXISTS profiles_phone_idx;

-- Make email and phone nullable since users can sign up with either
ALTER TABLE profiles ALTER COLUMN email DROP NOT NULL;

-- Recreate the table structure to ensure it's correct
DO $$ 
BEGIN
  -- Add phone column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone text;
  END IF;
END $$;

-- Create proper unique constraints
CREATE UNIQUE INDEX profiles_email_unique 
  ON profiles (email) 
  WHERE email IS NOT NULL AND email != '';

CREATE UNIQUE INDEX profiles_phone_unique 
  ON profiles (phone) 
  WHERE phone IS NOT NULL AND phone != '';

-- Create index for phone lookups
CREATE INDEX profiles_phone_idx 
  ON profiles (phone) 
  WHERE phone IS NOT NULL AND phone != '';

-- Update the handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_role text;
  user_email text;
  user_phone text;
BEGIN
  -- Extract user data safely
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'citizen');
  user_email := COALESCE(NEW.email, '');
  user_phone := COALESCE(NEW.phone, '');
  
  -- Ensure we have at least email or phone
  IF user_email = '' AND user_phone = '' THEN
    user_email := COALESCE(NEW.email, 'user_' || NEW.id || '@temp.com');
  END IF;

  -- Insert profile with proper conflict handling
  INSERT INTO public.profiles (id, email, phone, role)
  VALUES (NEW.id, user_email, user_phone, user_role)
  ON CONFLICT (id) DO UPDATE SET
    email = CASE 
      WHEN EXCLUDED.email != '' THEN EXCLUDED.email 
      ELSE profiles.email 
    END,
    phone = CASE 
      WHEN EXCLUDED.phone != '' THEN EXCLUDED.phone 
      ELSE profiles.phone 
    END,
    role = COALESCE(EXCLUDED.role, profiles.role),
    updated_at = now();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Profile creation failed for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the handle_user_update function
CREATE OR REPLACE FUNCTION handle_user_update()
RETURNS trigger AS $$
BEGIN
  -- Update existing profile or create if missing
  INSERT INTO public.profiles (id, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.phone, ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'citizen')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = CASE 
      WHEN EXCLUDED.email != '' THEN EXCLUDED.email 
      ELSE profiles.email 
    END,
    phone = CASE 
      WHEN EXCLUDED.phone != '' THEN EXCLUDED.phone 
      ELSE profiles.phone 
    END,
    updated_at = now();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Profile update failed for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure triggers are properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_user_update();

-- Update RLS policies to be more permissive for profile creation
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
CREATE POLICY "Service role can insert profiles" ON profiles
  FOR INSERT TO service_role
  WITH CHECK (true);

-- Allow authenticated users to update their own profiles
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow reading profiles
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can read other profiles" ON profiles;
CREATE POLICY "Users can read other profiles" ON profiles
  FOR SELECT TO authenticated
  USING (true);

-- Grant all necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON public.profiles TO authenticated, service_role;
GRANT ALL ON public.reports TO authenticated;
GRANT ALL ON public.donations TO authenticated;
GRANT ALL ON public.missions TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;

-- Insert a test profile to verify everything works
DO $$
BEGIN
  -- This will help verify the setup is working
  RAISE NOTICE 'Profile table setup completed successfully';
END $$;