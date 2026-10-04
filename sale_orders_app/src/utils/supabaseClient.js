import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://msvmlsmsvfbwmgwfvrqw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdm1sc21zdmZid21nd2Z2cnF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MDI0MTAsImV4cCI6MjEwMDM3ODQxMH0.oVG42rs-T6Z87ubr7zxsgnL71YAsTesQTdP-addf_AA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
