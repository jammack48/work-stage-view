import { createClient } from '@supabase/supabase-js';

const EXT_URL = import.meta.env.VITE_EXT_SUPABASE_URL;
const EXT_ANON = import.meta.env.VITE_EXT_SUPABASE_ANON_KEY;

if (!EXT_URL || !EXT_ANON) {
  console.warn(
    "[authSupabase] Missing VITE_EXT_SUPABASE_URL or VITE_EXT_SUPABASE_ANON_KEY — auth features will not work."
  );
}

export const authSupabase = EXT_URL && EXT_ANON
  ? createClient(EXT_URL, EXT_ANON, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
