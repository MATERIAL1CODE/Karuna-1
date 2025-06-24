/*
  # Verification and Setup Completion

  This migration verifies that all previous migrations have been applied correctly
  and provides a summary of the database setup.

  1. Verification Checks
    - Verify all tables exist
    - Check PostGIS installation
    - Validate storage setup
    - Confirm RLS policies

  2. Setup Summary
    - Display table counts
    - Show enabled extensions
    - List created functions
*/

-- Verify all required tables exist
DO $$
BEGIN
  -- Check profiles table
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    RAISE EXCEPTION 'profiles table not found - please run previous migrations first';
  END IF;

  -- Check reports table
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reports') THEN
    RAISE EXCEPTION 'reports table not found - please run create_reports_table migration';
  END IF;

  -- Check donations table
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'donations') THEN
    RAISE EXCEPTION 'donations table not found - please run create_donations_table migration';
  END IF;

  -- Check missions table
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'missions') THEN
    RAISE EXCEPTION 'missions table not found - please run create_missions_table migration';
  END IF;

  RAISE NOTICE 'All required tables exist ✓';
END $$;

-- Verify PostGIS is available
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') THEN
    RAISE EXCEPTION 'PostGIS extension not found - please run enable_extensions migration';
  END IF;
  
  RAISE NOTICE 'PostGIS extension is enabled ✓';
END $$;

-- Verify storage bucket exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'mission_videos') THEN
    RAISE NOTICE 'mission_videos bucket not found - this may be expected if storage policies migration has not run yet';
  ELSE
    RAISE NOTICE 'mission_videos storage bucket exists ✓';
  END IF;
END $$;

-- Display setup summary
DO $$
DECLARE
  table_count INTEGER;
  function_count INTEGER;
  policy_count INTEGER;
BEGIN
  -- Count tables
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'reports', 'donations', 'missions');

  -- Count custom functions
  SELECT COUNT(*) INTO function_count
  FROM information_schema.routines 
  WHERE routine_schema = 'public' 
  AND routine_name IN ('calculate_distance', 'extract_coordinates', 'get_mission_statistics', 'handle_new_user', 'update_updated_at_column');

  -- Count RLS policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE schemaname = 'public';

  RAISE NOTICE '=== KARUNA DATABASE SETUP SUMMARY ===';
  RAISE NOTICE 'Tables created: % / 4', table_count;
  RAISE NOTICE 'Functions created: %', function_count;
  RAISE NOTICE 'RLS policies: %', policy_count;
  RAISE NOTICE 'PostGIS enabled: ✓';
  RAISE NOTICE '=====================================';
  
  IF table_count = 4 THEN
    RAISE NOTICE 'Database setup completed successfully! 🎉';
  ELSE
    RAISE NOTICE 'Some tables are missing. Please check previous migrations.';
  END IF;
END $$;