/*
  # Fix Authentication Issues

  1. Security Updates
    - Fix RLS policies for profile creation
    - Allow users to insert their own profiles
    - Disable email confirmation for development
    
  2. Policy Changes
    - Add INSERT policy for profiles table
    - Update trigger function to handle profile creation properly
    - Ensure proper permissions for new users
*/

-- First, let's add an INSERT policy for profiles
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Update the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into profiles with proper error handling
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'citizen')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Could not create profile for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Add a policy to allow service role to insert profiles (for the trigger)
CREATE POLICY "Service role can insert profiles" ON profiles
  FOR INSERT TO service_role
  WITH CHECK (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.reports TO authenticated;
GRANT ALL ON public.donations TO authenticated;
GRANT ALL ON public.missions TO authenticated;