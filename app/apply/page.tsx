'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CheckCircle, AlertTriangle, Loader2, Shield } from 'lucide-react'
import { BRAND } from '@/lib/brand'

const INPUT: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(144,196,207,0.22)',
  borderRadius: 10,
  color: 'rgba(255,255,255,0.9)',
  padding: '10px 14px',
  fontSize: 14,
  width: '100%',
  outline: 'none',
  boxSizing: 'border-box',
}

const LABEL: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.16em',
  color: 'rgba(255,255,255,0.5)',
  display: 'block',
  marginBottom: 4,
}

const SELECT: React.CSSProperties = { ...INPUT, cursor: 'pointer' }

function F({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={LABEL}>{label}</label>
      {children}
      {error && <p style={{ fontSize: 11, color: BRAND.danger, marginTop: 4 }}>{error}</p>}
    </div>
  )
}

function TI({ value, onChange, placeholder = '', type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={INPUT} />
  )
}

function RadioGroup({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => onChange(opt)}
          style={{
            padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            border: `1px solid ${value === opt ? BRAND.cyan : 'rgba(144,196,207,0.2)'}`,
            backgroundColor: value === opt ? 'rgba(144,196,207,0.15)' : 'rgba(255,255,255,0.04)',
            color: value === opt ? BRAND.cyan : 'rgba(255,255,255,0.5)',
          }}>
          {opt}
        </button>
      ))}
    </div>
  )
}

interface FormState {
  businessName: string; dba: string; legalStructure: string; industry: string
  accountType: string; monthlyVolume: string; avgTicket: string; cardPresentPct: number
  ownerName: string; contactEmail: string; contactPhone: string
}

const INIT: FormState = {
  businessName: '', dba: '', legalStructure: '', industry: '',
  accountType: '', monthlyVolume: '', avgTicket: '', cardPresentPct: 50,
  ownerName: '', contactEmail: '', contactPhone: '',
}

const REQUIRED_KEYS: (keyof FormState)[] = [
  'businessName', 'legalStructure', 'industry', 'accountType',
  'monthlyVolume', 'avgTicket', 'ownerName', 'contactEmail', 'contactPhone',
]

