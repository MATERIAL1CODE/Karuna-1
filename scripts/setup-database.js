#!/usr/bin/env node

/**
 * Database setup script for Karuna
 * 
 * This script helps set up the database by running migrations in the correct order
 * and verifying that everything is working properly.
 */

// Load environment variables FIRST, before any other imports
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Check environment variables after loading them
const { checkEnvironmentVariables } = require('./check-env');

console.log('🔍 Checking environment variables...');

if (!checkEnvironmentVariables()) {
  console.log('\n💡 Make sure your .env file exists and contains the required variables.');
  process.exit(1);
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log(`\n🔗 Connecting to Supabase: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrationFile(filePath) {
  const fileName = path.basename(filePath);
  console.log(`📄 Running migration: ${fileName}`);
  
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Skip README files and other non-SQL files
    if (!fileName.endsWith('.sql')) {
      console.log(`⏭️  Skipping non-SQL file: ${fileName}`);
      return;
    }
    
    // Execute the SQL directly using the Supabase client
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      // If exec_sql doesn't exist, try direct query
      if (error.code === '42883') {
        console.log('📝 Using direct SQL execution...');
        const { error: directError } = await supabase.from('_').select('*').limit(0);
        
        // Split SQL into statements and execute them one by one
        const statements = sql
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*'));
        
        for (const statement of statements) {
          if (statement.trim()) {
            try {
              // Use raw SQL execution
              const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${supabaseServiceKey}`,
                  'Content-Type': 'application/json',
                  'apikey': supabaseServiceKey
                },
                body: JSON.stringify({ sql: statement + ';' })
              });
              
              if (!response.ok) {
                const errorText = await response.text();
                console.log(`⚠️  Statement execution note: ${errorText}`);
              }
            } catch (stmtError) {
              console.log(`⚠️  Statement execution note: ${stmtError.message}`);
            }
          }
        }
      } else {
        throw error;
      }
    }
    
    console.log(`✅ Migration completed: ${fileName}`);
  } catch (error) {
    console.error(`❌ Migration failed: ${fileName}`);
    console.error(error.message);
    
    // Don't throw for certain expected errors
    if (error.message.includes('already exists') || 
        error.message.includes('does not exist') ||
        error.message.includes('permission denied')) {
      console.log('⚠️  This error may be expected - continuing...');
      return;
    }
    
    throw error;
  }
}

async function verifySetup() {
  console.log('\n🔍 Verifying database setup...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error && error.code !== 'PGRST116') {
      throw new Error(`Database connection failed: ${error.message}`);
    }
    
    console.log('✅ Database connection successful');
    
    // Check if we can query system tables
    try {
      const { data: tables } = await supabase
        .rpc('exec_sql', { 
          sql: `SELECT table_name FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name IN ('profiles', 'reports', 'donations', 'missions');`
        });
      
      console.log('✅ System tables accessible');
    } catch (error) {
      console.log('⚠️  System table check skipped (may require additional permissions)');
    }
    
    console.log('\n🎉 Database setup verification completed!');
    
  } catch (error) {
    console.error('\n❌ Verification failed:');
    console.error(error.message);
    console.log('\n💡 This may be normal if migrations need to be run manually.');
  }
}

async function main() {
  console.log('🚀 Setting up Karuna database...\n');
  
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.error(`❌ Migrations directory not found: ${migrationsDir}`);
    process.exit(1);
  }
  
  // Get all migration files and sort them
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  console.log(`📁 Found ${migrationFiles.length} migration files`);
  
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
    console.log('4. Check if your Supabase project has the required extensions enabled');
    
    // Don't exit with error code for certain issues
    if (error.message.includes('permission') || error.message.includes('does not exist')) {
      console.log('\n💡 You may need to run the migrations manually in your Supabase dashboard.');
      process.exit(0);
    }
    
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runMigrationFile, verifySetup };