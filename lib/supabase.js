import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Biar lu tau di terminal kalau kuncinya gagal kebaca
if (!supabaseUrl || !supabaseAnonKey) {
  console.log("❌ Kunci Supabase tidak terbaca di Drive D!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)