export default function MerchantApplyPage() {
  const [data, setData] = useState<FormState>(INIT)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const set = (k: keyof FormState, v: string | number) => setData(prev => ({ ...prev, [k]: v }))
  const canSubmit = REQUIRED_KEYS.every(k => String(data[k]).trim().length > 0)

  async function handleSubmit() {
    if (!canSubmit || status === 'submitting') return
    setStatus('submitting')
    setErrorMessage('')
    setFieldErrors({})
    try {
      const res = await fetch('/api/merchants/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        setFieldErrors(json.fields ?? {})
        setErrorMessage(json.error || 'Submission failed. Please try again.')
        setStatus('error')
        return
      }
      setStatus('success')
    } catch {
      setErrorMessage('Network error. Please check your connection and try again.')
      setStatus('error')
    }
  }

  if (status === 'success') return (
    <div style={{ minHeight: '100vh', backgroundColor: BRAND.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: `${BRAND.success}1f`, border: `2px solid ${BRAND.success}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <CheckCircle size={36} color={BRAND.success} />
      </div>
      <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Application Received!</h2>
      <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, maxWidth: 400, lineHeight: 1.7 }}>
        Thank you, <strong style={{ color: 'rgba(255,255,255,0.85)' }}>{data.businessName}</strong>. Your application has been submitted.
      </p>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, maxWidth: 400, lineHeight: 1.7, marginTop: 12 }}>
        A United Fintech representative will review your details and reach out within 1–2 business days with next steps.
      </p>
      <div style={{ marginTop: 28, padding: '10px 16px', borderRadius: 10, backgroundColor: 'rgba(144,196,207,0.07)', border: '1px solid rgba(144,196,207,0.2)', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
        Questions? Email <span style={{ color: BRAND.cyan }}>apply@unitedfintech.io</span>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: BRAND.bg }}>
      <div style={{ borderBottom: '1px solid rgba(144,196,207,0.1)', backgroundColor: 'rgba(0,0,0,0.3)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Image src="/logo-vertical.png" alt="United Fintech" width={120} height={36} style={{ objectFit: 'contain' }} />
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Shield size={11} color={BRAND.cyan} /> Secure Application
        </span>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '36px 16px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Merchant Application</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 6 }}>
            Tell us about your business and a representative will follow up with a custom quote.
          </p>
        </div>

        <div style={{ backgroundColor: BRAND.card, border: '1px solid rgba(144,196,207,0.15)', borderRadius: 14, padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ display: 'grid', gap: 16 }}>
            <F label="Business Legal Name *" error={fieldErrors.businessName}>
              <TI value={data.businessName} onChange={v => set('businessName', v)} placeholder="Acme Retail LLC" />
            </F>
            <F label="DBA / Trade Name">
              <TI value={data.dba} onChange={v => set('dba', v)} placeholder="Optional" />
            </F>
          </div>

          <F label="Entity Type *" error={fieldErrors.legalStructure}>
            <RadioGroup value={data.legalStructure} onChange={v => set('legalStructure', v)}
              options={['LLC', 'Corporation', 'Sole Proprietor', 'Partnership']} />
          </F>

          <F label="Industry / Type of Business *" error={fieldErrors.industry}>
            <TI value={data.industry} onChange={v => set('industry', v)} placeholder="Retail clothing" />
          </F>

          <F label="Preferred Account Type *" error={fieldErrors.accountType}>
            <RadioGroup value={data.accountType} onChange={v => set('accountType', v)}
              options={['Card Present', 'eCommerce', 'MOTO', 'ACH']} />
          </F>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <F label="Est. Monthly Volume ($) *" error={fieldErrors.monthlyVolume}>
              <TI value={data.monthlyVolume} onChange={v => set('monthlyVolume', v)} placeholder="50000" type="number" />
            </F>
            <F label="Average Ticket ($) *" error={fieldErrors.avgTicket}>
              <TI value={data.avgTicket} onChange={v => set('avgTicket', v)} placeholder="150" type="number" />
            </F>
          </div>

          <div>
            <label style={LABEL}>Card-Present % (in person vs online) — {data.cardPresentPct}% in person</label>
            <input type="range" min={0} max={100} value={data.cardPresentPct}
              onChange={e => set('cardPresentPct', Number(e.target.value))}
              style={{ width: '100%', accentColor: BRAND.cyan }} />
          </div>

          <div style={{ borderTop: '1px solid rgba(144,196,207,0.1)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <F label="Owner / Contact Full Name *" error={fieldErrors.ownerName}>
              <TI value={data.ownerName} onChange={v => set('ownerName', v)} placeholder="Jane Doe" />
            </F>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <F label="Contact Email *" error={fieldErrors.contactEmail}>
                <TI value={data.contactEmail} onChange={v => set('contactEmail', v)} placeholder="jane@acme.com" type="email" />
              </F>
              <F label="Contact Phone *" error={fieldErrors.contactPhone}>
                <TI value={data.contactPhone} onChange={v => set('contactPhone', v)} placeholder="(305) 555-0100" type="tel" />
              </F>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <button type="button" onClick={handleSubmit} disabled={!canSubmit || status === 'submitting'}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 28px', borderRadius: 9, fontSize: 13, fontWeight: 700,
              cursor: (canSubmit && status !== 'submitting') ? 'pointer' : 'not-allowed',
              backgroundColor: BRAND.cyanDeep, color: '#fff', opacity: (canSubmit && status !== 'submitting') ? 1 : 0.5,
              boxShadow: canSubmit ? `0 0 20px ${BRAND.cyanDeep}4d` : 'none',
            }}>
            {status === 'submitting' ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Submitting…</> : 'Submit Application →'}
          </button>
        </div>

        {status === 'error' && (
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 9, backgroundColor: `${BRAND.danger}14`, border: `1px solid ${BRAND.danger}40`, fontSize: 12, color: BRAND.danger, textAlign: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={13} />
            <span>{errorMessage}</span>
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 28 }}>
          Your information is encrypted and protected. United Fintech will never sell your data.
        </p>
      </div>
    </div>
  )
}
