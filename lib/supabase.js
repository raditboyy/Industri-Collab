import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const createNoopQuery = () => ({
  select: () => createNoopQuery(),
  order: () => Promise.resolve({ data: [], error: null }),
  update: () => createNoopQuery(),
  insert: () => Promise.resolve({ data: null, error: null }),
  delete: () => createNoopQuery(),
  eq: () => Promise.resolve({ data: [], error: null }),
  single: () => Promise.resolve({ data: null, error: null }),
  upload: () => Promise.resolve({ data: null, error: null }),
  getPublicUrl: () => ({ data: { publicUrl: "" } }),
  remove: () => Promise.resolve({ data: null, error: null }),
})

const createNoopAuth = () => ({
  getSession: async () => ({ data: { session: null }, error: null }),
  getUser: async () => ({ data: { user: null }, error: null }),
  signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error("Supabase belum dikonfigurasi") }),
  signUp: async () => ({ data: { user: null, session: null }, error: new Error("Supabase belum dikonfigurasi") }),
  signOut: async () => ({ error: null }),
  updateUser: async () => ({ data: { user: null }, error: new Error("Supabase belum dikonfigurasi") }),
  onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
})

const createNoopSupabase = () => ({
  auth: createNoopAuth(),
  from: () => createNoopQuery(),
  storage: {
    from: () => createNoopQuery(),
  },
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase env belum diisi. Aplikasi berjalan dengan fallback dummy sampai NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY diset.")
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createNoopSupabase()