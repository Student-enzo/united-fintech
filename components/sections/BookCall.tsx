'use client'

import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { submitConsultation } from '@/app/actions/consultation'
import type { ConsultationFormData } from '@/app/actions/consultation'
import { LiquidButton } from '@/components/ui/liquid-glass-button'
import { useCursorArrow } from '@/components/ui/cursor-arrow'

const VOLUME_OPTIONS = [
  { value: '', label: 'Select monthly volume' },
  { value: 'under_50k', label: 'Under $50K / month' },
  { value: '50k_250k', label: '$50K – $250K / month' },
  { value: '250k_1m', label: '$250K – $1M / month' },
  { value: '1m_5m', label: '$1M – $5M / month' },
  { value: 'over_5m', label: 'Over $5M / month' },
]

const SERVICE_OPTIONS = [
  { value: 'merchant_processing', label: 'Merchant Processing' },
  { value: 'embedded_finance', label: 'Embedded Finance' },
  { value: 'risk_mitigation', label: 'Risk Mitigation' },
  { value: 'all', label: 'All / Not Sure Yet' },
] as const

const STEPS = [
  { n: '01', title: 'Submit Your Info', body: 'Tell us about your business and current payment setup.' },
  { n: '02', title: 'We Review', body: 'Our specialists assess your situation within 1 business day.' },
  { n: '03', title: 'Strategy Session', body: 'A focused 30-minute call to map your optimal payment stack.' },
  { n: '04', title: 'Implementation', body: 'We guide you through the full onboarding — start to finish.' },
]

const METRICS = [
  { v: '500+', l: 'Merchants Advised' },
  { v: '$2B+', l: 'Volume Facilitated' },
  { v: '18%', l: 'Avg. Rate Reduction' },
]

