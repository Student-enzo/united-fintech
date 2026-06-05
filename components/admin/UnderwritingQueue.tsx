'use client'

import { useState } from 'react'
import {
  Search, X, AlertTriangle, CheckCircle, Clock, FileText,
  ChevronDown, ChevronRight, Upload, MessageSquare, MoreHorizontal,
  Send, Filter, Building2, Info,
} from 'lucide-react'
import { BRAND } from '@/lib/brand'
import { fmtDate } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type UWStatus =
  | 'submitted'
  | 'under_review'
  | 'conditionally_approved'
  | 'approved'
  | 'declined'
  | 'more_info_requested'

type AccountType = 'Card Present' | 'eCommerce' | 'MOTO' | 'ACH'
type Processor   = 'Paysafe' | 'Worldpay' | 'Fiserv' | 'TSYS' | 'NMI'

type Documents = {
  business_license: boolean
  voided_check: boolean
  owner_id: boolean
  processing_statements: boolean
  pci_saq: boolean
}

type TimelineEntry = {
  date: string
  status: UWStatus
  note: string
}

type Condition = string

type Application = {
  id: string
  merchant_name: string
  dba: string
  mcc: string
  mcc_label: string
  account_type: AccountType
  monthly_volume: number
  processor: Processor
  processor_contact: string
  processor_email: string
  submitted_date: string
  status: UWStatus
  next_action: string
  info_requested?: string
  info_deadline?: string
  conditions?: Condition[]
  documents: Documents
  timeline: TimelineEntry[]
  notes: string[]
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK: Application[] = [
  {
    id: '1',
    merchant_name: 'Coastal Payments LLC',
    dba: 'Coastal Pay',
    mcc: '5411', mcc_label: 'Grocery Stores',
    account_type: 'Card Present',
    monthly_volume: 85000,
    processor: 'Worldpay',
    processor_contact: 'Mark Sloan',
    processor_email: 'msloan@worldpay.com',
    submitted_date: '2026-05-22',
    status: 'under_review',
    next_action: 'Awaiting processor',
    documents: { business_license: true, voided_check: true, owner_id: true, processing_statements: true, pci_saq: false },
    timeline: [
      { date: '2026-05-22', status: 'submitted', note: 'Application submitted to Worldpay' },
      { date: '2026-05-24', status: 'under_review', note: 'Processor confirmed receipt, assigned to underwriter' },
    ],
    notes: ['Initial call completed with merchant owner. No chargebacks in prior 12 months.'],
  },
  {
    id: '2',
    merchant_name: 'Apex Digital Commerce',
    dba: 'ApexDC',
    mcc: '5965', mcc_label: 'E-Commerce',
    account_type: 'eCommerce',
    monthly_volume: 220000,
    processor: 'Paysafe',
    processor_contact: 'Sandra Liu',
    processor_email: 'sandra.liu@paysafe.com',
    submitted_date: '2026-05-10',
    status: 'more_info_requested',
    next_action: 'Upload voided check',
    info_requested: 'Processor requires a voided check and 3 months of most recent bank statements.',
    info_deadline: '2026-06-12',
    documents: { business_license: true, voided_check: false, owner_id: true, processing_statements: true, pci_saq: true },
    timeline: [
      { date: '2026-05-10', status: 'submitted', note: 'Application submitted to Paysafe' },
      { date: '2026-05-13', status: 'under_review', note: 'Underwriting review started' },
      { date: '2026-05-20', status: 'more_info_requested', note: 'Processor requested voided check + bank statements' },
    ],
    notes: ['High volume eComm — chargeback ratio acceptable at 0.4%.'],
  },
  {
    id: '3',
    merchant_name: 'NovaMed Health Clinic',
    dba: 'NovaMed',
    mcc: '8099', mcc_label: 'Health Services',
    account_type: 'MOTO',
    monthly_volume: 42000,
    processor: 'TSYS',
    processor_contact: 'Greg Hutton',
    processor_email: 'g.hutton@tsys.com',
    submitted_date: '2026-05-28',
    status: 'submitted',
    next_action: 'Awaiting processor',
    documents: { business_license: true, voided_check: true, owner_id: true, processing_statements: false, pci_saq: false },
    timeline: [
      { date: '2026-05-28', status: 'submitted', note: 'Application sent to TSYS underwriting queue' },
    ],
    notes: [],
  },
  {
    id: '4',
    merchant_name: 'Harbor Auto Parts',
    dba: 'Harbor Auto',
    mcc: '5013', mcc_label: 'Auto Parts',
    account_type: 'Card Present',
    monthly_volume: 67000,
    processor: 'Fiserv',
    processor_contact: 'Tina Morales',
    processor_email: 't.morales@fiserv.com',
    submitted_date: '2026-05-01',
    status: 'approved',
    next_action: 'Schedule boarding',
    documents: { business_license: true, voided_check: true, owner_id: true, processing_statements: true, pci_saq: true },
    timeline: [
      { date: '2026-05-01', status: 'submitted', note: 'Application submitted' },
      { date: '2026-05-03', status: 'under_review', note: 'Assigned to underwriter' },
      { date: '2026-05-08', status: 'approved', note: 'Approved — all docs verified, low risk profile' },
    ],
    notes: ['Existing merchant relationship. No issues expected.'],
  },
  {
    id: '5',
    merchant_name: 'TechFront Solutions',
    dba: 'TechFront',
    mcc: '7372', mcc_label: 'Software / SaaS',
    account_type: 'eCommerce',
    monthly_volume: 310000,
    processor: 'NMI',
    processor_contact: 'Dana Park',
    processor_email: 'd.park@nmi.com',
    submitted_date: '2026-05-14',
    status: 'conditionally_approved',
    next_action: 'Submit rolling reserve agreement',
    conditions: [
      'Rolling reserve of 10% for 180 days',
      'Monthly chargeback threshold: 0.5%',
      'Annual review required at 12 months',
    ],
    documents: { business_license: true, voided_check: true, owner_id: true, processing_statements: true, pci_saq: true },
    timeline: [
      { date: '2026-05-14', status: 'submitted', note: 'Application submitted to NMI' },
      { date: '2026-05-17', status: 'under_review', note: 'High volume flagged for senior underwriter review' },
      { date: '2026-05-29', status: 'conditionally_approved', note: 'Conditionally approved — reserve required for high-volume SaaS' },
    ],
    notes: ['Merchant acceptable — volume warrants reserve. Prepare rolling reserve docs.'],
  },
  {
    id: '6',
    merchant_name: 'Gulf Coast Imports',
    dba: 'GCI',
    mcc: '5999', mcc_label: 'Miscellaneous Retail',
    account_type: 'Card Present',
    monthly_volume: 28000,
    processor: 'Paysafe',
    processor_contact: 'Sandra Liu',
    processor_email: 'sandra.liu@paysafe.com',
    submitted_date: '2026-04-20',
    status: 'declined',
    next_action: 'Discuss with merchant, explore alternatives',
    documents: { business_license: true, voided_check: false, owner_id: false, processing_statements: false, pci_saq: false },
    timeline: [
      { date: '2026-04-20', status: 'submitted', note: 'Application submitted' },
      { date: '2026-04-23', status: 'under_review', note: 'Under review' },
      { date: '2026-05-02', status: 'more_info_requested', note: 'Missing owner ID and financials' },
      { date: '2026-05-15', status: 'declined', note: 'Declined — insufficient documentation, high-risk MCC without financials' },
    ],
    notes: ['Merchant declined. Consider re-applying through TSYS with complete package.'],
  },
  {
    id: '7',
    merchant_name: 'Beachside Grille & Bar',
    dba: 'Beachside Grille',
    mcc: '5812', mcc_label: 'Restaurants',
    account_type: 'Card Present',
    monthly_volume: 55000,
    processor: 'Worldpay',
    processor_contact: 'Mark Sloan',
    processor_email: 'msloan@worldpay.com',
    submitted_date: '2026-05-30',
    status: 'submitted',
    next_action: 'Awaiting processor',
    documents: { business_license: true, voided_check: true, owner_id: true, processing_statements: true, pci_saq: true },
    timeline: [
      { date: '2026-05-30', status: 'submitted', note: 'Full package submitted to Worldpay' },
    ],
    notes: [],
  },
  {
    id: '8',
    merchant_name: 'Sunrise Consulting LLC',
    dba: 'Sunrise Consulting',
    mcc: '7389', mcc_label: 'Business Services',
    account_type: 'ACH',
    monthly_volume: 19000,
    processor: 'Fiserv',
    processor_contact: 'Tina Morales',
    processor_email: 't.morales@fiserv.com',
    submitted_date: '2026-05-19',
    status: 'more_info_requested',
    next_action: 'Owner ID needed',
    info_requested: 'Processor cannot proceed without government-issued photo ID for all beneficial owners (25%+ stake).',
    info_deadline: '2026-06-08',
    documents: { business_license: true, voided_check: true, owner_id: false, processing_statements: true, pci_saq: false },
    timeline: [
      { date: '2026-05-19', status: 'submitted', note: 'ACH application submitted' },
      { date: '2026-05-22', status: 'under_review', note: 'Under review' },
      { date: '2026-05-27', status: 'more_info_requested', note: 'Owner ID required for all beneficial owners' },
    ],
    notes: ['LLC has 3 partners at 33% each. Need IDs for all three.'],
  },
  {
    id: '9',
    merchant_name: 'Palermo\'s Fine Dining',
    dba: 'Palermo\'s',
    mcc: '5812', mcc_label: 'Restaurants',
    account_type: 'Card Present',
    monthly_volume: 73000,
    processor: 'TSYS',
    processor_contact: 'Greg Hutton',
    processor_email: 'g.hutton@tsys.com',
    submitted_date: '2026-05-05',
    status: 'approved',
    next_action: 'Initiate boarding',
    documents: { business_license: true, voided_check: true, owner_id: true, processing_statements: true, pci_saq: true },
    timeline: [
      { date: '2026-05-05', status: 'submitted', note: 'Application submitted to TSYS' },
      { date: '2026-05-07', status: 'under_review', note: 'Assigned to underwriter' },
      { date: '2026-05-12', status: 'approved', note: 'Approved — clean file, established restaurant' },
    ],
    notes: ['Smooth approval. Initiate MID setup.'],
  },
  {
    id: '10',
    merchant_name: 'Vertex Marketing Group',
    dba: 'Vertex MG',
    mcc: '7311', mcc_label: 'Advertising',
    account_type: 'eCommerce',
    monthly_volume: 145000,
    processor: 'NMI',
    processor_contact: 'Dana Park',
    processor_email: 'd.park@nmi.com',
    submitted_date: '2026-05-24',
    status: 'under_review',
    next_action: 'Follow up processor',
    documents: { business_license: true, voided_check: true, owner_id: true, processing_statements: true, pci_saq: false },
    timeline: [
      { date: '2026-05-24', status: 'submitted', note: 'Application submitted to NMI' },
      { date: '2026-05-26', status: 'under_review', note: 'Confirmed receipt, under review' },
    ],
    notes: ['Digital ad agency — PCI SAQ pending from merchant.'],
  },
]

// ─── Style helpers ────────────────────────────────────────────────────────────

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

const STATUS_META: Record<UWStatus, { label: string; color: string; bg: string }> = {
  submitted:              { label: 'Submitted',              color: '#8A929C',  bg: 'rgba(138,146,156,0.12)' },
  under_review:           { label: 'Under Review',           color: '#90c4cf',  bg: 'rgba(144,196,207,0.12)' },
  conditionally_approved: { label: 'Cond. Approved',         color: '#FCD34D',  bg: 'rgba(252,211,77,0.12)'  },
  approved:               { label: 'Approved',               color: '#6EE7B7',  bg: 'rgba(110,231,183,0.12)' },
  declined:               { label: 'Declined',               color: '#E8504A',  bg: 'rgba(232,80,74,0.12)'   },
  more_info_requested:    { label: 'More Info Needed',        color: '#C084FC',  bg: 'rgba(192,132,252,0.12)' },
}

type StatusFilterKey = 'all' | 'pending' | 'approved' | 'declined' | 'more_info_requested'

const STATUS_TABS: { key: StatusFilterKey; label: string }[] = [
  { key: 'all',                label: 'All'              },
  { key: 'pending',            label: 'Pending'          },
  { key: 'approved',           label: 'Approved'         },
  { key: 'declined',           label: 'Declined'         },
  { key: 'more_info_requested',label: 'More Info Needed' },
]

const DOC_LABELS: { key: keyof Documents; label: string }[] = [
  { key: 'business_license',      label: 'Business License'               },
  { key: 'voided_check',          label: 'Voided Check'                   },
  { key: 'owner_id',              label: 'Owner / Beneficial Owner ID'    },
  { key: 'processing_statements', label: 'Processing Statements (3 mo.)'  },
  { key: 'pci_saq',               label: 'PCI SAQ Form'                   },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysInQueue(submitted: string): number {
  const ms = Date.now() - new Date(submitted).getTime()
  return Math.floor(ms / 86_400_000)
}

function fmtVolume(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function matchesFilter(app: Application, tab: StatusFilterKey): boolean {
  if (tab === 'all') return true
  if (tab === 'pending') return app.status === 'submitted' || app.status === 'under_review' || app.status === 'conditionally_approved'
  if (tab === 'approved') return app.status === 'approved'
  if (tab === 'declined') return app.status === 'declined'
  if (tab === 'more_info_requested') return app.status === 'more_info_requested'
  return true
}

// ─── Small reusable components ────────────────────────────────────────────────

function StatusBadge({ status }: { status: UWStatus }) {
  const m = STATUS_META[status]
  return (
    <span style={{
      backgroundColor: m.bg, color: m.color,
      borderRadius: 20, fontSize: 10, fontWeight: 700,
      padding: '3px 9px', display: 'inline-block', whiteSpace: 'nowrap',
    }}>
      {m.label}
    </span>
  )
}

function DaysChip({ days }: { days: number }) {
  const color = days > 10 ? BRAND.danger : days > 5 ? '#FCD34D' : BRAND.muted
  const bg    = days > 10 ? 'rgba(232,80,74,0.12)' : days > 5 ? 'rgba(252,211,77,0.10)' : 'transparent'
  return (
    <span style={{
      color, backgroundColor: bg,
      borderRadius: 8, fontSize: 11, fontWeight: 700,
      padding: days > 5 ? '2px 7px' : '0',
    }}>
      {days}d
    </span>
  )
}

function DocChecklist({ docs }: { docs: Documents }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {DOC_LABELS.map(({ key, label }) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          {docs[key]
            ? <CheckCircle size={12} style={{ color: BRAND.success, flexShrink: 0 }} />
            : <X size={12} style={{ color: BRAND.danger, flexShrink: 0 }} />
          }
          <span style={{
            fontSize: 11,
            color: docs[key] ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.35)',
            textDecoration: docs[key] ? 'none' : 'line-through',
          }}>
            {label}
          </span>
          {!docs[key] && (
            <button style={{
              marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3,
              padding: '2px 7px', borderRadius: 6, fontSize: 10, fontWeight: 600,
              backgroundColor: 'rgba(144,196,207,0.08)',
              border: `1px solid rgba(144,196,207,0.2)`,
              color: BRAND.cyan, cursor: 'pointer',
            }}>
              <Upload size={9} /> Upload
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Detail Drawer ─────────────────────────────────────────────────────────────

function DetailDrawer({ app, onClose }: { app: Application; onClose: () => void }) {
  const [note, setNote] = useState('')
  const [localApp, setLocalApp] = useState<Application>(app)

  function addNote() {
    if (!note.trim()) return
    setLocalApp(prev => ({ ...prev, notes: [...prev.notes, note.trim()] }))
    setNote('')
  }

  function changeStatus(s: UWStatus) {
    setLocalApp(prev => ({
      ...prev,
      status: s,
      timeline: [...prev.timeline, {
        date: new Date().toISOString().slice(0, 10),
        status: s,
        note: `Status changed to: ${STATUS_META[s].label}`,
      }],
    }))
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60,
      display: 'flex', justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
    }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>

      <div style={{
        width: '100%', maxWidth: 540,
        backgroundColor: BRAND.card,
        borderLeft: `1px solid ${BRAND.border}`,
        height: '100%', overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${BRAND.border}`,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          position: 'sticky', top: 0, backgroundColor: BRAND.card, zIndex: 1,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <StatusBadge status={localApp.status} />
              <DaysChip days={daysInQueue(localApp.submitted_date)} />
            </div>
            <p style={{ color: BRAND.text, fontSize: 17, fontWeight: 800, margin: 0 }}>{localApp.merchant_name}</p>
            <p style={{ color: BRAND.muted, fontSize: 12, margin: '2px 0 0' }}>DBA: {localApp.dba}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: BRAND.muted, padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Conditional Approval Requirements */}
          {localApp.status === 'conditionally_approved' && localApp.conditions && localApp.conditions.length > 0 && (
            <div style={{
              backgroundColor: 'rgba(252,211,77,0.06)',
              border: `1px solid rgba(252,211,77,0.25)`,
              borderRadius: 12, padding: '14px 16px',
            }}>
              <p style={{ color: '#FCD34D', fontSize: 12, fontWeight: 700, margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Info size={13} /> Conditional Approval Requirements
              </p>
              <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {localApp.conditions.map((c, i) => (
                  <li key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* More Info Alert */}
          {localApp.status === 'more_info_requested' && localApp.info_requested && (
            <div style={{
              backgroundColor: 'rgba(192,132,252,0.06)',
              border: `1px solid rgba(192,132,252,0.25)`,
              borderRadius: 12, padding: '14px 16px',
            }}>
              <p style={{ color: '#C084FC', fontSize: 12, fontWeight: 700, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={13} /> Information Requested by Processor
              </p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, margin: '0 0 6px', lineHeight: 1.5 }}>
                {localApp.info_requested}
              </p>
              {localApp.info_deadline && (
                <p style={{ color: BRAND.danger, fontSize: 11, margin: 0, fontWeight: 600 }}>
                  Deadline: {fmtDate(localApp.info_deadline)}
                </p>
              )}
            </div>
          )}

          {/* Merchant Info */}
          <div>
            <p style={{ ...LABEL_STYLE as React.CSSProperties, marginBottom: 12 }}>Merchant Details</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
              {[
                ['MCC', `${localApp.mcc} — ${localApp.mcc_label}`],
                ['Account Type', localApp.account_type],
                ['Est. Monthly Volume', fmtVolume(localApp.monthly_volume)],
                ['Submitted', fmtDate(localApp.submitted_date)],
              ].map(([k, v]) => (
                <div key={k}>
                  <p style={{ color: BRAND.muted, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 2px' }}>{k}</p>
                  <p style={{ color: BRAND.text, fontSize: 12, margin: 0, fontWeight: 500 }}>{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Processor Info */}
          <div>
            <p style={{ ...LABEL_STYLE as React.CSSProperties, marginBottom: 12 }}>Processor Contact</p>
            <div style={{
              backgroundColor: 'rgba(144,196,207,0.04)',
              border: `1px solid ${BRAND.border}`,
              borderRadius: 10, padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <Building2 size={18} style={{ color: BRAND.cyan, flexShrink: 0 }} />
              <div>
                <p style={{ color: BRAND.text, fontSize: 13, fontWeight: 700, margin: 0 }}>{localApp.processor}</p>
                <p style={{ color: BRAND.muted, fontSize: 11, margin: '2px 0 0' }}>
                  {localApp.processor_contact} · <a href={`mailto:${localApp.processor_email}`} style={{ color: BRAND.cyan }}>{localApp.processor_email}</a>
                </p>
              </div>
            </div>
          </div>

          {/* Document Checklist */}
          <div>
            <p style={{ ...LABEL_STYLE as React.CSSProperties, marginBottom: 12 }}>Document Checklist</p>
            <DocChecklist docs={localApp.documents} />
          </div>

          {/* Timeline */}
          <div>
            <p style={{ ...LABEL_STYLE as React.CSSProperties, marginBottom: 14 }}>Status Timeline</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {localApp.timeline.map((entry, i) => {
                const m = STATUS_META[entry.status]
                const isLast = i === localApp.timeline.length - 1
                return (
                  <div key={i} style={{ display: 'flex', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: 10, height: 10, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                        backgroundColor: m.color,
                      }} />
                      {!isLast && (
                        <div style={{ width: 1, flex: 1, minHeight: 20, backgroundColor: BRAND.border, margin: '3px 0' }} />
                      )}
                    </div>
                    <div style={{ paddingBottom: isLast ? 0 : 16 }}>
                      <p style={{ color: BRAND.muted, fontSize: 10, margin: '0 0 2px' }}>{fmtDate(entry.date)}</p>
                      <p style={{ color: m.color, fontSize: 11, fontWeight: 700, margin: '0 0 1px' }}>{STATUS_META[entry.status].label}</p>
                      <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, margin: 0 }}>{entry.note}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Notes Log */}
          <div>
            <p style={{ ...LABEL_STYLE as React.CSSProperties, marginBottom: 12 }}>Notes & Communications</p>
            {localApp.notes.length === 0 && (
              <p style={{ color: BRAND.muted, fontSize: 12, fontStyle: 'italic' }}>No notes yet.</p>
            )}
            {localApp.notes.map((n, i) => (
              <div key={i} style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: `1px solid ${BRAND.border}`,
                borderRadius: 8, padding: '9px 12px', marginBottom: 8,
              }}>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>{n}</p>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <input
                type="text"
                placeholder="Add a note…"
                value={note}
                onChange={e => setNote(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addNote() }}
                style={{ ...INPUT_STYLE, flex: 1 }}
              />
              <button onClick={addNote} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '9px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                backgroundColor: BRAND.cyan, border: 'none', color: BRAND.bg, cursor: 'pointer',
              }}>
                <Send size={12} />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <p style={{ ...LABEL_STYLE as React.CSSProperties, marginBottom: 12 }}>Change Status</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(['approved', 'declined', 'under_review', 'more_info_requested'] as UWStatus[]).map(s => {
                const m = STATUS_META[s]
                const isActive = localApp.status === s
                return (
                  <button key={s} onClick={() => changeStatus(s)} style={{
                    padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    backgroundColor: isActive ? m.bg : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isActive ? m.color + '55' : BRAND.border}`,
                    color: isActive ? m.color : BRAND.muted,
                    transition: 'all 0.15s',
                  }}>
                    {m.label}
                  </button>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── Actions Menu ──────────────────────────────────────────────────────────────

function ActionsMenu({
  app,
  onView,
  onMarkApproved,
  onMarkDeclined,
}: {
  app: Application
  onView: () => void
  onMarkApproved: () => void
  onMarkDeclined: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(p => !p) }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 28, height: 28, borderRadius: 8,
          backgroundColor: 'rgba(255,255,255,0.04)',
          border: `1px solid ${BRAND.border}`,
          color: BRAND.muted, cursor: 'pointer',
        }}
      >
        <MoreHorizontal size={14} />
      </button>

      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 40 }}
            onClick={() => setOpen(false)}
          />
          <div style={{
            position: 'absolute', right: 0, top: 34, zIndex: 50,
            backgroundColor: '#2e2c2c',
            border: `1px solid ${BRAND.border}`,
            borderRadius: 10, overflow: 'hidden', minWidth: 180,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}>
            {[
              { label: 'View Details',    action: () => { onView(); setOpen(false) },           icon: <ChevronRight size={12} /> },
              { label: 'Upload Document', action: () => { alert('Upload doc — TBD'); setOpen(false) }, icon: <Upload size={12} /> },
              { label: 'Send Nudge',      action: () => { alert('Nudge sent to processor.'); setOpen(false) }, icon: <MessageSquare size={12} /> },
              { label: 'Mark Approved',   action: () => { onMarkApproved(); setOpen(false) },   icon: <CheckCircle size={12} /> },
              { label: 'Mark Declined',   action: () => { onMarkDeclined(); setOpen(false) },   icon: <X size={12} /> },
            ].map(item => (
              <button
                key={item.label}
                onClick={e => { e.stopPropagation(); item.action() }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                  padding: '9px 14px', background: 'none', border: 'none',
                  color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(144,196,207,0.07)'; (e.currentTarget as HTMLElement).style.color = BRAND.text }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)' }}
              >
                <span style={{ color: BRAND.muted }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KPICard({ label, value, sub, color, icon }: {
  label: string; value: string | number; sub: string; color: string; icon: React.ReactNode
}) {
  return (
    <div style={{ ...CARD, padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <p style={{ color: BRAND.muted, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{label}</p>
        <span style={{ color }}>{icon}</span>
      </div>
      <p style={{ color, fontSize: 26, fontWeight: 800, margin: '0 0 4px', lineHeight: 1 }}>{value}</p>
      <p style={{ color: BRAND.muted, fontSize: 11, margin: 0 }}>{sub}</p>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function UnderwritingQueue() {
  const [apps, setApps] = useState<Application[]>(MOCK)
  const [statusTab, setStatusTab] = useState<StatusFilterKey>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Application | null>(null)

  // Derived
  const moreInfoApps  = apps.filter(a => a.status === 'more_info_requested')
  const approvedMonth = apps.filter(a => a.status === 'approved').length
  const declinedCount = apps.filter(a => a.status === 'declined').length
  const pendingCount  = apps.filter(a => a.status === 'submitted' || a.status === 'under_review' || a.status === 'conditionally_approved').length
  const avgDays       = Math.round(apps.reduce((sum, a) => sum + daysInQueue(a.submitted_date), 0) / apps.length)
  const declineRate   = Math.round((declinedCount / apps.length) * 100)

  const filtered = apps.filter(a => {
    if (!matchesFilter(a, statusTab)) return false
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      a.merchant_name.toLowerCase().includes(q) ||
      a.dba.toLowerCase().includes(q) ||
      a.processor.toLowerCase().includes(q) ||
      a.mcc.includes(q) ||
      a.mcc_label.toLowerCase().includes(q)
    )
  })

  function quickStatus(id: string, s: UWStatus) {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status: s } : a))
  }

  const tabCounts: Record<StatusFilterKey, number> = {
    all:                  apps.length,
    pending:              pendingCount,
    approved:             approvedMonth,
    declined:             declinedCount,
    more_info_requested:  moreInfoApps.length,
  }

  return (
    <div style={{ padding: '28px 28px 64px' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-0.01em',
          background: 'linear-gradient(90deg, #C9D1D9 0%, #FFF 45%, #8A929C 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Underwriting Queue
        </h1>
        <p style={{ color: BRAND.muted, fontSize: 13, margin: '4px 0 0' }}>
          Track processor-side application status — from submission through approval or decline
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 28 }}>
        <KPICard label="Total in Queue"      value={apps.length}    sub="applications submitted"       color={BRAND.cyan}    icon={<FileText size={15} />} />
        <KPICard label="Pending Review"      value={pendingCount}   sub="at processor"                 color='#FCD34D'       icon={<Clock size={15} />} />
        <KPICard label="Approved This Month" value={approvedMonth}  sub="approved"                     color={BRAND.success}  icon={<CheckCircle size={15} />} />
        <KPICard label="Avg Days to Decision"value={`${avgDays}d`}  sub="industry avg: 3–7 days"       color={BRAND.muted}   icon={<Clock size={15} />} />
        <KPICard label="Decline Rate"        value={`${declineRate}%`} sub="of all submitted"          color={BRAND.danger}  icon={<AlertTriangle size={15} />} />
      </div>

      {/* More Info Alert Panel */}
      {moreInfoApps.length > 0 && (
        <div style={{
          backgroundColor: 'rgba(192,132,252,0.06)',
          border: `1px solid rgba(192,132,252,0.28)`,
          borderRadius: 12, padding: '16px 20px', marginBottom: 24,
        }}>
          <p style={{ color: '#C084FC', fontSize: 13, fontWeight: 700, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 7 }}>
            <AlertTriangle size={14} />
            {moreInfoApps.length} Application{moreInfoApps.length > 1 ? 's' : ''} Need Additional Information
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {moreInfoApps.map(a => (
              <div key={a.id} style={{
                backgroundColor: 'rgba(192,132,252,0.05)',
                border: `1px solid rgba(192,132,252,0.15)`,
                borderRadius: 8, padding: '10px 14px',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ color: BRAND.text, fontSize: 13, fontWeight: 700, margin: '0 0 3px' }}>
                    {a.merchant_name} <span style={{ color: BRAND.muted, fontWeight: 400 }}>({a.processor})</span>
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, margin: 0 }}>
                    {a.info_requested ?? 'Additional documentation required.'}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  {a.info_deadline && (
                    <span style={{ color: BRAND.danger, fontSize: 11, fontWeight: 600 }}>
                      Due {fmtDate(a.info_deadline)}
                    </span>
                  )}
                  <button
                    onClick={() => setSelected(a)}
                    style={{
                      padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 600,
                      backgroundColor: 'rgba(192,132,252,0.15)',
                      border: `1px solid rgba(192,132,252,0.3)`,
                      color: '#C084FC', cursor: 'pointer',
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {/* Status tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${BRAND.border}` }}>
          {STATUS_TABS.map(tab => {
            const isActive = statusTab === tab.key
            const color = tab.key === 'approved' ? BRAND.success
              : tab.key === 'declined' ? BRAND.danger
              : tab.key === 'more_info_requested' ? '#C084FC'
              : BRAND.cyan
            return (
              <button key={tab.key} onClick={() => setStatusTab(tab.key)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '7px 12px', fontSize: 12, fontWeight: 600,
                color: isActive ? color : BRAND.muted,
                borderBottom: isActive ? `2px solid ${color}` : '2px solid transparent',
                whiteSpace: 'nowrap',
              }}>
                {tab.label} <span style={{ opacity: 0.5 }}>({tabCounts[tab.key]})</span>
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Search size={13} style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: 'rgba(144,196,207,0.5)', pointerEvents: 'none',
          }} />
          <input
            type="text"
            placeholder="Search merchant, processor, MCC…"
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: BRAND.muted, fontSize: 12, whiteSpace: 'nowrap' }}>
          <Filter size={12} />
          {filtered.length} of {apps.length}
        </div>
      </div>

      {/* Table */}
      <div style={{ ...CARD, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(144,196,207,0.05)', borderBottom: `1px solid rgba(144,196,207,0.12)` }}>
                {['Merchant / DBA', 'MCC', 'Account Type', 'Est. Volume', 'Processor', 'Submitted', 'Days', 'Status', 'Next Action', ''].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '11px 14px',
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
                  <td colSpan={10} style={{ textAlign: 'center', padding: '48px 0', color: BRAND.muted, fontSize: 13 }}>
                    No applications match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((a, idx) => {
                  const days = daysInQueue(a.submitted_date)
                  const isLast = idx === filtered.length - 1
                  const isMoreInfo = a.status === 'more_info_requested'

                  return (
                    <tr
                      key={a.id}
                      style={{
                        borderBottom: isLast ? 'none' : `1px solid ${BRAND.border}`,
                        backgroundColor: isMoreInfo ? 'rgba(192,132,252,0.03)' : 'transparent',
                        borderLeft: isMoreInfo ? '3px solid rgba(192,132,252,0.45)' : '3px solid transparent',
                        cursor: 'pointer',
                        transition: 'background 0.12s',
                      }}
                      onClick={() => setSelected(a)}
                      onMouseEnter={e => { if (!isMoreInfo) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.015)' }}
                      onMouseLeave={e => { if (!isMoreInfo) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
                    >
                      {/* Merchant */}
                      <td style={{ padding: '13px 14px' }}>
                        <p style={{ color: BRAND.text, fontSize: 13, fontWeight: 600, margin: 0 }}>{a.merchant_name}</p>
                        <p style={{ color: BRAND.muted, fontSize: 10, margin: '1px 0 0' }}>DBA: {a.dba}</p>
                      </td>
                      {/* MCC */}
                      <td style={{ padding: '13px 14px' }}>
                        <p style={{ color: BRAND.muted, fontSize: 12, margin: 0, fontFamily: 'monospace' }}>{a.mcc}</p>
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, margin: '1px 0 0' }}>{a.mcc_label}</p>
                      </td>
                      {/* Account Type */}
                      <td style={{ padding: '13px 14px', color: BRAND.muted, fontSize: 12, whiteSpace: 'nowrap' }}>
                        {a.account_type}
                      </td>
                      {/* Volume */}
                      <td style={{ padding: '13px 14px', color: BRAND.text, fontSize: 12, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                        {fmtVolume(a.monthly_volume)}
                      </td>
                      {/* Processor */}
                      <td style={{ padding: '13px 14px' }}>
                        <span style={{
                          backgroundColor: 'rgba(144,196,207,0.08)',
                          border: `1px solid rgba(144,196,207,0.15)`,
                          color: BRAND.cyan, fontSize: 11, fontWeight: 600,
                          padding: '2px 8px', borderRadius: 6,
                        }}>
                          {a.processor}
                        </span>
                      </td>
                      {/* Submitted */}
                      <td style={{ padding: '13px 14px', color: BRAND.muted, fontSize: 12, whiteSpace: 'nowrap' }}>
                        {fmtDate(a.submitted_date)}
                      </td>
                      {/* Days */}
                      <td style={{ padding: '13px 14px' }}>
                        <DaysChip days={days} />
                      </td>
                      {/* Status */}
                      <td style={{ padding: '13px 14px' }}>
                        <StatusBadge status={a.status} />
                      </td>
                      {/* Next Action */}
                      <td style={{ padding: '13px 14px', color: 'rgba(255,255,255,0.5)', fontSize: 12, maxWidth: 180 }}>
                        {a.next_action}
                      </td>
                      {/* Actions */}
                      <td style={{ padding: '13px 14px' }} onClick={e => e.stopPropagation()}>
                        <ActionsMenu
                          app={a}
                          onView={() => setSelected(a)}
                          onMarkApproved={() => quickStatus(a.id, 'approved')}
                          onMarkDeclined={() => quickStatus(a.id, 'declined')}
                        />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11, marginTop: 12, textAlign: 'center' }}>
        Click any row to open the detail drawer — Days amber &gt;5, red &gt;10
      </p>

      {/* Detail Drawer */}
      {selected && (
        <DetailDrawer
          app={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
