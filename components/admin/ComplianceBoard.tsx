'use client'

import { useState } from 'react'
import {
  Search, X, AlertTriangle, CheckCircle, Clock, FileText,
  ShieldAlert, ShieldCheck, Filter, Flag,
} from 'lucide-react'
import { BRAND } from '@/lib/brand'
import { fmtDate } from '@/lib/utils'

// ─── Types ─────────────────────────────────────────────────────────────────────

type KYCStatus = 'verified' | 'pending' | 'failed'
type PCIStatus = 'compliant' | 'in-progress' | 'non-compliant'
type RiskLevel = 'low' | 'medium' | 'high'

type Documents = {
  business_license: boolean
  voided_check: boolean
  owner_id: boolean
  processing_statements: boolean
  pci_saq: boolean
}

type MerchantCompliance = {
  id: string
  merchant_name: string
  mcc: string
  mcc_label: string
  account_type: 'retail' | 'ecommerce' | 'restaurant' | 'healthcare' | 'services'
  kyc_status: KYCStatus
  pci_status: PCIStatus
  last_review: string
  next_review: string
  risk_level: RiskLevel
  documents: Documents
  flag_note?: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_MERCHANTS: MerchantCompliance[] = [
  {
    id: '1',
    merchant_name: 'Beachside Grille & Bar',
    mcc: '5812',
    mcc_label: 'Restaurants',
    account_type: 'restaurant',
    kyc_status: 'verified',
    pci_status: 'compliant',
    last_review: '2025-03-15',
    next_review: '2026-03-15',
    risk_level: 'low',
    documents: { business_license: true, voided_check: true, owner_id: true, processing_statements: true, pci_saq: true },
  },
  {
    id: '2',
    merchant_name: 'NovaMed Health Clinic',
    mcc: '8099',
    mcc_label: 'Health Services',
    account_type: 'healthcare',
    kyc_status: 'verified',
    pci_status: 'in-progress',
    last_review: '2025-01-20',
    next_review: '2025-07-20',
    risk_level: 'medium',
    documents: { business_license: true, voided_check: true, owner_id: true, processing_statements: true, pci_saq: false },
    flag_note: 'PCI SAQ overdue — clinic uses card storage',
  },
  {
    id: '3',
    merchant_name: 'Coral Bay Boutique',
    mcc: '5621',
    mcc_label: 'Women\'s Clothing',
    account_type: 'retail',
    kyc_status: 'pending',
    pci_status: 'in-progress',
    last_review: '2025-04-01',
    next_review: '2025-10-01',
    risk_level: 'medium',
    documents: { business_license: true, voided_check: true, owner_id: false, processing_statements: true, pci_saq: false },
  },
  {
    id: '4',
    merchant_name: 'Apex Digital Commerce',
    mcc: '5965',
    mcc_label: 'E-Commerce',
    account_type: 'ecommerce',
    kyc_status: 'failed',
    pci_status: 'non-compliant',
    last_review: '2024-11-10',
    next_review: '2025-02-10',
    risk_level: 'high',
    documents: { business_license: true, voided_check: false, owner_id: false, processing_statements: false, pci_saq: false },
    flag_note: 'FLAGGED: Multiple chargeback alerts, missing owner ID and bank docs. Escalate to compliance team.',
  },
  {
    id: '5',
    merchant_name: 'Harbor Auto Parts',
    mcc: '5013',
    mcc_label: 'Auto Parts',
    account_type: 'retail',
    kyc_status: 'verified',
    pci_status: 'compliant',
    last_review: '2025-02-28',
    next_review: '2026-02-28',
    risk_level: 'low',
    documents: { business_license: true, voided_check: true, owner_id: true, processing_statements: true, pci_saq: true },
  },
  {
    id: '6',
    merchant_name: 'Sunrise Consulting LLC',
    mcc: '7389',
    mcc_label: 'Business Services',
    account_type: 'services',
    kyc_status: 'verified',
    pci_status: 'compliant',
    last_review: '2025-04-10',
    next_review: '2026-04-10',
    risk_level: 'low',
    documents: { business_license: true, voided_check: true, owner_id: true, processing_statements: true, pci_saq: true },
  },
  {
    id: '7',
    merchant_name: 'TechFront Solutions',
    mcc: '7372',
    mcc_label: 'Software / SaaS',
    account_type: 'ecommerce',
    kyc_status: 'pending',
    pci_status: 'in-progress',
    last_review: '2025-05-01',
    next_review: '2025-08-01',
    risk_level: 'medium',
    documents: { business_license: true, voided_check: true, owner_id: true, processing_statements: false, pci_saq: false },
    flag_note: 'Awaiting 3 months processing statements from previous processor',
  },
  {
    id: '8',
    merchant_name: 'Gulf Coast Imports',
    mcc: '5999',
    mcc_label: 'Miscellaneous Retail',
    account_type: 'retail',
    kyc_status: 'failed',
    pci_status: 'non-compliant',
    last_review: '2024-09-05',
    next_review: '2025-03-05',
    risk_level: 'high',
    documents: { business_license: false, voided_check: false, owner_id: false, processing_statements: false, pci_saq: false },
    flag_note: 'FLAGGED: All documents missing. Possible shell entity — referred to AML review.',
  },
  {
    id: '9',
    merchant_name: 'Palermo\'s Fine Dining',
    mcc: '5812',
    mcc_label: 'Restaurants',
    account_type: 'restaurant',
    kyc_status: 'verified',
    pci_status: 'compliant',
    last_review: '2025-03-22',
    next_review: '2026-03-22',
    risk_level: 'low',
    documents: { business_license: true, voided_check: true, owner_id: true, processing_statements: true, pci_saq: true },
  },
  {
    id: '10',
    merchant_name: 'Vertex Marketing Group',
    mcc: '7311',
    mcc_label: 'Advertising',
    account_type: 'services',
    kyc_status: 'pending',
    pci_status: 'in-progress',
    last_review: '2025-05-15',
    next_review: '2025-08-15',
    risk_level: 'medium',
    documents: { business_license: true, voided_check: true, owner_id: false, processing_statements: true, pci_saq: false },
  },
]

// ─── Style constants ───────────────────────────────────────────────────────────

const CARD: React.CSSProperties = {
  backgroundColor: BRAND.card,
  border: `1px solid ${BRAND.border}`,
  borderRadius: 16,
}

const INPUT_STYLE: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.04)',
  border: `1px solid rgba(144,196,207,0.18)`,
  borderRadius: 10,
  color: BRAND.text,
  fontSize: 13,
  outline: 'none',
  padding: '9px 12px',
  width: '100%',
}

