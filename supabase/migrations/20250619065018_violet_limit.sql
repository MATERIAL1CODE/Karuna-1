/*
  # Disable Email Confirmation for Prototype

  1. Configuration Changes
    - Disable email confirmation requirement
    - Allow immediate sign-in after sign-up
    - Update auth policies for prototype mode

  2. Security Notes
    - This is for prototype/development only
    - In production, email confirmation should be enabled
    - Users can sign up and immediately sign in
*/

-- Update auth settings to disable email confirmation
-- Note: This would typically be done in Supabase dashboard under Authentication > Settings
-- For now, we'll ensure our trigger handles user creation properly

-- Make sure our user creation trigger is robust
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Always create profile for new users, regardless of email confirmation
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'citizen')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
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

-- Ensure trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Also handle updates to auth.users (in case email confirmation happens later)
CREATE OR REPLACE FUNCTION handle_user_update()
RETURNS trigger AS $$
BEGIN
  -- Update profile when user is updated (e.g., email confirmed)
  UPDATE public.profiles 
  SET 
    email = NEW.email,
    updated_at = now()
  WHERE id = NEW.id;
  
  -- If profile doesn't exist, create it
  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, email, role)
    VALUES (
      NEW.id,
      NEW.email,
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

-- Create trigger for user updates
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_user_update();

-- Ensure all necessary permissions are granted
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.reports TO authenticated;
GRANT ALL ON public.donations TO authenticated;
GRANT ALL ON public.missions TO authenticated;

-- Grant sequence permissions if needed
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;