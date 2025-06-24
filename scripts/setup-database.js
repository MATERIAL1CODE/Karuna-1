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

// Check environment variables first
const { checkEnvironmentVariables } = require('./check-env');

if (!checkEnvironmentVariables()) {
  process.exit(1);
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runSQL(sql, description) {
  console.log(`📄 ${description}`);
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      throw error;
    }
    
    console.log(`✅ ${description} - Completed`);
  } catch (error) {
    console.error(`❌ ${description} - Failed`);
    console.error(error.message);
    throw error;
  }
}

async function runMigrationFile(filePath) {
  const fileName = path.basename(filePath);
  console.log(`📄 Running migration: ${fileName}`);
  
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split SQL into individual statements and execute them
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
        if (error) {
          throw error;
        }
      }
    }
    
    console.log(`✅ Migration completed: ${fileName}`);
  } catch (error) {
    console.error(`❌ Migration failed: ${fileName}`);
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
    
    // Check PostGIS (optional)
    try {
      const { error: postgisError } = await supabase.rpc('postgis_version');
      if (postgisError) {
        console.log('⚠️  PostGIS not available - some features may not work');
      } else {
        console.log('✅ PostGIS is available');
      }
    } catch (error) {
      console.log('⚠️  PostGIS check failed - this may be normal');
    }
    
    // Check storage bucket
    try {
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
    } catch (error) {
      console.log('⚠️  Storage check failed - this may be normal');
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
  
  // Get all migration files and sort them
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  try {
    // Run migrations in order
    for (const fileName of migrationFiles) {
      const filePath = path.join(migrationsDir, fileName);
      await runMigrationFile(filePath);
    }
    
    // Verify setup
    await verifySetup();
    
    console.log('\n✨ Database setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Deploy Edge Functions to Supabase');
    console.log('2. Test the application');
    console.log('3. Set up production environment variables');
    
  } catch (error) {
    console.error('\n💥 Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your Supabase credentials in .env');
    console.log('2. Ensure your Supabase project is active');
    console.log('3. Try running migrations manually in Supabase dashboard');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runMigrationFile, verifySetup };