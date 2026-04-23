import { createClient } from '@supabase/supabase-js'

// Ini data asli dari project Supabase lu
const supabaseUrl = 'https://sbonbimamqfiryyxcdoa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNib25iaW1hbXFmaXJ5eXhjZG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNjI0OTYsImV4cCI6MjA5MTczODQ5Nn0.Mnz0IF8Z8jq02dXOlbztmW6YWHaZtXOobEcIq2Iw4zI'

export const supabase = createClient(supabaseUrl, supabaseKey)