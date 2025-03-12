import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bzlzfdolanyeoqmxmwxp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6bHpmZG9sYW55ZW9xbXhtd3hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MTcwNTksImV4cCI6MjA1NzM5MzA1OX0.yL0bf9HQcMS2btm4sXVFukrAMDXkv0fEVToU6QmXYeo";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
