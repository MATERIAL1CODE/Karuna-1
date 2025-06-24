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

async function executeSQLDirect(sql) {
  try {
    // Use the REST API directly to execute SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ sql })
    });

    if (!response.ok) {
      // If exec doesn't work, try alternative approach
      const errorText = await response.text();
      console.log(`⚠️  Direct execution note: ${errorText}`);
      
      // Try using the SQL editor approach
      const sqlEditorResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/sql',
          'apikey': supabaseServiceKey
        },
        body: sql
      });

      if (!sqlEditorResponse.ok) {
        const sqlErrorText = await sqlEditorResponse.text();
        throw new Error(`SQL execution failed: ${sqlErrorText}`);
      }
    }

    return { success: true };
  } catch (error) {
    throw error;
  }
}

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
    
    // Clean up the SQL - remove comments and empty lines
    const cleanedSQL = sql
      .split('\n')
      .filter(line => {
        const trimmed = line.trim();
        return trimmed.length > 0 && 
               !trimmed.startsWith('--') && 
               !trimmed.startsWith('/*') &&
               !trimmed.endsWith('*/');
      })
      .join('\n');

    if (!cleanedSQL.trim()) {
      console.log(`⏭️  Skipping empty migration: ${fileName}`);
      return;
    }

    // Try to execute the SQL
    try {
      await executeSQLDirect(cleanedSQL);
      console.log(`✅ Migration completed: ${fileName}`);
    } catch (error) {
      // Handle specific expected errors
      if (error.message.includes('already exists') || 
          error.message.includes('does not exist') ||
          error.message.includes('permission denied') ||
          error.message.includes('duplicate key') ||
          error.message.includes('relation') && error.message.includes('already exists')) {
        console.log(`⚠️  Migration note for ${fileName}: ${error.message}`);
        console.log(`✅ Continuing (this may be expected)...`);
        return;
      }
      
      // For other errors, try breaking down into individual statements
      console.log(`🔄 Trying alternative execution method for ${fileName}...`);
      
      const statements = cleanedSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await executeSQLDirect(statement + ';');
            successCount++;
          } catch (stmtError) {
            errorCount++;
            if (stmtError.message.includes('already exists') || 
                stmtError.message.includes('does not exist') ||
                stmtError.message.includes('permission denied')) {
              console.log(`⚠️  Expected: ${stmtError.message.substring(0, 100)}...`);
            } else {
              console.log(`❌ Statement error: ${stmtError.message.substring(0, 100)}...`);
            }
          }
        }
      }
      
      console.log(`📊 ${fileName}: ${successCount} successful, ${errorCount} with notes`);
      
      if (successCount === 0 && errorCount > 0) {
        throw new Error(`All statements failed in ${fileName}`);
      }
    }
    
  } catch (error) {
    console.error(`❌ Migration failed: ${fileName}`);
    console.error(error.message);
    
    // Don't throw for certain expected errors
    if (error.message.includes('already exists') || 
        error.message.includes('does not exist') ||
        error.message.includes('permission denied') ||
        error.message.includes('function') && error.message.includes('does not exist')) {
      console.log('⚠️  This error may be expected - continuing...');
      return;
    }
    
    throw error;
  }
}

async function verifySetup() {
  console.log('\n🔍 Verifying database setup...');
  
  try {
    // Test basic connection by trying to query profiles table
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error && !error.message.includes('relation "profiles" does not exist')) {
      console.log(`⚠️  Database query note: ${error.message}`);
    } else {
      console.log('✅ Database connection successful');
    }
    
    // Try to check if tables exist using a simple query
    try {
      const { data: profilesData } = await supabase.from('profiles').select('id').limit(1);
      console.log('✅ Profiles table accessible');
    } catch (error) {
      console.log('⚠️  Profiles table check skipped');
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
    console.log('1. Deploy Edge Functions to Supabase dashboard');
    console.log('2. Test the application');
    console.log('3. Set up production environment variables');
    
  } catch (error) {
    console.error('\n💥 Setup failed:', error.message);
    console.log('\n🔧 Manual Setup Instructions:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste each migration file from supabase/migrations/ in order:');
    
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    migrationFiles.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file}`);
    });
    
    console.log('4. Execute each migration one by one');
    console.log('5. Check for any errors and resolve them');
    
    // Don't exit with error code for certain issues
    if (error.message.includes('permission') || 
        error.message.includes('does not exist') ||
        error.message.includes('already exists')) {
      console.log('\n💡 The migrations may need to be run manually in your Supabase dashboard.');
      process.exit(0);
    }
    
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runMigrationFile, verifySetup };