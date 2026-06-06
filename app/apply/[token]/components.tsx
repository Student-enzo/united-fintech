'use client'

import { Upload, Shield, CheckCircle, AlertTriangle } from 'lucide-react'
import { BRAND } from '@/lib/brand'

export const CYAN = BRAND.cyan
export const CARD_BG = BRAND.card
export const BG = BRAND.bg

export const INPUT: React.CSSProperties = {
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

export const LABEL: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.16em',
  color: 'rgba(255,255,255,0.5)',
  display: 'block',
  marginBottom: 4,
}

export const SELECT: React.CSSProperties = { ...INPUT, cursor: 'pointer' }

export function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={LABEL}>{label}</label>
      {children}
    </div>
  )
}

export function TI({
  value, onChange, placeholder = '', type = 'text', maxLength,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; maxLength?: number
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      style={INPUT}
    />
  )
}

export function Toggle({ value, onChange, yesLabel = 'Yes', noLabel = 'No' }: {
  value: boolean | null; onChange: (v: boolean) => void; yesLabel?: string; noLabel?: string
}) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {[true, false].map(opt => (
        <button
          key={String(opt)}
          type="button"
          onClick={() => onChange(opt)}
          style={{
            padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            border: `1px solid ${value === opt ? BRAND.cyan : 'rgba(144,196,207,0.2)'}`,
            backgroundColor: value === opt ? 'rgba(144,196,207,0.15)' : 'rgba(255,255,255,0.04)',
            color: value === opt ? BRAND.cyan : 'rgba(255,255,255,0.5)',
          }}
        >
          {opt ? yesLabel : noLabel}
        </button>
      ))}
    </div>
  )
}

