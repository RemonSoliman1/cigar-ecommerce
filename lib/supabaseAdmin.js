import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('Missing SUPABASE_SERVICE_ROLE_KEY for Admin Client. Falling back to Anon Key (RLS may block inventory decrement).');
}

// Service Role Client - BYPASSES RLS
export const supabaseAdmin = (supabaseUrl && supabaseServiceKey)
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;
