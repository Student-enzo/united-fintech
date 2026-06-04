import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

async function makeToken(prefix: string, secret: string): Promise<string> {
  const data = new TextEncoder().encode(`${prefix}:${secret}`)
  const buf  = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

// Inline — do not import from lib to avoid edge runtime issues
const USERS: Record<string, string> = {
  Enzo:   process.env.USER_ENZO_PASS  ?? 'ChangeMe1!',
  Admin:  process.env.USER_ADMIN_PASS ?? 'ChangeMe2!',
  Demo:   process.env.USER_DEMO_PASS  ?? 'Demo1234!',
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes — always allow
  if (
    pathname === '/login' ||
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/api/consultation') ||
    pathname.startsWith('/_next/') ||
    pathname.match(/\.(png|svg|ico|jpg|webp|woff2?)$/)
  ) {
    return NextResponse.next()
  }

  // Marketing pages — allow
  if (
    pathname === '/' ||
    pathname.startsWith('/services/') ||
    pathname === '/about' ||
    pathname === '/contact'
  ) {
    return NextResponse.next()
  }

  // Admin routes + admin API — require uf_session cookie
  const session  = request.cookies.get('uf_session')?.value
  const username = request.cookies.get('uf_user')?.value

  if (!session || !username) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const userPass = USERS[username]
  if (!userPass) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const expected = await makeToken('uf', username + ':' + userPass)
  if (session !== expected) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
