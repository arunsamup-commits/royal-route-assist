import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbtdmtpxrnccdyaftvrz.supabase.co'; // Supabase settings se copy karein
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidGRtdHB4cm5jY2R5YWZ0dnJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyODE5MjcsImV4cCI6MjA5MTg1NzkyN30.2kOLFsk5GRStHRye8h1tjXQje2CpJ2XLe9Ig-lncdKU'; // Supabase settings se copy karein

export const supabase = createClient(supabaseUrl, supabaseAnonKey);