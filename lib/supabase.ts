import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key  = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!url || !key) {
  throw new Error('Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
}

// Service-role client — server-side only, never expose to the browser
export const supabase = createClient(url, key)
