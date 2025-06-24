# Manual Migration Guide for Karuna

If the automated database setup script fails, you can run the migrations manually in your Supabase dashboard. This guide provides step-by-step instructions.

## Prerequisites

1. Access to your Supabase project dashboard
2. Admin permissions on the project
3. All migration files from the `supabase/migrations/` directory

## Step-by-Step Instructions

### 1. Access the SQL Editor

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your Karuna project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query** to create a new SQL script

### 2. Run Migrations in Order

Execute the following migration files **in this exact order**. Copy the entire content of each file and run it before proceeding to the next one.

#### Migration 1: Enable Extensions
**File:** `20250624103317_crimson_fire.sql`

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "postgis_topology";

-- Ensure we have the required spatial reference system (WGS84)
INSERT INTO spatial_ref_sys (srid, auth_name, auth_srid, proj4text, srtext)
VALUES (4326, 'EPSG', 4326, '+proj=longlat +datum=WGS84 +no_defs', 
'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]')
ON CONFLICT (srid) DO NOTHING;
```

#### Migration 2: Update Profiles Table
**File:** `20250624103322_aged_field.sql`

```sql
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
```

#### Migration 3: Create Reports Table
**File:** `20250624103329_wild_crystal.sql`

```sql
-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id serial PRIMARY KEY,
  reporter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  location geography(Point, 4326) NOT NULL,
  description text,
  people_in_need integer NOT NULL CHECK (people_in_need > 0),
  video_url text,
  status text NOT NULL DEFAULT 'pending_match' CHECK (status IN ('pending_match', 'assigned', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create spatial index for efficient location queries
CREATE INDEX IF NOT EXISTS reports_location_idx ON reports USING GIST (location);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS reports_status_idx ON reports (status);

-- Create index on reporter_id for user queries
CREATE INDEX IF NOT EXISTS reports_reporter_id_idx ON reports (reporter_id);

-- Create index on created_at for ordering
CREATE INDEX IF NOT EXISTS reports_created_at_idx ON reports (created_at DESC);

-- Create policies
CREATE POLICY "Users can read own reports"
  ON reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id);

CREATE POLICY "Users can insert own reports"
  ON reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can update own reports"
  ON reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = reporter_id)
  WITH CHECK (auth.uid() = reporter_id);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Migration 4: Create Donations Table
**File:** `20250624103338_holy_sea.sql`

```sql
-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id serial PRIMARY KEY,
  donor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_type text NOT NULL,
  quantity text NOT NULL,
  pickup_location geography(Point, 4326) NOT NULL,
  pickup_address text NOT NULL,
  pickup_contact text NOT NULL,
  pickup_time_preference text NOT NULL,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'completed', 'failed')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Create spatial index for efficient location queries
CREATE INDEX IF NOT EXISTS donations_pickup_location_idx ON donations USING GIST (pickup_location);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS donations_status_idx ON donations (status);

-- Create index on donor_id for user queries
CREATE INDEX IF NOT EXISTS donations_donor_id_idx ON donations (donor_id);

-- Create index on resource_type for matching
CREATE INDEX IF NOT EXISTS donations_resource_type_idx ON donations (resource_type);

-- Create index on created_at for ordering
CREATE INDEX IF NOT EXISTS donations_created_at_idx ON donations (created_at DESC);

-- Create policies
CREATE POLICY "Users can read own donations"
  ON donations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = donor_id);

CREATE POLICY "Users can insert own donations"
  ON donations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Users can update own donations"
  ON donations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = donor_id)
  WITH CHECK (auth.uid() = donor_id);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Migration 5: Create Missions Table
**File:** `20250624103346_hidden_trail.sql`

```sql
-- Create missions table
CREATE TABLE IF NOT EXISTS missions (
  id serial PRIMARY KEY,
  report_id integer NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  donation_id integer NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
  facilitator_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'unassigned' CHECK (status IN ('unassigned', 'assigned', 'en_route_pickup', 'pickup_completed', 'en_route_delivery', 'completed', 'failed')),
  letter_of_thanks text,
  estimated_distance numeric,
  estimated_duration integer,
  pickup_completed_at timestamptz,
  delivery_completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS missions_status_idx ON missions (status);
CREATE INDEX IF NOT EXISTS missions_facilitator_id_idx ON missions (facilitator_id);
CREATE INDEX IF NOT EXISTS missions_report_id_idx ON missions (report_id);
CREATE INDEX IF NOT EXISTS missions_donation_id_idx ON missions (donation_id);
CREATE INDEX IF NOT EXISTS missions_created_at_idx ON missions (created_at DESC);

-- Create policies
CREATE POLICY "Facilitators can read assigned missions"
  ON missions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'facilitator'
    ) AND (facilitator_id = auth.uid() OR facilitator_id IS NULL)
  );

CREATE POLICY "Facilitators can update assigned missions"
  ON missions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'facilitator'
    ) AND facilitator_id = auth.uid()
  );

CREATE POLICY "Citizens can read missions related to their reports"
  ON missions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM reports 
      WHERE reports.id = missions.report_id 
      AND reports.reporter_id = auth.uid()
    )
  );

CREATE POLICY "Citizens can read missions related to their donations"
  ON missions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM donations 
      WHERE donations.id = missions.donation_id 
      AND donations.donor_id = auth.uid()
    )
  );

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_missions_updated_at
  BEFORE UPDATE ON missions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Migration 6: Create Database Functions
**File:** `20250624103357_velvet_dawn.sql`

