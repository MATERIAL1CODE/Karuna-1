# Database Migrations for Karuna

This directory contains all database migrations for the Karuna community aid platform. The migrations are designed to be run in order and are idempotent (safe to run multiple times).

## Migration Order

Run these migrations in the following order:

1. **20250624060000_enable_extensions.sql** - Enable PostGIS and other required extensions
2. **20250624060001_update_profiles_add_columns.sql** - Add new columns to existing profiles table
3. **20250624060002_create_reports_table.sql** - Create reports table for need reporting
4. **20250624060003_create_donations_table.sql** - Create donations table for resource donations
5. **20250624060004_create_missions_table.sql** - Create missions table for coordinating aid delivery
6. **20250624060005_create_database_functions.sql** - Create utility functions for geospatial operations
7. **20250624060006_create_storage_policies.sql** - Set up secure storage policies for videos

## Running Migrations

### Using Supabase CLI

```bash
# Apply all migrations
supabase db push

# Or apply individual migrations
supabase db push --include-all
```

### Manual Application

If you need to run migrations manually in the Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste each migration file content in order
4. Execute each migration

## Verification

After running all migrations, verify the setup:

```sql
-- Check that all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'reports', 'donations', 'missions');

-- Check that PostGIS is enabled
SELECT PostGIS_Version();

-- Check that storage bucket exists
SELECT * FROM storage.buckets WHERE id = 'mission_videos';

-- Check that functions exist
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('calculate_distance', 'extract_coordinates', 'get_mission_statistics');
```

## Troubleshooting

### PostGIS Extension Issues

If you get errors about PostGIS not being available:

1. Ensure your Supabase project has PostGIS enabled
2. Contact Supabase support if PostGIS is not available in your region
3. As a fallback, you can use basic geometry types instead of geography

### Permission Issues

If you get permission errors:

1. Ensure you're running migrations with the correct database role
2. Check that RLS policies are not blocking the migration
3. Temporarily disable RLS if needed during migration

### Storage Issues

If storage policies fail:

1. Ensure the storage bucket is created first
2. Check that the storage schema is available
3. Verify that the storage extension is enabled

## Schema Overview

### Tables

- **profiles**: User information and roles (extended from auth.users)
- **reports**: Need reports with geospatial location data
- **donations**: Resource donations with pickup information
- **missions**: Coordinated delivery missions linking reports and donations

### Key Features

- **Geospatial Support**: PostGIS for location-based matching
- **Row Level Security**: Comprehensive security policies
- **Audit Trails**: Created/updated timestamps on all tables
- **Referential Integrity**: Proper foreign key relationships
- **Performance**: Optimized indexes for common queries

### Security Model

- Users can only access their own data
- Facilitators can view assigned missions
- Video access is restricted to uploaders and assigned facilitators
- Service role has full access for backend operations