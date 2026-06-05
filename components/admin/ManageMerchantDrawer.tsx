'use client'

import { useState } from 'react'
import {
  X, Building2, Tag, CreditCard, Globe, Users, DollarSign, TrendingUp,
  Clock, CheckCircle2, AlertCircle, ArrowRight, FileText, Activity,
  Calendar, ChevronRight, ExternalLink, Send, Shield, AlertTriangle,
  Copy, Check, Link2, BarChart2, Mail,
} from 'lucide-react'
import { BRAND } from '@/lib/brand'

// ─── Shared domain types ─────────────────────────────────────────────────────

export type PipelineStage =
  | 'lead_identified' | 'proposal_sent' | 'agreement_sent'
  | 'agreement_signed' | 'setup_fee_paid' | 'underwriting'
  | 'account_activated' | 'merchant_live' | 'declined'

export type AccountType = 'Card Present' | 'eCommerce' | 'MOTO' | 'ACH'

export type MerchantRecord = {
  id: string
  name: string
  dba_name?: string
  mcc: string
  mcc_label: string
  legal_structure: string
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
  basis_points_earned?: number
  owner_name?: string
  contact_email?: string
  contact_phone?: string
}

// ─── Stage metadata ──────────────────────────────────────────────────────────

const STAGES: PipelineStage[] = [
  'lead_identified','proposal_sent','agreement_sent','agreement_signed',
  'setup_fee_paid','underwriting','account_activated','merchant_live',
]

const STAGE_META: Record<PipelineStage, { label: string; shortLabel: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  lead_identified:   { label:'Lead Identified',   shortLabel:'Lead',         color:'#93C5FD', bg:'rgba(96,165,250,0.10)',  border:'rgba(96,165,250,0.22)',  icon:<AlertCircle size={11}/> },
  proposal_sent:     { label:'Proposal Sent',     shortLabel:'Proposal',     color:'#FCD34D', bg:'rgba(251,191,36,0.10)',  border:'rgba(251,191,36,0.22)',  icon:<ArrowRight size={11}/> },
  agreement_sent:    { label:'Agreement Sent',    shortLabel:'Agmt Out',     color:'#C4B5FD', bg:'rgba(139,92,246,0.10)',  border:'rgba(139,92,246,0.22)',  icon:<ExternalLink size={11}/> },
  agreement_signed:  { label:'Agreement Signed',  shortLabel:'Signed',       color:'#3DD68C', bg:'rgba(61,214,140,0.10)',  border:'rgba(61,214,140,0.22)',  icon:<CheckCircle2 size={11}/> },
  setup_fee_paid:    { label:'Setup Fee Paid',    shortLabel:'Fee Paid',     color:'#34D399', bg:'rgba(52,211,153,0.12)',  border:'rgba(52,211,153,0.28)',  icon:<DollarSign size={11}/> },
  underwriting:      { label:'Underwriting',      shortLabel:'Underwriting', color:BRAND.warn, bg:'rgba(240,178,62,0.10)', border:'rgba(240,178,62,0.22)', icon:<Clock size={11}/> },
  account_activated: { label:'Account Activated', shortLabel:'Activated',    color:BRAND.cyan, bg:'rgba(144,196,207,0.10)',border:'rgba(144,196,207,0.25)',icon:<TrendingUp size={11}/> },
  merchant_live:     { label:'Merchant Live',     shortLabel:'Live',         color:BRAND.success, bg:'rgba(61,214,140,0.12)',border:'rgba(61,214,140,0.28)',icon:<CheckCircle2 size={11}/> },
  declined:          { label:'Declined',          shortLabel:'Declined',     color:'rgba(255,255,255,0.28)',bg:'rgba(255,255,255,0.04)',border:'rgba(255,255,255,0.10)',icon:<X size={11}/> },
}

// ─── Formatters ──────────────────────────────────────────────────────────────

function fmtCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 }).format(n)
}
function fmtDate(d: string): string {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })
}

const RISK_COLORS: Record<string, string> = { low:BRAND.success, medium:BRAND.warn, high:BRAND.danger }

// ─── Mock data helpers ───────────────────────────────────────────────────────

