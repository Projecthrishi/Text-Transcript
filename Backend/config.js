const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://nqgmpsllzsarhcwbsydx.supabase.co"; // ✅ Ensure correct Supabase URL
const SUPABASE_ANON_KEY = "eyJpc3MiOiJzdXBhYmFzZSIseyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9InJlZiI6Im5xZ21wc2xsenNhcmhjd2JzeWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0OTY0MzAsImV4cCI6MjA1NjA3MjQzMH0.1VI8Y-kGtkf194UT9xN_KUejPqjDarvqN1a0hZ0EyfE"

; // ✅ Ensure correct API key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

module.exports = { supabase };
