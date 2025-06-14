// Simple test script to verify Supabase connection
// Run with: node test-supabase.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://frwnqxhmviattxscjacu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyd25xeGhtdmlhdHR4c2NqYWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NDc4NDMsImV4cCI6MjA2NTAyMzg0M30.0QgylqdTBTR-P22JzsigB1hiwzwFw-APT6P4o0uT07M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔄 Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('projects').select('count', { count: 'exact' });
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return;
    }
    
    console.log('✅ Connection successful!');
    console.log(`📊 Found ${data.length} projects in database`);
    
    // Test skills table
    const { data: skillsData, error: skillsError } = await supabase.from('skills').select('count', { count: 'exact' });
    
    if (skillsError) {
      console.log('⚠️  Skills table not accessible:', skillsError.message);
    } else {
      console.log(`🎯 Found ${skillsData.length} skills in database`);
    }
    
    // Test profiles table
    const { data: profilesData, error: profilesError } = await supabase.from('profiles').select('count', { count: 'exact' });
    
    if (profilesError) {
      console.log('⚠️  Profiles table not accessible:', profilesError.message);
    } else {
      console.log(`👤 Found ${profilesData.length} profiles in database`);
    }
    
    console.log('\n🎉 Supabase is properly connected and configured!');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

testConnection();