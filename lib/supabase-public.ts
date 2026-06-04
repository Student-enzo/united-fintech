import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

// Anon client — safe to use in server actions for public-facing form inserts only
export function getSupabasePublic(): SupabaseClient {
  if (_client) return _client
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) {
    throw new Error('Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  _client = createClient(url, anon)
  return _client
}

export const supabasePublic = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabasePublic() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
