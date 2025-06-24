#!/usr/bin/env node

/**
 * Environment variables checker for Karuna
 * 
 * This script checks if all required environment variables are set
 * and provides helpful guidance for setting them up.
 */

const requiredVars = [
  'EXPO_PUBLIC_SUPABASE_URL',
  'EXPO_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

const optionalVars = [
  'PICAOS_SECRET_KEY'
];

function checkEnvironmentVariables() {
  console.log('🔍 Checking environment variables...\n');
  
  const missing = [];
  const present = [];
  
  // Check required variables
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      present.push(varName);
      console.log(`✅ ${varName}: Set`);
    } else {
      missing.push(varName);
      console.log(`❌ ${varName}: Missing`);
    }
  });
  
  // Check optional variables
  console.log('\nOptional variables:');
  optionalVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`✅ ${varName}: Set`);
    } else {
      console.log(`⚠️  ${varName}: Not set (optional)`);
    }
  });
  
  if (missing.length > 0) {
    console.log('\n❌ Missing required environment variables!');
    console.log('\n📋 Setup Instructions:');
    console.log('1. Copy .env.example to .env:');
    console.log('   cp .env.example .env');
    console.log('\n2. Get your Supabase credentials:');
    console.log('   • Go to https://supabase.com/dashboard');
    console.log('   • Select your project');
    console.log('   • Go to Settings > API');
    console.log('   • Copy the Project URL and anon/service_role keys');
    console.log('\n3. Update your .env file with the actual values');
    console.log('\n4. Run this script again to verify');
    
    return false;
  }
  
  console.log('\n✅ All required environment variables are set!');
  return true;
}

if (require.main === module) {
  const success = checkEnvironmentVariables();
  process.exit(success ? 0 : 1);
}

module.exports = { checkEnvironmentVariables };