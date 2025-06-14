import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with your project URL and public anon key
const supabaseUrl = 'https://frwnqxhmviattxscjacu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyd25xeGhtdmlhdHR4c2NqYWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NDc4NDMsImV4cCI6MjA2NTAyMzg0M30.0QgylqdTBTR-P22JzsigB1hiwzwFw-APT6P4o0uT07M';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);