function getMockAgreements(merchantId: string) {
  return [
    { id:`agr-${merchantId}-1`, type:'Merchant Processing Agreement', signed: true, date:'2026-01-15', pages:12 },
    { id:`agr-${merchantId}-2`, type:'Equipment Lease / Gateway',     signed: true, date:'2026-01-15', pages:4 },
    { id:`agr-${merchantId}-3`, type:'PCI Compliance Attestation',    signed: false, date:null, pages:8 },
  ]
}

function getMockActivity(m: MerchantRecord) {
  return [
    { id:'a1', text:`Stage advanced to "${STAGE_META[m.pipeline_stage].label}"`, date:'2 days ago', icon:<TrendingUp size={11}/>, color:BRAND.cyan },
    { id:'a2', text:`Partner assigned: ${m.partner}`, date:'5 days ago', icon:<Users size={11}/>, color:'#C4B5FD' },
    { id:'a3', text:`Merchant record created`, date: fmtDate(m.date_added), icon:<Building2 size={11}/>, color:BRAND.muted },
  ]
}

function getMockChargebacks(m: MerchantRecord) {
  if (m.risk === 'high') return [
    { id:'cb1', amount:320, date:'2026-05-14', reason:'Item not received', status:'open' },
    { id:'cb2', amount:85,  date:'2026-04-30', reason:'Unauthorized transaction', status:'resolved' },
  ]
  if (m.risk === 'medium') return [
    { id:'cb1', amount:140, date:'2026-05-01', reason:'Product not as described', status:'resolved' },
  ]
  return []
}

// ─── Tabs ────────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'pipeline' | 'finance' | 'documents' | 'activity'

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key:'overview',   label:'Overview',   icon:<Building2 size={13}/> },
  { key:'pipeline',   label:'Pipeline',   icon:<TrendingUp size={13}/> },
  { key:'finance',    label:'Finance',    icon:<BarChart2 size={13}/> },
  { key:'documents',  label:'Risk & Docs', icon:<Shield size={13}/> },
  { key:'activity',   label:'Activity',   icon:<Activity size={13}/> },
]

// ─── Copy-link button ─────────────────────────────────────────────────────────

function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(url).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
      style={{
        backgroundColor: copied ? 'rgba(61,214,140,0.12)' : `${BRAND.cyan}12`,
        color: copied ? BRAND.success : BRAND.cyan,
        border: `1px solid ${copied ? 'rgba(61,214,140,0.3)' : BRAND.borderCyan}`,
      }}>
      {copied ? <Check size={12}/> : <Copy size={12}/>}
      {copied ? 'Copied!' : 'Copy Link'}
    </button>
  )
}

// ─── Sub-panels ──────────────────────────────────────────────────────────────

