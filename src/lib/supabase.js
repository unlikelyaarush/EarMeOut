import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://iyczrplccxxajazjrsnq.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5Y3pycGxjY3h4YWphempyc25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MDQwODgsImV4cCI6MjA3OTk4MDA4OH0.vu6BNceMgs4w8fpKSB3A1W1yr0Ts4uBqlgJc_N5uWH8';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables - using defaults');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);