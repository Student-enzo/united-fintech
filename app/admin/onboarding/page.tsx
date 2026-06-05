'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Building2,
  User,
  CreditCard,
  Settings,
  FileUp,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Upload,
  Link2,
  Copy,
  Check,
  Clock,
  ExternalLink,
  UserPlus,
  ClipboardEdit,
} from 'lucide-react'

// ─── Mock pending client applications ─────────────────────────────────────────

const MOCK_PENDING = [
  {
    id: 'app_001',
    businessName: 'Sunset Spirits LLC',
    submittedAt: '2026-06-04T14:32:00',
    step: 'Documents uploaded',
    status: 'complete',
  },
  {
    id: 'app_002',
    businessName: 'Harbour Beauty Bar',
    submittedAt: '2026-06-03T10:15:00',
    step: 'Awaiting documents',
    status: 'partial',
  },
  {
    id: 'app_003',
    businessName: 'Atlantic Logistics Co.',
    submittedAt: '2026-06-02T09:00:00',
    step: 'Link not yet opened',
    status: 'pending',
  },
]

// ─── Link Generator ───────────────────────────────────────────────────────────

function ClientLinkGenerator() {
  const [businessName, setBusinessName] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  function generate() {
    const rand = Math.random().toString(36).slice(2, 10)
    setToken(rand)
    setCopied(false)
  }

  const url = token
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://unitedfintech.io'}/apply/${token}`
    : null

  function copyLink() {
    if (!url) return
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  const statusColor: Record<string, string> = {
    complete: '#6EE7B7',
    partial:  '#FCD34D',
    pending:  'rgba(255,255,255,0.35)',
  }
  const statusBg: Record<string, string> = {
    complete: 'rgba(110,231,183,0.1)',
    partial:  'rgba(251,191,36,0.1)',
    pending:  'rgba(255,255,255,0.05)',
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Generator card */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: '#1c1c1c', border: '1px solid rgba(144,196,207,0.15)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(144,196,207,0.12)' }}>
            <Link2 size={15} style={{ color: '#90c4cf' }} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Send Client Link</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Client fills out their own info — you just review & add rates
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            placeholder="Client business name (optional)"
            className="flex-1 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(144,196,207,0.2)',
              color: 'rgba(255,255,255,0.85)',
            }}
          />
          <button
            onClick={generate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-opacity hover:opacity-85"
            style={{ backgroundColor: '#90c4cf', color: '#111' }}
          >
            <Link2 size={14} /> Generate Link
          </button>
        </div>

        {url && (
          <div className="mt-4 flex flex-col gap-3">
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ backgroundColor: 'rgba(144,196,207,0.07)', border: '1px solid rgba(144,196,207,0.2)' }}
            >
              <span className="text-xs flex-1 font-mono truncate" style={{ color: '#90c4cf' }}>{url}</span>
              <button
                onClick={copyLink}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={copied
                  ? { backgroundColor: 'rgba(110,231,183,0.15)', color: '#6EE7B7', border: '1px solid rgba(110,231,183,0.3)' }
                  : { backgroundColor: 'rgba(144,196,207,0.12)', color: '#90c4cf', border: '1px solid rgba(144,196,207,0.25)' }
                }
              >
                {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
              </button>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <ExternalLink size={12} /> Preview
              </a>
            </div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Share this link with your client. They'll fill out business info, owner details, processing history, and upload documents.
              You'll review and set rates once they submit.
            </p>
          </div>
        )}
      </div>

      {/* Pending applications */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Pending Client Applications
        </p>
        <div className="flex flex-col gap-2">
          {MOCK_PENDING.map(app => (
            <div
              key={app.id}
              className="flex items-center gap-4 px-5 py-4 rounded-xl"
              style={{ backgroundColor: '#1c1c1c', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: statusBg[app.status] }}>
                {app.status === 'complete'
                  ? <CheckCircle size={14} style={{ color: statusColor[app.status] }} />
                  : <Clock size={14} style={{ color: statusColor[app.status] }} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {app.businessName}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {app.step} · {new Date(app.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              {app.status === 'complete' && (
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
                  style={{ backgroundColor: 'rgba(110,231,183,0.12)', color: '#6EE7B7', border: '1px solid rgba(110,231,183,0.25)' }}
                >
                  Review & Set Rates →
                </button>
              )}
              {app.status === 'partial' && (
                <span className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{ backgroundColor: 'rgba(251,191,36,0.1)', color: '#FCD34D', border: '1px solid rgba(251,191,36,0.2)' }}>
                  In Progress
                </span>
              )}
              {app.status === 'pending' && (
                <span className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  Not Opened
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

type LegalStructure = 'sole_proprietor' | 'llc' | 'corporation' | 'partnership' | ''
type AccountType = 'card_present' | 'ecommerce' | 'moto' | 'ach' | ''
type RateModel = 'interchange_plus' | 'flat_rate' | 'tiered' | ''

interface FormData {
  // Step 1: Business Info
  businessName: string
  dba: string
  legalStructure: LegalStructure
  mcc: string
  website: string
  businessAddress: string
  city: string
  state: string
  zip: string
  // Step 2: Owner Info
  ownerName: string
  ownerSSNLast4: string
  ownerDOB: string
  ownershipPercent: string
  ownerAddress: string
  ownerCity: string
  ownerState: string
  ownerZip: string
  // Step 3: Processing History
  currentProcessor: string
  monthlyVolume: string
  avgTicket: string
  cardPresentPercent: string
  chargebackRate: string
  chargebackHistory: string
  // Step 4: Account Type & Rate
  accountType: AccountType
  rateModel: RateModel
  proposedRate: string
  proposedTransFee: string
  // Step 5: Documents
  businessLicense: File | null
  voidedCheck: File | null
  ownerID: File | null
  statements: File[]
  pciSAQ: File | null
}

const INITIAL: FormData = {
  businessName: '', dba: '', legalStructure: '', mcc: '', website: '',
  businessAddress: '', city: '', state: '', zip: '',
  ownerName: '', ownerSSNLast4: '', ownerDOB: '', ownershipPercent: '',
  ownerAddress: '', ownerCity: '', ownerState: '', ownerZip: '',
  currentProcessor: '', monthlyVolume: '', avgTicket: '', cardPresentPercent: '',
  chargebackRate: '', chargebackHistory: 'none',
  accountType: '', rateModel: '', proposedRate: '', proposedTransFee: '',
  businessLicense: null, voidedCheck: null, ownerID: null, statements: [], pciSAQ: null,
}

// ─── Shared styles ─────────────────────────────────────────────────────────────

const CARD_STYLE: React.CSSProperties = {
  backgroundColor: '#282626',
  border: '1px solid rgba(144,196,207,0.13)',
  borderRadius: 16,
  padding: '28px 32px',
}

const INPUT_STYLE: React.CSSProperties = {
  backgroundColor: '#1c1c1c',
  border: '1px solid rgba(144,196,207,0.18)',
  borderRadius: 8,
  color: 'rgba(255,255,255,0.85)',
  padding: '9px 12px',
  fontSize: 13,
  width: '100%',
  outline: 'none',
}

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'rgba(255,255,255,0.45)',
  display: 'block',
  marginBottom: 6,
}

const SELECT_STYLE: React.CSSProperties = { ...INPUT_STYLE, appearance: 'none' }

// ─── Sub-components ────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={LABEL_STYLE}>{label}</label>
      {children}
    </div>
  )
}

function TextInput({
  value,
  onChange,
  placeholder = '',
  type = 'text',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={INPUT_STYLE}
    />
  )
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder: string
}) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={SELECT_STYLE}
      >
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

function FileDropZone({
  label,
  file,
  onFile,
  accept = '*',
  hint,
}: {
  label: string
  file: File | null
  onFile: (f: File) => void
  accept?: string
  hint?: string
}) {
  return (
    <div>
      <label style={LABEL_STYLE}>{label}</label>
      <label
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          border: `1px dashed ${file ? 'rgba(144,196,207,0.5)' : 'rgba(144,196,207,0.2)'}`,
          borderRadius: 10,
          padding: '20px 16px',
          cursor: 'pointer',
          backgroundColor: file ? 'rgba(144,196,207,0.04)' : 'rgba(255,255,255,0.02)',
          transition: 'all 0.15s',
        }}
      >
        <input
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={e => e.target.files?.[0] && onFile(e.target.files[0])}
        />
        <Upload size={18} color={file ? '#90c4cf' : 'rgba(255,255,255,0.25)'} />
        {file ? (
          <span style={{ fontSize: 12, color: '#90c4cf', fontWeight: 600 }}>{file.name}</span>
        ) : (
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            {hint ?? 'Click to upload'}
          </span>
        )}
      </label>
    </div>
  )
}

// ─── Steps ────────────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Business Info',         icon: Building2 },
  { label: 'Owner Info',            icon: User },
  { label: 'Processing History',    icon: CreditCard },
  { label: 'Account & Rate',        icon: Settings },
  { label: 'Documents',             icon: FileUp },
  { label: 'Review & Submit',       icon: CheckCircle },
]

// ─── Step 1 ───────────────────────────────────────────────────────────────────

function Step1({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  const legalOptions = [
    { value: 'sole_proprietor', label: 'Sole Proprietor' },
    { value: 'llc', label: 'LLC' },
    { value: 'corporation', label: 'Corporation' },
    { value: 'partnership', label: 'Partnership' },
  ]
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Legal Business Name *">
          <TextInput value={data.businessName} onChange={v => set('businessName', v)} placeholder="Acme Retail LLC" />
        </Field>
        <Field label="DBA (Doing Business As)">
          <TextInput value={data.dba} onChange={v => set('dba', v)} placeholder="Optional trade name" />
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Field label="Legal Structure *">
          <SelectInput value={data.legalStructure} onChange={v => set('legalStructure', v)} options={legalOptions} placeholder="Select structure" />
        </Field>
        <Field label="MCC (Merchant Category Code) *">
          <TextInput value={data.mcc} onChange={v => set('mcc', v)} placeholder="e.g. 5411" />
        </Field>
        <Field label="Business Website">
          <TextInput value={data.website} onChange={v => set('website', v)} placeholder="https://" type="url" />
        </Field>
      </div>
      <Field label="Business Address *">
        <TextInput value={data.businessAddress} onChange={v => set('businessAddress', v)} placeholder="Street address" />
      </Field>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <div className="col-span-2">
          <Field label="City *">
            <TextInput value={data.city} onChange={v => set('city', v)} placeholder="City" />
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

// ─── Step 2 ───────────────────────────────────────────────────────────────────

function Step2({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div
        className="flex items-start gap-3 px-4 py-3 rounded-xl"
        style={{ backgroundColor: 'rgba(144,196,207,0.06)', border: '1px solid rgba(144,196,207,0.18)' }}
      >
        <span style={{ color: '#90c4cf', fontSize: 15, flexShrink: 0 }}>🔒</span>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Owner information is collected for KYC / AML compliance. SSN last 4 digits only — full SSN is never stored in this system.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Principal Owner Full Name *">
          <TextInput value={data.ownerName} onChange={v => set('ownerName', v)} placeholder="Jane Doe" />
        </Field>
        <Field label="SSN Last 4 Digits *">
          <TextInput value={data.ownerSSNLast4} onChange={v => set('ownerSSNLast4', v.replace(/\D/g, '').slice(0, 4))} placeholder="1234" type="password" />
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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

// ─── Step 3 ───────────────────────────────────────────────────────────────────

function Step3({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Current Processor">
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
      <Field label="Chargeback History / Disputes">
        <SelectInput
          value={data.chargebackHistory}
          onChange={v => set('chargebackHistory', v)}
          placeholder="Select"
          options={[
            { value: 'none', label: 'None — clean history' },
            { value: 'minimal', label: 'Minimal — < 0.5%' },
            { value: 'moderate', label: 'Moderate — 0.5%–1%' },
            { value: 'elevated', label: 'Elevated — > 1%' },
            { value: 'terminated', label: 'Previously terminated' },
          ]}
        />
      </Field>
      {data.chargebackHistory !== 'none' && data.chargebackHistory !== '' && (
        <div
          className="px-4 py-3 rounded-xl"
          style={{ backgroundColor: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.2)' }}
        >
          <p className="text-xs font-semibold" style={{ color: '#FCD34D' }}>
            ⚡ Elevated chargeback history will require additional review and may affect rate approval.
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Step 4 ───────────────────────────────────────────────────────────────────

const ACCOUNT_TYPES = [
  { value: 'card_present',   label: 'Card Present',  desc: 'Retail / POS — in-person swipe or chip transactions' },
  { value: 'ecommerce',      label: 'eCommerce',     desc: 'Card-not-present online transactions' },
  { value: 'moto',           label: 'MOTO',          desc: 'Mail order / telephone order' },
  { value: 'ach',            label: 'ACH / e-Check',  desc: 'Bank-to-bank electronic transfers' },
]

const RATE_MODELS = [
  { value: 'interchange_plus', label: 'Interchange + (Cost Plus)',  desc: 'Pass-through interchange with fixed markup — most transparent' },
  { value: 'flat_rate',        label: 'Flat Rate',                  desc: 'Single blended % regardless of card type' },
  { value: 'tiered',           label: 'Tiered',                     desc: 'Qualified / mid-qual / non-qual buckets' },
]

function Step4({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Account type selector */}
      <div>
        <label style={LABEL_STYLE}>Account Type *</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {ACCOUNT_TYPES.map(t => {
            const active = data.accountType === t.value
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => set('accountType', t.value)}
                className="text-left flex flex-col gap-1 rounded-xl p-4 transition-all"
                style={{
                  backgroundColor: active ? 'rgba(144,196,207,0.08)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${active ? 'rgba(144,196,207,0.45)' : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: active ? 'inset 0 0 0 0px #90c4cf' : 'none',
                }}
              >
                <span className="text-sm font-bold" style={{ color: active ? '#90c4cf' : 'rgba(255,255,255,0.7)' }}>
                  {t.label}
                </span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{t.desc}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Rate model */}
      <div>
        <label style={LABEL_STYLE}>Rate Model *</label>
        <div className="flex flex-col gap-2 mt-2">
          {RATE_MODELS.map(m => {
            const active = data.rateModel === m.value
            return (
              <button
                key={m.value}
                type="button"
                onClick={() => set('rateModel', m.value)}
                className="text-left flex items-center gap-4 rounded-xl px-4 py-3 transition-all"
                style={{
                  backgroundColor: active ? 'rgba(144,196,207,0.08)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${active ? 'rgba(144,196,207,0.4)' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{
                    border: `2px solid ${active ? '#90c4cf' : 'rgba(255,255,255,0.2)'}`,
                    backgroundColor: active ? '#90c4cf' : 'transparent',
                  }}
                />
                <div>
                  <p className="text-sm font-semibold" style={{ color: active ? '#90c4cf' : 'rgba(255,255,255,0.7)' }}>{m.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{m.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Proposed rates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Proposed Rate (%) *">
          <TextInput value={data.proposedRate} onChange={v => set('proposedRate', v)} placeholder="1.89" type="number" />
        </Field>
        <Field label="Per-Transaction Fee ($)">
          <TextInput value={data.proposedTransFee} onChange={v => set('proposedTransFee', v)} placeholder="0.15" type="number" />
        </Field>
      </div>
    </div>
  )
}

// ─── Step 5 ───────────────────────────────────────────────────────────────────

function Step5({
  data,
  setFile,
  setStatements,
}: {
  data: FormData
  setFile: (k: keyof FormData, f: File) => void
  setStatements: (files: File[]) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <div
        className="flex items-start gap-3 px-4 py-3 rounded-xl"
        style={{ backgroundColor: 'rgba(144,196,207,0.06)', border: '1px solid rgba(144,196,207,0.18)' }}
      >
        <span style={{ color: '#90c4cf', fontSize: 15 }}>📎</span>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Upload required documents. Accepted: PDF, JPG, PNG (max 10 MB each). All documents are encrypted at rest.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FileDropZone
          label="Business License / Articles of Incorporation *"
          file={data.businessLicense}
          onFile={f => setFile('businessLicense', f)}
          accept=".pdf,.jpg,.jpeg,.png"
          hint="PDF or image — business license"
        />
        <FileDropZone
          label="Voided Check (Bank Account Verification) *"
          file={data.voidedCheck}
          onFile={f => setFile('voidedCheck', f)}
          accept=".pdf,.jpg,.jpeg,.png"
          hint="PDF or image — voided check"
        />
        <FileDropZone
          label="Owner Government-Issued ID *"
          file={data.ownerID}
          onFile={f => setFile('ownerID', f)}
          accept=".pdf,.jpg,.jpeg,.png"
          hint="Driver's license or passport"
        />
        <FileDropZone
          label="PCI SAQ (Self-Assessment Questionnaire)"
          file={data.pciSAQ}
          onFile={f => setFile('pciSAQ', f)}
          accept=".pdf"
          hint="PCI DSS SAQ — if available"
        />
      </div>

      {/* Statements — multi-file */}
      <div>
        <label style={LABEL_STYLE}>3 Months Processing Statements *</label>
        <label
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            border: `1px dashed ${data.statements.length > 0 ? 'rgba(144,196,207,0.5)' : 'rgba(144,196,207,0.2)'}`,
            borderRadius: 10,
            padding: '24px 16px',
            cursor: 'pointer',
            backgroundColor: data.statements.length > 0 ? 'rgba(144,196,207,0.04)' : 'rgba(255,255,255,0.02)',
          }}
        >
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
            onChange={e => {
              const files = Array.from(e.target.files ?? [])
              setStatements([...data.statements, ...files])
            }}
          />
          <Upload size={18} color={data.statements.length > 0 ? '#90c4cf' : 'rgba(255,255,255,0.25)'} />
          {data.statements.length === 0 ? (
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
              Select up to 3 statement files
            </span>
          ) : (
            <div className="flex flex-col items-center gap-1">
              {data.statements.map((f, i) => (
                <span key={i} style={{ fontSize: 12, color: '#90c4cf', fontWeight: 600 }}>{f.name}</span>
              ))}
            </div>
          )}
        </label>
      </div>
    </div>
  )
}

// ─── Step 6 — Review ──────────────────────────────────────────────────────────

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline gap-4 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span className="text-xs uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>{label}</span>
      <span className="text-sm text-right" style={{ color: 'rgba(255,255,255,0.8)' }}>{value || '—'}</span>
    </div>
  )
}

function Step6({ data }: { data: FormData }) {
  const legalMap: Record<string, string> = {
    sole_proprietor: 'Sole Proprietor', llc: 'LLC',
    corporation: 'Corporation', partnership: 'Partnership',
  }
  const acctMap: Record<string, string> = {
    card_present: 'Card Present', ecommerce: 'eCommerce',
    moto: 'MOTO', ach: 'ACH / e-Check',
  }
  const rateMap: Record<string, string> = {
    interchange_plus: 'Interchange+', flat_rate: 'Flat Rate', tiered: 'Tiered',
  }

  const sections: { title: string; rows: { label: string; value: string }[] }[] = [
    {
      title: 'Business',
      rows: [
        { label: 'Legal name', value: data.businessName },
        { label: 'DBA', value: data.dba },
        { label: 'Structure', value: legalMap[data.legalStructure] ?? '' },
        { label: 'MCC', value: data.mcc },
        { label: 'Website', value: data.website },
        { label: 'Address', value: [data.businessAddress, data.city, data.state, data.zip].filter(Boolean).join(', ') },
      ],
    },
    {
      title: 'Owner (KYC)',
      rows: [
        { label: 'Name', value: data.ownerName },
        { label: 'SSN last 4', value: data.ownerSSNLast4 ? `••••${data.ownerSSNLast4}` : '' },
        { label: 'DOB', value: data.ownerDOB },
        { label: 'Ownership %', value: data.ownershipPercent ? `${data.ownershipPercent}%` : '' },
        { label: 'Address', value: [data.ownerAddress, data.ownerCity, data.ownerState, data.ownerZip].filter(Boolean).join(', ') },
      ],
    },
    {
      title: 'Processing',
      rows: [
        { label: 'Current processor', value: data.currentProcessor },
        { label: 'Monthly volume', value: data.monthlyVolume ? `$${Number(data.monthlyVolume).toLocaleString()}` : '' },
        { label: 'Avg ticket', value: data.avgTicket ? `$${data.avgTicket}` : '' },
        { label: 'Card-present', value: data.cardPresentPercent ? `${data.cardPresentPercent}%` : '' },
        { label: 'Chargeback rate', value: data.chargebackRate ? `${data.chargebackRate}%` : '' },
      ],
    },
    {
      title: 'Account & Rate',
      rows: [
        { label: 'Account type', value: acctMap[data.accountType] ?? '' },
        { label: 'Rate model', value: rateMap[data.rateModel] ?? '' },
        { label: 'Proposed rate', value: data.proposedRate ? `${data.proposedRate}%` : '' },
        { label: 'Trans fee', value: data.proposedTransFee ? `$${data.proposedTransFee}` : '' },
      ],
    },
    {
      title: 'Documents',
      rows: [
        { label: 'Business license', value: data.businessLicense?.name ?? 'Not uploaded' },
        { label: 'Voided check', value: data.voidedCheck?.name ?? 'Not uploaded' },
        { label: 'Owner ID', value: data.ownerID?.name ?? 'Not uploaded' },
        { label: 'Statements', value: data.statements.length > 0 ? `${data.statements.length} file(s)` : 'Not uploaded' },
        { label: 'PCI SAQ', value: data.pciSAQ?.name ?? 'Not provided' },
      ],
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {sections.map(s => (
        <div key={s.title}>
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-1"
            style={{ color: '#90c4cf' }}
          >
            {s.title}
          </p>
          {s.rows.map(r => <ReviewRow key={r.label} label={r.label} value={r.value} />)}
        </div>
      ))}
      <div
        className="flex items-start gap-3 px-4 py-3 rounded-xl mt-2"
        style={{ backgroundColor: 'rgba(74,155,127,0.08)', border: '1px solid rgba(74,155,127,0.25)' }}
      >
        <CheckCircle size={15} color="#6EE7B7" style={{ flexShrink: 0, marginTop: 1 }} />
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Submitting will create this merchant in the pipeline at <strong style={{ color: '#6EE7B7' }}>Agreement Sent</strong> stage and trigger the KYC review queue.
        </p>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type OnboardMode = 'client_link' | 'admin_fill'

export default function OnboardingPage() {
  const router = useRouter()
  const [mode, setMode] = useState<OnboardMode>('client_link')
  const [step, setStep] = useState(0)
  const [data, setData] = useState<FormData>(INITIAL)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function setField(k: keyof FormData, v: string) {
    setData(prev => ({ ...prev, [k]: v }))
  }
  function setFile(k: keyof FormData, f: File) {
    setData(prev => ({ ...prev, [k]: f }))
  }
  function setStatements(files: File[]) {
    setData(prev => ({ ...prev, statements: files }))
  }

  function validateStep(): boolean {
    if (step === 0) return !!(data.businessName && data.legalStructure && data.mcc)
    if (step === 1) return !!(data.ownerName && data.ownerSSNLast4 && data.ownerDOB && data.ownershipPercent)
    if (step === 2) return !!(data.monthlyVolume && data.avgTicket && data.cardPresentPercent)
    if (step === 3) return !!(data.accountType && data.rateModel && data.proposedRate)
    if (step === 4) return !!(data.businessLicense && data.voidedCheck && data.ownerID && data.statements.length > 0)
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-5">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(74,155,127,0.12)', border: '2px solid rgba(74,155,127,0.35)' }}
        >
          <CheckCircle size={36} color="#6EE7B7" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Merchant Submitted</h2>
          <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {data.businessName} has been added to the pipeline at <span style={{ color: '#6EE7B7' }}>Agreement Sent</span>.
          </p>
        </div>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => { setData(INITIAL); setStep(0); setSubmitted(false) }}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: 'rgba(144,196,207,0.1)', border: '1px solid rgba(144,196,207,0.25)', color: '#90c4cf' }}
          >
            Add Another Merchant
          </button>
          <Link
            href="/admin/merchants"
            className="px-5 py-2.5 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: '#90c4cf', color: '#1c1c1c' }}
          >
            View Pipeline →
          </Link>
        </div>
      </div>
    )
  }

  const valid = validateStep()

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin" className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.35)' }}>←</Link>
            <h1 className="text-3xl font-bold text-white">Onboarding</h1>
          </div>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Add a new merchant to the pipeline
          </p>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setMode('client_link')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={mode === 'client_link'
            ? { backgroundColor: 'rgba(144,196,207,0.12)', color: '#90c4cf', border: '1px solid rgba(144,196,207,0.35)' }
            : { backgroundColor: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }
          }
        >
          <UserPlus size={14} /> Send Client Link
        </button>
        <button
          onClick={() => setMode('admin_fill')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={mode === 'admin_fill'
            ? { backgroundColor: 'rgba(144,196,207,0.12)', color: '#90c4cf', border: '1px solid rgba(144,196,207,0.35)' }
            : { backgroundColor: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }
          }
        >
          <ClipboardEdit size={14} /> Admin Fill
        </button>
      </div>

      {/* Client Link mode */}
      {mode === 'client_link' && <ClientLinkGenerator />}

      {/* Admin Fill mode — existing 6-step form */}
      {mode === 'admin_fill' && (
        <div>

      {/* Progress bar */}
      <div className="mb-8">
        {/* Step pills */}
        <div className="flex items-center gap-0 mb-4 overflow-x-auto pb-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const done = i < step
            const active = i === step
            return (
              <div key={i} className="flex items-center">
                <button
                  type="button"
                  onClick={() => i < step && setStep(i)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
                  style={
                    active
                      ? { backgroundColor: 'rgba(144,196,207,0.12)', color: '#90c4cf', border: '1px solid rgba(144,196,207,0.35)' }
                      : done
                        ? { color: 'rgba(110,231,183,0.8)', cursor: 'pointer' }
                        : { color: 'rgba(255,255,255,0.25)', cursor: 'default' }
                  }
                >
                  {done ? (
                    <CheckCircle size={12} color="#6EE7B7" />
                  ) : (
                    <Icon size={12} />
                  )}
                  {s.label}
                </button>
                {i < STEPS.length - 1 && (
                  <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
                )}
              </div>
            )
          })}
        </div>
        {/* Progress track */}
        <div className="h-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-1 rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%`, backgroundColor: '#90c4cf' }}
          />
        </div>
      </div>

      {/* Step card */}
      <div style={CARD_STYLE}>
        <h2 className="text-base font-bold mb-1 text-white">{STEPS[step].label}</h2>
        <p className="text-xs mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {step === 0 && 'Enter the merchant\'s legal business information.'}
          {step === 1 && 'Collect principal owner details for KYC verification.'}
          {step === 2 && 'Understand the merchant\'s current processing situation.'}
          {step === 3 && 'Select account type and propose pricing structure.'}
          {step === 4 && 'Upload all required compliance documents.'}
          {step === 5 && 'Review all information before submitting.'}
        </p>

        {step === 0 && <Step1 data={data} set={setField} />}
        {step === 1 && <Step2 data={data} set={setField} />}
        {step === 2 && <Step3 data={data} set={setField} />}
        {step === 3 && <Step4 data={data} set={setField} />}
        {step === 4 && <Step5 data={data} setFile={setFile} setStatements={setStatements} />}
        {step === 5 && <Step6 data={data} />}
      </div>

      {/* Nav buttons */}
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
            disabled={submitting}
            className="flex items-center gap-2 px-7 py-2.5 rounded-lg text-sm font-bold transition-all"
            style={{ backgroundColor: submitting ? 'rgba(74,155,127,0.5)' : '#4A9B7F', color: '#ffffff' }}
          >
            {submitting ? 'Submitting…' : 'Submit Merchant →'}
          </button>
        )}
      </div>
      </div>
      )}
    </div>
  )
}