function OverviewTab({ m }: { m: MerchantRecord }) {
  const chargebacks = getMockChargebacks(m)
  const rows = [
    { icon:<Tag size={12}/>,        label:'MCC',             value:`${m.mcc} — ${m.mcc_label}` },
    { icon:<Building2 size={12}/>,  label:'Legal Structure', value:m.legal_structure },
    { icon:<CreditCard size={12}/>, label:'Account Type',    value:m.account_type },
    { icon:<Globe size={12}/>,      label:'Card Present %',  value:`${m.card_present_pct}%` },
    { icon:<Users size={12}/>,      label:'Partner / ISO',   value:`${m.partner}  (${m.partner_iso})` },
    { icon:<Calendar size={12}/>,   label:'Date Added',      value:fmtDate(m.date_added) },
    { icon:<Clock size={12}/>,      label:'Days in Stage',   value:`${m.days_in_stage} days` },
  ]
  return (
    <div className="flex flex-col gap-5">
      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label:'Monthly Volume', value: fmtCurrency(m.monthly_volume), color:BRAND.cyan },
          { label:'Avg Ticket',     value: fmtCurrency(m.avg_ticket),     color:BRAND.text },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 rounded-xl flex flex-col gap-1"
            style={{ backgroundColor:'rgba(255,255,255,0.04)', border:`1px solid ${BRAND.border}` }}>
            <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color:BRAND.muted }}>{label}</span>
            <span className="text-xl font-bold" style={{ color }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Risk summary inline */}
      {chargebacks.length > 0 && (
        <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl"
          style={{ backgroundColor:'rgba(232,80,74,0.06)', border:'1px solid rgba(232,80,74,0.2)' }}>
          <AlertTriangle size={14} style={{ color:BRAND.danger, flexShrink:0 }} />
          <div>
            <p className="text-xs font-semibold" style={{ color:BRAND.danger }}>
              {chargebacks.filter(c => c.status === 'open').length > 0
                ? `${chargebacks.filter(c => c.status === 'open').length} open chargeback${chargebacks.filter(c => c.status === 'open').length > 1 ? 's' : ''}`
                : `${chargebacks.length} resolved chargeback${chargebacks.length > 1 ? 's' : ''} on record`
              }
            </p>
            <p className="text-[10px] mt-0.5" style={{ color:BRAND.muted }}>See Risk & Docs tab for details</p>
          </div>
        </div>
      )}

      {/* Field list */}
      <div className="flex flex-col gap-2.5">
        {rows.map(({ icon, label, value }) => (
          <div key={label} className="flex items-center justify-between py-2"
            style={{ borderBottom:`1px solid ${BRAND.border}` }}>
            <span className="flex items-center gap-2 text-xs" style={{ color:BRAND.muted }}>{icon}{label}</span>
            <span className="text-xs font-semibold text-right max-w-[240px] truncate" style={{ color:BRAND.text }}>{value}</span>
          </div>
        ))}
      </div>

      {m.notes && (
        <div className="px-3.5 py-3 rounded-xl text-xs italic"
          style={{ backgroundColor:'rgba(255,255,255,0.03)', borderLeft:`3px solid ${BRAND.borderCyan}`, color:BRAND.muted }}>
          {m.notes}
        </div>
      )}
    </div>
  )
}

const STAGE_ACTIONS: Record<PipelineStage, string[]> = {
  lead_identified:   ['Send proposal to decision maker', 'Confirm monthly volume estimate', 'Qualify card-present vs e-commerce mix'],
  proposal_sent:     ['Follow up within 3 business days', 'Address objections on rate sheet', 'Confirm legal entity name matches ID'],
  agreement_sent:    ['Verify agreement was received', 'Answer questions on terms', 'Set signing deadline reminder'],
  agreement_signed:  ['Collect setup fee payment', 'Request bank statement + voided check', 'Confirm processor assignment'],
  setup_fee_paid:    ['Submit underwriting package', 'Upload all KYC documents', 'Assign underwriter and set SLA'],
  underwriting:      ['Monitor underwriting queue daily', 'Respond to UW info requests <24h', 'Confirm MCC approval with processor'],
  account_activated: ['Send terminal / gateway credentials', 'Schedule merchant onboarding call', 'Confirm first batch settlement'],
  merchant_live:     ['Verify first month residual', 'Review chargeback rate after 30 days', 'Schedule 90-day account review'],
  declined:          ['Document decline reason', 'Notify partner ISO', 'Consider appeal or alternative processor'],
}

