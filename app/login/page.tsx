'use client'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'

const CYAN   = '#2BB8E6'
const BG     = '#0A0C12'
const CARD   = '#141821'
const BORDER = 'rgba(43,184,230,0.18)'

function LoginContent() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
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
        router.push('/admin')
        router.refresh()
      } else {
        const data = await res.json().catch(() => ({}))
        setError((data as { error?: string }).error ?? 'Invalid credentials')
        setLoading(false)
      }
    } catch {
      setError('Network error — please try again.')
      setLoading(false)
    }
  }

  const disabled = loading || !username || !password

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: BG }}
    >
      {/* Subtle radial glow */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: '-160px', left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '500px',
          background: `radial-gradient(ellipse at center, rgba(43,184,230,0.07) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 w-full mx-4" style={{ maxWidth: 400 }}>
        <div
          className="rounded-2xl p-8"
          style={{
            backgroundColor: 'rgba(20,24,33,0.96)',
            border: `1px solid ${BORDER}`,
            backdropFilter: 'blur(14px)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(43,184,230,0.06)',
          }}
        >
          {/* Logo / Wordmark */}
          <div className="flex flex-col items-center mb-8">
            {/* UF monogram */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 font-black text-lg tracking-tighter"
              style={{
                background: `linear-gradient(135deg, ${CYAN} 0%, #0E8FB8 100%)`,
                color: '#fff',
                boxShadow: `0 0 24px rgba(43,184,230,0.35)`,
              }}
            >
              UF
            </div>
            <p
              className="text-sm font-bold tracking-[0.22em] uppercase"
              style={{
                background: 'linear-gradient(90deg, #C9D1D9 0%, #FFFFFF 50%, #8A929C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              United Fintech
            </p>
            <div className="mt-3 w-10 h-px" style={{ backgroundColor: `rgba(43,184,230,0.25)` }} />
            <p
              className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: 'rgba(43,184,230,0.55)' }}
            >
              Admin Portal
            </p>
          </div>

          {/* Form */}
          <div className="mb-5">
            <h1 className="text-lg font-semibold text-white">Welcome back</h1>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Sign in to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(43,184,230,0.55)' }}
                onBlur={e  => { e.currentTarget.style.borderColor = error ? 'rgba(232,80,74,0.5)' : BORDER }}
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
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(43,184,230,0.55)' }}
                onBlur={e  => { e.currentTarget.style.borderColor = error ? 'rgba(232,80,74,0.5)' : BORDER }}
              />
              {error && (
                <p className="text-[11px]" style={{ color: '#E8504A' }}>{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={disabled}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all mt-1"
              style={{
                backgroundColor: disabled ? 'rgba(43,184,230,0.25)' : CYAN,
                color:           disabled ? 'rgba(255,255,255,0.35)' : '#fff',
                cursor:          disabled ? 'not-allowed' : 'pointer',
                boxShadow:       disabled ? 'none' : '0 0 20px rgba(43,184,230,0.25)',
              }}
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>
        </div>

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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
