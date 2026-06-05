'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Building2,
  User,
  CreditCard,
  FileUp,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Upload,
  Shield,
  Globe,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type LegalStructure = 'sole_proprietor' | 'llc' | 'corporation' | 'partnership' | ''

interface ClientForm {
  // Step 1 — Business Info
  businessName: string
  dba: string
  legalStructure: LegalStructure
  mcc: string
  website: string
  businessAddress: string
  city: string
  state: string
  zip: string
  phone: string
  // Step 2 — Owner Info
  ownerName: string
  ownerSSNLast4: string
  ownerDOB: string
  ownershipPercent: string
  ownerAddress: string
  ownerCity: string
  ownerState: string
  ownerZip: string
  // Step 3 — Processing History
  currentProcessor: string
  monthlyVolume: string
  avgTicket: string
  cardPresentPercent: string
  chargebackRate: string
  chargebackHistory: string
  // Step 4 — Documents
  businessLicense: File | null
  voidedCheck: File | null
  ownerID: File | null
  statements: File[]
  pciSAQ: File | null
}

const INITIAL: ClientForm = {
  businessName: '', dba: '', legalStructure: '', mcc: '', website: '', businessAddress: '',
  city: '', state: '', zip: '', phone: '',
  ownerName: '', ownerSSNLast4: '', ownerDOB: '', ownershipPercent: '',
  ownerAddress: '', ownerCity: '', ownerState: '', ownerZip: '',
  currentProcessor: '', monthlyVolume: '', avgTicket: '', cardPresentPercent: '',
  chargebackRate: '', chargebackHistory: 'none',
  businessLicense: null, voidedCheck: null, ownerID: null, statements: [], pciSAQ: null,
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const INPUT: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(144,196,207,0.22)',
  borderRadius: 10,
  color: 'rgba(255,255,255,0.9)',
  padding: '10px 14px',
  fontSize: 14,
  width: '100%',
  outline: 'none',
}

const LABEL: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'rgba(255,255,255,0.45)',
  display: 'block',
  marginBottom: 7,
}

const SELECT: React.CSSProperties = { ...INPUT, cursor: 'pointer' }

const CARD: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(144,196,207,0.15)',
  borderRadius: 16,
  padding: '28px 32px',
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={LABEL}>{label}</label>
      {children}
    </div>
  )
}

function TextInput({
  value, onChange, placeholder = '', type = 'text',
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={INPUT}
    />
  )
}

function FileZone({
  label, file, onFile, accept = '*', hint,
}: {
  label: string; file: File | null; onFile: (f: File) => void; accept?: string; hint?: string
}) {
  return (
    <div>
      <label style={LABEL}>{label}</label>
      <label
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 8,
          border: `1px dashed ${file ? 'rgba(144,196,207,0.55)' : 'rgba(144,196,207,0.22)'}`,
          borderRadius: 12, padding: '22px 16px', cursor: 'pointer',
          backgroundColor: file ? 'rgba(144,196,207,0.05)' : 'rgba(255,255,255,0.02)',
          transition: 'all 0.15s',
        }}
      >
        <input type="file" accept={accept} style={{ display: 'none' }}
          onChange={e => e.target.files?.[0] && onFile(e.target.files[0])} />
        <Upload size={18} color={file ? '#90c4cf' : 'rgba(255,255,255,0.28)'} />
        {file
          ? <span style={{ fontSize: 12, color: '#90c4cf', fontWeight: 700 }}>{file.name}</span>
          : <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{hint ?? 'Click to upload'}</span>
        }
      </label>
    </div>
  )
}

// ─── Steps ────────────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Business Info',      icon: Building2 },
  { label: 'Owner Info',         icon: User      },
  { label: 'Processing History', icon: CreditCard },
  { label: 'Documents',          icon: FileUp    },
]

// ─── Step components ──────────────────────────────────────────────────────────

