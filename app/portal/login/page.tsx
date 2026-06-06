'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createPortalBrowserClient } from '@/lib/supabase-browser'

function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  useEffect(() => {
    const e = searchParams.get('email')
    if (e) setEmail(e)
  }, [searchParams])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createPortalBrowserClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? 'Email or password is incorrect. Check your welcome email for login details.'
          : error.message
      )
      setLoading(false)
      return
    }
    router.push('/portal/dashboard')
  }

  const input: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(144,196,207,0.22)',
    color: 'rgba(255,255,255,0.85)', fontSize: 14, outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ color: '#90c4cf', fontSize: 22, fontWeight: 300, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>
            United Fintech
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, letterSpacing: '0.06em' }}>
            Merchant Application Portal
          </div>
        </div>

        <div style={{ background: '#282626', border: '1px solid rgba(144,196,207,0.15)', borderRadius: 14, padding: 32 }}>
          <h1 style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, fontWeight: 400, marginBottom: 6 }}>
            Sign in to your portal
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 28 }}>
            Use the credentials from your welcome email.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Email</label>
              <input style={input} type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" />
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Password</label>
              <input style={input} type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>

            {error && (
              <div style={{ background: 'rgba(232,80,74,0.12)', border: '1px solid rgba(232,80,74,0.3)', borderRadius: 8, padding: '10px 14px', color: '#E8504A', fontSize: 13 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px 0', borderRadius: 10, border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? 'rgba(144,196,207,0.3)' : '#90c4cf',
              color: loading ? 'rgba(255,255,255,0.5)' : '#1c1c1c',
              fontSize: 14, fontWeight: 500, letterSpacing: '0.05em', marginTop: 4,
              transition: 'all 0.15s',
            }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 12, marginTop: 24 }}>
          Need help? Contact your United Fintech representative.
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
