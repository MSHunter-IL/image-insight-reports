
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cmecyojlcdhkqucthrbj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtZWN5b2psY2Roa3F1Y3RocmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMzgwMTgsImV4cCI6MjA2MDgxNDAxOH0.T_gsm7euwJugP0eiCivfw6s3cJY1Xcc_p8UoQl9qo6Y";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Google OAuth Client ID for the application
export const GOOGLE_CLIENT_ID = "603201000451-5n5vea5dpu5vnccpc0do7jk4j4q0qsio.apps.googleusercontent.com";
