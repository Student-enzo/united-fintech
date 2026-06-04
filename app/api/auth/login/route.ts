import { NextRequest, NextResponse } from 'next/server'

async function makeToken(prefix: string, secret: string): Promise<string> {
  const data = new TextEncoder().encode(`${prefix}:${secret}`)
  const buf  = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

// Inline — do not import from lib to avoid edge runtime issues
const USERS: Record<string, string> = {
  Enzo:  process.env.USER_ENZO_PASS  ?? 'ChangeMe1!',
  Admin: process.env.USER_ADMIN_PASS ?? 'ChangeMe2!',
  Demo:  process.env.USER_DEMO_PASS  ?? 'Demo1234!',
}

const COOKIE_BASE = {
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path:     '/',
  maxAge:   60 * 60 * 24 * 7, // 7 days
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { username, password } = body as { username?: string; password?: string }

  if (!username || !password || !USERS[username] || password !== USERS[username]) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = await makeToken('uf', username + ':' + password)
  const res   = NextResponse.json({ success: true })

  res.cookies.set('uf_session', token,    { ...COOKIE_BASE, httpOnly: true  })
  res.cookies.set('uf_user',    username, { ...COOKIE_BASE, httpOnly: false })

  return res
}
