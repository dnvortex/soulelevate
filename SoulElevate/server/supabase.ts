import { createClient } from '@supabase/supabase-js';

// Check if we should use Supabase
const useSupabase = process.env.USE_SUPABASE === 'true';

// Initialize only if needed
let supabaseClient = null;

if (useSupabase) {
  const supabaseUrl = 'https://hunugopjdwftoqgovvgs.supabase.co';
  const supabaseKey = process.env.SUPABASE_KEY || '';

  if (!supabaseKey) {
    console.error('SUPABASE_KEY environment variable is not set');
    console.error('Using in-memory storage instead of Supabase');
  } else {
    try {
      supabaseClient = createClient(supabaseUrl, supabaseKey);
      console.log('Supabase client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error);
      console.error('Using in-memory storage instead of Supabase');
    }
  }
} else {
  console.log('Supabase is disabled (USE_SUPABASE is not set to true)');
}

export const supabase = supabaseClient;

export default supabaseClient;