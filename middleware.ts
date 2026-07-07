import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

async function makeToken(prefix: string, secret: string): Promise<string> {
  const data = new TextEncoder().encode(`${prefix}:${secret}`)
  const buf  = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

const USERS: Record<string, string> = {
  Enzo:   process.env.USER_ENZO_PASS  ?? 'ChangeMe1!',
  Admin:  process.env.USER_ADMIN_PASS ?? 'ChangeMe2!',
  Demo:   process.env.USER_DEMO_PASS  ?? 'Demo1234!',
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Static assets — always allow
  if (
    pathname.startsWith('/_next/') ||
    pathname.match(/\.(png|svg|ico|jpg|webp|woff2?)$/)
  ) {
    return NextResponse.next()
  }

  // ── Portal routes: Supabase session auth ──────────────────────────────────
  if (pathname.startsWith('/portal')) {
    // Public portal routes
    if (pathname === '/portal/login' || pathname.startsWith('/portal/auth/')) {
      return NextResponse.next()
    }

    // Protected portal routes — check Supabase session
    let response = NextResponse.next({ request })
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.redirect(new URL('/portal/login', request.url))
    }
    return response
  }

  // ── Admin routes: cookie-based auth ───────────────────────────────────────
  if (
    pathname === '/login' ||
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/api/consultation') ||
    pathname === '/api/merchants/apply'
  ) {
    return NextResponse.next()
  }

  if (
    pathname === '/' ||
    pathname === '/services' ||
    pathname.startsWith('/services/') ||
    pathname === '/about' ||
    pathname === '/contact' ||
    pathname === '/blog' ||
    pathname.startsWith('/providers/') ||
    pathname === '/apply'
  ) {
    return NextResponse.next()
  }

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
