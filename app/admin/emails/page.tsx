'use client'

import { useState } from 'react'
import { Plus, X, Search, Mail, Send, Clock, Eye, Reply, ChevronDown } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type EmailStatus = 'draft' | 'sent' | 'read' | 'replied'

type Email = {
  id: number
  from: string
  to: string
  subject: string
  body: string
  status: EmailStatus
  template: string | null
  merchant_id: number | null
  partner_id: number | null
  date: string
  thread: ThreadMessage[]
}

type ThreadMessage = {
  id: number
  from: string
  body: string
  date: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TEAM_MEMBERS = ['Enzo Godoy', 'Sarah Chen', 'Marcus Webb', 'Priya Nair']

const MOCK_EMAILS: Email[] = [
  {
    id: 1,
    from: 'enzo@unitedfintech.com',
    to: 'john.smith@retailco.com',
    subject: 'Proposal Follow-up: Card-Present Processing Rates',
    body: "Hi John,\n\nFollowing up on our discussion last week regarding interchange-plus pricing for your card-present volume. Based on your $2.1M monthly throughput, we can offer 0.15% + $0.07 per transaction.\n\nWould you like to schedule a call to review the full proposal?\n\nBest,\nEnzo",
    status: 'read',
    template: 'proposal_followup',
    merchant_id: 1,
    partner_id: null,
    date: '2026-06-03',
    thread: [
      { id: 2, from: 'john.smith@retailco.com', body: "Thanks Enzo, that looks competitive. Can you also include your chargeback dispute process?", date: '2026-06-04' },
    ],
  },
  {
    id: 2,
    from: 'sarah.chen@unitedfintech.com',
    to: 'ops@bayviewrestaurants.com',
    subject: 'Agreement Reminder: DocuSign Pending',
    body: "Hi Maria,\n\nJust a friendly reminder that your Merchant Processing Agreement has been sitting in DocuSign since June 1st. Please review and sign at your earliest convenience so we can activate your account by the end of the week.\n\nLet me know if you have any questions!\n\nSarah",
    status: 'sent',
    template: 'agreement_reminder',
    merchant_id: 2,
    partner_id: null,
    date: '2026-06-04',
    thread: [],
  },
  {
    id: 3,
    from: 'marcus.webb@unitedfintech.com',
    to: 'finance@quickservepizza.com',
    subject: 'Welcome to United Fintech — Activation Complete',
    body: "Hi Team,\n\nYour merchant account has been successfully activated! Here is a summary of your setup:\n\n• MID: 4412-9900-0034\n• Processing limit: $500K/month\n• Settlement: T+1 business days\n• Chargeback threshold: 1%\n\nYour first statement will arrive on July 1st. Welcome aboard!\n\nMarcus",
    status: 'replied',
    template: 'activation_welcome',
    merchant_id: 3,
    partner_id: null,
    date: '2026-06-02',
    thread: [
      { id: 10, from: 'finance@quickservepizza.com', body: 'Thank you! Everything looks good. Looking forward to the partnership.', date: '2026-06-02' },
      { id: 11, from: 'marcus.webb@unitedfintech.com', body: 'Glad to have you! Reach out anytime.', date: '2026-06-02' },
    ],
  },
  {
    id: 4,
    from: 'priya.nair@unitedfintech.com',
    to: 'billing@techgadgets.io',
    subject: 'Rate Review: eCommerce Optimization Opportunity',
    body: "Hi Daniel,\n\nAfter reviewing your Q1 processing data, we identified that ~34% of your volume is being processed at a higher interchange tier than necessary. By adding Level 2 data to your B2B transactions, you could save approximately $4,200/month.\n\nWould you like a free rate review call?\n\nPriya",
    status: 'sent',
    template: 'rate_review',
    merchant_id: 4,
    partner_id: null,
    date: '2026-06-01',
    thread: [],
  },
  {
    id: 5,
    from: 'enzo@unitedfintech.com',
    to: 'compliance@isopayments.com',
    subject: 'Chargeback Alert: Threshold Approaching — Action Required',
    body: "Hi Robert,\n\nWe are writing to inform you that your chargeback ratio for May reached 0.82%, approaching the 1.0% threshold set by Visa. Immediate action is required to avoid processing restrictions.\n\nPlease review the attached dispute log and respond to all open cases by June 10.\n\nUrgently,\nEnzo",
    status: 'read',
    template: 'chargeback_alert',
    merchant_id: 5,
    partner_id: null,
    date: '2026-05-31',
    thread: [],
  },
  {
    id: 6,
    from: 'sarah.chen@unitedfintech.com',
    to: 'accounts@luxehotel.com',
    subject: 'Proposal Follow-up: MOTO Processing Package',
    body: "Hi Claudia,\n\nThank you for your time yesterday. As discussed, our MOTO package for hospitality businesses includes:\n\n• Rate: 2.45% + $0.15\n• PCI-compliant virtual terminal\n• Real-time fraud scoring\n• 24/7 support\n\nLet me know if you would like to move forward!\n\nSarah",
    status: 'draft',
    template: 'proposal_followup',
    merchant_id: 6,
    partner_id: null,
    date: '2026-05-30',
    thread: [],
  },
  {
    id: 7,
    from: 'marcus.webb@unitedfintech.com',
    to: 'info@firstcapitaliso.com',
    subject: 'Partner Revenue Share: May Residuals Posted',
    body: "Hi Team at First Capital ISO,\n\nYour May residual payment of $12,450.00 has been processed and will hit your account by June 5th. Your portfolio grew 8.3% MoM — great work!\n\nSee attached breakdown by merchant.\n\nMarcus",
    status: 'replied',
    template: null,
    merchant_id: null,
    partner_id: 1,
    date: '2026-05-28',
    thread: [
      { id: 20, from: 'info@firstcapitaliso.com', body: 'Received, thank you. Great month for our portfolio!', date: '2026-05-28' },
    ],
  },
  {
    id: 8,
    from: 'priya.nair@unitedfintech.com',
    to: 'alex@speedretail.com',
    subject: 'Agreement Reminder: 3rd Notice — Processing Paused',
    body: "Hi Alex,\n\nThis is our third reminder that your Merchant Agreement renewal has not been signed. As a result, processing for MID 7733-2201-0019 has been temporarily paused effective today.\n\nPlease sign immediately to restore service.\n\nPriya Nair\nCompliance Team",
    status: 'sent',
    template: 'agreement_reminder',
    merchant_id: 8,
    partner_id: null,
    date: '2026-05-27',
    thread: [],
  },
  {
    id: 9,
    from: 'enzo@unitedfintech.com',
    to: 'cfo@bigboxstore.com',
    subject: 'Rate Review: Q2 Savings Analysis — $28,000 Opportunity',
    body: "Hi Patricia,\n\nOur Q2 analysis of your processing volume reveals a significant savings opportunity. By switching to interchange-plus with Level 3 data, your effective rate drops from 2.31% to 1.78%, saving approximately $28,000 annually.\n\nI have attached the full analysis. Can we meet next week?\n\nEnzo",
    status: 'read',
    template: 'rate_review',
    merchant_id: 9,
    partner_id: null,
    date: '2026-05-26',
    thread: [],
  },
  {
    id: 10,
    from: 'sarah.chen@unitedfintech.com',
    to: 'owner@mainstreetcafe.com',
    subject: 'Welcome to United Fintech — Getting Started Guide',
    body: "Hi James,\n\nWelcome to the United Fintech family! Your account is live. Here is how to get started:\n\n1. Log into your merchant portal at portal.unitedfintech.com\n2. Add your team members under Settings > Users\n3. Set up your bank account for next-day settlement\n\nYour dedicated support contact is Sarah Chen (sarah.chen@unitedfintech.com).\n\nSarah",
    status: 'sent',
    template: 'activation_welcome',
    merchant_id: 10,
    partner_id: null,
    date: '2026-05-25',
    thread: [],
  },
  {
    id: 11,
    from: 'marcus.webb@unitedfintech.com',
    to: 'risk@globaliso.net',
    subject: 'Chargeback Alert: Merchant MID 5502 — Escalation Required',
    body: "Hi Risk Team,\n\nMerchant MID 5502-0011-7723 has exceeded 1.2% chargeback ratio for two consecutive months. Per our agreement, this triggers mandatory risk review.\n\nAttached: 90-day chargeback log, dispute responses, and our recommendation for account remediation.\n\nMarcus Webb\nRisk Management",
    status: 'replied',
    template: 'chargeback_alert',
    merchant_id: 11,
    partner_id: null,
    date: '2026-05-24',
    thread: [
      { id: 30, from: 'risk@globaliso.net', body: 'Received. Opening case RR-2026-0511. Will respond within 48 hours.', date: '2026-05-24' },
    ],
  },
  {
    id: 12,
    from: 'priya.nair@unitedfintech.com',
    to: 'billing@cloudpossystem.com',
    subject: 'Proposal Follow-up: SaaS Merchant Bundle',
    body: "Hi Tara,\n\nAs a software company, your processing needs are unique. Our SaaS Merchant Bundle includes:\n\n• Payment facilitation (PayFac lite)\n• Split settlement for marketplace payouts\n• Embedded checkout SDK\n• Flat 2.9% + $0.30 all-in rate\n\nShall we set up a technical review call?\n\nPriya",
    status: 'draft',
    template: 'proposal_followup',
    merchant_id: 12,
    partner_id: null,
    date: '2026-05-23',
    thread: [],
  },
  {
    id: 13,
    from: 'enzo@unitedfintech.com',
    to: 'finance@premiumauto.com',
    subject: 'Rate Review: High-Ticket Auto Dealer Analysis',
    body: "Hi Roger,\n\nFor your average ticket of $45,000, standard rates are punishing. We specialize in high-ticket automotive processing with:\n\n• Surcharging programs (pass credit card fees to buyer)\n• ACH alternative for large transactions\n• Dealer floor plan integration\n\nSavings estimate: $6,700/month.\n\nEnzo",
    status: 'sent',
    template: 'rate_review',
    merchant_id: 13,
    partner_id: null,
    date: '2026-05-22',
    thread: [],
  },
  {
    id: 14,
    from: 'sarah.chen@unitedfintech.com',
    to: 'ops@sunrisegym.com',
    subject: 'Agreement Reminder: Please Sign Your Annual Renewal',
    body: "Hi Team,\n\nYour annual processing agreement renewal is due by June 15th. Failure to renew will result in a processing freeze on June 16th.\n\nPlease complete the DocuSign envelope in your inbox titled 'United Fintech Annual Renewal — Sunrise Gym'.\n\nSarah",
    status: 'sent',
    template: 'agreement_reminder',
    merchant_id: 14,
    partner_id: null,
    date: '2026-05-21',
    thread: [],
  },
  {
    id: 15,
    from: 'marcus.webb@unitedfintech.com',
    to: 'accounts@alphaiso.co',
    subject: 'Partner Revenue Share: Q1 Bonus Payout',
    body: "Hi Alpha ISO Team,\n\nCongratulations on exceeding your Q1 activation target! As per your partner agreement, your Q1 performance bonus of $8,750 has been added to your June residual payment.\n\nTotal June payout: $31,200.\n\nMarcus",
    status: 'read',
    template: null,
    merchant_id: null,
    partner_id: 2,
    date: '2026-05-20',
    thread: [],
  },
]

const TEMPLATES = [
  { key: 'proposal_followup', label: 'Proposal Follow-up', description: 'Follow up on a submitted proposal' },
  { key: 'agreement_reminder', label: 'Agreement Reminder', description: 'Remind merchant to sign DocuSign' },
  { key: 'activation_welcome', label: 'Activation Welcome', description: 'Welcome email for new activated accounts' },
  { key: 'rate_review', label: 'Rate Review', description: 'Offer a rate analysis/savings review' },
  { key: 'chargeback_alert', label: 'Chargeback Alert', description: 'Alert about chargeback threshold' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const STATUS_CONFIG: Record<EmailStatus, { label: string; color: string; bg: string; border: string; Icon: React.ElementType }> = {
  draft:   { label: 'Draft',   color: '#FBBF24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.3)',  Icon: Clock },
  sent:    { label: 'Sent',    color: '#90c4cf', bg: 'rgba(144,196,207,0.12)', border: 'rgba(144,196,207,0.3)', Icon: Send },
  read:    { label: 'Read',    color: '#6EE7B7', bg: 'rgba(110,231,183,0.12)', border: 'rgba(110,231,183,0.3)', Icon: Eye },
  replied: { label: 'Replied', color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.3)', Icon: Reply },
}

const TEMPLATE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  proposal_followup:  { label: 'Proposal',    color: '#90c4cf', bg: 'rgba(144,196,207,0.12)' },
  agreement_reminder: { label: 'Agreement',   color: '#FBBF24', bg: 'rgba(251,191,36,0.12)' },
  activation_welcome: { label: 'Welcome',     color: '#6EE7B7', bg: 'rgba(110,231,183,0.12)' },
  rate_review:        { label: 'Rate Review', color: '#A78BFA', bg: 'rgba(167,139,250,0.12)' },
  chargeback_alert:   { label: 'Chargeback',  color: '#F87171', bg: 'rgba(248,113,113,0.12)' },
}

const STATUS_TABS: Array<{ key: 'all' | EmailStatus; label: string }> = [
  { key: 'all',     label: 'All' },
  { key: 'draft',   label: 'Drafts' },
  { key: 'sent',    label: 'Sent' },
  { key: 'read',    label: 'Read' },
  { key: 'replied', label: 'Replied' },
]

const inputStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(144,196,207,0.2)',
  color: 'rgba(255,255,255,0.85)',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 13,
  outline: 'none',
  width: '100%',
}

// ─── Compose Modal ─────────────────────────────────────────────────────────────

function ComposeModal({ onClose, onSent }: { onClose: () => void; onSent: (email: Email) => void }) {
  const [form, setForm] = useState({
    from: TEAM_MEMBERS[0],
    to: '',
    subject: '',
    body: '',
    template: '',
    status: 'sent' as EmailStatus,
  })
  const [saving, setSaving] = useState(false)

  const sectionLabel: React.CSSProperties = {
    color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.15em',
    fontWeight: 600, textTransform: 'uppercase', marginBottom: 6, display: 'block',
  }

  function applyTemplate(key: string) {
    const tmpl = TEMPLATES.find(t => t.key === key)
    if (!tmpl) return
    setForm(f => ({ ...f, template: key, subject: `[${tmpl.label}] ` }))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      const newEmail: Email = {
        id: Date.now(),
        from: TEAM_MEMBERS.find(m => m === form.from) ?? form.from,
        to: form.to,
        subject: form.subject,
        body: form.body,
        status: form.status,
        template: form.template || null,
        merchant_id: null,
        partner_id: null,
        date: new Date().toISOString().slice(0, 10),
        thread: [],
      }
      onSent(newEmail)
      setSaving(false)
      onClose()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl" style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(144,196,207,0.15)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10"
          style={{ borderColor: 'rgba(144,196,207,0.1)', backgroundColor: '#1a1a1a' }}>
          <h2 className="font-bold text-white text-lg">Compose Email</h2>
          <button onClick={onClose} className="cursor-pointer" style={{ color: 'rgba(255,255,255,0.4)' }}><X size={20} /></button>
        </div>

        <form onSubmit={submit} className="p-6 flex flex-col gap-5">
          {/* Template picker */}
          <div>
            <span style={sectionLabel}>Template (optional)</span>
            <div className="flex flex-wrap gap-1.5">
              {TEMPLATES.map(t => (
                <button key={t.key} type="button" onClick={() => applyTemplate(t.key)}
                  className="px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer"
                  style={form.template === t.key
                    ? { backgroundColor: TEMPLATE_CONFIG[t.key].bg, color: TEMPLATE_CONFIG[t.key].color, border: `1px solid ${TEMPLATE_CONFIG[t.key].color}60` }
                    : { backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }
                  }>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* From */}
          <div>
            <span style={sectionLabel}>From</span>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))}>
              {TEAM_MEMBERS.map(m => <option key={m} value={m}>{m} &lt;{m.toLowerCase().replace(' ', '.')}@unitedfintech.com&gt;</option>)}
            </select>
          </div>

          {/* To */}
          <div>
            <span style={sectionLabel}>To *</span>
            <input required type="email" value={form.to} onChange={e => setForm(f => ({ ...f, to: e.target.value }))}
              placeholder="merchant@example.com" style={inputStyle} />
          </div>

          {/* Subject */}
          <div>
            <span style={sectionLabel}>Subject *</span>
            <input required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              placeholder="Email subject" style={inputStyle} />
          </div>

          {/* Body */}
          <div>
            <span style={sectionLabel}>Message</span>
            <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
              placeholder="Write your message..." rows={6}
              style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          {/* Status */}
          <div>
            <span style={sectionLabel}>Save as</span>
            <div className="flex gap-2">
              {(['draft', 'sent'] as const).map(s => (
                <button key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s }))}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer capitalize"
                  style={form.status === s
                    ? { backgroundColor: 'rgba(144,196,207,0.15)', border: '2px solid rgba(144,196,207,0.5)', color: '#90c4cf' }
                    : { backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }
                  }>
                  {s === 'draft' ? 'Save Draft' : 'Send Now'}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
            style={{ backgroundColor: saving ? 'rgba(144,196,207,0.4)' : '#4A9B7F', color: '#fff' }}>
            {saving ? 'Sending…' : form.status === 'draft' ? 'Save Draft' : 'Send Email'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Thread Panel ─────────────────────────────────────────────────────────────

function ThreadPanel({ email, onClose }: { email: Email; onClose: () => void }) {
  const cfg = STATUS_CONFIG[email.status]

  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#282626', border: '1px solid rgba(144,196,207,0.13)' }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-start justify-between gap-4 border-b" style={{ borderColor: 'rgba(144,196,207,0.1)' }}>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{email.subject}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <span>From: <span style={{ color: '#90c4cf' }}>{email.from}</span></span>
            <span>To: {email.to}</span>
            <span>{formatDate(email.date)}</span>
          </div>
        </div>
        <button onClick={onClose} className="cursor-pointer flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }}><X size={16} /></button>
      </div>

      {/* Original message */}
      <div className="px-6 py-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>Original Message</p>
        <p className="text-sm whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>{email.body}</p>
      </div>

      {/* Thread replies */}
      {email.thread.length > 0 && (
        <div className="border-t" style={{ borderColor: 'rgba(144,196,207,0.08)' }}>
          <p className="px-6 pt-4 pb-2 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Thread ({email.thread.length} repl{email.thread.length === 1 ? 'y' : 'ies'})
          </p>
          {email.thread.map(msg => (
            <div key={msg.id} className="px-6 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: '#90c4cf' }}>{msg.from}</span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{formatDate(msg.date)}</span>
              </div>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{msg.body}</p>
            </div>
          ))}
        </div>
      )}

      {/* Status badge */}
      <div className="px-6 py-3 border-t flex items-center gap-2" style={{ borderColor: 'rgba(144,196,207,0.1)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
        <cfg.Icon size={12} style={{ color: cfg.color }} />
        <span className="text-xs font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
        {email.template && TEMPLATE_CONFIG[email.template] && (
          <>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: TEMPLATE_CONFIG[email.template].bg, color: TEMPLATE_CONFIG[email.template].color }}>
              {TEMPLATE_CONFIG[email.template].label}
            </span>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EmailsPage() {
  const [emails, setEmails] = useState<Email[]>(MOCK_EMAILS)
  const [statusFilter, setStatusFilter] = useState<'all' | EmailStatus>('all')
  const [search, setSearch] = useState('')
  const [showCompose, setShowCompose] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)

  const drafts = emails.filter(e => e.status === 'draft')

  const filtered = emails.filter(e => {
    if (statusFilter !== 'all' && e.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return e.subject.toLowerCase().includes(q) || e.to.toLowerCase().includes(q) || e.from.toLowerCase().includes(q)
    }
    return true
  })

  const crmEmails   = filtered.filter(e => e.merchant_id !== null || e.partner_id !== null)
  const otherEmails = filtered.filter(e => e.merchant_id === null && e.partner_id === null)

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'rgba(255,255,255,0.95)' }}>Communications</h1>
          {drafts.length > 0 && (
            <p className="text-sm mt-1 font-medium" style={{ color: '#FBBF24' }}>
              {drafts.length} draft{drafts.length > 1 ? 's' : ''} not yet sent
            </p>
          )}
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
          style={{ backgroundColor: '#4A9B7F', color: '#fff' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#3d8a6e'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#4A9B7F'}>
          <Plus size={16} /> Compose
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Status tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl flex-wrap" style={{ backgroundColor: '#282626', border: '1px solid rgba(144,196,207,0.1)' }}>
          {STATUS_TABS.map(tab => (
            <button key={tab.key} onClick={() => setStatusFilter(tab.key)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              style={statusFilter === tab.key
                ? { backgroundColor: '#90c4cf', color: '#111' }
                : { color: 'rgba(255,255,255,0.5)' }
              }>
              {tab.label}
              {tab.key !== 'all' && (
                <span className="ml-1.5 text-[10px]">
                  ({emails.filter(e => e.status === tab.key).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search emails…"
            style={{ ...inputStyle, paddingLeft: 36, fontSize: 13 }} />
        </div>
      </div>

      {/* Thread panel */}
      {selectedEmail && (
        <div className="mb-5">
          <ThreadPanel email={selectedEmail} onClose={() => setSelectedEmail(null)} />
        </div>
      )}

      {/* Template library */}
      <div className="mb-5 p-4 rounded-xl" style={{ backgroundColor: '#282626', border: '1px solid rgba(144,196,207,0.1)' }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>Template Library</p>
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map(t => (
            <div key={t.key} className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: TEMPLATE_CONFIG[t.key].bg, border: `1px solid ${TEMPLATE_CONFIG[t.key].color}30` }}>
              <span className="text-xs font-semibold" style={{ color: TEMPLATE_CONFIG[t.key].color }}>{t.label}</span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{t.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Email lists */}
      <div className="flex flex-col gap-8">
        {crmEmails.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color: '#90c4cf' }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#4A9B7F' }} />
              CRM — Merchants & Partners ({crmEmails.length})
            </h2>
            <EmailTable emails={crmEmails} selected={selectedEmail} onSelect={setSelectedEmail} />
          </section>
        )}

        {otherEmails.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
              Other ({otherEmails.length})
            </h2>
            <EmailTable emails={otherEmails} selected={selectedEmail} onSelect={setSelectedEmail} />
          </section>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <Mail size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-base">No emails found</p>
          </div>
        )}
      </div>

      {showCompose && (
        <ComposeModal
          onClose={() => setShowCompose(false)}
          onSent={email => { setEmails(prev => [email, ...prev]); setShowCompose(false) }}
        />
      )}
    </div>
  )
}

// ─── Email Table ──────────────────────────────────────────────────────────────

function EmailTable({ emails, selected, onSelect }: {
  emails: Email[]
  selected: Email | null
  onSelect: (e: Email | null) => void
}) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#1c1c1c', border: '1px solid rgba(144,196,207,0.13)' }}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="text-xs uppercase tracking-wide"
            style={{ backgroundColor: 'rgba(144,196,207,0.07)', borderBottom: '1px solid rgba(144,196,207,0.13)', color: 'rgba(255,255,255,0.35)' }}>
            <tr>
              <th className="text-left px-5 py-3 font-medium">From</th>
              <th className="text-left px-5 py-3 font-medium">To</th>
              <th className="text-left px-5 py-3 font-medium">Subject</th>
              <th className="text-center px-5 py-3 font-medium">Template</th>
              <th className="text-center px-5 py-3 font-medium">Status</th>
              <th className="text-right px-5 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((email, idx) => {
              const cfg = STATUS_CONFIG[email.status]
              const tmpl = email.template ? TEMPLATE_CONFIG[email.template] : null
              const isSelected = selected?.id === email.id
              return (
                <tr key={email.id}
                  className="cursor-pointer transition-colors"
                  style={{
                    borderBottom: idx < emails.length - 1 ? '1px solid rgba(144,196,207,0.08)' : 'none',
                    backgroundColor: isSelected ? 'rgba(144,196,207,0.06)' : undefined,
                  }}
                  onClick={() => onSelect(isSelected ? null : email)}
                  onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.025)' }}
                  onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}>
                  <td className="px-5 py-3 text-xs font-medium truncate max-w-[120px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {email.from.split('@')[0].replace('.', ' ').split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{email.to}</td>
                  <td className="px-5 py-3">
                    <button className="hover:underline text-sm text-left" style={{ color: '#90c4cf' }}>{email.subject}</button>
                  </td>
                  <td className="px-5 py-3 text-center">
                    {tmpl ? (
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: tmpl.bg, color: tmpl.color }}>
                        {tmpl.label}
                      </span>
                    ) : <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>—</span>}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {formatDate(email.date)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
