import { createClient } from '@supabase/supabase-js';

// Fallback placeholders prevent build crashes on Vercel if env vars are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mjzlrennehxjxamrilga.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_0eFC6nwWHxjcS-sZpI95xQ_798Mwfl1';

export const supabase = createClient(supabaseUrl, supabaseKey);
