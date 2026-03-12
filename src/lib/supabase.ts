import { createClient } from '@supabase/supabase-js';

// Your own Supabase project — independent of Lovable Cloud
const SUPABASE_URL = 'https://qrkojbfayjrtrlrmgzry.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFya29qYmZheWpydHJscm1nenJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTcxNTQsImV4cCI6MjA4ODU3MzE1NH0.xVKR6dILRdUkdUmUCANysKqlviWxfATrSKo-SvyT4oA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});