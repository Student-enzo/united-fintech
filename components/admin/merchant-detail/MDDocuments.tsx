'use client'

import { useState } from 'react'
import { Mail, CheckCircle2, Clock, AlertTriangle, FileText } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import type { MerchantRecord, PipelineStage } from '@/lib/mock-merchants'
import { STAGE_META } from '@/lib/mock-merchants'

// ── KYC document definitions ──────────────────────────────────────────────────

type KycDoc = { id: string; label: string; description: string }

const KYC_DOCS: KycDoc[] = [
  { id: 'biz_license',      label: 'Business License',             description: 'State-issued business license or DBA registration' },
  { id: 'ein',              label: 'EIN / Tax ID Letter',          description: 'IRS EIN confirmation letter' },
  { id: 'bank_letter',      label: 'Bank Letter',                  description: 'Letter confirming business banking relationship' },
  { id: 'voided_check',     label: 'Voided Check',                 description: 'For ACH settlement setup' },
  { id: 'statements',       label: 'Processing Statements (3 mo)', description: '3 months prior processor statements' },
  { id: 'drivers_license',  label: "Driver's License",             description: 'Owner government-issued photo ID' },
  { id: 'pci_saq',          label: 'PCI SAQ',                      description: 'Self-Assessment Questionnaire for cardholder data security' },
  { id: 'signed_agreement', label: 'Signed Merchant Agreement',    description: 'Executed merchant processing agreement' },
]

type DocStatus = 'pending' | 'received' | 'approved'

function initialDocStatuses(risk: MerchantRecord['risk']): Record<string, DocStatus> {
  const all = KYC_DOCS.map(d => d.id)
  if (risk === 'high') {
    // Most pending, one received
    return Object.fromEntries(all.map((id, i) => [id, i === 0 ? 'received' : 'pending']))
  }
  if (risk === 'medium') {
    // Half received, half pending
    return Object.fromEntries(all.map((id, i) => [id, i < 4 ? 'received' : 'pending']))
  }
  // low — most approved, 1-2 received
  return Object.fromEntries(all.map((id, i) => [id, i < 6 ? 'approved' : 'received']))
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function StatusChip({ status }: { status: DocStatus }) {
  const map: Record<DocStatus, { color: string; bg: string; border: string; label: string }> = {
    pending:  { color: BRAND.warn,    bg: 'rgba(252,211,77,0.08)',  border: 'rgba(252,211,77,0.2)',  label: 'Pending' },
    received: { color: BRAND.cyan,    bg: `${BRAND.cyan}10`,        border: BRAND.borderCyan,        label: 'Received' },
    approved: { color: BRAND.success, bg: 'rgba(110,231,183,0.08)', border: 'rgba(110,231,183,0.2)', label: 'Approved' },
  }
  const s = map[status]
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ backgroundColor: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
      {s.label}
    </span>
  )
}

// ── Chargeback types ─────────────────────────────────────────────────────────

type Chargeback = { id: string; date: string; amount: number; reason: string; status: 'resolved' | 'pending' }

function mockChargebacks(risk: MerchantRecord['risk']): Chargeback[] {
  if (risk === 'high') return [
    { id: 'cb1', date: '2026-01-15', amount: 340, reason: 'Unauthorized transaction', status: 'resolved' },
    { id: 'cb2', date: '2026-03-02', amount: 189, reason: 'Item not received',        status: 'pending' },
  ]
  if (risk === 'medium') return [
    { id: 'cb1', date: '2026-02-20', amount: 210, reason: 'Credit not processed', status: 'resolved' },
  ]
  return []
}

// ── Agreement status helper ───────────────────────────────────────────────────

const SIGNED_STAGES: PipelineStage[] = [
  'agreement_signed', 'setup_fee_paid', 'underwriting', 'account_activated', 'merchant_live',
]

