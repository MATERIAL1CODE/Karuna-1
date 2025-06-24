#!/usr/bin/env node

/**
 * Database setup script for Karuna
 * 
 * This script helps set up the database by running migrations in the correct order
 * and verifying that everything is working properly.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   EXPO_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration(filePath) {
  console.log(`📄 Running migration: ${path.basename(filePath)}`);
  
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      throw error;
    }
    
    console.log(`✅ Migration completed: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`❌ Migration failed: ${path.basename(filePath)}`);
    console.error(error.message);
    throw error;
  }
}

async function verifySetup() {
  console.log('\n🔍 Verifying database setup...');
  
  try {
    // Check tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['profiles', 'reports', 'donations', 'missions']);
    
    if (tablesError) throw tablesError;
    
    const expectedTables = ['profiles', 'reports', 'donations', 'missions'];
    const existingTables = tables.map(t => t.table_name);
    const missingTables = expectedTables.filter(t => !existingTables.includes(t));
    
    if (missingTables.length > 0) {
      throw new Error(`Missing tables: ${missingTables.join(', ')}`);
    }
    
    console.log('✅ All required tables exist');
    
    // Check PostGIS
    const { data: postgisVersion, error: postgisError } = await supabase
      .rpc('postgis_version');
    
    if (postgisError) {
      console.log('⚠️  PostGIS not available - some features may not work');
    } else {
      console.log('✅ PostGIS is available');
    }
    
    // Check storage bucket
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) throw bucketsError;
    
    const missionVideosBucket = buckets.find(b => b.id === 'mission_videos');
    if (!missionVideosBucket) {
      console.log('⚠️  mission_videos bucket not found - video uploads may not work');
    } else {
      console.log('✅ Storage bucket configured');
    }
    
    console.log('\n🎉 Database setup verification completed!');
    
  } catch (error) {
    console.error('\n❌ Verification failed:');
    console.error(error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Setting up Karuna database...\n');
  
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  
  // Migration files in order
  const migrationFiles = [
    '20250624060000_enable_extensions.sql',
    '20250624060001_update_profiles_add_columns.sql', 
    '20250624060002_create_reports_table.sql',
    '20250624060003_create_donations_table.sql',
    '20250624060004_create_missions_table.sql',
    '20250624060005_create_database_functions.sql',
    '20250624060006_create_storage_policies.sql'
  ];
  
  try {
    // Run migrations in order
    for (const fileName of migrationFiles) {
      const filePath = path.join(migrationsDir, fileName);
      
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Migration file not found: ${fileName}`);
        continue;
      }
      
      await runMigration(filePath);
    }
    
    // Verify setup
    await verifySetup();
    
    console.log('\n✨ Database setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Deploy Edge Functions: supabase functions deploy');
    console.log('2. Set up environment variables');
    console.log('3. Test the application');
    
  } catch (error) {
    console.error('\n💥 Setup failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runMigration, verifySetup };