const LABEL_STYLE: React.CSSProperties = {
  color: `rgba(144,196,207,0.55)`,
  display: 'block',
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: '0.12em',
  marginBottom: 5,
  textTransform: 'uppercase',
}

// ─── Status helpers ────────────────────────────────────────────────────────────

const KYC_META: Record<KYCStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  verified: { label: 'Verified',  color: BRAND.success, bg: 'rgba(61,214,140,0.10)',  icon: <CheckCircle size={10} /> },
  pending:  { label: 'Pending',   color: BRAND.warn,    bg: 'rgba(240,178,62,0.10)',  icon: <Clock size={10} /> },
  failed:   { label: 'Failed',    color: BRAND.danger,  bg: 'rgba(232,80,74,0.10)',   icon: <X size={10} /> },
}

const PCI_META: Record<PCIStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  compliant:      { label: 'Compliant',    color: BRAND.success, bg: 'rgba(61,214,140,0.10)',  icon: <ShieldCheck size={10} /> },
  'in-progress':  { label: 'In Progress',  color: BRAND.warn,    bg: 'rgba(240,178,62,0.10)',  icon: <Clock size={10} /> },
  'non-compliant':{ label: 'Non-Compliant',color: BRAND.danger,  bg: 'rgba(232,80,74,0.10)',   icon: <ShieldAlert size={10} /> },
}

