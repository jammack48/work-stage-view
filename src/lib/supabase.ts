import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_EXT_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_EXT_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing external Supabase environment variables. Set VITE_EXT_SUPABASE_URL and VITE_EXT_SUPABASE_ANON_KEY.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
