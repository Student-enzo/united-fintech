'use client'

import { useState } from 'react'
import { Mail, CheckCircle2, Clock, AlertTriangle, FileText, ChevronDown } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import type { MerchantRecord, PipelineStage } from '@/lib/mock-merchants'
import { STAGE_META } from '@/lib/mock-merchants'
import { saveMerchantProcessor } from '@/lib/merchants-db'

// ── Processor definitions ─────────────────────────────────────────────────────

export type Processor = 'Airwallex' | 'Stripe' | 'Helcim' | 'NMI' | 'PaymentCloud'

const PROCESSORS: Processor[] = ['Airwallex', 'Stripe', 'Helcim', 'NMI', 'PaymentCloud']

type KycDoc = { id: string; label: string; description: string }

const KYC_BY_PROCESSOR: Record<Processor, KycDoc[]> = {
  Airwallex: [
    { id: 'biz_registration', label: 'Business Registration',         description: 'State-issued business license or certificate of incorporation' },
    { id: 'ein',              label: 'EIN / Tax ID Letter',           description: 'IRS EIN confirmation letter (SS-4)' },
    { id: 'ubo_id',           label: 'UBO Photo ID (≥25% owners)',    description: 'Government-issued photo ID for all beneficial owners ≥25%' },
    { id: 'ubo_address',      label: 'UBO Address Proof',             description: 'Utility bill or bank statement showing owner address' },
    { id: 'bank_statement',   label: 'Bank Account Verification',     description: 'Voided check or bank letter for ACH settlement' },
    { id: 'website_review',   label: 'Website / Terms of Service',    description: 'Merchant website URL with active checkout + refund policy' },
    { id: 'mcc_approval',     label: 'MCC Approval Form',             description: 'Airwallex-specific MCC classification form' },
    { id: 'statements',       label: 'Processing Statements (3 mo)',  description: '3 months prior processor statements if processing elsewhere' },
    { id: 'signed_agreement', label: 'Signed Merchant Agreement',     description: 'Executed Airwallex merchant services agreement' },
  ],
  Stripe: [
    { id: 'ein',              label: 'EIN / Tax ID',                  description: 'IRS EIN confirmation letter' },
    { id: 'biz_license',      label: 'Business License',              description: 'State business license or DBA registration' },
    { id: 'bank_account',     label: 'Bank Account Details',          description: 'Routing + account number for payouts' },
    { id: 'owner_id',         label: "Owner Photo ID",                description: 'Government-issued photo ID for primary owner' },
    { id: 'website',          label: 'Website with Checkout',         description: 'Live website with product/service description and pricing' },
    { id: 'statements',       label: 'Processing Statements (3 mo)',  description: '3 months prior statements if requested' },
    { id: 'pci_saq',          label: 'PCI SAQ',                       description: 'Self-Assessment Questionnaire if volume > $1M/yr' },
    { id: 'signed_agreement', label: 'Stripe Services Agreement',     description: 'Executed Stripe Connect or direct agreement' },
  ],
  Helcim: [
    { id: 'ein',              label: 'EIN / Tax ID Letter',           description: 'IRS EIN confirmation letter' },
    { id: 'biz_license',      label: 'Business License',              description: 'State-issued business license' },
    { id: 'voided_check',     label: 'Voided Check',                  description: 'For ACH settlement and payout setup' },
    { id: 'owner_id',         label: "Owner Photo ID",                description: 'Government-issued photo ID' },
    { id: 'statements',       label: 'Processing Statements (3 mo)',  description: 'Last 3 months of prior processor statements' },
    { id: 'signed_agreement', label: 'Helcim Merchant Agreement',     description: 'Signed Helcim processing agreement' },
  ],
  NMI: [
    { id: 'ein',              label: 'EIN / Tax ID Letter',           description: 'IRS EIN confirmation letter' },
    { id: 'biz_license',      label: 'Business License',              description: 'State business license or articles of incorporation' },
    { id: 'voided_check',     label: 'Voided Check / Bank Letter',    description: 'For settlement account setup' },
    { id: 'owner_id',         label: "Owner Photo ID",                description: 'Government-issued ID for all owners ≥25%' },
    { id: 'pci_saq',          label: 'PCI SAQ',                       description: 'Self-Assessment Questionnaire (SAQ A or B)' },
    { id: 'statements',       label: 'Processing Statements (3 mo)',  description: '3 months prior processor statements' },
    { id: 'signed_agreement', label: 'NMI Merchant Agreement',        description: 'Executed NMI gateway + processing agreement' },
  ],
  PaymentCloud: [
    { id: 'ein',              label: 'EIN / Tax ID Letter',           description: 'IRS EIN confirmation letter' },
    { id: 'biz_license',      label: 'Business License',              description: 'State-issued business license' },
    { id: 'voided_check',     label: 'Voided Check',                  description: 'For ACH settlement' },
    { id: 'owner_id',         label: "Owner Photo ID (front + back)", description: 'Government photo ID, both sides, for all owners ≥25%' },
    { id: 'bank_statements',  label: 'Bank Statements (3 mo)',        description: '3 months business bank statements' },
    { id: 'statements',       label: 'Processing Statements (3 mo)',  description: 'Prior processor statements if applicable' },
    { id: 'pci_saq',          label: 'PCI SAQ',                       description: 'PCI Self-Assessment Questionnaire' },
    { id: 'chargeback_letter', label: 'Chargeback Rebuttal Letter',   description: 'Required if CB ratio > 1% in prior 3 months' },
    { id: 'signed_agreement', label: 'PaymentCloud Agreement',        description: 'Executed merchant services agreement' },
  ],
}