export function RadioGroup({ options, value, onChange }: {
  options: { label: string; value: string }[]; value: string; onChange: (v: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          style={{
            padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            border: `1px solid ${value === opt.value ? BRAND.cyan : 'rgba(144,196,207,0.2)'}`,
            backgroundColor: value === opt.value ? 'rgba(144,196,207,0.15)' : 'rgba(255,255,255,0.04)',
            color: value === opt.value ? BRAND.cyan : 'rgba(255,255,255,0.5)',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export interface CoOwner {
  name: string; dob: string; ssn4: string; pct: string
  address: string; city: string; state: string; zip: string
}

export function emptyCoOwner(): CoOwner {
  return { name: '', dob: '', ssn4: '', pct: '', address: '', city: '', state: '', zip: '' }
}

export interface FormData {
  businessName: string; dba: string; entityType: string; ein: string
  stateOfInc: string; yearsInBusiness: string; website: string; industry: string
  businessPhone: string; businessAddress: string; city: string; state: string; zip: string
  ownerName: string; ownerDob: string; ownerSsn4: string; ownerPct: string
  ownerAddress: string; ownerCity: string; ownerState: string; ownerZip: string; ownerPhone: string
  hasCoOwners: boolean | null; coOwners: CoOwner[]
  monthlyVolume: string; avgTicket: string; cardPresentPct: number
  hasCurrentProcessor: boolean | null; currentProcessor: string; chargebackRate: string
  wasTerminated: boolean | null; terminationExplain: string
  bankName: string; accountType: string; routingNumber: string; accountNumber: string
  agreed: boolean; signature: string
}

export const INIT: FormData = {
  businessName: '', dba: '', entityType: '', ein: '', stateOfInc: '', yearsInBusiness: '',
  website: '', industry: '', businessPhone: '', businessAddress: '', city: '', state: '', zip: '',
  ownerName: '', ownerDob: '', ownerSsn4: '', ownerPct: '', ownerAddress: '',
  ownerCity: '', ownerState: '', ownerZip: '', ownerPhone: '',
  hasCoOwners: null, coOwners: [],
  monthlyVolume: '', avgTicket: '', cardPresentPct: 50,
  hasCurrentProcessor: null, currentProcessor: '', chargebackRate: '',
  wasTerminated: null, terminationExplain: '',
  bankName: '', accountType: 'checking', routingNumber: '', accountNumber: '',
  agreed: false, signature: '',
}

export const STEP_LABELS = ['Business Info', 'Owner Info', 'Processing', 'Bank Account', 'Documents', 'Agreement']

export const DOCS = [
  { key: 'gov_id', label: 'Government-Issued Photo ID', required: true, hint: "Owner/signer driver's license or passport" },
  { key: 'bank_statements', label: '3 Months Business Bank Statements', required: true, hint: 'Last 3 months' },
  { key: 'biz_license', label: 'Business License or Articles of Incorporation', required: true, hint: '' },
  { key: 'ein_letter', label: 'EIN Verification Letter (SS-4)', required: true, hint: '' },
  { key: 'processing_statements', label: 'Processing Statements (last 3 months)', required: false, hint: 'If applicable' },
  { key: 'proof_of_address', label: 'Proof of Business Address', required: true, hint: 'Utility bill, lease, etc.' },
]

export function UploadZone({ label, required, hint, file, onFile }: {
  label: string; required: boolean; hint: string; file: File | null; onFile: (f: File) => void
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={LABEL as React.CSSProperties}>{label}</span>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: required ? BRAND.cyan : 'rgba(255,255,255,0.3)',
          border: `1px solid ${required ? 'rgba(144,196,207,0.3)' : 'rgba(255,255,255,0.15)'}`,
          borderRadius: 4, padding: '1px 5px',
        }}>
          {required ? 'Required' : 'Optional'}
        </span>
      </div>
      <label style={{
        display: 'flex', alignItems: 'center', gap: 10,
        border: `1px dashed ${file ? 'rgba(144,196,207,0.55)' : 'rgba(144,196,207,0.22)'}`,
        borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
        backgroundColor: file ? 'rgba(144,196,207,0.05)' : 'rgba(255,255,255,0.02)',
      }}>
        <input type="file" accept=".pdf,.jpg,.jpeg,.png,.heic,.doc,.docx"
          style={{ display: 'none' }} onChange={e => e.target.files?.[0] && onFile(e.target.files[0])} />
        <Upload size={15} color={file ? BRAND.cyan : 'rgba(255,255,255,0.28)'} style={{ flexShrink: 0 }} />
        <div>
          {file
            ? <span style={{ fontSize: 12, color: BRAND.cyan, fontWeight: 600 }}>{file.name}</span>
            : <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{hint || 'Click to upload (PDF, JPG, PNG, HEIC, DOC)'}</span>
          }
        </div>
      </label>
    </div>
  )
}

export function Step1({ d, s }: { d: FormData; s: (k: keyof FormData, v: unknown) => void }) {
  const einFormat = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 9)
    return digits.length > 2 ? `${digits.slice(0, 2)}-${digits.slice(2)}` : digits
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <F label="Business Legal Name *"><TI value={d.businessName} onChange={v => s('businessName', v)} placeholder="Acme Retail LLC" /></F>
        <F label="DBA / Trade Name"><TI value={d.dba} onChange={v => s('dba', v)} placeholder="Optional" /></F>
      </div>
      <F label="Entity Type *">
        <RadioGroup value={d.entityType} onChange={v => s('entityType', v)}
          options={[
            { label: 'LLC', value: 'LLC' },
            { label: 'Corporation', value: 'Corporation' },
            { label: 'Sole Proprietor', value: 'Sole Proprietor' },
            { label: 'Partnership', value: 'Partnership' },
          ]} />
      </F>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <F label="EIN *"><TI value={d.ein} onChange={v => s('ein', einFormat(v))} placeholder="XX-XXXXXXX" maxLength={10} /></F>
        <F label="State of Incorporation *"><TI value={d.stateOfInc} onChange={v => s('stateOfInc', v)} placeholder="FL" /></F>
        <F label="Years in Business *"><TI value={d.yearsInBusiness} onChange={v => s('yearsInBusiness', v)} placeholder="5" type="number" /></F>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <F label="Industry / Type of Business *"><TI value={d.industry} onChange={v => s('industry', v)} placeholder="Retail clothing" /></F>
        <F label="Business Website"><TI value={d.website} onChange={v => s('website', v)} placeholder="https://" type="url" /></F>
      </div>
      <F label="Business Phone *"><TI value={d.businessPhone} onChange={v => s('businessPhone', v)} placeholder="(305) 555-0100" type="tel" /></F>
      <F label="Business Address *"><TI value={d.businessAddress} onChange={v => s('businessAddress', v)} placeholder="Street address" /></F>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="col-span-2"><F label="City *"><TI value={d.city} onChange={v => s('city', v)} placeholder="Miami" /></F></div>
        <F label="State *"><TI value={d.state} onChange={v => s('state', v)} placeholder="FL" /></F>
        <F label="Zip *"><TI value={d.zip} onChange={v => s('zip', v)} placeholder="33101" /></F>
      </div>
    </div>
  )
}

export function Step2({ d, s }: { d: FormData; s: (k: keyof FormData, v: unknown) => void }) {
  const addCoOwner = () => s('coOwners', [...d.coOwners, emptyCoOwner()])
  const updateCoOwner = (i: number, k: keyof CoOwner, v: string) => {
    const arr = d.coOwners.map((c, idx) => idx === i ? { ...c, [k]: v } : c)
    s('coOwners', arr)
  }
  const removeCoOwner = (i: number) => s('coOwners', d.coOwners.filter((_, idx) => idx !== i))
  return (
    <div className="flex flex-col gap-4">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 10, backgroundColor: 'rgba(144,196,207,0.07)', border: '1px solid rgba(144,196,207,0.2)' }}>
        <Shield size={13} color={BRAND.cyan} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
          Owner info is required for KYC / AML compliance. Only the last 4 digits of your SSN are collected here.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <F label="Full Legal Name *"><TI value={d.ownerName} onChange={v => s('ownerName', v)} placeholder="Jane Doe" /></F>
        <F label="Date of Birth * (MM/DD/YYYY)"><TI value={d.ownerDob} onChange={v => s('ownerDob', v)} placeholder="MM/DD/YYYY" /></F>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <F label="SSN Last 4 Digits * (identity verification only)">
          <TI value={d.ownerSsn4} onChange={v => s('ownerSsn4', v.replace(/\D/g, '').slice(0, 4))} placeholder="••••" type="password" />
        </F>
        <F label="Ownership % *"><TI value={d.ownerPct} onChange={v => s('ownerPct', v)} placeholder="100" type="number" /></F>
        <F label="Personal Phone *"><TI value={d.ownerPhone} onChange={v => s('ownerPhone', v)} placeholder="(305) 555-0101" type="tel" /></F>
      </div>
      <F label="Home Address *"><TI value={d.ownerAddress} onChange={v => s('ownerAddress', v)} placeholder="Street address" /></F>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="col-span-2"><F label="City *"><TI value={d.ownerCity} onChange={v => s('ownerCity', v)} placeholder="City" /></F></div>
        <F label="State *"><TI value={d.ownerState} onChange={v => s('ownerState', v)} placeholder="FL" /></F>
        <F label="Zip *"><TI value={d.ownerZip} onChange={v => s('ownerZip', v)} placeholder="33101" /></F>
      </div>
      <div style={{ borderTop: '1px solid rgba(144,196,207,0.1)', paddingTop: 16 }}>
        <F label="Does this business have other owners with 25%+ ownership?">
          <Toggle value={d.hasCoOwners} onChange={v => { s('hasCoOwners', v); if (!v) s('coOwners', []) }} />
        </F>
      </div>
      {d.hasCoOwners && (
        <div className="flex flex-col gap-4">
          {d.coOwners.map((co, i) => (
            <div key={i} style={{ border: '1px solid rgba(144,196,207,0.15)', borderRadius: 10, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: BRAND.cyan }}>Co-Owner {i + 1}</span>
                <button type="button" onClick={() => removeCoOwner(i)} style={{ fontSize: 11, color: BRAND.danger, background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <F label="Full Legal Name *"><TI value={co.name} onChange={v => updateCoOwner(i, 'name', v)} placeholder="John Doe" /></F>
                <F label="Date of Birth (MM/DD/YYYY)"><TI value={co.dob} onChange={v => updateCoOwner(i, 'dob', v)} placeholder="MM/DD/YYYY" /></F>
                <F label="SSN Last 4"><TI value={co.ssn4} onChange={v => updateCoOwner(i, 'ssn4', v.replace(/\D/g, '').slice(0, 4))} type="password" placeholder="••••" /></F>
                <F label="Ownership %"><TI value={co.pct} onChange={v => updateCoOwner(i, 'pct', v)} type="number" placeholder="25" /></F>
              </div>
              <div style={{ marginTop: 12 }}>
                <F label="Home Address"><TI value={co.address} onChange={v => updateCoOwner(i, 'address', v)} placeholder="Street address" /></F>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                <div className="col-span-2"><F label="City"><TI value={co.city} onChange={v => updateCoOwner(i, 'city', v)} placeholder="City" /></F></div>
                <F label="State"><TI value={co.state} onChange={v => updateCoOwner(i, 'state', v)} placeholder="FL" /></F>
                <F label="Zip"><TI value={co.zip} onChange={v => updateCoOwner(i, 'zip', v)} placeholder="33101" /></F>
              </div>
            </div>
          ))}
          <button type="button" onClick={addCoOwner}
            style={{ alignSelf: 'flex-start', fontSize: 13, fontWeight: 600, color: BRAND.cyan, background: 'none', border: `1px solid rgba(144,196,207,0.3)`, borderRadius: 8, padding: '7px 16px', cursor: 'pointer' }}>
            + Add Co-Owner
          </button>
        </div>
      )}
    </div>
  )
}

export function Step3({ d, s }: { d: FormData; s: (k: keyof FormData, v: unknown) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <F label="Estimated Monthly Processing Volume *">
        <select value={d.monthlyVolume} onChange={e => s('monthlyVolume', e.target.value)} style={SELECT}>
          <option value="">Select range…</option>
          {['<$10K', '$10K-$50K', '$50K-$100K', '$100K-$500K', '$500K+'].map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </F>
      <F label="Average Transaction Size *"><TI value={d.avgTicket} onChange={v => s('avgTicket', v)} placeholder="e.g. $150" /></F>
      <div>
        <label style={LABEL}>Card-Present % (in person vs online) — {d.cardPresentPct}% in person</label>
        <input type="range" min={0} max={100} value={d.cardPresentPct}
          onChange={e => s('cardPresentPct', Number(e.target.value))}
          style={{ width: '100%', accentColor: BRAND.cyan }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
          <span>0% (all online)</span><span>100% (all in person)</span>
        </div>
      </div>
      <F label="Do you currently have a payment processor?">
        <Toggle value={d.hasCurrentProcessor} onChange={v => s('hasCurrentProcessor', v)} />
      </F>
      {d.hasCurrentProcessor && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <F label="Current Processor Name"><TI value={d.currentProcessor} onChange={v => s('currentProcessor', v)} placeholder="e.g. Square, Stripe" /></F>
          <F label="Approx. Monthly Chargeback Rate (%)"><TI value={d.chargebackRate} onChange={v => s('chargebackRate', v)} placeholder="0.1" type="number" /></F>
        </div>
      )}
      <F label="Have you ever had a merchant account terminated?">
        <Toggle value={d.wasTerminated} onChange={v => s('wasTerminated', v)} />
      </F>
      {d.wasTerminated && (
        <F label="Please explain *">
          <textarea value={d.terminationExplain} onChange={e => s('terminationExplain', e.target.value)}
            placeholder="Briefly describe what happened…" rows={3}
            style={{ ...INPUT, resize: 'vertical' }} />
        </F>
      )}
    </div>
  )
}

export function Step4({ d, s }: { d: FormData; s: (k: keyof FormData, v: unknown) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div style={{ padding: '10px 14px', borderRadius: 10, backgroundColor: 'rgba(144,196,207,0.07)', border: '1px solid rgba(144,196,207,0.2)', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
        Provide your settlement bank account details. This is where processed funds will be deposited.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <F label="Bank Name *"><TI value={d.bankName} onChange={v => s('bankName', v)} placeholder="Bank of America" /></F>
        <F label="Account Type *">
          <RadioGroup value={d.accountType} onChange={v => s('accountType', v)}
            options={[{ label: 'Checking', value: 'checking' }, { label: 'Savings', value: 'savings' }]} />
        </F>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <F label="Routing Number *"><TI value={d.routingNumber} onChange={v => s('routingNumber', v.replace(/\D/g, '').slice(0, 9))} placeholder="9 digits" /></F>
        <F label="Account Number *"><TI value={d.accountNumber} onChange={v => s('accountNumber', v.replace(/\D/g, ''))} placeholder="Account number" /></F>
      </div>
    </div>
  )
}

export function Step5({ files, setFile }: { files: Record<string, File | null>; setFile: (k: string, f: File) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div style={{ padding: '10px 14px', borderRadius: 10, backgroundColor: 'rgba(144,196,207,0.07)', border: '1px solid rgba(144,196,207,0.2)', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
        All files are encrypted. Accepted formats: PDF, JPG, PNG, HEIC, DOC, DOCX (max 10 MB each).
      </div>
      {DOCS.map(doc => (
        <UploadZone key={doc.key} label={doc.label} required={doc.required} hint={doc.hint}
          file={files[doc.key] ?? null} onFile={f => setFile(doc.key, f)} />
      ))}
    </div>
  )
}

const AGREEMENT_TEXT = `MERCHANT REPRESENTATION AGREEMENT

This Merchant Representation Agreement ("Agreement") is entered into as of [DATE] between United Fintech LLC ("United Fintech") and [BUSINESS_NAME] ("Merchant"), operated by [OWNER_NAME].

1. REPRESENTATION. United Fintech agrees to represent Merchant in securing merchant payment processing services from acquiring banks and payment processors ("Partners") in its network.

2. MERCHANT OBLIGATIONS. Merchant agrees to provide accurate and complete information, maintain compliance with payment network rules, and notify United Fintech of any material changes to their business operations.

3. CONFIDENTIALITY. Both parties agree to maintain the confidentiality of all shared business and financial information.

4. TERM. This agreement is effective upon signing and remains in effect during the active pursuit of merchant processing services.

5. NO GUARANTEE. United Fintech does not guarantee approval by any specific Partner. Approval decisions are made solely by the acquiring institution.

6. FEES. Any fees for services will be disclosed separately and agreed upon in writing before implementation.

By signing below, Merchant confirms all information provided is accurate and complete to the best of their knowledge.`

export function Step6({ d, s, ownerName, businessName }: {
  d: FormData; s: (k: keyof FormData, v: unknown) => void; ownerName: string; businessName: string
}) {
  const text = AGREEMENT_TEXT
    .replace('[DATE]', new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))
    .replace('[BUSINESS_NAME]', businessName || '[Business Name]')
    .replace('[OWNER_NAME]', ownerName || '[Owner Name]')

  const sigMatch = d.signature.trim().toLowerCase() === ownerName.trim().toLowerCase() && ownerName.trim().length > 0

  return (
    <div className="flex flex-col gap-4">
      <div style={{ height: 260, overflowY: 'auto', padding: '14px 16px', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(144,196,207,0.15)', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', whiteSpace: 'pre-line' }}>
        {text}
      </div>
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
        <input type="checkbox" checked={d.agreed} onChange={e => s('agreed', e.target.checked)}
          style={{ width: 16, height: 16, accentColor: BRAND.cyan, marginTop: 2, flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
          I have read and agree to the Merchant Representation Agreement *
        </span>
      </label>
      <F label="E-Signature — Type your full legal name to sign *">
        <TI value={d.signature} onChange={v => s('signature', v)} placeholder={ownerName || 'Your full legal name'} />
      </F>
      {d.signature.trim().length > 0 && !sigMatch && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, backgroundColor: `${BRAND.danger}14`, border: `1px solid ${BRAND.danger}40`, fontSize: 12, color: BRAND.danger }}>
          <AlertTriangle size={13} />
          <span>Signature must match your legal name: <strong>{ownerName}</strong></span>
        </div>
      )}
      {sigMatch && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, backgroundColor: `${BRAND.success}14`, border: `1px solid ${BRAND.success}40`, fontSize: 12, color: BRAND.success }}>
          <CheckCircle size={13} />
          <span>Signature verified</span>
        </div>
      )}
    </div>
  )
}

export function Gate({ icon, color, borderColor, title, body }: {
  icon: React.ReactNode; color: string; borderColor: string; title: string; body: string
}) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: BRAND.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      <div style={{ width: 68, height: 68, borderRadius: '50%', backgroundColor: color, border: `2px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        {icon}
      </div>
      <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{title}</h2>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, maxWidth: 360, lineHeight: 1.7 }}>{body}</p>
      <p style={{ marginTop: 24, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
        Email <span style={{ color: BRAND.cyan }}>apply@unitedfintech.io</span> for assistance.
      </p>
    </div>
  )
}