function Step1({ data, set }: { data: ClientForm; set: (k: keyof ClientForm, v: string) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Legal Business Name *">
          <TextInput value={data.businessName} onChange={v => set('businessName', v)} placeholder="Acme Retail LLC" />
        </Field>
        <Field label="DBA (if different)">
          <TextInput value={data.dba} onChange={v => set('dba', v)} placeholder="Trade name (optional)" />
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Field label="Legal Structure *">
          <select value={data.legalStructure} onChange={e => set('legalStructure', e.target.value)} style={SELECT}>
            <option value="">Select…</option>
            <option value="sole_proprietor">Sole Proprietor</option>
            <option value="llc">LLC</option>
            <option value="corporation">Corporation</option>
            <option value="partnership">Partnership</option>
          </select>
        </Field>
        <Field label="MCC Code *">
          <TextInput value={data.mcc} onChange={v => set('mcc', v)} placeholder="e.g. 5411" />
        </Field>
        <Field label="Business Phone *">
          <TextInput value={data.phone} onChange={v => set('phone', v)} placeholder="(305) 555-0100" type="tel" />
        </Field>
      </div>
      <Field label="Business Website">
        <TextInput value={data.website} onChange={v => set('website', v)} placeholder="https://" type="url" />
      </Field>
      <Field label="Business Address *">
        <TextInput value={data.businessAddress} onChange={v => set('businessAddress', v)} placeholder="Street address" />
      </Field>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <div className="col-span-2">
          <Field label="City *">
            <TextInput value={data.city} onChange={v => set('city', v)} placeholder="Miami" />
          </Field>
        </div>
        <Field label="State *">
          <TextInput value={data.state} onChange={v => set('state', v)} placeholder="FL" />
        </Field>
        <Field label="ZIP *">
          <TextInput value={data.zip} onChange={v => set('zip', v)} placeholder="33101" />
        </Field>
      </div>
    </div>
  )
}

function Step2({ data, set }: { data: ClientForm; set: (k: keyof ClientForm, v: string) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
        style={{ backgroundColor: 'rgba(144,196,207,0.07)', border: '1px solid rgba(144,196,207,0.2)' }}>
        <Shield size={14} style={{ color: '#90c4cf', flexShrink: 0, marginTop: 2 }} />
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Owner information is required for KYC / AML compliance. We collect SSN last 4 only — your full SSN is never stored here.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Principal Owner Full Name *">
          <TextInput value={data.ownerName} onChange={v => set('ownerName', v)} placeholder="Jane Doe" />
        </Field>
        <Field label="SSN Last 4 Digits *">
          <TextInput value={data.ownerSSNLast4}
            onChange={v => set('ownerSSNLast4', v.replace(/\D/g, '').slice(0, 4))}
            placeholder="••••" type="password" />
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Date of Birth *">
          <TextInput value={data.ownerDOB} onChange={v => set('ownerDOB', v)} type="date" />
        </Field>
        <Field label="Ownership % *">
          <TextInput value={data.ownershipPercent} onChange={v => set('ownershipPercent', v)} placeholder="100" type="number" />
        </Field>
      </div>
      <Field label="Home Address *">
        <TextInput value={data.ownerAddress} onChange={v => set('ownerAddress', v)} placeholder="Street address" />
      </Field>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <div className="col-span-2">
          <Field label="City *">
            <TextInput value={data.ownerCity} onChange={v => set('ownerCity', v)} placeholder="City" />
          </Field>
        </div>
        <Field label="State *">
          <TextInput value={data.ownerState} onChange={v => set('ownerState', v)} placeholder="FL" />
        </Field>
        <Field label="ZIP *">
          <TextInput value={data.ownerZip} onChange={v => set('ownerZip', v)} placeholder="33101" />
        </Field>
      </div>
    </div>
  )
}

