import { supabase } from '@/lib/supabase'

function parseCookieHeader(header: string | null, name: string): string | null {
  if (!header) return null
  const match = header.match(new RegExp('(?:^|;)\\s*' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[1]) : null
}

export async function logActivity(
  req: Request,
  eventType: string,
  eventData: Record<string, unknown> = {}
): Promise<void> {
  try {
    let username: string | null = null
    let sessionId: string | null = null

    // NextRequest has .cookies; plain Request does not
    if ('cookies' in req && typeof (req as { cookies?: { get?: (n: string) => { value?: string } | undefined } }).cookies?.get === 'function') {
      const r = req as { cookies: { get: (n: string) => { value?: string } | undefined } }
      username  = r.cookies.get('uf_user')?.value ?? null
      sessionId = r.cookies.get('uf_sid')?.value  ?? null
    } else {
      const cookieHeader = req.headers.get('cookie')
      username  = parseCookieHeader(cookieHeader, 'uf_user')
      sessionId = parseCookieHeader(cookieHeader, 'uf_sid')
    }

    if (!username || !sessionId) return

    await supabase.from('activity_events').insert({
      session_id:  sessionId,
      username,
      event_type:  eventType,
      event_data:  eventData,
    })
  } catch (err) {
    console.error('[activity] logActivity error:', err)
  }
}