const RISK_META: Record<RiskLevel, { color: string; bg: string }> = {
  low:    { color: BRAND.success, bg: 'rgba(61,214,140,0.10)' },
  medium: { color: BRAND.warn,    bg: 'rgba(240,178,62,0.10)' },
  high:   { color: BRAND.danger,  bg: 'rgba(232,80,74,0.10)' },
}

function StatusBadge({ status, meta }: { status: string; meta: { label: string; color: string; bg: string; icon: React.ReactNode } }) {
  return (
    <span style={{
      backgroundColor: meta.bg, color: meta.color,
      borderRadius: 20, fontSize: 10, fontWeight: 700,
      padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: 4,
      whiteSpace: 'nowrap',
    }}>
      {meta.icon}{meta.label}
    </span>
  )
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const m = RISK_META[level]
  return (
    <span style={{
      backgroundColor: m.bg, color: m.color,
      borderRadius: 20, fontSize: 10, fontWeight: 800,
      padding: '3px 8px', textTransform: 'uppercase', letterSpacing: '0.06em',
    }}>
      {level}
    </span>
  )
}

// ─── Document Checklist ────────────────────────────────────────────────────────

const DOC_LABELS: { key: keyof Documents; label: string }[] = [
  { key: 'business_license',      label: 'Business License' },
  { key: 'voided_check',          label: 'Voided Check' },
  { key: 'owner_id',              label: 'Owner ID' },
  { key: 'processing_statements', label: 'Processing Statements (3mo)' },
  { key: 'pci_saq',               label: 'PCI SAQ Form' },
]

