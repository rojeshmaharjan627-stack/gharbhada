import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 
  (typeof window !== 'undefined' && window.localStorage.getItem('GHARBHADA_SUPABASE_URL')) ||
  import.meta.env.VITE_SUPABASE_URL || 
  'https://oxetsraoimciyaqhkhhs.supabase.co';

const SUPABASE_ANON_KEY = 
  (typeof window !== 'undefined' && window.localStorage.getItem('GHARBHADA_SUPABASE_ANON_KEY')) ||
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94ZXRzcmFvaW1jaXlhcWhraGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3MjEzNDMsImV4cCI6MjEwNTI5NzM0M30.quku1l8fWQl6MlsPUYMuvESGkOonxzyu0GUT1xeYYgo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