function PipelineTab({
  m, onStageChange, addActivity,
}: {
  m: MerchantRecord
  onStageChange: (id:string, stage:PipelineStage) => void
  addActivity: (text: string, icon: React.ReactNode, color: string) => void
}) {
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [linkGenerated, setLinkGenerated] = useState(false)
  const curIdx   = STAGES.indexOf(m.pipeline_stage)
  const nextStage = curIdx >= 0 && curIdx < STAGES.length - 1 ? STAGES[curIdx + 1] : null

  const showOnboardLink = !['account_activated', 'merchant_live', 'declined'].includes(m.pipeline_stage)
  const mockToken = `tok_${m.id.replace('m-', '')}_${m.name.split(' ')[0].toLowerCase()}`
  const applyUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://unitedfintech.com'}/apply/${mockToken}`

  function saveNote() {
    if (!note.trim()) return
    setSaving(true)
    addActivity(`Note: ${note.trim()}`, <FileText size={11}/>, BRAND.muted)
    setTimeout(() => { setSaving(false); setNote('') }, 200)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Client onboarding link — visible for early-stage merchants */}
      {showOnboardLink && (
        <div className="rounded-xl overflow-hidden"
          style={{ border:`1px solid ${BRAND.borderCyan}`, backgroundColor:'rgba(144,196,207,0.04)' }}>
          <div className="px-4 pt-4 pb-3 flex items-center gap-2"
            style={{ borderBottom:`1px solid ${BRAND.border}` }}>
            <Link2 size={14} style={{ color:BRAND.cyan }} />
            <p className="text-sm font-bold" style={{ color:BRAND.text }}>Send to Client</p>
          </div>
          <div className="px-4 py-3 flex flex-col gap-3">
            <p className="text-xs" style={{ color:BRAND.muted }}>
              Generate a secure link and send it to your client. They fill out their own application — you approve at the end.
            </p>
            {!linkGenerated ? (
              <button
                onClick={() => setLinkGenerated(true)}
                className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-opacity hover:opacity-85"
                style={{ backgroundColor:BRAND.cyan, color:BRAND.bg }}>
                <Link2 size={14}/> Generate Apply Link
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-mono truncate"
                  style={{ backgroundColor:'rgba(255,255,255,0.04)', border:`1px solid ${BRAND.border}`, color:BRAND.muted }}>
                  {applyUrl}
                </div>
                <div className="flex gap-2">
                  <CopyLinkButton url={applyUrl} />
                  <a
                    href={`mailto:?subject=Application%20Link%20%E2%80%94%20${encodeURIComponent(m.name)}&body=Hi%2C%20please%20use%20this%20secure%20link%20to%20complete%20your%20application%3A%0A%0A${encodeURIComponent(applyUrl)}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                    style={{ backgroundColor:'rgba(255,255,255,0.04)', color:BRAND.muted, border:`1px solid ${BRAND.border}` }}>
                    <Mail size={12}/> Send via Email
                  </a>
                </div>
                <div className="flex flex-col gap-1.5 mt-1">
                  {[
                    { label:'Business Info',        done: false },
                    { label:'Owner Details',         done: false },
                    { label:'Processing History',    done: false },
                    { label:'Document Upload',       done: false },
                  ].map(step => (
                    <div key={step.label} className="flex items-center gap-2 text-xs">
                      {step.done
                        ? <CheckCircle2 size={12} style={{ color:BRAND.success }} />
                        : <div className="w-3 h-3 rounded-full border" style={{ borderColor:'rgba(255,255,255,0.15)' }} />
                      }
                      <span style={{ color: step.done ? BRAND.text : BRAND.muted }}>{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Current stage */}
      <div className="p-4 rounded-xl flex items-center justify-between"
        style={{ backgroundColor: STAGE_META[m.pipeline_stage].bg, border:`1px solid ${STAGE_META[m.pipeline_stage].border}` }}>
        <div>
          <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color:BRAND.muted }}>Current Stage</p>
          <p className="text-lg font-bold flex items-center gap-2" style={{ color:STAGE_META[m.pipeline_stage].color }}>
            {STAGE_META[m.pipeline_stage].icon} {STAGE_META[m.pipeline_stage].label}
          </p>
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor:'rgba(255,255,255,0.06)', color:BRAND.muted }}>
          {m.days_in_stage}d
        </span>
      </div>

      {/* Stage action checklist */}
      <div>
        <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color:BRAND.muted }}>Action Checklist</p>
        <div className="flex flex-col gap-1.5">
          {STAGE_ACTIONS[m.pipeline_stage].map((action, i) => (
            <div key={i} className="flex items-start gap-2 text-xs py-1">
              <div className="w-3.5 h-3.5 rounded border mt-0.5 flex-shrink-0"
                style={{ borderColor: STAGE_META[m.pipeline_stage].color, backgroundColor: `${STAGE_META[m.pipeline_stage].color}10` }} />
              <span style={{ color: BRAND.text }}>{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick advance */}
      {nextStage && (
        <button onClick={() => onStageChange(m.id, nextStage)}
          className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-opacity hover:opacity-85"
          style={{ backgroundColor:STAGE_META[nextStage].bg, color:STAGE_META[nextStage].color, border:`1px solid ${STAGE_META[nextStage].border}` }}>
          <ArrowRight size={14}/> Advance → {STAGE_META[nextStage].label}
        </button>
      )}

      {/* Jump to any stage */}
      <div>
        <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color:BRAND.muted }}>Jump to Stage</p>
        <div className="grid grid-cols-2 gap-1.5">
          {STAGES.filter(s => s !== m.pipeline_stage).map(s => (
            <button key={s} onClick={() => onStageChange(m.id, s)}
              className="text-left px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-opacity hover:opacity-80 flex items-center gap-1"
              style={{ backgroundColor:STAGE_META[s].bg, color:STAGE_META[s].color, border:`1px solid ${STAGE_META[s].border}` }}>
              {STAGE_META[s].icon} {STAGE_META[s].shortLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Add note */}
      <div>
        <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color:BRAND.muted }}>Add Note</p>
        <div className="flex gap-2">
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Add a note…"
            className="flex-1 rounded-xl px-3 py-2 text-xs resize-none focus:outline-none"
            style={{ backgroundColor:'rgba(255,255,255,0.05)', border:`1px solid ${BRAND.borderCyan}`, color:BRAND.text }} />
          <button onClick={saveNote} disabled={!note.trim() || saving}
            className="px-3 rounded-xl flex items-center justify-center transition-opacity hover:opacity-80 disabled:opacity-30"
            style={{ backgroundColor:`${BRAND.cyan}18`, border:`1px solid ${BRAND.borderCyan}`, color:BRAND.cyan }}>
            <Send size={13}/>
          </button>
        </div>
      </div>
    </div>
  )
}

function FinanceTab({ m }: { m: MerchantRecord }) {
  const bps = (m as any).basis_points_earned ?? 15
  const estimatedResidual = Math.round(m.monthly_volume * (bps / 10000))
  const ytdVolume         = m.monthly_volume * 12
  const metrics = [
    { label:'Monthly Volume',     value:fmtCurrency(m.monthly_volume),  color:BRAND.cyan,    note:'current month estimate' },
    { label:'Est. Residual / Mo', value:fmtCurrency(estimatedResidual), color:BRAND.success, note:`~${(bps/100).toFixed(2)}% of volume` },
    { label:'Avg Ticket',         value:fmtCurrency(m.avg_ticket),      color:BRAND.text,    note:'per transaction' },
    { label:'YTD Volume (est.)',  value:fmtCurrency(ytdVolume),         color:BRAND.silverLo,note:'annualized' },
  ]
  return (
    <div className="flex flex-col gap-3">
      {metrics.map(({ label, value, color, note }) => (
        <div key={label} className="p-4 rounded-xl flex items-center justify-between"
          style={{ backgroundColor:'rgba(255,255,255,0.04)', border:`1px solid ${BRAND.border}` }}>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-0.5" style={{ color:BRAND.muted }}>{label}</p>
            <p className="text-[10px]" style={{ color:'rgba(255,255,255,0.2)' }}>{note}</p>
          </div>
          <span className="text-lg font-bold" style={{ color }}>{value}</span>
        </div>
      ))}
      <a href="/admin/finance" className="mt-1 flex items-center gap-1.5 text-xs font-semibold hover:underline"
        style={{ color:BRAND.cyan }}>
        View Finance Hub <ChevronRight size={12}/>
      </a>
    </div>
  )
}

function DocumentsTab({ m }: { m: MerchantRecord }) {
  const agreements  = getMockAgreements(m.id)
  const [chargebacks, setChargebacks] = useState(getMockChargebacks(m))
  const [showCbForm, setShowCbForm] = useState(false)
  const [cbForm, setCbForm] = useState({ amount: '', reason: '', date: '' })
  const [kycStatuses, setKycStatuses] = useState<Record<string, string>>({
    'Government ID': 'verified',
    'Business Licence': m.risk === 'high' ? 'missing' : 'verified',
    'Bank Statement': m.risk === 'medium' ? 'pending' : 'verified',
    'Voided Check': m.pipeline_stage === 'lead_identified' ? 'pending' : 'verified',
    'PCI SAQ (Self-Assessment)': ['account_activated','merchant_live'].includes(m.pipeline_stage) ? 'verified' : 'pending',
  })
  const kycItems = Object.entries(kycStatuses).map(([label, status]) => ({ label, status }))
  const kycColor: Record<string, string> = {
    verified: BRAND.success,
    pending:  BRAND.warn,
    missing:  BRAND.danger,
  }

  return (
    <div className="flex flex-col gap-5">
      {/* KYC / Compliance */}
      <div>
        <p className="text-[10px] uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{ color:BRAND.muted }}>
          <Shield size={10}/> KYC Status
        </p>
        <div className="flex flex-col gap-2">
          {kycItems.map(item => (
            <div key={item.label} className="flex items-center justify-between px-3.5 py-2.5 rounded-lg"
              style={{ backgroundColor:'rgba(255,255,255,0.03)', border:`1px solid ${BRAND.border}` }}>
              <span className="text-xs" style={{ color:BRAND.text }}>{item.label}</span>
              <select
                value={item.status}
                onChange={e => setKycStatuses(prev => ({ ...prev, [item.label]: e.target.value }))}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full focus:outline-none cursor-pointer"
                style={{
                  backgroundColor: `${kycColor[item.status]}15`,
                  color: kycColor[item.status],
                  border: `1px solid ${kycColor[item.status]}35`,
                }}>
                <option value="verified">verified</option>
                <option value="pending">pending</option>
                <option value="missing">missing</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Chargebacks */}
      <div>
        <p className="text-[10px] uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{ color:BRAND.muted }}>
          <AlertTriangle size={10}/> Chargebacks
        </p>
        {chargebacks.length === 0 ? (
          <div className="flex items-center gap-2 px-3.5 py-3 rounded-lg text-xs"
            style={{ backgroundColor:'rgba(61,214,140,0.06)', border:'1px solid rgba(61,214,140,0.2)', color:BRAND.success }}>
            <CheckCircle2 size={12}/> No chargebacks on record
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {chargebacks.map(cb => (
              <div key={cb.id} className="flex items-center justify-between px-3.5 py-2.5 rounded-lg"
                style={{ backgroundColor:'rgba(255,255,255,0.03)', border:`1px solid ${BRAND.border}` }}>
                <div>
                  <p className="text-xs font-semibold" style={{ color:BRAND.text }}>{fmtCurrency(cb.amount)}</p>
                  <p className="text-[10px] mt-0.5" style={{ color:BRAND.muted }}>{cb.reason} · {cb.date}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: cb.status === 'open' ? 'rgba(232,80,74,0.12)' : 'rgba(255,255,255,0.05)',
                    color: cb.status === 'open' ? BRAND.danger : BRAND.muted,
                    border: `1px solid ${cb.status === 'open' ? 'rgba(232,80,74,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  }}>
                  {cb.status}
                </span>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => setShowCbForm(v => !v)}
          className="flex items-center gap-1.5 text-[10px] font-semibold mt-1 transition-opacity hover:opacity-70"
          style={{ color: BRAND.muted }}>
          <AlertTriangle size={9}/> {showCbForm ? 'Cancel' : '+ Log Chargeback'}
        </button>
        {showCbForm && (
          <div className="mt-2 flex flex-col gap-2 p-3 rounded-xl"
            style={{ backgroundColor:'rgba(255,255,255,0.03)', border:`1px solid ${BRAND.border}` }}>
            <input type="number" placeholder="Amount ($)" value={cbForm.amount}
              onChange={e => setCbForm(f => ({ ...f, amount: e.target.value }))}
              className="w-full rounded-lg px-3 py-1.5 text-xs focus:outline-none"
              style={{ backgroundColor:'rgba(255,255,255,0.05)', border:`1px solid ${BRAND.borderCyan}`, color:BRAND.text }} />
            <input type="text" placeholder="Reason" value={cbForm.reason}
              onChange={e => setCbForm(f => ({ ...f, reason: e.target.value }))}
              className="w-full rounded-lg px-3 py-1.5 text-xs focus:outline-none"
              style={{ backgroundColor:'rgba(255,255,255,0.05)', border:`1px solid ${BRAND.borderCyan}`, color:BRAND.text }} />
            <input type="date" value={cbForm.date}
              onChange={e => setCbForm(f => ({ ...f, date: e.target.value }))}
              className="w-full rounded-lg px-3 py-1.5 text-xs focus:outline-none"
              style={{ backgroundColor:'rgba(255,255,255,0.05)', border:`1px solid ${BRAND.borderCyan}`, color:BRAND.text }} />
            <button
              onClick={() => {
                if (!cbForm.amount || !cbForm.reason) return
                setChargebacks(prev => [{ id:`cb${Date.now()}`, amount:parseFloat(cbForm.amount), date:cbForm.date||new Date().toISOString().split('T')[0], reason:cbForm.reason, status:'open' }, ...prev])
                setCbForm({ amount:'', reason:'', date:'' })
                setShowCbForm(false)
              }}
              className="w-full py-1.5 rounded-lg text-xs font-bold transition-opacity hover:opacity-85"
              style={{ backgroundColor:`${BRAND.danger}15`, color:BRAND.danger, border:`1px solid ${BRAND.danger}35` }}>
              Log Chargeback
            </button>
          </div>
        )}
      </div>

      {/* Agreements */}
      <div>
        <p className="text-[10px] uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{ color:BRAND.muted }}>
          <FileText size={10}/> Agreements
        </p>
        <div className="flex flex-col gap-2">
          {agreements.map(agr => (
            <div key={agr.id} className="p-3.5 rounded-xl flex items-center justify-between gap-3"
              style={{ backgroundColor:'rgba(255,255,255,0.04)', border:`1px solid ${BRAND.border}` }}>
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor:`${BRAND.cyan}15`, border:`1px solid ${BRAND.borderCyan}` }}>
                  <FileText size={12} style={{ color:BRAND.cyan }}/>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color:BRAND.text }}>{agr.type}</p>
                  <p className="text-[10px] mt-0.5" style={{ color:BRAND.muted }}>
                    {agr.pages} pages{agr.date ? ` · ${fmtDate(agr.date)}` : ''}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: agr.signed ? 'rgba(61,214,140,0.12)' : 'rgba(240,178,62,0.12)',
                  color:           agr.signed ? BRAND.success : BRAND.warn,
                  border:`1px solid ${agr.signed ? 'rgba(61,214,140,0.28)' : 'rgba(240,178,62,0.28)'}`,
                }}>
                {agr.signed ? 'Signed' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ActivityTab({ m, activityLog }: { m: MerchantRecord; activityLog: Array<{id:string;text:string;date:string;icon:React.ReactNode;color:string}> }) {
  const events = activityLog
  return (
    <div className="flex flex-col gap-0">
      {events.map((ev, i) => (
        <div key={ev.id} className="flex items-start gap-3 py-3"
          style={{ borderBottom: i < events.length - 1 ? `1px solid ${BRAND.border}` : 'none' }}>
          <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
            style={{ backgroundColor:`${ev.color}18`, border:`1px solid ${ev.color}40` }}>
            <span style={{ color:ev.color }}>{ev.icon}</span>
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color:BRAND.text }}>{ev.text}</p>
            <p className="text-[10px] mt-0.5" style={{ color:BRAND.muted }}>{ev.date}</p>
          </div>
        </div>
      ))}
      <a href="/admin/activity" className="mt-2 flex items-center gap-1.5 text-xs font-semibold hover:underline"
        style={{ color:BRAND.cyan }}>
        View full activity log <ChevronRight size={12}/>
      </a>
    </div>
  )
}

// ─── Main drawer ─────────────────────────────────────────────────────────────

export default function ManageMerchantDrawer({
  merchant,
  onClose,
  onStageChange,
}: {
  merchant: MerchantRecord
  onClose: () => void
  onStageChange: (id: string, stage: PipelineStage) => void
}) {
  const [tab, setTab] = useState<Tab>('overview')
  const [activityLog, setActivityLog] = useState<Array<{
    id: string; text: string; date: string; icon: React.ReactNode; color: string
  }>>(() => [
    { id:'a1', text:`Stage: ${STAGE_META[merchant.pipeline_stage].label}`, date:'2 days ago', icon:<TrendingUp size={11}/>, color:BRAND.cyan },
    { id:'a2', text:`Partner assigned: ${merchant.partner}`, date:'5 days ago', icon:<Users size={11}/>, color:'#C4B5FD' },
    { id:'a3', text:`Merchant record created`, date: fmtDate(merchant.date_added), icon:<Building2 size={11}/>, color:BRAND.muted },
  ])

  function addActivity(text: string, icon: React.ReactNode, color: string) {
    setActivityLog(prev => [{
      id: `a${Date.now()}`,
      text,
      date: new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' }) + ' today',
      icon,
      color,
    }, ...prev])
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />

      <div
        className="fixed top-0 right-0 h-screen w-full sm:w-[620px] flex flex-col z-50 shadow-2xl"
        style={{ backgroundColor: BRAND.card, borderLeft: `1px solid ${BRAND.borderCyan}` }}
      >
        {/* ── Header ── */}
        <div className="flex-shrink-0 px-6 py-5"
          style={{ borderBottom: `1px solid ${BRAND.border}` }}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold leading-tight truncate" style={{ color: BRAND.text }}>
                  {merchant.name}
                </h2>
                {merchant.risk && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0"
                    style={{ backgroundColor:`${RISK_COLORS[merchant.risk]}18`, color:RISK_COLORS[merchant.risk], border:`1px solid ${RISK_COLORS[merchant.risk]}40` }}>
                    {merchant.risk} risk
                  </span>
                )}
              </div>
              {merchant.dba_name && (
                <p className="text-xs mt-0.5" style={{ color: BRAND.muted }}>DBA: {merchant.dba_name}</p>
              )}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ backgroundColor:STAGE_META[merchant.pipeline_stage].bg, color:STAGE_META[merchant.pipeline_stage].color, border:`1px solid ${STAGE_META[merchant.pipeline_stage].border}` }}>
                  {STAGE_META[merchant.pipeline_stage].icon} {STAGE_META[merchant.pipeline_stage].label}
                </span>
                <span className="text-[10px]" style={{ color: BRAND.muted }}>
                  {merchant.partner_iso}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="flex-shrink-0 hover:opacity-70 transition-opacity mt-0.5"
              style={{ color: BRAND.muted }}>
              <X size={20} />
            </button>
          </div>

          {/* Tab bar */}
          <div className="flex gap-0.5 mt-4 overflow-x-auto" style={{ scrollbarWidth:'none' }}>
            {TABS.map(({ key, label, icon }) => (
              <button key={key} onClick={() => setTab(key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0"
                style={tab === key
                  ? { backgroundColor:`${BRAND.cyan}18`, color:BRAND.cyan, border:`1px solid ${BRAND.borderCyan}` }
                  : { backgroundColor:'transparent', color:BRAND.muted, border:'1px solid transparent' }
                }>
                {icon} {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab content ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5"
          style={{ scrollbarWidth:'thin', scrollbarColor:`${BRAND.borderCyan} transparent` }}>
          {tab === 'overview'  && <OverviewTab m={merchant} />}
          {tab === 'pipeline'  && <PipelineTab m={merchant} onStageChange={(id, stage) => { addActivity(`Stage → ${STAGE_META[stage].label}`, <TrendingUp size={11}/>, BRAND.cyan); onStageChange(id, stage); }} addActivity={addActivity} />}
          {tab === 'finance'   && <FinanceTab m={merchant} />}
          {tab === 'documents' && <DocumentsTab m={merchant} />}
          {tab === 'activity'  && <ActivityTab m={merchant} activityLog={activityLog} />}
        </div>

        {/* ── Footer ── */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4"
          style={{ borderTop:`1px solid ${BRAND.border}` }}>
          <button
            onClick={() => setTab('pipeline')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-opacity hover:opacity-85"
            style={{ backgroundColor:BRAND.cyan, color:BRAND.bg }}>
            <TrendingUp size={12}/> Manage Pipeline
          </button>
          <button onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ border:`1px solid ${BRAND.border}`, color:BRAND.muted }}>
            Close
          </button>
        </div>
      </div>
    </>
  )
}
