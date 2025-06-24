# Database Setup Guide for Karuna

This document provides comprehensive instructions for setting up the Karuna database schema and migrations.

## Overview

The Karuna platform uses Supabase with PostGIS for geospatial operations. The database schema includes tables for user profiles, need reports, resource donations, and coordinated missions.

## Migration Files

The following migration files should be applied in order:

1. **20250624060000_enable_extensions.sql** - Enable PostGIS and other required extensions
2. **20250624060001_update_profiles_add_columns.sql** - Add new columns to existing profiles table
3. **20250624060002_create_reports_table.sql** - Create reports table for need reporting
4. **20250624060003_create_donations_table.sql** - Create donations table for resource donations
5. **20250624060004_create_missions_table.sql** - Create missions table for coordinating aid delivery
6. **20250624060005_create_database_functions.sql** - Create utility functions for geospatial operations
7. **20250624060006_create_storage_policies.sql** - Set up secure storage policies for videos

## Quick Setup

### Option 1: Automatic Setup (Recommended)

```bash
# Install dependencies
npm install

# Run the automated database setup
npm run setup:db
```

### Option 2: Manual Migration

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste each migration file content in the order listed above
4. Execute each migration one by one

### Option 3: Supabase CLI

```bash
# Apply all migrations
supabase db push
```

## Verification Commands

After running migrations, verify everything is set up correctly:

```sql
-- Check that all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'reports', 'donations', 'missions');

-- Verify PostGIS is enabled
SELECT PostGIS_Version();

-- Check storage bucket
SELECT * FROM storage.buckets WHERE id = 'mission_videos';

-- Verify functions exist
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('calculate_distance', 'extract_coordinates', 'get_mission_statistics');

-- Test RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

## Schema Details

### Core Tables

- **profiles**: Extended user information with roles and FCM tokens
- **reports**: Geospatial need reports with video support
- **donations**: Resource donations with pickup coordination
- **missions**: Links reports and donations for facilitator coordination

### Security Features

- Row Level Security (RLS) enabled on all tables
- Secure video storage with access controls
- Role-based access policies
- Audit trails with timestamps

### Geospatial Features

- PostGIS integration for location-based operations
- Distance calculations for optimal matching
- Coordinate extraction and validation
- Spatial indexing for performance

## Troubleshooting

### Common Issues

1. **PostGIS Not Available**: Contact Supabase support or use basic geometry types
2. **Permission Errors**: Ensure proper database role and temporarily disable RLS if needed
3. **Storage Issues**: Verify storage extension is enabled and bucket exists
4. **Migration Conflicts**: Check for existing objects and use IF NOT EXISTS clauses

### Support

For additional help:
- Check Supabase documentation
- Review migration logs in the dashboard
- Contact the development team