'use client'

import { useState, useRef } from 'react'
import {
  LayoutGrid, List, Search, X, Plus, ChevronUp, ChevronDown,
  Building2, CreditCard, Globe, Phone, Tag, Users, DollarSign,
  TrendingUp, AlertCircle, CheckCircle2, Clock, ArrowRight,
  Filter, SortAsc, MoreHorizontal, ExternalLink, GripVertical,
} from 'lucide-react'
import { BRAND } from '@/lib/brand'

// ─── Domain types ─────────────────────────────────────────────────────────────

type PipelineStage =
  | 'lead_identified'
  | 'proposal_sent'
  | 'agreement_sent'
  | 'agreement_signed'
  | 'setup_fee_paid'
  | 'underwriting'
  | 'account_activated'
  | 'merchant_live'
  | 'declined'

type AccountType = 'Card Present' | 'eCommerce' | 'MOTO' | 'ACH'

type MerchantRecord = {
  id: string
  name: string
  dba_name?: string
  mcc: string
  mcc_label: string
  legal_structure: 'LLC' | 'S-Corp' | 'C-Corp' | 'Sole Proprietor' | 'Partnership'
  account_type: AccountType
  monthly_volume: number
  avg_ticket: number
  card_present_pct: number
  partner: string
  partner_iso: string
  pipeline_stage: PipelineStage
  days_in_stage: number
  date_added: string
  notes?: string
  risk?: 'low' | 'medium' | 'high'
}

// ─── Stage metadata ───────────────────────────────────────────────────────────

const STAGE_META: Record<PipelineStage, {
  label: string
  shortLabel: string
  color: string
  bg: string
  border: string
  icon: React.ReactNode
}> = {
  lead_identified:  {
    label: 'Lead Identified',   shortLabel: 'Lead',
    color: '#93C5FD',           bg: 'rgba(96,165,250,0.10)',   border: 'rgba(96,165,250,0.22)',
    icon: <AlertCircle size={11} />,
  },
  proposal_sent:    {
    label: 'Proposal Sent',     shortLabel: 'Proposal',
    color: '#FCD34D',           bg: 'rgba(251,191,36,0.10)',   border: 'rgba(251,191,36,0.22)',
    icon: <ArrowRight size={11} />,
  },
  agreement_sent:   {
    label: 'Agreement Sent',    shortLabel: 'Agmt Out',
    color: '#C4B5FD',           bg: 'rgba(139,92,246,0.10)',   border: 'rgba(139,92,246,0.22)',
    icon: <ExternalLink size={11} />,
  },
  agreement_signed: {
    label: 'Agreement Signed',  shortLabel: 'Signed',
    color: '#3DD68C',           bg: 'rgba(61,214,140,0.10)',   border: 'rgba(61,214,140,0.22)',
    icon: <CheckCircle2 size={11} />,
  },
  setup_fee_paid:   {
    label: 'Setup Fee Paid',    shortLabel: 'Fee Paid',
    color: '#34D399',           bg: 'rgba(52,211,153,0.12)',   border: 'rgba(52,211,153,0.28)',
    icon: <DollarSign size={11} />,
  },
  underwriting:     {
    label: 'Underwriting',      shortLabel: 'Underwriting',
    color: BRAND.warn,          bg: 'rgba(240,178,62,0.10)',   border: 'rgba(240,178,62,0.22)',
    icon: <Clock size={11} />,
  },
  account_activated: {
    label: 'Account Activated', shortLabel: 'Activated',
    color: BRAND.cyanBright,    bg: 'rgba(144,196,207,0.10)',   border: 'rgba(144,196,207,0.25)',
    icon: <TrendingUp size={11} />,
  },
  merchant_live:    {
    label: 'Merchant Live',     shortLabel: 'Live',
    color: BRAND.success,       bg: 'rgba(61,214,140,0.12)',   border: 'rgba(61,214,140,0.28)',
    icon: <CheckCircle2 size={11} />,
  },
  declined:         {
    label: 'Declined',          shortLabel: 'Declined',
    color: 'rgba(255,255,255,0.28)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.10)',
    icon: <X size={11} />,
  },
}

