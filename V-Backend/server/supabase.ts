import { createClient } from '@supabase/supabase-js';

// Use NEW Supabase project (abizuwqnqkbicrhorcig) where database and storage exist
const supabaseUrl = 'https://abizuwqnqkbicrhorcig.supabase.co';
const supabaseAnonKey = process.env.NEW_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.NEW_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set NEW_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY');
}

if (!supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY. This is required for user management and admin operations.');
}

// Client for regular operations (respects RLS policies)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

// Admin client for server-side operations (bypasses RLS policies)
// This should only be used for administrative tasks like user creation
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