// ── Status types ──────────────────────────────────────────────────────────────

type DocStatus = 'pending' | 'received' | 'approved'

function initialStatuses(docs: KycDoc[]): Record<string, DocStatus> {
  return Object.fromEntries(docs.map(d => [d.id, 'pending' as DocStatus]))
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

// ── Chargeback mock ───────────────────────────────────────────────────────────

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

// ── Agreement helper ──────────────────────────────────────────────────────────

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
  const [processor, setProcessor] = useState<Processor | null>(
    (m.processor as Processor | null) ?? null
  )
  const [saving, setSaving] = useState(false)

  const docs = processor ? KYC_BY_PROCESSOR[processor] : []
  const [statuses, setStatuses] = useState<Record<string, DocStatus>>(() => initialStatuses(docs))

  const chargebacks = mockChargebacks(m.risk)
  const agrStatus = agreementStatus(m.pipeline_stage)
  const receivedCount = Object.values(statuses).filter(s => s !== 'pending').length

  async function handleProcessorChange(p: Processor | null) {
    setProcessor(p)
    setStatuses(p ? initialStatuses(KYC_BY_PROCESSOR[p]) : {})
    setSaving(true)
    try {
      await saveMerchantProcessor(m.id, p)
      addActivity(`Processor assigned: ${p ?? 'unassigned'}`, BRAND.cyan)
    } catch {
      // non-fatal
    } finally {
      setSaving(false)
    }
  }

  function handleStatusChange(docId: string, newStatus: DocStatus) {
    setStatuses(prev => ({ ...prev, [docId]: newStatus }))
    const doc = docs.find(d => d.id === docId)
    addActivity(`Document status updated: ${doc?.label} → ${newStatus}`, BRAND.cyan)
  }

  function handleRequestDoc(doc: KycDoc) {
    const subject = encodeURIComponent(`Document Request — ${m.name}`)
    const body = encodeURIComponent(
      `Hi ${m.owner_name || 'there'},\n\nTo continue processing your application, we need your ${doc.label}.\n\nPlease reply to this email with the document attached.\n\nThank you,\nUnited Fintech Team`
    )
    const email = m.contact_email || ''
    window.open(`mailto:${email}?subject=${subject}&body=${body}`)
    addActivity(`Document requested: ${doc.label}`, BRAND.warn)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── Processor selector ── */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: BRAND.muted }}>
            Assigned Processor
          </p>
          {saving && <span className="text-[10px]" style={{ color: BRAND.muted }}>Saving…</span>}
        </div>

        <div className="flex flex-wrap gap-2">
          {PROCESSORS.map(p => (
            <button
              key={p}
              onClick={() => handleProcessorChange(processor === p ? null : p)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={
                processor === p
                  ? { backgroundColor: BRAND.cyan, color: '#0A0C12', border: `1px solid ${BRAND.cyan}` }
                  : { backgroundColor: 'transparent', color: BRAND.muted, border: `1px solid ${BRAND.border}` }
              }>
              {p}
            </button>
          ))}
        </div>

        {!processor && (
          <p className="mt-3 text-[11px]" style={{ color: BRAND.muted }}>
            Select a processor to load its KYC/KYB checklist.
          </p>
        )}
      </div>

      {/* ── KYC Documents (processor-specific) ── */}
      {processor && (
        <div className="rounded-2xl p-5" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: BRAND.muted }}>
                {processor} KYC / KYB Requirements
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: BRAND.muted }}>
                {docs.length} documents required for underwriting
              </p>
            </div>
            <span className="text-xs font-semibold" style={{ color: BRAND.text }}>
              {receivedCount} / {docs.length} received
            </span>
          </div>

          {/* Progress bar */}
          <div className="mb-5">
            <div className="h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
              <div className="h-2 rounded-full transition-all"
                style={{
                  width: `${docs.length ? (receivedCount / docs.length) * 100 : 0}%`,
                  backgroundColor: receivedCount === docs.length ? BRAND.success : BRAND.cyan,
                }} />
            </div>
          </div>

          {/* Doc rows */}
          <div className="flex flex-col divide-y" style={{ borderColor: BRAND.border }}>
            {docs.map(doc => {
              const status = statuses[doc.id] ?? 'pending'
              return (
                <div key={doc.id} className="flex items-center gap-3 py-3">
                  <FileText size={14} className="flex-shrink-0" style={{ color: BRAND.muted }} />

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: BRAND.text }}>{doc.label}</p>
                    <p className="text-[10px] mt-0.5 truncate" style={{ color: BRAND.muted }}>{doc.description}</p>
                  </div>

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
      )}

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
                          <CheckCircle2 size={9} /> Resolved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{ backgroundColor: 'rgba(252,211,77,0.08)', border: '1px solid rgba(252,211,77,0.2)', color: BRAND.warn }}>
                          <Clock size={9} /> Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

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
            const bg    = isSigned ? 'rgba(110,231,183,0.08)' : 'rgba(252,211,77,0.08)'
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
