'use client'

import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { submitConsultation } from '@/app/actions/consultation'
import type { ConsultationFormData } from '@/app/actions/consultation'
import { LiquidButton } from '@/components/ui/liquid-glass-button'

const VOLUME_OPTIONS = [
  { value: '', label: 'Select monthly volume' },
  { value: 'under_50k', label: 'Under $50K / month' },
  { value: '50k_250k', label: '$50K – $250K / month' },
  { value: '250k_1m', label: '$250K – $1M / month' },
  { value: '1m_5m', label: '$1M – $5M / month' },
  { value: 'over_5m', label: 'Over $5M / month' },
]

const SERVICE_OPTIONS = [
  { value: 'merchant_processing', label: 'Merchant Processing Solutions' },
  { value: 'embedded_finance', label: 'Embedded Finance' },
  { value: 'risk_mitigation', label: 'Risk Mitigation Strategy' },
  { value: 'all', label: 'All / Not Sure Yet' },
] as const

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.875rem 1rem',
  backgroundColor: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, color: '#E8EDF2',
  fontSize: '0.9rem', outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  appearance: 'none',
  WebkitAppearance: 'none',
}

export default function BookCall() {
  const [form, setForm] = useState<ConsultationFormData>({
    name: '', email: '', phone: '', company: '',
    monthly_volume: '', service_interest: 'all', message: '',
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
      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error ?? 'An error occurred. Please try again.')
      }
    })
  }

  const focusStyle = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = 'rgba(43,184,230,0.5)'
      e.currentTarget.style.boxShadow = '0 0 0 2px rgba(43,184,230,0.15)'
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
      e.currentTarget.style.boxShadow = 'none'
    },
  }

  return (
    <section
      id="consultation"
      className="photo-hero"
      style={{
        backgroundImage: "url('https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1600')",
        padding: '6rem 1.5rem',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,12,18,0.88) 0%, rgba(10,12,18,0.92) 100%)' }} />
      <div className="max-w-3xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: '#2BB8E6', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Get Started
            </p>
            <h2 style={{
              fontWeight: 900,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: '#E8EDF2',
              marginBottom: '1rem',
            }}>
              Book a{' '}
              <span style={{ color: '#2BB8E6', fontStyle: 'italic' }}>consultation.</span>
            </h2>
            <p style={{ color: '#7E8794', fontSize: '1rem', lineHeight: 1.75, maxWidth: 480, margin: '0 auto' }}>
              Tell us about your business and processing needs. We'll review your situation and schedule a strategy session — no commitment required.
            </p>
          </div>

          {/* Success state */}
          {success ? (
            <div style={{
              backgroundColor: 'rgba(61,214,140,0.08)', border: '1px solid rgba(61,214,140,0.25)',
              borderRadius: 16, padding: '3rem', textAlign: 'center',
            }}>
              <div style={{ color: '#3DD68C', fontSize: '2rem', marginBottom: '1rem' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3DD68C" strokeWidth="1.5" style={{ margin: '0 auto' }}>
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '1.25rem', color: '#E8EDF2', marginBottom: '0.75rem' }}>
                Request Received
              </h3>
              <p style={{ color: '#7E8794', fontSize: '0.95rem', lineHeight: 1.75, maxWidth: 360, margin: '0 auto' }}>
                Thank you, {form.name.split(' ')[0]}. We'll review your submission and reach out within 1–2 business days to schedule your strategy session.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}
              className="uf-card"
              style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>

              {/* Name + Email */}
              <div style={{ display: 'grid', gap: '1rem' }} className="grid grid-cols-1 sm:grid-cols-2">
                <div>
                  <label style={{ display: 'block', color: '#7E8794', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Full Name *
                  </label>
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="Jane Smith" required style={inputStyle} {...focusStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#7E8794', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Email Address *
                  </label>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="jane@company.com" required style={inputStyle} {...focusStyle} />
                </div>
              </div>

              {/* Phone + Company */}
              <div style={{ display: 'grid', gap: '1rem' }} className="grid grid-cols-1 sm:grid-cols-2">
                <div>
                  <label style={{ display: 'block', color: '#7E8794', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Phone
                  </label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+1 (555) 000-0000" style={inputStyle} {...focusStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#7E8794', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Company
                  </label>
                  <input type="text" name="company" value={form.company} onChange={handleChange}
                    placeholder="Acme eCommerce Inc." style={inputStyle} {...focusStyle} />
                </div>
              </div>

              {/* Monthly Volume */}
              <div>
                <label style={{ display: 'block', color: '#7E8794', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Monthly Processing Volume
                </label>
                <div style={{ position: 'relative' }}>
                  <select name="monthly_volume" value={form.monthly_volume} onChange={handleChange}
                    style={{ ...inputStyle, paddingRight: '2.5rem', cursor: 'pointer', backgroundColor: '#141821' }}
                    {...focusStyle}>
                    {VOLUME_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value} style={{ backgroundColor: '#141821' }}>{o.label}</option>
                    ))}
                  </select>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7E8794" strokeWidth="2"
                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>

              {/* Service Interest */}
              <div>
                <label style={{ display: 'block', color: '#7E8794', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Service Interest
                </label>
                <div style={{ display: 'grid', gap: '0.5rem' }} className="grid grid-cols-1 sm:grid-cols-2">
                  {SERVICE_OPTIONS.map((opt) => (
                    <label key={opt.value} style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.75rem 1rem', borderRadius: 10, cursor: 'pointer',
                      border: form.service_interest === opt.value ? '1px solid rgba(43,184,230,0.4)' : '1px solid rgba(255,255,255,0.08)',
                      backgroundColor: form.service_interest === opt.value ? 'rgba(43,184,230,0.06)' : 'rgba(255,255,255,0.02)',
                      transition: 'border-color 0.2s, background-color 0.2s',
                    }}>
                      <input type="radio" name="service_interest" value={opt.value}
                        checked={form.service_interest === opt.value}
                        onChange={handleChange}
                        style={{ accentColor: '#2BB8E6', width: 16, height: 16 }} />
                      <span style={{ color: form.service_interest === opt.value ? '#E8EDF2' : '#7E8794', fontSize: '0.875rem', fontWeight: 500 }}>
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={{ display: 'block', color: '#7E8794', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Tell Us About Your Situation
                </label>
                <textarea name="message" value={form.message} onChange={handleChange}
                  placeholder="Describe your business, current processing challenges, or what you're looking to achieve..."
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
                  {...focusStyle} />
              </div>

              {/* Error */}
              {error && (
                <div style={{ backgroundColor: 'rgba(232,80,74,0.1)', border: '1px solid rgba(232,80,74,0.3)', borderRadius: 10, padding: '0.875rem 1rem', color: '#E8504A', fontSize: '0.875rem' }}>
                  {error}
                </div>
              )}

              {/* Submit */}
              <LiquidButton
                type="submit"
                disabled={isPending}
                size="xxl"
                className="w-full bg-[#2BB8E6] text-[#0A0C12] font-bold tracking-wide rounded-full justify-center"
                style={{ opacity: isPending ? 0.7 : 1, cursor: isPending ? 'not-allowed' : 'pointer' }}
              >
                {isPending ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Submitting…
                  </>
                ) : (
                  <>
                    Request Strategy Session →
                  </>
                )}
              </LiquidButton>

              <p style={{ color: '#7E8794', fontSize: '0.78rem', textAlign: 'center', lineHeight: 1.6 }}>
                No spam. No commitment. We'll review your situation and follow up within 1–2 business days.
              </p>
            </form>
          )}
        </motion.div>
      </div>

      <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="pexels-credit">Photo via Pexels</a>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </section>
  )
}
