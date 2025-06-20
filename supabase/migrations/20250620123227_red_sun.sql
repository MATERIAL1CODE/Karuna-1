/*
  # Fix Profiles RLS Policies

  1. Security Updates
    - Drop existing restrictive policies
    - Add more permissive policies for profile creation
    - Ensure users can create and read their own profiles
    - Allow service role to manage profiles

  2. Changes
    - Remove overly restrictive INSERT policies
    - Add policy for anyone to create profiles
    - Maintain security for updates and deletes
*/

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;

-- Create more permissive policies for profile creation
CREATE POLICY "Anyone can create profiles"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow users to read all profiles (needed for the app functionality)
DROP POLICY IF EXISTS "Users can read other profiles" ON profiles;
CREATE POLICY "Users can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to update their own profiles
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- Allow service role full access
CREATE POLICY "Service role full access"
  ON profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);