function agreementStatus(stage: PipelineStage): 'Signed' | 'Pending' {
  return SIGNED_STAGES.includes(stage) ? 'Signed' : 'Pending'
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  merchant: MerchantRecord
  addActivity: (text: string, color: string) => void
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MDDocuments({ merchant: m, addActivity }: Props) {
  const [statuses, setStatuses] = useState<Record<string, DocStatus>>(
    () => initialDocStatuses(m.risk)
  )

  const chargebacks = mockChargebacks(m.risk)
  const agrStatus = agreementStatus(m.pipeline_stage)

  const receivedCount = Object.values(statuses).filter(s => s === 'received' || s === 'approved').length

  function handleStatusChange(docId: string, newStatus: DocStatus) {
    setStatuses(prev => ({ ...prev, [docId]: newStatus }))
    const doc = KYC_DOCS.find(d => d.id === docId)
    addActivity(`Document status updated: ${doc?.label} → ${newStatus}`, BRAND.cyan)
  }

  function handleRequestDoc(doc: KycDoc) {
    const subject = encodeURIComponent(`Document Request — ${m.name}`)
    const body = encodeURIComponent(
      `Hi ${m.owner_name || 'there'},\n\nTo continue processing your application, we need your ${doc.label}.\n\nPlease upload it via this secure link: https://docs.unitedfintech.io/upload/${m.id}/${doc.id}\n\nThank you,\nUnited Fintech Team`
    )
    const email = m.contact_email || ''
    window.open(`mailto:${email}?subject=${subject}&body=${body}`)
    addActivity(`Document requested: ${doc.label}`, BRAND.warn)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── KYC Documents ── */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: BRAND.muted }}>
            KYC Documents
          </p>
          <span className="text-xs font-semibold" style={{ color: BRAND.text }}>
            {receivedCount} / {KYC_DOCS.length} received
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div className="h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
            <div className="h-2 rounded-full transition-all"
              style={{
                width: `${(receivedCount / KYC_DOCS.length) * 100}%`,
                backgroundColor: receivedCount === KYC_DOCS.length ? BRAND.success : BRAND.cyan,
              }} />
          </div>
        </div>

        {/* Doc rows */}
        <div className="flex flex-col divide-y" style={{ borderColor: BRAND.border }}>
          {KYC_DOCS.map(doc => {
            const status = statuses[doc.id] ?? 'pending'
            return (
              <div key={doc.id} className="flex items-center gap-3 py-3">

                {/* Icon */}
                <FileText size={14} className="flex-shrink-0" style={{ color: BRAND.muted }} />

                {/* Label + description */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold" style={{ color: BRAND.text }}>{doc.label}</p>
                  <p className="text-[10px] mt-0.5 truncate" style={{ color: BRAND.muted }}>{doc.description}</p>
                </div>

                {/* Status dropdown */}
                <select
                  value={status}
                  onChange={e => handleStatusChange(doc.id, e.target.value as DocStatus)}
                  className="text-[11px] font-semibold rounded-lg px-2 py-1 border outline-none cursor-pointer flex-shrink-0"
                  style={{
                    backgroundColor: BRAND.bg,
                    borderColor: BRAND.border,
                    color: status === 'approved' ? BRAND.success : status === 'received' ? BRAND.cyan : BRAND.warn,
                  }}>
                  <option value="pending">Pending</option>
                  <option value="received">Received</option>
                  <option value="approved">Approved</option>
                </select>

                {/* Request email button — only when pending */}
                {status === 'pending' && (
                  <button
                    onClick={() => handleRequestDoc(doc)}
                    title="Draft email request"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex-shrink-0 transition-opacity hover:opacity-80"
                    style={{
                      backgroundColor: 'transparent',
                      border: `1px solid ${BRAND.borderCyan}`,
                      color: BRAND.cyan,
                    }}>
                    <Mail size={11} />
                    Request
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Chargebacks ── */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-4" style={{ color: BRAND.muted }}>
          Chargebacks
        </p>

        {chargebacks.length === 0 ? (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
            style={{ backgroundColor: 'rgba(110,231,183,0.06)', border: '1px solid rgba(110,231,183,0.2)' }}>
            <CheckCircle2 size={14} style={{ color: BRAND.success }} />
            <span className="text-xs font-semibold" style={{ color: BRAND.success }}>
              No chargebacks on record
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  {['Date', 'Amount', 'Reason', 'Status'].map(h => (
                    <th key={h} className="text-left py-2 pr-4 text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: BRAND.muted, borderBottom: `1px solid ${BRAND.border}` }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chargebacks.map(cb => (
                  <tr key={cb.id}>
                    <td className="py-2.5 pr-4 whitespace-nowrap" style={{ color: BRAND.text }}>{fmtDate(cb.date)}</td>
                    <td className="py-2.5 pr-4 font-semibold whitespace-nowrap" style={{ color: BRAND.danger }}>{fmtCurrency(cb.amount)}</td>
                    <td className="py-2.5 pr-4" style={{ color: BRAND.muted }}>{cb.reason}</td>
                    <td className="py-2.5">
                      {cb.status === 'resolved' ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{ backgroundColor: 'rgba(110,231,183,0.08)', border: '1px solid rgba(110,231,183,0.2)', color: BRAND.success }}>
                          <CheckCircle2 size={9} />
                          Resolved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{ backgroundColor: 'rgba(252,211,77,0.08)', border: '1px solid rgba(252,211,77,0.2)', color: BRAND.warn }}>
                          <Clock size={9} />
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary row */}
            <div className="mt-3 px-3 py-2.5 rounded-xl flex items-center gap-2"
              style={{ backgroundColor: 'rgba(232,80,74,0.05)', border: '1px solid rgba(232,80,74,0.15)' }}>
              <AlertTriangle size={12} style={{ color: BRAND.danger }} />
              <span className="text-[11px]" style={{ color: BRAND.danger }}>
                {chargebacks.length} chargeback{chargebacks.length !== 1 ? 's' : ''} on record
                {' — '}{fmtCurrency(chargebacks.reduce((s, cb) => s + cb.amount, 0))} total exposure
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Agreements ── */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-4" style={{ color: BRAND.muted }}>
          Agreements
        </p>

        <div className="flex flex-col divide-y" style={{ borderColor: BRAND.border }}>
          {[
            { label: 'Merchant Processing Agreement', status: agrStatus },
            { label: 'ISO Partner Agreement',          status: 'Received' as const },
            { label: 'Privacy Policy Acknowledgment',  status: 'Signed' as const },
          ].map(({ label, status }) => {
            const isSigned = status === 'Signed' || status === 'Received'
            const color = isSigned ? BRAND.success : BRAND.warn
            const bg = isSigned ? 'rgba(110,231,183,0.08)' : 'rgba(252,211,77,0.08)'
            const border = isSigned ? 'rgba(110,231,183,0.2)' : 'rgba(252,211,77,0.2)'

            return (
              <div key={label} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2.5">
                  <FileText size={13} style={{ color: BRAND.muted }} />
                  <span className="text-xs" style={{ color: BRAND.text }}>{label}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ backgroundColor: bg, border: `1px solid ${border}`, color }}>
                  {status}
                </span>
              </div>
            )
          })}
        </div>

        {/* Stage context note */}
        <div className="mt-4 px-3 py-2.5 rounded-xl text-[11px] italic"
          style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderLeft: `3px solid ${BRAND.borderCyan}`, color: BRAND.muted }}>
          Agreement status reflects current pipeline stage:{' '}
          <span style={{ color: STAGE_META[m.pipeline_stage].color }}>
            {STAGE_META[m.pipeline_stage].label}
          </span>
        </div>
      </div>
    </div>
  )
}
