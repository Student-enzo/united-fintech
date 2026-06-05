'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { BRAND } from '@/lib/brand'

// ─── Constants ────────────────────────────────────────────────────────────────

const BORDER      = `rgba(30,168,212,0.18)`
const PIN_LENGTH  = 4

// ─── LoginContent ─────────────────────────────────────────────────────────────

type LoginMode = 'admin' | 'pin'

function LoginContent() {
  const router = useRouter()
  const params = useSearchParams()
  const next   = params.get('next') ?? '/admin'

  const [mode,     setMode]     = useState<LoginMode>('admin')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [pin,      setPin]      = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  // Auto-submit PIN when full length reached
  useEffect(() => {
    if (mode === 'pin' && pin.length === PIN_LENGTH) {
      void submitPin(pin)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, mode])

  // Clear error when switching modes
  useEffect(() => { setError(''); setPin('') }, [mode])

  // ── Handlers ─────────────────────────────────────────────────────────────

  async function handleAdminSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username, password }),
      })
      if (res.ok) {
        router.push(next)
        router.refresh()
      } else {
        const data = await res.json().catch(() => ({}))
        setError((data as { error?: string }).error ?? 'Invalid username or password.')
        setLoading(false)
      }
    } catch {
      setError('Network error — please try again.')
      setLoading(false)
    }
  }

  async function submitPin(value: string) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ mode: 'pin', pin: value }),
      })
      if (res.ok) {
        router.push(next)
        router.refresh()
      } else {
        setError('Incorrect PIN. Try again.')
        setPin('')
        setLoading(false)
      }
    } catch {
      setError('Network error — please try again.')
      setPin('')
      setLoading(false)
    }
  }

  function pressDigit(d: string) {
    if (pin.length < PIN_LENGTH) setPin(p => p + d)
  }
  function backspace() { setPin(p => p.slice(0, -1)) }

  const adminDisabled = loading || !username || !password

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: BRAND.bg }}
    >
      {/* Grid backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(30,168,212,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(30,168,212,0.04) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial glow */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: '-160px', left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '500px',
          background: `radial-gradient(ellipse at center, rgba(30,168,212,0.09) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 w-full mx-4" style={{ maxWidth: 420 }}>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            backgroundColor: 'rgba(20,24,33,0.96)',
            border: `1px solid ${BORDER}`,
            backdropFilter: 'blur(14px)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(30,168,212,0.06)',
          }}
        >
          {/* Logo + wordmark */}
          <div className="flex flex-col items-center mb-7">
            <Image
              src="/uf-logo-vertical.png"
              alt="United Fintech"
              width={148}
              height={148}
              priority
              style={{ objectFit: 'contain', marginBottom: '0.5rem' }}
            />
            <div className="mt-1 w-10 h-px" style={{ backgroundColor: 'rgba(30,168,212,0.25)' }} />
            <p
              className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: 'rgba(30,168,212,0.55)' }}
            >
              Admin Portal
            </p>
          </div>

          {/* Mode switcher */}
          <div
            className="flex p-1 rounded-xl mb-7"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${BRAND.border}` }}
          >
            {([
              { id: 'admin' as LoginMode, label: 'Admin Login'    },
              { id: 'pin'   as LoginMode, label: 'Agent Quick Access' },
            ] as const).map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className="flex-1 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all"
                style={{
                  backgroundColor: mode === m.id ? 'rgba(30,168,212,0.15)' : 'transparent',
                  color:           mode === m.id ? BRAND.cyan : BRAND.muted,
                  border:          mode === m.id ? `1px solid rgba(30,168,212,0.25)` : '1px solid transparent',
                  cursor: 'pointer',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* ── Admin login form ─────────────────────────────────── */}
          {mode === 'admin' && (
            <div>
              <div className="mb-5">
                <h1 className="text-lg font-semibold text-white">Welcome back</h1>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Sign in with your admin credentials
                </p>
              </div>

              <form onSubmit={handleAdminSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[11px] font-semibold uppercase tracking-[0.12em]"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    autoFocus
                    required
                    autoComplete="username"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: error ? '1px solid rgba(232,80,74,0.5)' : `1px solid ${BORDER}`,
                      color: 'rgba(255,255,255,0.9)',
                    }}
                    onFocus={e  => { e.currentTarget.style.borderColor = 'rgba(30,168,212,0.55)' }}
                    onBlur={e   => { e.currentTarget.style.borderColor = error ? 'rgba(232,80,74,0.5)' : BORDER }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[11px] font-semibold uppercase tracking-[0.12em]"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: error ? '1px solid rgba(232,80,74,0.5)' : `1px solid ${BORDER}`,
                      color: 'rgba(255,255,255,0.9)',
                    }}
                    onFocus={e  => { e.currentTarget.style.borderColor = 'rgba(30,168,212,0.55)' }}
                    onBlur={e   => { e.currentTarget.style.borderColor = error ? 'rgba(232,80,74,0.5)' : BORDER }}
                  />
                  {error && (
                    <p className="text-[11px]" style={{ color: BRAND.danger }}>{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={adminDisabled}
                  className="w-full py-3 rounded-xl text-sm font-semibold transition-all mt-1"
                  style={{
                    backgroundColor: adminDisabled ? 'rgba(30,168,212,0.25)' : BRAND.cyan,
                    color:           adminDisabled ? 'rgba(255,255,255,0.35)' : '#fff',
                    cursor:          adminDisabled ? 'not-allowed' : 'pointer',
                    border: 'none',
                    boxShadow:       adminDisabled ? 'none' : `0 0 20px rgba(30,168,212,0.25)`,
                  }}
                >
                  {loading ? 'Signing in…' : 'Sign In →'}
                </button>
              </form>
            </div>
          )}

          {/* ── Agent PIN pad ────────────────────────────────────── */}
          {mode === 'pin' && (
            <div>
              <div className="mb-6 text-center">
                <h1 className="text-lg font-semibold text-white">Agent Quick Access</h1>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Enter your {PIN_LENGTH}-digit agent PIN
                </p>
              </div>

              {/* PIN dot display */}
              <div className="flex justify-center gap-4 mb-6">
                {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: i < pin.length ? BRAND.cyan : 'rgba(255,255,255,0.12)',
                      border: i < pin.length ? `1px solid ${BRAND.cyanBright}` : `1px solid rgba(255,255,255,0.12)`,
                      boxShadow: i < pin.length ? `0 0 10px ${BRAND.cyan}88` : 'none',
                      transition: 'all 0.15s',
                    }}
                  />
                ))}
              </div>

              {error && (
                <p className="text-center text-xs mb-4" style={{ color: BRAND.danger }}>{error}</p>
              )}

              {/* Number pad */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((key, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (key === '⌫') backspace()
                      else if (key !== '') pressDigit(key)
                    }}
                    disabled={loading || key === ''}
                    style={{
                      height: 58,
                      borderRadius: 14,
                      fontSize: key === '⌫' ? 20 : 22,
                      fontWeight: 600,
                      cursor: key === '' ? 'default' : 'pointer',
                      backgroundColor:
                        key === ''   ? 'transparent'
                        : key === '⌫' ? 'rgba(255,255,255,0.04)'
                        : 'rgba(255,255,255,0.06)',
                      color:
                        key === '⌫'
                          ? 'rgba(255,255,255,0.45)'
                          : BRAND.text,
                      border:
                        key === '' ? 'none'
                        : `1px solid ${BRAND.border}`,
                      transition: 'background-color 0.1s',
                    }}
                  >
                    {loading && key !== '⌫' && key !== '' ? '' : key}
                  </button>
                ))}
              </div>

              {loading && (
                <p className="text-center text-xs mt-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Verifying…
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <p
          className="text-center text-[10px] mt-5 uppercase tracking-[0.18em]"
          style={{ color: 'rgba(255,255,255,0.15)' }}
        >
          United Fintech · Admin
        </p>
      </div>
    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