function DocChecklist({ docs }: { docs: Documents }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {DOC_LABELS.map(({ key, label }) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          {docs[key]
            ? <CheckCircle size={12} style={{ color: BRAND.success, flexShrink: 0 }} />
            : <X size={12} style={{ color: BRAND.danger, flexShrink: 0 }} />
          }
          <span style={{ fontSize: 11, color: docs[key] ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.35)', textDecoration: docs[key] ? 'none' : 'line-through' }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Flag Merchant Modal ──────────────────────────────────────────────────────

function FlagModal({
  merchant,
  onClose,
  onSave,
}: {
  merchant: MerchantCompliance
  onClose: () => void
  onSave: (id: string, note: string, risk: RiskLevel) => void
}) {
  const [note, setNote] = useState(merchant.flag_note ?? '')
  const [risk, setRisk] = useState<RiskLevel>(merchant.risk_level)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)', padding: 16,
    }}>
      <div style={{ ...CARD, width: '100%', maxWidth: 480 }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px', borderBottom: `1px solid ${BRAND.border}`,
        }}>
          <div>
            <p style={{ color: BRAND.danger, fontSize: 15, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Flag size={14} /> Flag Merchant
            </p>
            <p style={{ color: BRAND.muted, fontSize: 12, margin: '2px 0 0' }}>{merchant.merchant_name}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: BRAND.muted }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <span style={LABEL_STYLE}>Risk Level</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['low', 'medium', 'high'] as RiskLevel[]).map(r => {
                const m = RISK_META[r]
                return (
                  <button key={r} onClick={() => setRisk(r)} style={{
                    flex: 1, padding: '9px 0', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    textTransform: 'capitalize',
                    backgroundColor: risk === r ? m.bg : 'transparent',
                    border: `1px solid ${risk === r ? m.color + '55' : BRAND.border}`,
                    color: risk === r ? m.color : BRAND.muted,
                  }}>
                    {r}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <span style={LABEL_STYLE}>Compliance Note</span>
            <textarea
              value={note} onChange={e => setNote(e.target.value)}
              placeholder="Describe the compliance concern, required actions, escalation status…"
              rows={4} style={{ ...INPUT_STYLE, resize: 'vertical' as const }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              backgroundColor: 'transparent', border: `1px solid ${BRAND.border}`, color: BRAND.muted,
            }}>Cancel</button>
            <button onClick={() => { onSave(merchant.id, note, risk); onClose() }} style={{
              flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              backgroundColor: BRAND.danger, border: 'none', color: '#fff',
            }}>Save Flag</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Expanded Row ──────────────────────────────────────────────────────────────

function ExpandedRow({ merchant }: { merchant: MerchantCompliance }) {
  return (
    <tr>
      <td colSpan={9} style={{ padding: 0 }}>
        <div style={{
          backgroundColor: 'rgba(144,196,207,0.03)',
          borderTop: `1px solid ${BRAND.border}`,
          borderBottom: `1px solid ${BRAND.border}`,
          padding: '16px 24px',
          display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start',
        }}>
          <div>
            <p style={{ color: BRAND.muted, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 10px' }}>
              Required Documents
            </p>
            <DocChecklist docs={merchant.documents} />
          </div>
          {merchant.flag_note && (
            <div style={{ flex: 1, minWidth: 220 }}>
              <p style={{ color: BRAND.danger, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 5 }}>
                <AlertTriangle size={10} /> Compliance Note
              </p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>
                {merchant.flag_note}
              </p>
            </div>
          )}
          <div>
            <p style={{ color: BRAND.muted, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px' }}>
              Review Schedule
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <p style={{ color: BRAND.muted, fontSize: 11, margin: 0 }}>
                Last: <span style={{ color: BRAND.text }}>{fmtDate(merchant.last_review)}</span>
              </p>
              <p style={{ color: BRAND.muted, fontSize: 11, margin: 0 }}>
                Next: <span style={{ color: BRAND.warn }}>{fmtDate(merchant.next_review)}</span>
              </p>
            </div>
          </div>
        </div>
      </td>
    </tr>
  )
}

// ─── KPI Card ──────────────────────────────────────────────────────────────────

function KPICard({ label, value, sub, color, icon }: {
  label: string; value: number; sub: string; color: string; icon: React.ReactNode
}) {
  return (
    <div style={{ ...CARD, padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <p style={{ color: BRAND.muted, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{label}</p>
        <span style={{ color }}>{icon}</span>
      </div>
      <p style={{ color, fontSize: 26, fontWeight: 800, margin: '0 0 4px', lineHeight: 1 }}>{value}</p>
      <p style={{ color: BRAND.muted, fontSize: 11, margin: 0 }}>{sub}</p>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ComplianceBoard() {
  const [merchants, setMerchants] = useState<MerchantCompliance[]>(MOCK_MERCHANTS)
  const [riskFilter, setRiskFilter] = useState<'all' | RiskLevel>('all')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [flagTarget, setFlagTarget] = useState<MerchantCompliance | null>(null)

  const filtered = merchants.filter(m => {
    if (riskFilter !== 'all' && m.risk_level !== riskFilter) return false
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      m.merchant_name.toLowerCase().includes(q) ||
      m.mcc.includes(q) ||
      m.mcc_label.toLowerCase().includes(q) ||
      m.account_type.toLowerCase().includes(q)
    )
  })

  const fullyCompliant  = merchants.filter(m => m.kyc_status === 'verified' && m.pci_status === 'compliant').length
  const pendingReview   = merchants.filter(m => m.kyc_status === 'pending' || m.pci_status === 'in-progress').length
  const flaggedAtRisk   = merchants.filter(m => m.risk_level === 'high').length
  const overdueDocs     = merchants.filter(m => Object.values(m.documents).some(v => !v)).length

  const flaggedMerchants = merchants.filter(m => m.risk_level === 'high' || m.kyc_status === 'failed')

  function handleFlagSave(id: string, note: string, risk: RiskLevel) {
    setMerchants(prev => prev.map(m => m.id === id ? { ...m, flag_note: note, risk_level: risk } : m))
  }

  function toggleRow(id: string) {
    setExpandedId(prev => prev === id ? null : id)
  }

  const RISK_TABS: { key: 'all' | RiskLevel; label: string; count: number }[] = [
    { key: 'all',    label: 'All',    count: merchants.length },
    { key: 'low',    label: 'Low',    count: merchants.filter(m => m.risk_level === 'low').length },
    { key: 'medium', label: 'Medium', count: merchants.filter(m => m.risk_level === 'medium').length },
    { key: 'high',   label: 'High',   count: merchants.filter(m => m.risk_level === 'high').length },
  ]

  return (
    <div style={{ padding: '28px 28px 64px' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-0.01em',
          background: 'linear-gradient(90deg, #C9D1D9 0%, #FFF 45%, #8A929C 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          KYC / Compliance Tracker
        </h1>
        <p style={{ color: BRAND.muted, fontSize: 13, margin: '4px 0 0' }}>
          Monitor merchant verification status, document collection, and PCI compliance
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <KPICard label="Fully Compliant"   value={fullyCompliant} sub="verified + PCI compliant" color={BRAND.success} icon={<ShieldCheck size={16} />} />
        <KPICard label="Pending Review"    value={pendingReview}  sub="KYC or PCI incomplete"    color={BRAND.warn}    icon={<Clock size={16} />} />
        <KPICard label="Flagged / At Risk" value={flaggedAtRisk}  sub="high risk merchants"      color={BRAND.danger}  icon={<AlertTriangle size={16} />} />
        <KPICard label="Overdue Docs"      value={overdueDocs}    sub="missing documents"         color={BRAND.silverLo} icon={<FileText size={16} />} />
      </div>

      {/* Flagged Alert Banner */}
      {flaggedMerchants.length > 0 && (
        <div style={{
          backgroundColor: 'rgba(232,80,74,0.08)',
          border: `1px solid rgba(232,80,74,0.30)`,
          borderRadius: 12,
          padding: '14px 18px',
          marginBottom: 24,
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <AlertTriangle size={16} style={{ color: BRAND.danger, flexShrink: 0, marginTop: 1 }} />
          <div style={{ flex: 1 }}>
            <p style={{ color: BRAND.danger, fontSize: 13, fontWeight: 700, margin: '0 0 6px' }}>
              {flaggedMerchants.length} Flagged Merchant{flaggedMerchants.length > 1 ? 's' : ''} Require Attention
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px' }}>
              {flaggedMerchants.map(m => (
                <span key={m.id} style={{ color: 'rgba(232,80,74,0.75)', fontSize: 12 }}>
                  {m.merchant_name} — {m.kyc_status === 'failed' ? 'KYC Failed' : 'High Risk'}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {/* Risk tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${BRAND.border}` }}>
          {RISK_TABS.map(tab => {
            const c = tab.key === 'all' ? BRAND.cyan : RISK_META[tab.key]?.color ?? BRAND.cyan
            return (
              <button key={tab.key} onClick={() => setRiskFilter(tab.key)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '7px 12px', fontSize: 12, fontWeight: 600,
                color: riskFilter === tab.key ? c : BRAND.muted,
                borderBottom: riskFilter === tab.key ? `2px solid ${c}` : '2px solid transparent',
                transition: 'color 0.15s',
              }}>
                {tab.label} <span style={{ opacity: 0.55 }}>({tab.count})</span>
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={13} style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: `rgba(144,196,207,0.5)`, pointerEvents: 'none',
          }} />
          <input
            type="text" placeholder="Search merchant, MCC, account type…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...INPUT_STYLE, paddingLeft: 34, paddingRight: search ? 34 : 12 }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: BRAND.muted,
            }}>
              <X size={12} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: BRAND.muted, fontSize: 12 }}>
          <Filter size={12} />
          {filtered.length} of {merchants.length}
        </div>
      </div>

      {/* Table */}
      <div style={{ ...CARD, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(144,196,207,0.05)', borderBottom: `1px solid rgba(144,196,207,0.12)` }}>
                {['Merchant', 'MCC', 'Type', 'KYC Status', 'PCI Status', 'Risk Level', 'Next Review', 'Docs', 'Actions'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '11px 16px',
                    color: 'rgba(144,196,207,0.55)', fontSize: 10,
                    fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em',
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '48px 0', color: BRAND.muted, fontSize: 13 }}>
                    No merchants match your filters.
                  </td>
                </tr>
              ) : (
                filtered.flatMap((m, idx) => {
                  const isExpanded = expandedId === m.id
                  const isHighRisk = m.risk_level === 'high'
                  const docsComplete = Object.values(m.documents).every(Boolean)
                  const docsCount = Object.values(m.documents).filter(Boolean).length

                  const rows = [
                    <tr key={m.id}
                      style={{
                        borderBottom: !isExpanded && idx < filtered.length - 1 ? `1px solid ${BRAND.border}` : 'none',
                        backgroundColor: isHighRisk ? 'rgba(232,80,74,0.03)' : 'transparent',
                        borderLeft: isHighRisk ? `3px solid ${BRAND.danger}` : '3px solid transparent',
                        cursor: 'pointer',
                      }}
                      onClick={() => toggleRow(m.id)}
                      onMouseEnter={e => !isHighRisk && (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.015)')}
                      onMouseLeave={e => !isHighRisk && (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '13px 16px' }}>
                        <p style={{ color: BRAND.text, fontSize: 13, fontWeight: 600, margin: 0 }}>{m.merchant_name}</p>
                        {m.flag_note && !isExpanded && (
                          <p style={{ color: BRAND.danger, fontSize: 10, margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: 3 }}>
                            <AlertTriangle size={9} /> Flagged
                          </p>
                        )}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <p style={{ color: BRAND.muted, fontSize: 12, margin: 0, fontFamily: 'monospace' }}>{m.mcc}</p>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, margin: '1px 0 0' }}>{m.mcc_label}</p>
                      </td>
                      <td style={{ padding: '13px 16px', color: BRAND.muted, fontSize: 12, textTransform: 'capitalize' }}>
                        {m.account_type}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <StatusBadge status={m.kyc_status} meta={KYC_META[m.kyc_status]} />
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <StatusBadge status={m.pci_status} meta={PCI_META[m.pci_status]} />
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <RiskBadge level={m.risk_level} />
                      </td>
                      <td style={{ padding: '13px 16px', color: BRAND.muted, fontSize: 12, whiteSpace: 'nowrap' }}>
                        {fmtDate(m.next_review)}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{
                          fontSize: 11, fontWeight: 700,
                          color: docsComplete ? BRAND.success : BRAND.warn,
                        }}>
                          {docsCount}/5
                        </span>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <button
                          onClick={e => { e.stopPropagation(); setFlagTarget(m) }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            padding: '5px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                            backgroundColor: m.flag_note ? 'rgba(232,80,74,0.12)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${m.flag_note ? 'rgba(232,80,74,0.3)' : BRAND.border}`,
                            color: m.flag_note ? BRAND.danger : BRAND.muted,
                          }}
                        >
                          <Flag size={10} /> Flag
                        </button>
                      </td>
                    </tr>,
                  ]

                  if (isExpanded) {
                    rows.push(<ExpandedRow key={`${m.id}-exp`} merchant={m} />)
                  }

                  return rows
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 12, textAlign: 'center' }}>
        Click any row to expand documents and compliance notes
      </p>

      {flagTarget && (
        <FlagModal
          merchant={flagTarget}
          onClose={() => setFlagTarget(null)}
          onSave={handleFlagSave}
        />
      )}
    </div>
  )
}