const KANBAN_STAGES: PipelineStage[] = [
  'lead_identified', 'proposal_sent', 'agreement_sent',
  'agreement_signed', 'setup_fee_paid', 'underwriting',
  'account_activated', 'merchant_live',
]

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_MERCHANTS: MerchantRecord[] = [
  {
    id: 'm-001', name: 'Suncoast Retail Group', dba_name: 'Suncoast Shops',
    mcc: '5411', mcc_label: 'Grocery Stores', legal_structure: 'LLC',
    account_type: 'Card Present', monthly_volume: 385000, avg_ticket: 62,
    card_present_pct: 94, partner: 'First Capital ISO', partner_iso: 'FC-ISO',
    pipeline_stage: 'merchant_live', days_in_stage: 42, date_added: '2025-11-14',
    notes: 'Multi-location grocery chain, flagship account', risk: 'low',
  },
  {
    id: 'm-002', name: 'BluePeak eCommerce LLC', dba_name: 'BluePeak Store',
    mcc: '5999', mcc_label: 'Retail Stores, NEC', legal_structure: 'LLC',
    account_type: 'eCommerce', monthly_volume: 210000, avg_ticket: 128,
    card_present_pct: 0, partner: 'Meridian Partners', partner_iso: 'MP-001',
    pipeline_stage: 'account_activated', days_in_stage: 11, date_added: '2026-01-03',
    risk: 'low',
  },
  {
    id: 'm-003', name: 'Atlas Medical Supplies', dba_name: undefined,
    mcc: '5047', mcc_label: 'Medical & Hospital Equipment', legal_structure: 'C-Corp',
    account_type: 'MOTO', monthly_volume: 95000, avg_ticket: 310,
    card_present_pct: 10, partner: 'HealthPay ISO', partner_iso: 'HP-ISO',
    pipeline_stage: 'underwriting', days_in_stage: 7, date_added: '2026-02-18',
    notes: 'Requires enhanced underwriting — DME category', risk: 'medium',
  },
  {
    id: 'm-004', name: 'NovaBrew Coffee Co.', dba_name: 'NovaBrew',
    mcc: '5812', mcc_label: 'Eating Places & Restaurants', legal_structure: 'S-Corp',
    account_type: 'Card Present', monthly_volume: 52000, avg_ticket: 18,
    card_present_pct: 98, partner: 'First Capital ISO', partner_iso: 'FC-ISO',
    pipeline_stage: 'setup_fee_paid', days_in_stage: 3, date_added: '2026-03-05',
    risk: 'low',
  },
  {
    id: 'm-005', name: 'PrimeAuto Finance', dba_name: undefined,
    mcc: '5511', mcc_label: 'Auto Dealers - New & Used', legal_structure: 'LLC',
    account_type: 'Card Present', monthly_volume: 720000, avg_ticket: 4200,
    card_present_pct: 75, partner: 'Velocity ISO Group', partner_iso: 'VG-ISO',
    pipeline_stage: 'agreement_signed', days_in_stage: 5, date_added: '2026-03-12',
    notes: 'High ticket — needs VP approval', risk: 'medium',
  },
  {
    id: 'm-006', name: 'ClearView Law Group', dba_name: undefined,
    mcc: '8111', mcc_label: 'Legal Services', legal_structure: 'Partnership',
    account_type: 'MOTO', monthly_volume: 68000, avg_ticket: 850,
    card_present_pct: 5, partner: 'Meridian Partners', partner_iso: 'MP-001',
    pipeline_stage: 'agreement_sent', days_in_stage: 9, date_added: '2026-03-20',
    risk: 'low',
  },
  {
    id: 'm-007', name: 'Apex Fitness Studios', dba_name: 'Apex Fit',
    mcc: '7997', mcc_label: 'Membership Sports & Recreation Clubs', legal_structure: 'LLC',
    account_type: 'Card Present', monthly_volume: 41000, avg_ticket: 55,
    card_present_pct: 88, partner: 'First Capital ISO', partner_iso: 'FC-ISO',
    pipeline_stage: 'proposal_sent', days_in_stage: 14, date_added: '2026-04-01',
    risk: 'low',
  },
  {
    id: 'm-008', name: 'OceanTech Imports', dba_name: undefined,
    mcc: '5065', mcc_label: 'Electrical Parts & Equipment', legal_structure: 'C-Corp',
    account_type: 'eCommerce', monthly_volume: 155000, avg_ticket: 240,
    card_present_pct: 0, partner: 'Velocity ISO Group', partner_iso: 'VG-ISO',
    pipeline_stage: 'lead_identified', days_in_stage: 2, date_added: '2026-04-10',
    risk: 'medium',
  },
  {
    id: 'm-009', name: 'Harborside Hospitality', dba_name: 'Harborside Hotels',
    mcc: '7011', mcc_label: 'Hotels & Motels', legal_structure: 'LLC',
    account_type: 'Card Present', monthly_volume: 490000, avg_ticket: 195,
    card_present_pct: 82, partner: 'Meridian Partners', partner_iso: 'MP-001',
    pipeline_stage: 'merchant_live', days_in_stage: 88, date_added: '2025-09-30',
    risk: 'low',
  },
  {
    id: 'm-010', name: 'RedLine Logistics Inc.', dba_name: undefined,
    mcc: '4215', mcc_label: 'Courier Services', legal_structure: 'C-Corp',
    account_type: 'ACH', monthly_volume: 320000, avg_ticket: 1100,
    card_present_pct: 0, partner: 'HealthPay ISO', partner_iso: 'HP-ISO',
    pipeline_stage: 'underwriting', days_in_stage: 12, date_added: '2026-02-28',
    notes: 'ACH debit — fleet billing model', risk: 'medium',
  },
  {
    id: 'm-011', name: 'StarPath Education', dba_name: 'StarPath Online',
    mcc: '8299', mcc_label: 'Schools & Educational Services', legal_structure: 'S-Corp',
    account_type: 'eCommerce', monthly_volume: 78000, avg_ticket: 299,
    card_present_pct: 0, partner: 'First Capital ISO', partner_iso: 'FC-ISO',
    pipeline_stage: 'proposal_sent', days_in_stage: 6, date_added: '2026-04-05',
    risk: 'low',
  },
  {
    id: 'm-012', name: 'TerraVerde Cannabis Dist.', dba_name: 'TerraVerde',
    mcc: '5912', mcc_label: 'Drug Stores & Pharmacies', legal_structure: 'LLC',
    account_type: 'Card Present', monthly_volume: 165000, avg_ticket: 72,
    card_present_pct: 95, partner: 'Velocity ISO Group', partner_iso: 'VG-ISO',
    pipeline_stage: 'declined', days_in_stage: 0, date_added: '2026-03-01',
    notes: 'Declined — prohibited MCC in processing network', risk: 'high',
  },
]

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtVolume(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

function fmtCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function fmtDate(d: string): string {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const INPUT_BASE = 'w-full rounded-xl px-3 py-2 text-sm focus:outline-none transition-colors'
const INPUT_STYLE: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: `1px solid ${BRAND.borderCyan}`,
  color: BRAND.text,
}
const LABEL_STYLE: React.CSSProperties = {
  color: BRAND.muted,
  fontSize: '10px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
}
const CARD_STYLE: React.CSSProperties = {
  backgroundColor: BRAND.card,
  border: `1px solid ${BRAND.border}`,
  borderRadius: '14px',
}

// ─── Account type badge ───────────────────────────────────────────────────────

const ACCT_COLORS: Record<AccountType, { color: string; bg: string }> = {
  'Card Present': { color: BRAND.cyan,      bg: 'rgba(144,196,207,0.12)' },
  'eCommerce':    { color: '#A78BFA',        bg: 'rgba(139,92,246,0.12)' },
  'MOTO':         { color: BRAND.warn,       bg: 'rgba(240,178,62,0.12)' },
  'ACH':          { color: BRAND.cyanDeep,  bg: 'rgba(14,143,184,0.12)' },
}

function AccountTypeBadge({ type }: { type: AccountType }) {
  const c = ACCT_COLORS[type]
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ backgroundColor: c.bg, color: c.color, border: `1px solid ${c.color}30` }}>
      {type}
    </span>
  )
}

