import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://jeddjulucawhwxtocnqy.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZGRqdWx1Y2F3aHd4dG9jbnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwOTA4MDIsImV4cCI6MjA3MDY2NjgwMn0.AmHHBMpM4Fy0D021wdgWAEEn50rlYqVJa491qJ7mBbc'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
