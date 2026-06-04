import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Anon client — safe to use in server actions for public-facing form inserts only
export const supabasePublic = createClient(url, anon)