function Step3({ data, set }: { data: ClientForm; set: (k: keyof ClientForm, v: string) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Current Processor (if any)">
          <TextInput value={data.currentProcessor} onChange={v => set('currentProcessor', v)} placeholder="e.g. Square, Stripe, none" />
        </Field>
        <Field label="Monthly Processing Volume ($) *">
          <TextInput value={data.monthlyVolume} onChange={v => set('monthlyVolume', v)} placeholder="50000" type="number" />
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Field label="Average Ticket ($) *">
          <TextInput value={data.avgTicket} onChange={v => set('avgTicket', v)} placeholder="85" type="number" />
        </Field>
        <Field label="Card-Present % *">
          <TextInput value={data.cardPresentPercent} onChange={v => set('cardPresentPercent', v)} placeholder="75" type="number" />
        </Field>
        <Field label="Chargeback Rate (%) *">
          <TextInput value={data.chargebackRate} onChange={v => set('chargebackRate', v)} placeholder="0.1" type="number" />
        </Field>
      </div>
      <Field label="Chargeback / Dispute History">
        <select value={data.chargebackHistory} onChange={e => set('chargebackHistory', e.target.value)} style={SELECT}>
          <option value="none">None — clean history</option>
          <option value="minimal">Minimal — &lt; 0.5%</option>
          <option value="moderate">Moderate — 0.5%–1%</option>
          <option value="elevated">Elevated — &gt; 1%</option>
          <option value="terminated">Previously terminated</option>
        </select>
      </Field>
      {data.chargebackHistory !== 'none' && data.chargebackHistory !== '' && (
        <div className="px-4 py-3 rounded-xl"
          style={{ backgroundColor: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.2)' }}>
          <p className="text-xs font-semibold" style={{ color: '#FCD34D' }}>
            Elevated chargeback history may require additional review and could affect approval.
          </p>
        </div>
      )}
    </div>
  )
}

function Step4({
  data,
  setFile,
  setStatements,
}: {
  data: ClientForm
  setFile: (k: keyof ClientForm, f: File) => void
  setStatements: (files: File[]) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
        style={{ backgroundColor: 'rgba(144,196,207,0.07)', border: '1px solid rgba(144,196,207,0.2)' }}>
        <span style={{ color: '#90c4cf', fontSize: 15, flexShrink: 0 }}>📎</span>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Upload required documents. Accepted: PDF, JPG, PNG (max 10 MB each). All files are encrypted at rest.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FileZone
          label="Business License / Articles *"
          file={data.businessLicense}
          onFile={f => setFile('businessLicense', f)}
          accept=".pdf,.jpg,.jpeg,.png"
          hint="Business license or articles of incorporation"
        />
        <FileZone
          label="Voided Check *"
          file={data.voidedCheck}
          onFile={f => setFile('voidedCheck', f)}
          accept=".pdf,.jpg,.jpeg,.png"
          hint="Bank account verification"
        />
        <FileZone
          label="Owner Government ID *"
          file={data.ownerID}
          onFile={f => setFile('ownerID', f)}
          accept=".pdf,.jpg,.jpeg,.png"
          hint="Driver's license or passport"
        />
        <FileZone
          label="PCI SAQ (if available)"
          file={data.pciSAQ}
          onFile={f => setFile('pciSAQ', f)}
          accept=".pdf"
          hint="PCI DSS Self-Assessment Questionnaire"
        />
      </div>
      <div>
        <label style={LABEL}>3 Months Processing Statements *</label>
        <label style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 8,
          border: `1px dashed ${data.statements.length > 0 ? 'rgba(144,196,207,0.55)' : 'rgba(144,196,207,0.22)'}`,
          borderRadius: 12, padding: '24px 16px', cursor: 'pointer',
          backgroundColor: data.statements.length > 0 ? 'rgba(144,196,207,0.05)' : 'rgba(255,255,255,0.02)',
        }}>
          <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }}
            onChange={e => {
              const files = Array.from(e.target.files ?? [])
              setStatements([...data.statements, ...files])
            }} />
          <Upload size={18} color={data.statements.length > 0 ? '#90c4cf' : 'rgba(255,255,255,0.25)'} />
          {data.statements.length === 0
            ? <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Select up to 3 statement files</span>
            : <div className="flex flex-col items-center gap-1">
                {data.statements.map((f, i) => (
                  <span key={i} style={{ fontSize: 12, color: '#90c4cf', fontWeight: 700 }}>{f.name}</span>
                ))}
              </div>
          }
        </label>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ClientApplyPage() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<ClientForm>(INITIAL)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function setField(k: keyof ClientForm, v: string) {
    setData(prev => ({ ...prev, [k]: v }))
  }
  function setFile(k: keyof ClientForm, f: File) {
    setData(prev => ({ ...prev, [k]: f }))
  }
  function setStatements(files: File[]) {
    setData(prev => ({ ...prev, statements: files }))
  }

  function validateStep(): boolean {
    if (step === 0) return !!(data.businessName && data.legalStructure && data.mcc && data.phone)
    if (step === 1) return !!(data.ownerName && data.ownerSSNLast4 && data.ownerDOB && data.ownershipPercent)
    if (step === 2) return !!(data.monthlyVolume && data.avgTicket && data.cardPresentPercent)
    if (step === 3) return !!(data.businessLicense && data.voidedCheck && data.ownerID && data.statements.length > 0)
    return true
  }

  async function handleSubmit() {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1400))
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
        style={{ background: 'linear-gradient(160deg, #0A0C12 0%, #0D1421 100%)' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: 'rgba(74,155,127,0.14)', border: '2px solid rgba(74,155,127,0.4)' }}>
          <CheckCircle size={36} color="#6EE7B7" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Application Submitted!</h2>
        <p className="text-sm max-w-sm" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
          Thank you, <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{data.businessName}</strong>. Your application has been received and is under review.
          A member of the United Fintech team will be in touch within 1–2 business days.
        </p>
        <div className="mt-8 px-4 py-3 rounded-xl text-xs"
          style={{ backgroundColor: 'rgba(144,196,207,0.07)', border: '1px solid rgba(144,196,207,0.18)', color: 'rgba(255,255,255,0.4)' }}>
          Questions? Email <span style={{ color: '#90c4cf' }}>apply@unitedfintech.io</span>
        </div>
      </div>
    )
  }

  const valid = validateStep()

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #0A0C12 0%, #0D1421 100%)' }}>
      {/* Top bar */}
      <div className="border-b px-6 py-4 flex items-center justify-between"
        style={{ borderColor: 'rgba(144,196,207,0.1)', backgroundColor: 'rgba(0,0,0,0.3)' }}>
        <Image src="/logo.png" alt="United Fintech" width={160} height={40} className="object-contain" />
        <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <Globe size={12} />
          <span>Secure Application Portal</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Intro */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Merchant Application</h1>
          <p className="text-sm mt-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Complete the form below to start your merchant account application.
            Takes about 5 minutes.
          </p>
        </div>

        {/* Step progress */}
        <div className="mb-8">
          <div className="flex items-center gap-0 overflow-x-auto pb-2 justify-center">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const done = i < step
              const active = i === step
              return (
                <div key={i} className="flex items-center">
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap"
                    style={
                      active
                        ? { backgroundColor: 'rgba(144,196,207,0.12)', color: '#90c4cf', border: '1px solid rgba(144,196,207,0.35)' }
                        : done
                          ? { color: 'rgba(110,231,183,0.8)' }
                          : { color: 'rgba(255,255,255,0.25)' }
                    }
                  >
                    {done ? <CheckCircle size={12} color="#6EE7B7" /> : <Icon size={12} />}
                    {s.label}
                  </div>
                  {i < STEPS.length - 1 && (
                    <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
                  )}
                </div>
              )
            })}
          </div>
          <div className="h-1 rounded-full mt-3 mx-auto max-w-sm" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-1 rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%`, backgroundColor: '#90c4cf' }}
            />
          </div>
        </div>

        {/* Card */}
        <div style={CARD}>
          <h2 className="text-base font-bold text-white mb-1">{STEPS[step].label}</h2>
          <p className="text-xs mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {step === 0 && "Tell us about your business."}
            {step === 1 && "Owner information for compliance verification."}
            {step === 2 && "Your current processing details help us find the best solution."}
            {step === 3 && "Upload the required compliance documents."}
          </p>

          {step === 0 && <Step1 data={data} set={setField} />}
          {step === 1 && <Step2 data={data} set={setField} />}
          {step === 2 && <Step3 data={data} set={setField} />}
          {step === 3 && <Step4 data={data} setFile={setFile} setStatements={setStatements} />}
        </div>

        {/* Nav */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
            style={step === 0
              ? { opacity: 0.3, cursor: 'not-allowed', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }
              : { color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.04)' }
            }
          >
            <ChevronLeft size={15} /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep(s => s + 1)}
              disabled={!valid}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={!valid
                ? { opacity: 0.4, cursor: 'not-allowed', backgroundColor: '#90c4cf', color: '#1c1c1c' }
                : { backgroundColor: '#90c4cf', color: '#1c1c1c' }
              }
            >
              Continue <ChevronRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !valid}
              className="flex items-center gap-2 px-7 py-2.5 rounded-lg text-sm font-bold transition-all"
              style={{ backgroundColor: submitting ? 'rgba(74,155,127,0.5)' : '#4A9B7F', color: '#ffffff' }}
            >
              {submitting ? 'Submitting…' : 'Submit Application →'}
            </button>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs mt-8" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Your information is encrypted and protected. United Fintech will never sell your data.
        </p>
      </div>
    </div>
  )
}