// ─── Stage badge ──────────────────────────────────────────────────────────────

function StageBadge({ stage }: { stage: PipelineStage }) {
  const meta = STAGE_META[stage]
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ backgroundColor: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
      {meta.icon}{meta.label}
    </span>
  )
}

// ─── Risk badge ───────────────────────────────────────────────────────────────

const RISK_COLORS: Record<string, string> = {
  low:    BRAND.success,
  medium: BRAND.warn,
  high:   BRAND.danger,
}

function RiskBadge({ risk }: { risk?: 'low' | 'medium' | 'high' }) {
  if (!risk) return null
  const color = RISK_COLORS[risk]
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide"
      style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}40` }}>
      {risk}
    </span>
  )
}

// ─── Days-in-stage chip ───────────────────────────────────────────────────────

function DaysChip({ days, stage }: { days: number; stage: PipelineStage }) {
  const urgent = days > 10 && !['merchant_live', 'declined'].includes(stage)
  return (
    <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
      style={{
        backgroundColor: urgent ? 'rgba(240,178,62,0.15)' : 'rgba(255,255,255,0.05)',
        color: urgent ? BRAND.warn : 'rgba(255,255,255,0.35)',
        border: `1px solid ${urgent ? 'rgba(240,178,62,0.3)' : 'rgba(255,255,255,0.1)'}`,
      }}>
      <Clock size={8} /> {days}d
    </span>
  )
}

// ─── Kanban card ──────────────────────────────────────────────────────────────

function KanbanCard({
  merchant,
  dragging,
  onDragStart,
  onDragEnd,
  onClick,
}: {
  merchant: MerchantRecord
  dragging: boolean
  onDragStart: () => void
  onDragEnd: () => void
  onClick: () => void
}) {
  const meta = STAGE_META[merchant.pipeline_stage]

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className="cursor-grab active:cursor-grabbing select-none transition-all hover:shadow-lg"
      style={{
        ...CARD_STYLE,
        opacity: dragging ? 0.4 : 1,
        transform: dragging ? 'scale(0.96)' : undefined,
        border: `1px solid ${dragging ? meta.color : BRAND.border}`,
      }}
    >
      <div className="p-3.5 flex flex-col gap-2.5">
        {/* Name + DBA */}
        <div>
          <p className="text-sm font-bold leading-snug" style={{ color: BRAND.text }}>
            {merchant.name}
          </p>
          {merchant.dba_name && (
            <p className="text-[10px] mt-0.5" style={{ color: BRAND.muted }}>
              DBA: {merchant.dba_name}
            </p>
          )}
        </div>

        {/* MCC + account type */}
        <div className="flex flex-col gap-1">
          <p className="text-[10px]" style={{ color: BRAND.muted }}>
            MCC {merchant.mcc} · {merchant.mcc_label}
          </p>
          <AccountTypeBadge type={merchant.account_type} />
        </div>

        {/* Volume + ticket */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold" style={{ color: BRAND.cyan }}>
            {fmtVolume(merchant.monthly_volume)}<span className="text-[9px] font-normal opacity-60">/mo</span>
          </span>
          <div className="flex items-center gap-1">
            <RiskBadge risk={merchant.risk} />
            <DaysChip days={merchant.days_in_stage} stage={merchant.pipeline_stage} />
          </div>
        </div>

        {/* Partner */}
        <div className="flex items-center gap-1 text-[10px]" style={{ color: BRAND.silverLo }}>
          <Users size={9} />
          <span className="truncate">{merchant.partner}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Add Merchant Modal ───────────────────────────────────────────────────────

const MCC_OPTIONS = [
  { code: '5411', label: 'Grocery Stores' },
  { code: '5812', label: 'Eating Places & Restaurants' },
  { code: '5999', label: 'Retail Stores, NEC' },
  { code: '5047', label: 'Medical & Hospital Equipment' },
  { code: '5511', label: 'Auto Dealers - New & Used' },
  { code: '7011', label: 'Hotels & Motels' },
  { code: '7997', label: 'Membership Sports & Recreation Clubs' },
  { code: '8111', label: 'Legal Services' },
  { code: '8299', label: 'Schools & Educational Services' },
  { code: '5065', label: 'Electrical Parts & Equipment' },
  { code: '4215', label: 'Courier Services' },
  { code: '5912', label: 'Drug Stores & Pharmacies' },
]

const PARTNERS = ['First Capital ISO', 'Meridian Partners', 'Velocity ISO Group', 'HealthPay ISO']

type NewMerchantForm = {
  name: string
  dba_name: string
  mcc: string
  legal_structure: string
  est_monthly_volume: string
  avg_ticket: string
  card_present_pct: string
  partner: string
  account_type: AccountType | ''
}

function AddMerchantModal({ onClose, onAdded }: { onClose: () => void; onAdded: (m: MerchantRecord) => void }) {
  const [form, setForm] = useState<NewMerchantForm>({
    name: '', dba_name: '', mcc: '', legal_structure: '',
    est_monthly_volume: '', avg_ticket: '', card_present_pct: '',
    partner: '', account_type: '',
  })
  const [saving, setSaving] = useState(false)

  function set(k: keyof NewMerchantForm, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    // Build mock record — in production this would POST to /api/merchants
    const mccOption = MCC_OPTIONS.find(o => o.code === form.mcc)
    const newMerchant: MerchantRecord = {
      id: `m-${Date.now()}`,
      name: form.name,
      dba_name: form.dba_name || undefined,
      mcc: form.mcc,
      mcc_label: mccOption?.label ?? 'Unknown',
      legal_structure: (form.legal_structure as MerchantRecord['legal_structure']) || 'LLC',
      account_type: (form.account_type as AccountType) || 'Card Present',
      monthly_volume: parseFloat(form.est_monthly_volume) || 0,
      avg_ticket: parseFloat(form.avg_ticket) || 0,
      card_present_pct: parseFloat(form.card_present_pct) || 0,
      partner: form.partner,
      partner_iso: form.partner.slice(0, 2).toUpperCase() + '-ISO',
      pipeline_stage: 'lead_identified',
      days_in_stage: 0,
      date_added: new Date().toISOString().split('T')[0],
      risk: 'low',
    }
    setTimeout(() => {
      onAdded(newMerchant)
      setSaving(false)
    }, 400)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto"
        style={{ backgroundColor: BRAND.cardAlt, border: `1px solid ${BRAND.borderCyan}` }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
          style={{ borderBottom: `1px solid ${BRAND.border}`, backgroundColor: BRAND.cardAlt }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${BRAND.cyan}18`, border: `1px solid ${BRAND.borderCyan}` }}>
              <Building2 size={15} style={{ color: BRAND.cyan }} />
            </div>
            <h2 className="font-bold text-lg" style={{ color: BRAND.text }}>Add Merchant</h2>
          </div>
          <button onClick={onClose} style={{ color: BRAND.muted }}
            className="hover:opacity-70 transition-opacity">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Business Name */}
          <div>
            <label className="block mb-1.5" style={LABEL_STYLE}>Business / Legal Name *</label>
            <input required value={form.name} onChange={e => set('name', e.target.value)}
              className={INPUT_BASE} style={INPUT_STYLE} placeholder="Acme Retail LLC" />
          </div>

          {/* DBA + MCC */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1.5" style={LABEL_STYLE}>DBA Name</label>
              <input value={form.dba_name} onChange={e => set('dba_name', e.target.value)}
                className={INPUT_BASE} style={INPUT_STYLE} placeholder="Doing business as…" />
            </div>
            <div>
              <label className="block mb-1.5" style={LABEL_STYLE}>MCC Code *</label>
              <select required value={form.mcc} onChange={e => set('mcc', e.target.value)}
                className={INPUT_BASE} style={INPUT_STYLE}>
                <option value="">Select MCC</option>
                {MCC_OPTIONS.map(o => (
                  <option key={o.code} value={o.code}>{o.code} — {o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Legal structure + Account type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1.5" style={LABEL_STYLE}>Legal Structure *</label>
              <select required value={form.legal_structure} onChange={e => set('legal_structure', e.target.value)}
                className={INPUT_BASE} style={INPUT_STYLE}>
                <option value="">Select structure</option>
                <option value="LLC">LLC</option>
                <option value="S-Corp">S-Corp</option>
                <option value="C-Corp">C-Corp</option>
                <option value="Sole Proprietor">Sole Proprietor</option>
                <option value="Partnership">Partnership</option>
              </select>
            </div>
            <div>
              <label className="block mb-1.5" style={LABEL_STYLE}>Account Type *</label>
              <select required value={form.account_type} onChange={e => set('account_type', e.target.value)}
                className={INPUT_BASE} style={INPUT_STYLE}>
                <option value="">Select type</option>
                <option value="Card Present">Card Present</option>
                <option value="eCommerce">eCommerce</option>
                <option value="MOTO">MOTO</option>
                <option value="ACH">ACH</option>
              </select>
            </div>
          </div>

          {/* Volume + Avg ticket */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1.5" style={LABEL_STYLE}>Est. Monthly Volume ($) *</label>
              <input required type="number" min="0" value={form.est_monthly_volume}
                onChange={e => set('est_monthly_volume', e.target.value)}
                className={INPUT_BASE} style={INPUT_STYLE} placeholder="100000" />
            </div>
            <div>
              <label className="block mb-1.5" style={LABEL_STYLE}>Avg Ticket ($)</label>
              <input type="number" min="0" value={form.avg_ticket}
                onChange={e => set('avg_ticket', e.target.value)}
                className={INPUT_BASE} style={INPUT_STYLE} placeholder="85" />
            </div>
          </div>

          {/* Card present % */}
          <div>
            <label className="block mb-1.5" style={LABEL_STYLE}>
              Card Present % <span style={{ color: BRAND.muted, textTransform: 'none', letterSpacing: 0 }}>(0–100)</span>
            </label>
            <div className="flex items-center gap-3">
              <input type="range" min="0" max="100" value={form.card_present_pct || 0}
                onChange={e => set('card_present_pct', e.target.value)}
                className="flex-1 accent-[#90c4cf]" />
              <span className="text-sm font-bold w-10 text-right" style={{ color: BRAND.cyan }}>
                {form.card_present_pct || 0}%
              </span>
            </div>
          </div>

          {/* Partner/ISO */}
          <div>
            <label className="block mb-1.5" style={LABEL_STYLE}>Assigned Partner / ISO *</label>
            <select required value={form.partner} onChange={e => set('partner', e.target.value)}
              className={INPUT_BASE} style={INPUT_STYLE}>
              <option value="">Select partner</option>
              {PARTNERS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Info row */}
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
            style={{ backgroundColor: `${BRAND.cyan}0D`, border: `1px solid ${BRAND.borderCyan}` }}>
            <AlertCircle size={12} style={{ color: BRAND.cyan, flexShrink: 0 }} />
            <span style={{ color: BRAND.muted }}>
              Merchant will be added to <strong style={{ color: BRAND.text }}>Lead Identified</strong> stage and can be advanced through the pipeline.
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ border: `1px solid ${BRAND.border}`, color: BRAND.muted }}>
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-85 disabled:opacity-50"
              style={{ backgroundColor: BRAND.cyan, color: BRAND.bg }}>
              {saving ? 'Adding…' : 'Add to Pipeline'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Merchant detail modal ────────────────────────────────────────────────────

function MerchantDetailModal({
  merchant,
  onClose,
  onStageChange,
}: {
  merchant: MerchantRecord
  onClose: () => void
  onStageChange: (id: string, stage: PipelineStage) => void
}) {
  const [moving, setMoving] = useState(false)
  const meta = STAGE_META[merchant.pipeline_stage]
  const nextIdx = KANBAN_STAGES.indexOf(merchant.pipeline_stage) + 1
  const nextStage = nextIdx < KANBAN_STAGES.length ? KANBAN_STAGES[nextIdx] : null

  async function moveTo(stage: PipelineStage) {
    setMoving(true)
    onStageChange(merchant.id, stage)
    // In production: await fetch(`/api/merchants/${merchant.id}`, { method: 'PATCH', ... })
    setMoving(false)
    onClose()
  }

  const allStages = Object.entries(STAGE_META) as [PipelineStage, typeof STAGE_META[PipelineStage]][]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="rounded-2xl shadow-2xl w-full max-w-sm max-h-[92vh] overflow-y-auto"
        style={{ backgroundColor: BRAND.cardAlt, border: `1px solid ${BRAND.borderCyan}` }}>

        {/* Header */}
        <div className="px-5 py-4 flex items-start justify-between"
          style={{ borderBottom: `1px solid ${BRAND.border}` }}>
          <div>
            <p className="font-bold text-base" style={{ color: BRAND.text }}>{merchant.name}</p>
            {merchant.dba_name && (
              <p className="text-xs mt-0.5" style={{ color: BRAND.muted }}>DBA: {merchant.dba_name}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <StageBadge stage={merchant.pipeline_stage} />
              <RiskBadge risk={merchant.risk} />
            </div>
          </div>
          <button onClick={onClose} className="hover:opacity-70 transition-opacity mt-0.5"
            style={{ color: BRAND.muted }}>
            <X size={18} />
          </button>
        </div>

        {/* Details */}
        <div className="px-5 py-4 flex flex-col gap-3" style={{ borderBottom: `1px solid ${BRAND.border}` }}>
          {[
            { icon: <Tag size={11} />,        label: 'MCC',            value: `${merchant.mcc} — ${merchant.mcc_label}` },
            { icon: <CreditCard size={11} />, label: 'Account Type',   value: merchant.account_type },
            { icon: <Building2 size={11} />,  label: 'Legal Structure', value: merchant.legal_structure },
            { icon: <DollarSign size={11} />, label: 'Monthly Volume', value: fmtCurrency(merchant.monthly_volume) },
            { icon: <TrendingUp size={11} />, label: 'Avg Ticket',     value: fmtCurrency(merchant.avg_ticket) },
            { icon: <Globe size={11} />,      label: 'CP %',           value: `${merchant.card_present_pct}%` },
            { icon: <Users size={11} />,      label: 'Partner / ISO',  value: `${merchant.partner} (${merchant.partner_iso})` },
            { icon: <Clock size={11} />,      label: 'Days in Stage',  value: `${merchant.days_in_stage} days` },
            { icon: <Phone size={11} />,      label: 'Date Added',     value: fmtDate(merchant.date_added) },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs" style={{ color: BRAND.muted }}>
                {icon} {label}
              </span>
              <span className="text-xs font-semibold" style={{ color: BRAND.text }}>{value}</span>
            </div>
          ))}
          {merchant.notes && (
            <div className="mt-1 px-3 py-2 rounded-lg text-xs italic"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderLeft: `2px solid ${BRAND.borderCyan}`, color: BRAND.muted }}>
              {merchant.notes}
            </div>
          )}
        </div>

        {/* Quick advance */}
        {nextStage && (
          <div className="px-5 py-3" style={{ borderBottom: `1px solid ${BRAND.border}` }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: BRAND.muted }}>
              Quick Advance
            </p>
            <button
              onClick={() => moveTo(nextStage)}
              disabled={moving}
              className="w-full py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-opacity hover:opacity-85 disabled:opacity-50"
              style={{ backgroundColor: STAGE_META[nextStage].bg, color: STAGE_META[nextStage].color, border: `1px solid ${STAGE_META[nextStage].border}` }}>
              <ArrowRight size={14} />
              Move to {STAGE_META[nextStage].label}
            </button>
          </div>
        )}

        {/* Move to any stage */}
        <div className="px-5 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: BRAND.muted }}>
            Move to Stage
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {allStages
              .filter(([key]) => key !== merchant.pipeline_stage)
              .map(([key, s]) => (
                <button key={key}
                  onClick={() => moveTo(key)}
                  disabled={moving}
                  className="text-left px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-opacity hover:opacity-80 disabled:opacity-40 flex items-center gap-1"
                  style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                  {s.icon} {s.shortLabel}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sort types ───────────────────────────────────────────────────────────────

type SortKey = 'name' | 'monthly_volume' | 'days_in_stage' | 'date_added'
type SortDir = 'asc' | 'desc'

// ─── Main board ───────────────────────────────────────────────────────────────

export default function MerchantsBoard() {
  const [merchants, setMerchants] = useState<MerchantRecord[]>(MOCK_MERCHANTS)
  const [view, setView]           = useState<'kanban' | 'list'>('kanban')
  const [search, setSearch]       = useState('')
  const [filterStage, setFilterStage] = useState<PipelineStage | ''>('')
  const [filterPartner, setFilterPartner] = useState('')
  const [filterAcctType, setFilterAcctType] = useState<AccountType | ''>('')
  const [showDeclined, setShowDeclined] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selected, setSelected]   = useState<MerchantRecord | null>(null)
  const [sortKey, setSortKey]     = useState<SortKey>('date_added')
  const [sortDir, setSortDir]     = useState<SortDir>('desc')
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null)
  const dragCounter = useRef<Record<string, number>>({})

  // ── Derived state ─────────────────────────────────────────────────────────

  const active   = merchants.filter(m => m.pipeline_stage !== 'declined')
  const declined = merchants.filter(m => m.pipeline_stage === 'declined')
  const displayed = showDeclined ? merchants : active

  const filtered = displayed.filter(m => {
    const q = search.trim().toLowerCase()
    if (q) {
      const textMatch =
        m.name.toLowerCase().includes(q) ||
        (m.dba_name ?? '').toLowerCase().includes(q) ||
        m.mcc.includes(q) ||
        m.mcc_label.toLowerCase().includes(q) ||
        m.account_type.toLowerCase().includes(q) ||
        m.partner.toLowerCase().includes(q) ||
        STAGE_META[m.pipeline_stage].label.toLowerCase().includes(q) ||
        m.legal_structure.toLowerCase().includes(q)
      if (!textMatch) return false
    }
    if (filterStage && m.pipeline_stage !== filterStage) return false
    if (filterPartner && m.partner !== filterPartner) return false
    if (filterAcctType && m.account_type !== filterAcctType) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'name')           cmp = a.name.localeCompare(b.name)
    if (sortKey === 'monthly_volume') cmp = a.monthly_volume - b.monthly_volume
    if (sortKey === 'days_in_stage')  cmp = a.days_in_stage - b.days_in_stage
    if (sortKey === 'date_added')     cmp = a.date_added.localeCompare(b.date_added)
    return sortDir === 'asc' ? cmp : -cmp
  })

  const totalVolume = active.reduce((s, m) => s + m.monthly_volume, 0)
  const liveCount   = merchants.filter(m => m.pipeline_stage === 'merchant_live').length

  // ── Helpers ───────────────────────────────────────────────────────────────

  function handleStageChange(id: string, stage: PipelineStage) {
    setMerchants(prev => prev.map(m => m.id === id ? { ...m, pipeline_stage: stage, days_in_stage: 0 } : m))
  }

  function handleAdded(m: MerchantRecord) {
    setMerchants(prev => [m, ...prev])
    setShowAddModal(false)
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <SortAsc size={10} style={{ opacity: 0.3 }} />
    return sortDir === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />
  }

  function moveToStage(merchantId: string, stage: PipelineStage) {
    handleStageChange(merchantId, stage)
  }

  const hasActiveFilters = !!filterStage || !!filterPartner || !!filterAcctType

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight"
            style={{
              background: `linear-gradient(90deg, ${BRAND.silver} 0%, ${BRAND.silverHi} 45%, ${BRAND.silverLo} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            Merchants
          </h1>
          <p className="text-sm mt-1 flex flex-wrap items-center gap-x-3 gap-y-1" style={{ color: BRAND.muted }}>
            <span>{active.length} active · {declined.length} declined</span>
            <span className="inline-flex items-center gap-1 font-semibold" style={{ color: BRAND.cyan }}>
              <TrendingUp size={11} /> {fmtVolume(totalVolume)}/mo pipeline
            </span>
            <span className="inline-flex items-center gap-1 font-semibold" style={{ color: BRAND.success }}>
              <CheckCircle2 size={11} /> {liveCount} live
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View toggle */}
          <div className="flex items-center rounded-lg overflow-hidden"
            style={{ border: `1px solid ${BRAND.borderCyan}` }}>
            {([['kanban', <LayoutGrid key="k" size={13} />, 'Pipeline'] as const,
               ['list',   <List key="l" size={13} />, 'List'] as const] as const).map(([v, icon, lbl]) => (
              <button key={v} onClick={() => setView(v)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors"
                style={{
                  backgroundColor: view === v ? BRAND.cyan : 'rgba(255,255,255,0.04)',
                  color: view === v ? BRAND.bg : BRAND.muted,
                }}>
                {icon} {lbl}
              </button>
            ))}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(v => !v)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
            style={{
              border: `1px solid ${hasActiveFilters ? BRAND.cyan : BRAND.borderCyan}`,
              backgroundColor: hasActiveFilters ? `${BRAND.cyan}15` : 'rgba(255,255,255,0.04)',
              color: hasActiveFilters ? BRAND.cyan : BRAND.muted,
            }}>
            <Filter size={12} />
            Filters
            {hasActiveFilters && (
              <span className="w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                style={{ backgroundColor: BRAND.cyan, color: BRAND.bg }}>
                {[filterStage, filterPartner, filterAcctType].filter(Boolean).length}
              </span>
            )}
          </button>

          {/* Add merchant */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-opacity hover:opacity-85"
            style={{ backgroundColor: BRAND.cyan, color: BRAND.bg }}>
            <Plus size={14} /> Add Merchant
          </button>
        </div>
      </div>

      {/* ── Search + filter bar ── */}
      <div className="flex flex-col gap-2 mb-5">
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: `${BRAND.cyan}80` }} />
          <input
            type="text"
            placeholder="Search by name, MCC, account type, partner, stage…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-10 py-2.5 text-sm rounded-xl focus:outline-none"
            style={{ ...INPUT_STYLE, paddingLeft: 44 }}
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
              style={{ color: `${BRAND.cyan}99` }}>
              <X size={13} />
            </button>
          )}
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-2 p-3 rounded-xl"
            style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
            {/* Stage filter */}
            <select value={filterStage} onChange={e => setFilterStage(e.target.value as PipelineStage | '')}
              className="py-1.5 px-3 text-xs rounded-lg focus:outline-none"
              style={{ ...INPUT_STYLE, minWidth: 160 }}>
              <option value="">All Stages</option>
              {Object.entries(STAGE_META).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            {/* Partner filter */}
            <select value={filterPartner} onChange={e => setFilterPartner(e.target.value)}
              className="py-1.5 px-3 text-xs rounded-lg focus:outline-none"
              style={{ ...INPUT_STYLE, minWidth: 160 }}>
              <option value="">All Partners</option>
              {PARTNERS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {/* Account type filter */}
            <select value={filterAcctType} onChange={e => setFilterAcctType(e.target.value as AccountType | '')}
              className="py-1.5 px-3 text-xs rounded-lg focus:outline-none"
              style={{ ...INPUT_STYLE, minWidth: 140 }}>
              <option value="">All Account Types</option>
              <option value="Card Present">Card Present</option>
              <option value="eCommerce">eCommerce</option>
              <option value="MOTO">MOTO</option>
              <option value="ACH">ACH</option>
            </select>
            {hasActiveFilters && (
              <button
                onClick={() => { setFilterStage(''); setFilterPartner(''); setFilterAcctType('') }}
                className="flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-opacity hover:opacity-70"
                style={{ border: `1px solid ${BRAND.danger}50`, color: BRAND.danger, backgroundColor: `${BRAND.danger}0D` }}>
                <X size={10} /> Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Empty state ── */}
      {merchants.length === 0 ? (
        <div className="rounded-xl p-16 text-center"
          style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
          <Building2 size={32} className="mx-auto mb-3" style={{ color: BRAND.muted, opacity: 0.4 }} />
          <p className="text-sm mb-3" style={{ color: BRAND.muted }}>No merchants yet.</p>
          <button onClick={() => setShowAddModal(true)}
            className="text-sm font-semibold hover:opacity-80 transition-opacity"
            style={{ color: BRAND.cyan }}>
            + Add your first merchant
          </button>
        </div>

      ) : view === 'kanban' ? (
        /* ══ KANBAN VIEW ══════════════════════════════════════════════════════ */
        <div>
          {/* Drag hint */}
          <p className="text-xs mb-3 flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
            <GripVertical size={11} /> Drag cards to move between stages · Click to open detail
          </p>

          <div className="flex gap-3 overflow-x-auto pb-4"
            style={{ scrollbarWidth: 'thin', scrollbarColor: `${BRAND.borderCyan} transparent` }}>
            {KANBAN_STAGES.map(stage => {
              const meta = STAGE_META[stage]
              const cards = filtered.filter(m => m.pipeline_stage === stage)
              const isOver = dragOverStage === stage && draggingId !== null
              const stageVolume = cards.reduce((s, m) => s + m.monthly_volume, 0)

              return (
                <div key={stage} className="flex flex-col gap-2.5 flex-shrink-0"
                  style={{ width: 196 }}
                  onDragOver={e => { e.preventDefault(); setDragOverStage(stage) }}
                  onDragEnter={e => {
                    e.preventDefault()
                    dragCounter.current[stage] = (dragCounter.current[stage] ?? 0) + 1
                    setDragOverStage(stage)
                  }}
                  onDragLeave={() => {
                    dragCounter.current[stage] = (dragCounter.current[stage] ?? 1) - 1
                    if ((dragCounter.current[stage] ?? 0) <= 0) {
                      dragCounter.current[stage] = 0
                      setDragOverStage(null)
                    }
                  }}
                  onDrop={e => {
                    e.preventDefault()
                    dragCounter.current[stage] = 0
                    if (draggingId) moveToStage(draggingId, stage)
                    setDragOverStage(null)
                    setDraggingId(null)
                  }}>

                  {/* Column header */}
                  <div className="flex flex-col gap-1 px-3 py-2.5 rounded-xl transition-all"
                    style={{
                      backgroundColor: isOver ? meta.bg : meta.bg,
                      border: `1px solid ${isOver ? meta.color : meta.border}`,
                      boxShadow: isOver ? `0 0 0 2px ${meta.color}30` : undefined,
                    }}>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: meta.color }}>
                        {meta.icon} {meta.shortLabel}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: `${meta.color}20`, color: meta.color }}>
                        {cards.length}
                      </span>
                    </div>
                    {stageVolume > 0 && (
                      <p className="text-[9px] font-semibold" style={{ color: `${meta.color}99` }}>
                        {fmtVolume(stageVolume)}/mo
                      </p>
                    )}
                  </div>

                  {/* Cards */}
                  <div className="flex flex-col gap-2 min-h-[80px] transition-all rounded-xl p-1.5"
                    style={{
                      backgroundColor: isOver ? `${meta.bg}` : 'transparent',
                      border: isOver ? `1px dashed ${meta.color}60` : '1px solid transparent',
                    }}>
                    {cards.length === 0 ? (
                      <div style={{ ...CARD_STYLE, opacity: isOver ? 0.7 : 0.35 }}>
                        <p className="p-5 text-center text-[10px]" style={{ color: BRAND.muted }}>
                          {isOver ? 'Drop here' : 'Empty'}
                        </p>
                      </div>
                    ) : (
                      cards.map(m => (
                        <KanbanCard key={m.id} merchant={m}
                          dragging={draggingId === m.id}
                          onDragStart={() => { setDraggingId(m.id) }}
                          onDragEnd={() => { setDraggingId(null); setDragOverStage(null) }}
                          onClick={() => setSelected(m)}
                        />
                      ))
                    )}
                    {isOver && cards.length > 0 && (
                      <div className="h-10 rounded-xl border-2 border-dashed flex items-center justify-center text-[10px] font-semibold"
                        style={{ borderColor: `${meta.color}60`, color: meta.color }}>
                        Drop here
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Declined toggle */}
          {declined.length > 0 && (
            <button onClick={() => setShowDeclined(v => !v)}
              className="mt-1 text-xs transition-opacity hover:opacity-60"
              style={{ color: 'rgba(255,255,255,0.3)' }}>
              {showDeclined
                ? '↑ Hide declined'
                : `↓ Show ${declined.length} declined merchant${declined.length !== 1 ? 's' : ''}`}
            </button>
          )}
        </div>

      ) : (
        /* ══ LIST VIEW ════════════════════════════════════════════════════════ */
        <div>
          <div className="rounded-xl overflow-hidden"
            style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: `${BRAND.cyan}0D`, borderBottom: `1px solid ${BRAND.borderCyan}` }}>
                  <tr>
                    {/* Sortable columns */}
                    {([
                      { key: 'name' as SortKey,         label: 'Business Name' },
                      { key: null,                       label: 'MCC' },
                      { key: null,                       label: 'Account Type' },
                      { key: 'monthly_volume' as SortKey, label: 'Monthly Vol.' },
                      { key: null,                       label: 'Stage' },
                      { key: null,                       label: 'Partner' },
                      { key: 'date_added' as SortKey,   label: 'Date Added' },
                      { key: 'days_in_stage' as SortKey, label: 'Days in Stage' },
                      { key: null,                       label: '' },
                    ] as { key: SortKey | null; label: string }[]).map(({ key, label }) => (
                      <th key={label}
                        className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-semibold"
                        style={{ color: `${BRAND.cyan}99`, cursor: key ? 'pointer' : 'default', whiteSpace: 'nowrap' }}
                        onClick={() => key && toggleSort(key)}>
                        <span className="flex items-center gap-1">
                          {label}
                          {key && <SortIcon k={key} />}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: BRAND.border }}>
                  {sorted.map(m => (
                    <tr key={m.id}
                      className="transition-colors hover:cursor-pointer"
                      style={{ backgroundColor: 'transparent' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                      <td className="px-4 py-3">
                        <div>
                          <button
                            onClick={() => setSelected(m)}
                            className="text-sm font-bold hover:underline text-left"
                            style={{ color: BRAND.cyan }}>
                            {m.name}
                          </button>
                          {m.dba_name && (
                            <p className="text-[10px] mt-0.5" style={{ color: BRAND.muted }}>
                              {m.dba_name}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-xs font-semibold" style={{ color: BRAND.text }}>{m.mcc}</p>
                          <p className="text-[10px] mt-0.5 max-w-[130px] truncate" style={{ color: BRAND.muted }}>{m.mcc_label}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <AccountTypeBadge type={m.account_type} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold" style={{ color: BRAND.cyan }}>
                          {fmtVolume(m.monthly_volume)}
                        </span>
                        <p className="text-[10px] mt-0.5" style={{ color: BRAND.muted }}>
                          avg {fmtCurrency(m.avg_ticket)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <StageBadge stage={m.pipeline_stage} />
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: BRAND.muted }}>
                        {m.partner}
                        <p className="text-[10px] mt-0.5 font-mono" style={{ color: `${BRAND.muted}80` }}>
                          {m.partner_iso}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: BRAND.muted }}>
                        {fmtDate(m.date_added)}
                      </td>
                      <td className="px-4 py-3">
                        <DaysChip days={m.days_in_stage} stage={m.pipeline_stage} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <RiskBadge risk={m.risk} />
                          <button
                            onClick={() => setSelected(m)}
                            className="p-1.5 rounded-lg transition-colors hover:opacity-70"
                            style={{ backgroundColor: `${BRAND.cyan}12`, color: BRAND.cyan, border: `1px solid ${BRAND.borderCyan}` }}>
                            <MoreHorizontal size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {sorted.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-sm" style={{ color: BRAND.muted }}>No merchants match your search.</p>
                </div>
              )}
            </div>
          </div>

          {/* Declined toggle for list view */}
          {declined.length > 0 && (
            <button onClick={() => setShowDeclined(v => !v)}
              className="mt-3 text-xs transition-opacity hover:opacity-60"
              style={{ color: 'rgba(255,255,255,0.3)' }}>
              {showDeclined
                ? '↑ Hide declined'
                : `↓ Show ${declined.length} declined merchant${declined.length !== 1 ? 's' : ''}`}
            </button>
          )}

          {/* Table summary */}
          <div className="mt-3 flex items-center gap-4 text-xs" style={{ color: BRAND.muted }}>
            <span>{sorted.length} merchants shown</span>
            <span>|</span>
            <span>
              Total pipeline:{' '}
              <strong style={{ color: BRAND.cyan }}>
                {fmtVolume(sorted.reduce((s, m) => s + m.monthly_volume, 0))}/mo
              </strong>
            </span>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {showAddModal && (
        <AddMerchantModal onClose={() => setShowAddModal(false)} onAdded={handleAdded} />
      )}
      {selected && (
        <MerchantDetailModal
          merchant={selected}
          onClose={() => setSelected(null)}
          onStageChange={(id, stage) => {
            handleStageChange(id, stage)
            setSelected(null)
          }}
        />
      )}
    </div>
  )
}
