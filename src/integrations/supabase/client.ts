
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wmkqryfukkyzbchgdeii.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indta3FyeWZ1a2t5emJjaGdkZWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNDE3OTIsImV4cCI6MjA2MTkxNzc5Mn0.6rkMNjzjh_GMmNIrRuEGCJJRg5Qsr5xUk8AqviveBIA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