```sql
-- Function to calculate distance between two geography points
CREATE OR REPLACE FUNCTION calculate_distance(point1 geography, point2 geography)
RETURNS numeric AS $$
BEGIN
  RETURN ST_Distance(point1, point2);
END;
$$ LANGUAGE plpgsql;

-- Function to extract coordinates from geography point
CREATE OR REPLACE FUNCTION extract_coordinates(geography_point geography)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'lat', ST_Y(geography_point::geometry),
    'lng', ST_X(geography_point::geometry)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to find nearby points within a distance
CREATE OR REPLACE FUNCTION find_nearby_points(
  center_point geography,
  search_distance numeric DEFAULT 5000
)
RETURNS TABLE(
  point_id integer,
  distance numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id as point_id,
    ST_Distance(location, center_point) as distance
  FROM reports
  WHERE ST_DWithin(location, center_point, search_distance)
  ORDER BY distance;
END;
$$ LANGUAGE plpgsql;

-- Function to get mission statistics
CREATE OR REPLACE FUNCTION get_mission_statistics()
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total_missions', COUNT(*),
    'completed_missions', COUNT(*) FILTER (WHERE status = 'completed'),
    'active_missions', COUNT(*) FILTER (WHERE status IN ('assigned', 'en_route_pickup', 'pickup_completed', 'en_route_delivery')),
    'total_people_helped', COALESCE(SUM(
      CASE WHEN status = 'completed' THEN 
        (SELECT people_in_need FROM reports WHERE reports.id = missions.report_id)
      ELSE 0 END
    ), 0)
  ) INTO result
  FROM missions;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get user impact statistics
CREATE OR REPLACE FUNCTION get_user_impact_stats(user_id uuid)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total_reports', (
      SELECT COUNT(*) FROM reports WHERE reporter_id = user_id
    ),
    'total_donations', (
      SELECT COUNT(*) FROM donations WHERE donor_id = user_id
    ),
    'total_people_helped', (
      SELECT COALESCE(SUM(r.people_in_need), 0)
      FROM reports r
      JOIN missions m ON m.report_id = r.id
      WHERE r.reporter_id = user_id AND m.status = 'completed'
    ) + (
      SELECT COALESCE(SUM(r.people_in_need), 0)
      FROM donations d
      JOIN missions m ON m.donation_id = d.id
      JOIN reports r ON r.id = m.report_id
      WHERE d.donor_id = user_id AND m.status = 'completed'
    ),
    'completed_missions', (
      SELECT COUNT(DISTINCT m.id)
      FROM missions m
      LEFT JOIN reports r ON r.id = m.report_id
      LEFT JOIN donations d ON d.id = m.donation_id
      WHERE (r.reporter_id = user_id OR d.donor_id = user_id) AND m.status = 'completed'
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

#### Migration 7: Create Storage Policies
**File:** `20250624103410_restless_butterfly.sql`

```sql
-- Create storage bucket for mission videos (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('mission_videos', 'mission_videos', false)
ON CONFLICT (id) DO NOTHING;

-- Policy: Users can upload videos for reports
CREATE POLICY "Users can upload videos for reports"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'mission_videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can view their own uploaded videos
CREATE POLICY "Users can view own uploaded videos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'mission_videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Facilitators can view videos for their assigned missions
CREATE POLICY "Facilitators can view assigned mission videos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'mission_videos' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'facilitator'
  ) AND
  EXISTS (
    SELECT 1 FROM missions m
    JOIN reports r ON r.id = m.report_id
    WHERE m.facilitator_id = auth.uid()
    AND r.video_url LIKE '%' || name || '%'
  )
);

-- Policy: Service role can manage all videos
CREATE POLICY "Service role can manage all videos"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'mission_videos');
```

#### Migration 8: Verification
**File:** `20250624103645_white_temple.sql`

```sql
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
```

### 3. Verification

After running all migrations, execute this verification query to ensure everything is set up correctly:

```sql
-- Final verification query
SELECT 
  'Tables' as category,
  COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'reports', 'donations', 'missions')

UNION ALL

SELECT 
  'Functions' as category,
  COUNT(*) as count
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('calculate_distance', 'extract_coordinates', 'get_mission_statistics')

UNION ALL

SELECT 
  'RLS Policies' as category,
  COUNT(*) as count
FROM pg_policies 
WHERE schemaname = 'public';
```

Expected results:
- Tables: 4
- Functions: 3 or more
- RLS Policies: 10 or more

### 4. Common Issues and Solutions

#### PostGIS Extension Error
If you get an error about PostGIS not being available:
- Contact Supabase support to enable PostGIS for your project
- Some regions may not have PostGIS available

#### Permission Errors
If you get permission denied errors:
- Make sure you're using the service role key, not the anon key
- Check that your Supabase project is not paused

#### Table Already Exists
If you see "table already exists" errors:
- This is normal and expected
- The migrations use `IF NOT EXISTS` to handle this gracefully

### 5. Next Steps

After successfully running all migrations:

1. **Deploy Edge Functions**: Go to your Supabase dashboard and deploy the Edge Functions from the `supabase/functions/` directory
2. **Test the Application**: Run `npm run dev` to start the development server
3. **Verify Functionality**: Test user registration, report submission, and donation logging

### 6. Getting Help

If you encounter issues:
- Check the Supabase dashboard logs for detailed error messages
- Ensure your project has sufficient permissions and resources
- Contact the development team with specific error messages