export default function BookCall({ initialInterest, contextTopic }: { initialInterest?: string; contextTopic?: string }) {
  const submitRef = useCursorArrow<HTMLDivElement>()
  const [form, setForm] = useState<ConsultationFormData>({
    name: '', email: '', phone: '', company: '',
    monthly_volume: '',
    service_interest: (initialInterest as ConsultationFormData['service_interest']) || 'all',
    message: '',
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await submitConsultation(form)
      if (result.success) setSuccess(true)
      else setError(result.error ?? 'An error occurred. Please try again.')
    })
  }

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'rgba(30,168,212,0.55)'
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30,168,212,0.1)'
  }
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'
    e.currentTarget.style.boxShadow = 'none'
  }

  const inputS: React.CSSProperties = {
    width: '100%', padding: '0.875rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 10, color: '#E8EDF2',
    fontSize: '0.9rem', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    appearance: 'none', WebkitAppearance: 'none',
  }

  const labelS: React.CSSProperties = {
    display: 'block', color: 'rgba(232,237,242,0.45)',
    fontSize: '0.7rem', fontWeight: 700,
    letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem',
  }

  return (
    <section
      id="consultation"
      style={{ backgroundColor: '#090B10', position: 'relative', overflow: 'hidden', padding: '6rem 1.5rem' }}
    >
      {/* Radial glow */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '80%', height: 500,
        background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(30,168,212,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {/* Bottom separator line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(30,168,212,0.15), transparent)',
      }} />

      <div style={{ maxWidth: 1180, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section tag */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p style={{ color: '#1EA8D4', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Free Strategy Session
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

          {/* ── LEFT: Trust panel ── */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65 }}
          >
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(2rem, 3vw, 2.6rem)',
              letterSpacing: '-0.03em', lineHeight: 1.05, color: '#E8EDF2', marginBottom: '1.25rem',
            }}>
              Let&apos;s find you{' '}
              <span style={{ color: '#1EA8D4', fontStyle: 'italic' }}>a better deal.</span>
            </h2>
            <p style={{ color: 'rgba(232,237,242,0.5)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
              Tell us what you&apos;re paying now. We&apos;ll tell you what you should be paying — and show you exactly how to get there.
            </p>

            {/* Metrics */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.75rem' }}>
              {METRICS.map((m) => (
                <div key={m.l} style={{
                  padding: '0.875rem 1.125rem',
                  background: 'rgba(30,168,212,0.06)',
                  border: '1px solid rgba(30,168,212,0.14)',
                  borderRadius: 12, minWidth: 100,
                }}>
                  <div style={{ color: '#1EA8D4', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.03em', lineHeight: 1 }}>{m.v}</div>
                  <div style={{ color: 'rgba(232,237,242,0.45)', fontSize: '0.72rem', marginTop: '0.3rem', lineHeight: 1.3 }}>{m.l}</div>
                </div>
              ))}
            </div>

            {/* Process timeline */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {STEPS.map((step, i) => (
                <div key={step.n} style={{ display: 'flex', gap: '1rem', paddingBottom: i < STEPS.length - 1 ? '1.5rem' : 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                      background: i === 0 ? '#1EA8D4' : 'rgba(30,168,212,0.1)',
                      border: i === 0 ? 'none' : '1px solid rgba(30,168,212,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: i === 0 ? '#090B10' : '#1EA8D4',
                      fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.04em',
                    }}>{step.n}</div>
                    {i < STEPS.length - 1 && (
                      <div style={{ width: 1, flex: 1, background: 'rgba(30,168,212,0.12)', minHeight: 20, marginTop: 4 }} />
                    )}
                  </div>
                  <div style={{ paddingTop: 7 }}>
                    <div style={{ color: '#E8EDF2', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.2rem' }}>{step.title}</div>
                    <div style={{ color: 'rgba(232,237,242,0.42)', fontSize: '0.8rem', lineHeight: 1.6 }}>{step.body}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: '0.625rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
              {['No commitment', 'Confidential', '100% Free'].map((badge) => (
                <span key={badge} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.35rem 0.875rem',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 999, color: 'rgba(232,237,242,0.55)',
                  fontSize: '0.75rem', fontWeight: 500,
                }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#1EA8D4" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: Form ── */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            {success ? (
              <div style={{
                background: 'rgba(61,214,140,0.05)', border: '1px solid rgba(61,214,140,0.18)',
                borderRadius: 20, padding: '4rem 2.5rem', textAlign: 'center',
              }}>
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#3DD68C" strokeWidth="1.5" style={{ margin: '0 auto 1.5rem' }}>
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <h3 style={{ fontWeight: 700, fontSize: '1.3rem', color: '#E8EDF2', marginBottom: '0.75rem' }}>Request Received</h3>
                <p style={{ color: 'rgba(232,237,242,0.5)', fontSize: '0.95rem', lineHeight: 1.8 }}>
                  Thanks, {form.name.split(' ')[0]}. We&apos;ll review your details and reach out within 1–2 business days to schedule your strategy session.
                </p>
              </div>
            ) : (
              <div style={{
                background: 'rgba(255,255,255,0.028)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20, padding: '2.5rem',
              }}>
                {contextTopic && (
                  <div style={{
                    marginBottom: '1.75rem', padding: '0.875rem 1.125rem',
                    background: 'rgba(30,168,212,0.07)', border: '1px solid rgba(30,168,212,0.22)',
                    borderRadius: 12, display: 'flex', alignItems: 'center', gap: '0.75rem',
                  }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1EA8D4" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <p style={{ color: '#E8EDF2', fontSize: '0.875rem', margin: 0 }}>
                      Interested in <strong style={{ color: '#1EA8D4' }}>{contextTopic}</strong> — let&apos;s find the right solution together.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label style={labelS}>Full Name *</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange}
                        placeholder="Jane Smith" required style={inputS} onFocus={onFocus} onBlur={onBlur} />
                    </div>
                    <div>
                      <label style={labelS}>Work Email *</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange}
                        placeholder="jane@company.com" required style={inputS} onFocus={onFocus} onBlur={onBlur} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label style={labelS}>Phone</label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                        placeholder="+1 (555) 000-0000" style={inputS} onFocus={onFocus} onBlur={onBlur} />
                    </div>
                    <div>
                      <label style={labelS}>Company</label>
                      <input type="text" name="company" value={form.company} onChange={handleChange}
                        placeholder="Acme Inc." style={inputS} onFocus={onFocus} onBlur={onBlur} />
                    </div>
                  </div>

                  <div>
                    <label style={labelS}>Monthly Processing Volume</label>
                    <div style={{ position: 'relative' }}>
                      <select name="monthly_volume" value={form.monthly_volume} onChange={handleChange}
                        style={{ ...inputS, paddingRight: '2.5rem', cursor: 'pointer', backgroundColor: '#0D1016' }}
                        onFocus={onFocus} onBlur={onBlur}>
                        {VOLUME_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value} style={{ backgroundColor: '#0D1016' }}>{o.label}</option>
                        ))}
                      </select>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(232,237,242,0.35)" strokeWidth="2.5"
                        style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <label style={labelS}>Service Interest</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {SERVICE_OPTIONS.map((opt) => (
                        <label key={opt.value} style={{
                          display: 'flex', alignItems: 'center', gap: '0.625rem',
                          padding: '0.75rem 1rem', borderRadius: 10, cursor: 'pointer',
                          border: form.service_interest === opt.value
                            ? '1px solid rgba(30,168,212,0.42)'
                            : '1px solid rgba(255,255,255,0.07)',
                          background: form.service_interest === opt.value
                            ? 'rgba(30,168,212,0.07)'
                            : 'rgba(255,255,255,0.02)',
                          transition: 'border-color 0.15s, background 0.15s',
                        }}>
                          <input type="radio" name="service_interest" value={opt.value}
                            checked={form.service_interest === opt.value}
                            onChange={handleChange}
                            style={{ accentColor: '#1EA8D4', width: 14, height: 14, flexShrink: 0 }} />
                          <span style={{
                            color: form.service_interest === opt.value ? '#E8EDF2' : 'rgba(232,237,242,0.5)',
                            fontSize: '0.825rem', fontWeight: 500, lineHeight: 1.3,
                          }}>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={labelS}>Tell Us About Your Situation</label>
                    <textarea name="message" value={form.message} onChange={handleChange}
                      placeholder="Current processor, main challenges, what you're looking to achieve..."
                      rows={4}
                      style={{ ...inputS, resize: 'vertical', minHeight: 96 }}
                      onFocus={onFocus} onBlur={onBlur} />
                  </div>

                  {error && (
                    <div style={{
                      background: 'rgba(232,80,74,0.07)', border: '1px solid rgba(232,80,74,0.22)',
                      borderRadius: 10, padding: '0.875rem 1rem', color: '#E8504A', fontSize: '0.875rem',
                    }}>
                      {error}
                    </div>
                  )}

                  <div ref={submitRef} style={{ marginTop: '0.375rem' }}>
                    <LiquidButton
                      type="submit"
                      disabled={isPending}
                      size="xxl"
                      className="w-full bg-[#1EA8D4] text-[#090B10] font-bold tracking-wide rounded-full justify-center"
                      style={{ opacity: isPending ? 0.65 : 1, cursor: isPending ? 'not-allowed' : 'pointer' }}
                    >
                      {isPending ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                            style={{ animation: 'uf-spin 1s linear infinite' }}>
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                          </svg>
                          Submitting…
                        </>
                      ) : 'Request Strategy Session →'}
                    </LiquidButton>
                  </div>

                  <p style={{ color: 'rgba(232,237,242,0.3)', fontSize: '0.73rem', textAlign: 'center', lineHeight: 1.6 }}>
                    No spam. No commitment. We&apos;ll follow up within 1–2 business days.
                  </p>
                </form>
              </div>
            )}
          </motion.div>

        </div>
      </div>
      <style>{`@keyframes uf-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </section>
  )
}
