import { NextResponse } from 'next/server'

const CLEAR = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path:     '/',
  maxAge:   0,
}

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set('uf_session', '', CLEAR)
  res.cookies.set('uf_user',    '', { ...CLEAR, httpOnly: false })
  return res
}
